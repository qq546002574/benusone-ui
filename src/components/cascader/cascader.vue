<template>
  <div
    v-click-outside-x="hidePopover"
    class="cascader-wrapper">
    <el-popover
      :popper-class="popOverClass"
      v-model="showPopover"
      placement="bottom-start"
      trigger="manual"
    >
      <div slot="reference">
        <el-select
          v-model="selectedLabels"
          :placeholder="placeholder"
          :disabled="disabled"
          :size="size"
          :collapse-tags="collapseTags"
          :clearable="clearable"
          :filterable="filterable"
          :filter-method="filterHandler"
          multiple
          style="width: 100%;"
          popper-class="hide-popper"
          @focus="handleFocus"
          @remove-tag="removeTag"
          @clear="clearTag"
          @visible-change="visibleChange"
        />
      </div>
      <div
        v-if="!searchKey && casTree.length > 0"
        class="cascader-menu-wrapper">
        <ul
          v-for="(cas, index) in casTree"
          :style="{'width': panelWidth === 'auto' ? 'auto' : panelWidth + 'px'}"
          :key="index"
          class="el-cascader-menu cascader-menu"
        >
          <li
            v-for="(item, itemIdx) in cas"
            :class="{
              'el-cascader-menu__item': true,
              'el-cascader-menu__item--extensible': item[childrenKey] && item[childrenKey].length > 0,
              'can-load-children': !item.isLeaf && !item[childrenKey] && allowLoadChildren && showLoadingIndicator,
              'loading-children': !item.isLeaf && item.loading && allowLoadChildren && showLoadingIndicator,
              'has-checked-child': item.indeterminate || item.hasCheckedChild,
              'is-active': item.checked,
            }"
            :key="itemIdx"
            :title="item[labelKey]"
            @click="spreadNext(item[childrenKey], index, item)"
          >
            <el-checkbox
              :disabled="item.disabled"
              v-model="item.checked"
              :indeterminate="item.indeterminate"
              class="cascader-checkbox"
              @click.native.stop
              @change="checked => { checkedChange(item, checked) }"
            />
            <span>{{ item[labelKey] }}</span>
          </li>
        </ul>
      </div>
      <div
        v-if="searchKey && casTree.length > 0"
        class="cascader-menu-wrapper">
        <ul
          :style="{'width': panelWidth === 'auto' ? 'auto' : panelWidth + 'px'}"
          class="el-cascader-menu cascader-menu" >
          <li
            v-for="(item, index) in casTree"
            :class="{
              'el-cascader-menu__item': true,
              'loading-children': !item.isLeaf && item.loading && allowLoadChildren && showLoadingIndicator,
              'has-checked-child': item.indeterminate || item.hasCheckedChild,
              'is-active': item.checked,
            }"
            :title="item[labelKey]"
            :key="index">
            <el-checkbox
              :disabled="item.disabled"
              v-model="item.checked"
              :indeterminate="item.indeterminate"
              class="cascader-checkbox"
              @click.native.stop
              @change="checked => { checkedSearchChange(item, checked) }"
            />
            <span>{{ item[labelKey] }}</span>
          </li>
        </ul>
      </div>
      <div
        v-if="options.length === 0"
        class="cascader-menu-wrapper">
        <ul
          class="el-cascader-menu cascader-menu">
          <li class="el-cascader-menu__item dropdown__empty">
            {{ noDataText }}
          </li>
        </ul>
      </div>
    </el-popover>
  </div>
</template>
  
<script>
// element v2.4.5
import { directive as clickOutsideX } from 'v-click-outside-x'
import { hasArrayChild, completeDeepClone, getId, fireEvent, isPromise, debounce } from '@/utils'


export default {
  name: "bs-cascader",
  directives: { clickOutsideX },
  props: {
    // 所有选项
    value: {
      type: Array,
      default() {
        return []
      },
    },

    placeholder: {
      type: String,
      default: '请选择',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default() {
        return []
      },
    },
    size: {
      type: String,
      default: '',
    },
    selectChildren: {
      type: Boolean,
      default: false,
    },
    noDataText: {
      type: String,
      default: '无数据',
    },
    collapseTags: {
      type: Boolean,
      default: false,
    },
    separator: {
      type: String,
      default: '/',
    },
    showAllLevels: {
      type: Boolean,
      default: false,
    },
    outputLevelValue: {
      type: Boolean,
      default: false,
    },
    // 显示加载指示器
    showLoadingIndicator: {
      type: Boolean,
      default: true,
    },
    // 允许加载子项
    allowLoadChildren: {
      type: Boolean,
      default: false,
    },
    // 加载方法
    loadChildrenMethod: {
      type: Function,
      default: null,
      return: Promise,
    },
    // key
    labelKey: {
      type: String,
      default: 'label',
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    childrenKey: {
      type: String,
      default: 'children',
    },
    popperClass: {
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    panelWidth: {
      type: [Number, String],
      default: 180,
    },
  },
  data() {
    return {
      elWidth: '',
      popperWidth: '',
      popOverClass: '',
      classRef: '',
      showPopover: false,
      clonedOpts: [],
      casTree: [],
      selectedItems: [],
      selectedLabels: [],
      selectedValues: [],
      loadChildrenPromise: null,
      searchKey: '',
      allSearchOption: [],
    }
  },
  computed: {
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.initOpts()
        this.initDatas()
        this.initAllLabel()
      },
    },
    value: {
      deep: true,
      handler() {
        if (this.selectedValues != this.value) {
          this.initOpts()
          this.initDatas()
        }
      },
    },
    disabled(disabled) {
      if (disabled) {
        this.hidePopover()
      }
    },
    searchKey: {
      handler(val) {
        if (val) {
          this.casTree = this.allSearchOption.filter((it) => it[this.labelKey].indexOf(val)  !== -1)
        } else {
          this.casTree = [this.clonedOpts]
        }
      },
    },
  },
  created() {
    this.classRef = `popper-class-${getId()}`
    this.popOverClass = `cascader-popper ${this.classRef} ${this.popperClass}`
    this.initOpts()
    this.initDatas()
  },
  mounted() {
    // 设置弹出层宽度
    this.elWidth = this.$el.offsetWidth
  },
  destroyed() {
    this.clonedOpts = null
    this.casTree = null
    this.selectedItems = null
    this.selectedLabels = null
    this.selectedvalues = null
  },
  methods: {
    initOpts() {
      this.clonedOpts = completeDeepClone(this.options)
      this.recursiveOpt(this.clonedOpts, null)
      this.casTree = [this.clonedOpts]
    },
    /**
       * 初始化数据
       * 空值初始化，两个绑定不一致的情况
       */
    initDatas() {
      this.pickCheckedItem(this.clonedOpts)
    },
    /**
       * 递归option数据
       * 标记数据树形层级 parent
       * 打上初始状态 checked indeterminate
       */
    recursiveOpt(nodeArr, parent) {
      const vm = this
      nodeArr.forEach((node) => {
        if (parent) {
          node.parent = parent
        }
        node.indeterminate = false
        node.checked = false
        if (vm.value.some((val) => val == vm.getLevel(node, vm.valueKey, vm.outputLevelValue))) {
          node.checked = true
        }
        vm.markChildrenChecked(node)
        vm.markParentChecked(node)
        vm.markParentHasCheckChild(node)
        if (hasArrayChild(node, vm.childrenKey)) {
          vm.recursiveOpt(node[vm.childrenKey], node)
        }
      })
    },
    /**
       * 根据当前节点 checked
       * 更改所有子孙节点 checked
       * 依赖 this.selectChildren
       */
    markChildrenChecked(node) {
      const vm = this
      function loop(children, status) {
        if (children) {
          children.map((child) => {
            if (!child.disabled) {
              child.checked = status
              if (child.checked) {
                child.indeterminate = false
              }
            }
            if (hasArrayChild(child, vm.childrenKey)) {
              loop(child[vm.childrenKey], status)
            }
          })
        }
      }
      if (node && hasArrayChild(node, vm.childrenKey) && this.selectChildren) {
        loop(node[vm.childrenKey], node.checked)
      }
    },
    /**
       * 标记父节点 checked、indeterminate 状态
       * 依赖 this.selectChildren
       */
    markParentChecked(node) {
      const vm = this
      node.indeterminate = false
      function loop(node) {
        let checkCount = 0
        if (hasArrayChild(node, vm.childrenKey)) {
          const childIndeterminate = node[vm.childrenKey].some((child) => child.indeterminate)
          node[vm.childrenKey].map((child) => {
            if (child.checked) {
              checkCount ++
            }
          })
          // 子节点全部被选中
          if (checkCount === node[vm.childrenKey].length) {
            node.checked = true
            node.indeterminate = false
          } else {
            node.checked = false
            if (checkCount > 0 || childIndeterminate) {
              node.indeterminate = true
            } else {
              node.indeterminate = false
            }
          }
        }
        if (node.parent) {
          loop(node.parent)
        }
      }
      if (node && node.parent && this.selectChildren) {
        loop(node.parent)
      }
    },
    /**
       * 标记是否有被选子项
       * 依赖 this.selectChildren
       */
    markParentHasCheckChild(node) {
      const vm = this
      node.hasCheckedChild = false
      function loop(node) {
        let checkCount = 0
        if (hasArrayChild(node, vm.childrenKey)) {
          const childHasCheckedChild = node[vm.childrenKey].some((child) => child.hasCheckedChild)
          node[vm.childrenKey].map((child) => {
            if (child.checked) {
              checkCount ++
            }
          })
          // 子节点有被选中
          node.hasCheckedChild = (checkCount > 0) || childHasCheckedChild
        }
        if (node.parent) {
          loop(node.parent)
        }
      }
      if (node && node.parent && !this.selectChildren) {
        loop(node.parent)
      }
    },
    // 展示标签所有层级
    getLevel(node, key, leveled) {
      const levels = []
      function loop(data) {
        levels.push(data[key])
        if (data.parent) {
          loop(data.parent)
        }
      }
      if (leveled) {
        loop(node)
        return levels.reverse().join(this.separator)
      } else {
        return node[key]
      }
    },
    /**
       * 处理已选中
       * 重新遍历tree，pick除已选中项目
       */
    pickCheckedItem(tree) {
      const vm = this
      /**
         * 移除parent引用
         */
      function removeParent(node) {
        const obj = {}
        Object.keys(node).forEach((key) => {
          if (key != 'parent') {
            obj[key] = node[key]
          }
        })
        if (hasArrayChild(obj, vm.childrenKey)) {
          obj[vm.childrenKey] = obj[vm.childrenKey].map((child) => removeParent(child))
        }
        return obj
      }
  
      vm.selectedItems = []
      vm.selectedLabels = []
      vm.selectedValues = []
      function loop(data) {
        if (Array.isArray(data)) {
          data.map((item) => {
            if (item.checked) {
              const newItem = removeParent(item)
              vm.selectedItems.push(newItem)
              vm.selectedLabels.push(vm.getLevel(item, vm.labelKey, vm.showAllLevels))
              vm.selectedValues.push(vm.getLevel(item, vm.valueKey, vm.outputLevelValue))
            }
            if (hasArrayChild(item, vm.childrenKey)) {
              loop(item[vm.childrenKey])
            }
          })
        }
      }
      loop(tree)
    },
    removeTag(label) {
      /**
       * 遍历 tree
       * 根据传入label 寻找 item
       */
      const vm = this
      function findNodeByLabel(label) {
        let result = null
        function loop(tree) {
          if (tree) {
            tree.find((node) => {
              if (vm.getLevel(node, vm.labelKey, vm.showAllLevels) === label) {
                result = node
                return true
              }
              if (hasArrayChild(node, vm.childrenKey)) {
                loop(node[vm.childrenKey])
              }
            })
          }
        }
        if (label) {
          loop(vm.clonedOpts)
          return result
        }
      }
      const deletedItem = findNodeByLabel(label)
      if (deletedItem) {
        vm.checkedChange(deletedItem, false)
      }
  
      this.$emit('remove-tag', label, deletedItem)
    },
    clearTag() {
      const vm = this
      function loop(nodeArr) {
        nodeArr.forEach((node) => {
          node.checked = false
          node.indeterminate = false
          if (hasArrayChild(node, vm.childrenKey)) {
            loop(node[vm.childrenKey])
          }
        })
      }
      // 关闭全部状态
      loop(this.clonedOpts)
      this.selectedLabels = []
      this.selectedValues = []
      this.selectedItems = []
      this.$emit('clear')
      this.syncData()
    },
    // 菜单选中变化
    checkedChange(item, checked) {
      item.checked = checked
      this.$emit('clickItem', item)
      this.markChildrenChecked(item)
      this.markParentChecked(item)
      this.markParentHasCheckChild(item)
      this.pickCheckedItem(this.clonedOpts)
      this.refresPopover()
      this.syncData()
    },
    // 同步数据到上层
    syncData() {
      this.$emit('input', this.selectedValues)
      this.$emit('change', this.selectedValues, this.selectedItems)
    },
    // 展开下一级
    async spreadNext(children, index, item) {
      const vm = this
      if (
        vm.allowLoadChildren &&
          !children && !item[vm.childrenKey] &&
          vm.loadChildrenMethod &&
          vm.loadChildrenMethod.constructor === Function &&
          !vm.loadChildrenPromise && // promise 不存在
          !item.isLeaf
      ) {
        const isPromiseMethod = this.loadChildrenMethod(item)
        if (isPromise(isPromiseMethod)) {
          vm.loadChildrenPromise = isPromiseMethod
          this.$set(item, 'loading', true)
          const result = await vm.loadChildrenPromise.catch((e) => {
            this.$set(item, 'loading', false)
          })
          this.$set(item, 'loading', false)
          vm.loadChildrenPromise = null
          if (result && result.constructor === Array) {
            this.recursiveOpt(result, item)
            this.$set(item, vm.childrenKey, result)
            children = result
          } else {
            console.warn('The resolved value by loadChildrenMethod must be an Option Array !')
          }
        } else {
          console.warn('You must return a Promise instance in loadChildrenMethod !')
        }
      }
  
      if (index || index === 0) {
        if (vm.casTree.indexOf(children) === -1) {
          if (children && children.length > 0) {
            vm.casTree.splice(index + 1, vm.casTree.length - 1, children)
          } else {
            vm.casTree.splice(index + 1, vm.casTree.length - 1)
          }
  
          vm.$emit('spread', item)
        }
      }
    },
    visibleChange(visible) {
      if (visible) {
        this.showPopover = true
      }
    },
    handleFocus(evt) {
      if (this.disabled) {
        return
      }
      this.$emit('focus', evt)
    },
    hidePopover(evt) {
      this.showPopover = false
      this.searchKey = ''
      this.$emit('blur', evt)
    },
    refresPopover() {
      setTimeout(() => {
        fireEvent(window, 'resize')
      }, 66)
    },
    // 展示标签所有层级
    getCurrentNode(list, item) {
      const vm = this
      list && list.forEach((it) => {
        if (it[vm.valueKey] === item[vm.valueKey]) {
          vm.checkedChange(it, !it.checked)
          return
        } else {
          vm.getCurrentNode(it[vm.childrenKey], item)
        }
      })
    },
    setSearchLabel(val, strList) {
      val && val.forEach((it) => {
        const labelObj = {}
        labelObj[this.labelKey] = [...strList, it[this.labelKey]].join(this.separator)
        labelObj[this.valueKey] = it[this.valueKey]
        labelObj.checked = it.checked
        this.allSearchOption.push(labelObj)
        this.setSearchLabel(it[this.childrenKey], [it[this.labelKey], ...strList])
      })
    },
    checkedSearchChange(item, checked) {
      item.checked = checked
      const list = this.clonedOpts
      this.getCurrentNode(list, item)
    },
    initAllLabel() {
      this.allSearchOption = []
      this.setSearchLabel(this.clonedOpts, [])
    },
    filterHandler(node, keyword) {
      if (!this.filterable) {
        return
      }
      const vm = this
      debounce(function() {
        vm.initAllLabel()
        vm.searchKey = node
      }, 1000)()
    },
  },
}
</script>
  <style>
  .hide-popper {
    display: none;
  }
  .cascader-popper {
    padding: 0px;
  }
  .cascader-menu-wrapper {
    white-space: nowrap;
    overflow-x: auto;
  }
  .cascader-menu-wrapper .cascader-checkbox {
    margin-right: 10px;
  }
  .el-cascader-menu__item.has-checked-child {
    background-color: #f5f7fa !important;
  }
  .dropdown__empty {
    height: 100%;
    padding-top: 50%;
    margin: 0;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
  .can-load-children {
    position: relative;
  }
  .can-load-children::after {
    content: "";
    display: inline-block;
    position: absolute;
    width: 5px;
    height: 5px;
    background: #a5d279;
    right: 20px;
    top: 50%;
    border-radius:50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
  }
  .can-load-children.loading-children::after {
    animation: loading 0.22s infinite alternate;
    -moz-animation: loading 0.22s infinite alternate;	/* Firefox */
    -webkit-animation: loading 0.22s infinite alternate;	/* Safari 和 Chrome */
    -o-animation: loading 0.22s infinite alternate;	/* Opera */
  }
  
  @keyframes loading
  {
  from {background: #a5d279;}
  to {background: #334d19;}
  }
  </style>
  