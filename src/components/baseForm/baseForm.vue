<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    v-bind="{ ...config.props, ...config.attrs, ...$attrs, ...$props }"
    :class="{ readonly: readonly }"
    :disabled="readonly || config.props.disabled || $props.disabled"
    size="small"
    class="extend-form"
    v-on="{ ...$listeners, ...config.on }"
  >
    <el-row>
      <template v-for="item in formItems.filter((item) => !item.isHide)">
        <el-col
          ref="col"
          :key="item.props.prop"
          :xs="getSpan(item, config)[0] || 24"
          :sm="getSpan(item, config)[0] || 24"
          :md="getSpan(item, config)[1] || 24"
          :lg="getSpan(item, config)[2] || 24"
          :xl="getSpan(item, config)[3] || 24"
        >
          <el-collapse-transition>
            <div v-show="item.visible">
              <slot
                v-if="item.slot === true"
                :name="item.props.prop"
                :item="item"
                :form="form"
              />
              <el-form-item
                v-else-if="
                  item.type === 'digitrange' || item.type === 'numberrange'
                "
                :ref="item.props.prop"
                v-bind="{
                  ...item.props,
                  ...item.attrs,
                  ...{ required: false },
                }"
                v-on="item.on"
              >
                <span
                  v-for="(cell, index) in _getRangeCell(item)"
                  :key="cell.prop"
                  :class="{ [`bsform_${item.type}`]: item.type }"
                >
                  <el-input
                    :type="_inputTypeGet(cell.type).type"
                    v-model="form[cell.prop]"
                    v-bind="{ ...cell.props, ...cell.attrs }"
                    :placeholder="
                      _getOV(cell.props, 'placeholder') ||
                      `请输入${item.props.label}`
                    "
                    v-on="{
                      ...cell.on,
                      ...{ input: InputHandle.bind(this, item, cell, index) },
                      ...{
                        blur: InputBlurHandle.bind(this, item, cell, index),
                      },
                    }"
                  >
                    <template v-slot:append v-if="cell.slots.append">{{
                      cell.slots.append
                    }}</template>
                  </el-input>
                </span>
              </el-form-item>
              <!-- required由rule生成，props这里设置为false -->
              <el-form-item
                v-else
                :ref="item.props.prop"
                v-bind="{
                  ...item.props,
                  ...item.attrs,
                  ...{ required: false },
                }"
                v-on="item.on"
              >
                <template v-if="item.type === 'plain'">{{
                  form[item.props.prop]
                }}</template>
                <span
                  v-for="(cell, index) in item.items"
                  v-else
                  :key="cell.prop"
                  :class="{ [`bsform_${item.type}`]: item.type }"
                >
                  <template v-if="_inputTypeGet(cell.type).isInput">
                    <el-input
                      :type="_inputTypeGet(cell.type).type"
                      v-model="form[cell.prop]"
                      v-bind="{ ...cell.props, ...cell.attrs }"
                      :placeholder="
                        _getOV(cell.props, 'placeholder') ||
                        `请输入${item.props.label}`
                      "
                      v-on="{
                        ...cell.on,
                        ...{ input: InputHandle.bind(this, item, cell, index) },
                        ...{
                          blur: InputBlurHandle.bind(this, item, cell, index),
                        },
                      }"
                    >
                      <template v-slot:append v-if="cell.slots.append">{{
                        cell.slots.append
                      }}</template>
                    </el-input>
                  </template>
                  <template v-else-if="cell.type === 'select'">
                    <el-select
                      v-model="form[cell.prop]"
                      v-bind="{ ...cell.props, ...cell.attrs }"
                      v-on="cell.on"
                    >
                      <el-option
                        v-for="option in cell.options.data"
                        :key="
                          option[cell.options.value] ||
                          option[cell.options.value] === 0
                            ? option[cell.options.value]
                            : option
                        "
                        :value="
                          option[cell.options.value] ||
                          option[cell.options.value] === 0
                            ? option[cell.options.value]
                            : option
                        "
                        :label="option[cell.options.label] || option"
                        v-bind="{ ...option.props, ...option.attrs }"
                      />
                    </el-select>
                  </template>
                  <template v-else-if="cell.type === 'cascader'">
                    <base-cascader
                      v-model="form[cell.prop]"
                      v-on="cell.on"
                      v-bind="{ ...cell.props, ...cell.attrs }"
                    />
                  </template>
                  <template v-else-if="cell.type === 'checkbox'">
                    <el-checkbox-group
                      v-model="form[cell.prop]"
                      v-bind="{ ...cell.props, ...cell.attrs }"
                      v-on="cell.on"
                    >
                      <el-checkbox
                        v-for="option in cell.options.data"
                        :key="
                          option[cell.options.value] ||
                          option[cell.options.value] === 0
                            ? option[cell.options.value]
                            : option
                        "
                        :label="
                          option[cell.options.value] ||
                          option[cell.options.value] === 0
                            ? option[cell.options.value]
                            : option
                        "
                        v-bind="{ ...option.props, ...option.attrs }"
                      >
                        <slot :name="cell.prop" :option="option">{{
                          option[cell.options.label] || option
                        }}</slot>
                      </el-checkbox>
                    </el-checkbox-group>
                  </template>
                  <template v-else-if="cell.type === 'radio'">
                    <el-radio-group
                      v-model="form[cell.prop]"
                      v-bind="{ ...cell.props, ...cell.attrs }"
                      v-on="cell.on"
                    >
                      <el-radio
                        v-for="option in cell.options.data"
                        :key="
                          option[cell.options.value] ||
                          option[cell.options.value] === 0
                            ? option[cell.options.value]
                            : option
                        "
                        :label="
                          option[cell.options.value] ||
                          option[cell.options.value] === 0
                            ? option[cell.options.value]
                            : option
                        "
                        v-bind="{ ...option.props, ...option.attrs }"
                      >
                        <slot :name="cell.prop" :option="option">{{
                          option[cell.options.label] || option
                        }}</slot>
                      </el-radio>
                    </el-radio-group>
                  </template>
                  <!-- <span class="split" v-show="item.type && item.type.indexOf('range') > -1 && index === 0" >-</span> -->
                  <template v-else-if="_isDatePicker(cell.type)">
                    <el-date-picker
                      :type="cell.type"
                      v-model="form[cell.prop]"
                      v-bind="{ ...cell.props, ...cell.attrs }"
                      :placeholder="
                        _getOV(cell.props, 'placeholder') ||
                        `请选择${item.props.label}`
                      "
                      v-on="{
                        ...cell.on,
                      }"
                    >
                      <template
                        v-slot:[slotName]
                        v-for="slotName in _getObjExistKey(cell.slots)"
                      >
                        <div :key="slotName">{{ cell.slots[slotName] }}</div>
                      </template>
                    </el-date-picker>
                  </template>
                </span>
              </el-form-item>
            </div>
          </el-collapse-transition>
        </el-col>
      </template>
    </el-row>
    <el-row>
      <div class="bs-search-expand">
        <div>
          <slot name="searchLeft" />
        </div>
        <div>
          <slot name="searchCenter" />
        </div>
        <div>
          <slot name="searchRight" />
          <span
            v-if="showAdvanceSearch"
            class="rt expand"
            @click="expandChange(!isExpand)"
          >
            高级搜索
            <span :class="[!isExpand ? 'el-icon-bottom' : 'el-icon-top']" />
          </span>
        </div>
      </div>
    </el-row>
  </el-form>
</template>
<script>
import bsCascader from "@/components/cascader";
/* eslint-disable */
class Options {
  constructor(attrs = {}, props = {}, on = {}, slots = {}) {
    this.attrs = attrs;
    this.props = props;
    this.on = on;
    this.slots = slots;
  }
}

/* 根据数字类型input的type的特殊处理，如：限制非数字的输入 */
const numberInputValueHandle = function (vm, formItem, cell, index) {
  let cellProp = cell.prop;
  let type = cell.type;
  let finalValue = vm.form[cellProp];
  if (!["digit", "number", "money"].includes(type)) {
    return finalValue;
  }
  let { negative, precision } = cell.props;
  const negativeValid = (value) => {
    let newValue = value || "";
    if (value.indexOf("-") === 0) {
      if (value.length === 1) {
        newValue = "";
      } else {
        newValue = "-" + value.replace(/-/g, "");
      }
    } else {
      newValue = value.replace(/-/g, "");
    }
    return newValue;
  };
  // digit 时，不可键入非数字
  if (type === "digit" && vm.form[cellProp]) {
    finalValue = String(vm.form[cellProp]);
    if (negative) {
      finalValue = negativeValid(finalValue).replace(/[\D-]/g, "");
    } else {
      finalValue = finalValue.replace(/[\D]/g, "");
    }
    finalValue = finalValue.replace(/^0+(\d+)/g, "$1");
  }
  // number 时，只可以输入小数
  if ((type === "number" || type === "money") && vm.form[cellProp]) {
    finalValue = String(vm.form[cellProp]);
    // money时 数值精度为2位
    if (type === "money") {
      negative = false;
      precision = 2;
    }
    if (negative) {
      finalValue = negativeValid(finalValue).replace(/[^.\d-]/g, "");
    } else {
      finalValue = finalValue.replace(/[^.\d]/g, "");
    }
    finalValue = finalValue
      .replace(/^0+(\d+)/g, "$1")
      .replace(/(.*\..*)\./g, "$1");
    if (precision) {
      let fixedReg = new RegExp("(\\.\\d{" + precision + "})\\d+", "ig");
      finalValue = finalValue.replace(fixedReg, `$1`);
    }
  }

  // 处理数字限制范围
  if (finalValue) {
    let value = Number(finalValue);
    let min = cell.props.min;
    let max = cell.props.max;
    if ((min && isNaN(min)) || (max && isNaN(max))) {
      throw new Error(`min or max is Not a Number in ${cellProp}`);
    }
    if (!isNaN(min) && !isNaN(value) && value < min) {
      finalValue = min;
    } else if (!isNaN(max) && !isNaN(value) && value > max) {
      finalValue = max;
    }

    if (formItem.type && formItem.type.indexOf("range") > -1) {
      let start = Number(vm.form[formItem.propStart]);
      let end = vm.form[formItem.propEnd];
      if (index === 0 && value && end) {
        finalValue = !isNaN(end - 0) && finalValue > end ? end : finalValue;
      } else if (index === 1 && start) {
        finalValue =
          !isNaN(start - 0) && finalValue < start ? start : finalValue;
      }
    }
  }
  return finalValue;
};

export default {
  name: "bs-baseForm",
  components: {
    bsCascader,
  },
  props: {
    config: Object, //
    readonly: Boolean,
    /**
     * @description: 是否显示高级搜索
     */
    showAdvanceSearch: {
      type: Boolean,
      default: false,
    },
    /**
     * @description: 重新设置表格高度的函数，在高级搜索开启时，收缩/展开 searchbar 时需要调用
     */
    fnTableHeightReset: {
      type: Function,
      default: null,
    },
    /**
     * @description: 是否需要开启响应式布局
     */
    isResponse: {
      type: Boolean,
      default: false,
    },
    model: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formItems: [],
      form: {},
      rules: {},
      isExpand: true,
    };
  },
  watch: {
    form: {
      handler(value) {
        this.$emit("update:model", value);
      },
      immediate: true,
      deep: true,
    },
    model: {
      handler(value) {
        this.form = value;
      },
      deep: true,
    },
    "config.formItem": {
      handler(formItem) {
        let rules = {};
        Object.entries(formItem)
          .filter(([prop, itemInfo]) => !itemInfo.layoutOnly)
          .map(([prop, itemInfo]) => {
            rules[prop] = this._FormRuleInit(prop, itemInfo, rules);
          });
        // 校验规则改变时 重新生成规则
        if (JSON.stringify(this.rules) !== JSON.stringify(rules)) {
          this.rules = rules;
        }
      },
      deep: true,
    },
  },
  methods: {
    /**
     * @description: 计算分栏策略
     * @param {*} type:类型，colNum:分栏数量
     * @return {*} Array [sm, md, lg, xl]
     */
    getSpan(item, config) {
      if (config.colNum) {
        const doubleColNumType = ["area"];
        let colNum = doubleColNumType.includes(item.type)
          ? config.colNum * 2
          : config.colNum;
        return new Array(4).fill(colNum);
      }
      let colNum = item.colNum;
      if (!colNum) {
        return [24, 24, 24, 24];
      }
      let spanArray = [];
      if (!this.isResponse) {
        return new Array(4).fill(24 / colNum);
      }
      if (colNum === 2) {
        // 分二栏
        spanArray = [24, 24, 12, 12];
      } else if (colNum === 3) {
        // 分三栏
        spanArray = [24, 12, 8, 8];
      } else if (colNum === 6) {
        // 分6栏
        spanArray = [12, 6, 4, 4];
      } else {
        // 默认分4栏
        spanArray = [12, 8, 6, 6];
      }
      return spanArray;
    },
    /**
     * @description: 展开/收起高级搜索行
     */
    expandChange(bool) {
      let colDom = this.$refs.col;
      colDom.reduce((total, col, index) => {
        let el = col.$el;
        total += el.offsetWidth;
        let parentWidth = el.parentNode.offsetWidth;
        if (this.formItems[index].visible === false) {
          this.formItems[index].visible = true;
        } else if (total > parentWidth) {
          this.formItems[index].visible = bool ? true : false;
        }
        // if (el.style.display === 'none') {
        //   el.style.display = 'block'
        // } else if (total > parentWidth) {
        //   el.style.display = bool ? 'block' : 'none'
        // }
        return total;
      }, 0);
      this.isExpand = bool;
      if (typeof this.fnTableHeightReset === "function") {
        this.$nextTick(() => {
          this.fnTableHeightReset();
        });
      }
    },
    // 获取Option的值
    getOptions(formItemName, cellIndex = 0) {
      return this.config.formItem[formItemName].items[cellIndex].options;
    },
    getFormObj(formItemName, cellIndex = 0) {
      return this.config.formItem[formItemName].items[cellIndex];
    },
    // 获取form对象
    getForm() {
      return this.$refs.form;
    },
    // 获取formItem对象
    getFormItem(prop) {
      return this.$refs[prop][0];
    },
    // 根据formList初始化form的model
    _FormModelInit() {
      this._ObjectComplete(this.config);
      let formItem = this.config.formItem;

      if (!formItem) {
        throw new Error("formItem is Not Exist");
      }

      let form = {};
      let rules = {};
      Object.entries(formItem).map(([prop, itemInfo]) => {
        // if (!item.hide) {
        this._ObjectComplete(itemInfo);
        itemInfo.props.prop = prop;
        this.formItems.push(itemInfo);

        this._SetDefaultFormValue(prop, itemInfo, form);
        if (this._ArrayNotEmpty(itemInfo.items)) {
          itemInfo.items.map((cell) => {
            this._ObjectComplete(cell);

            if (!cell.prop) {
              cell.prop = prop;
            } else {
              form[cell.prop] =
                cell.defaultValue !== undefined
                  ? cell.defaultValue
                  : cell.type === "checkbox"
                  ? []
                  : null;
            }

            // 初始化默认Props
            this._CellDefaultPropsInit(cell, itemInfo);
            this._CellDefaultDataInit(cell, itemInfo);
          });
        }
        // }

        rules[prop] = this._FormRuleInit(prop, itemInfo, rules);
        this._FormVisibleInit(itemInfo);

        if (itemInfo.layoutOnly) {
          delete form[prop];
          delete rules[prop];
        }
      });
      form = { ...form, ...this.model };
      this.$emit("update:model", form);
      this.form = form;
      console.log("form--->", JSON.stringify(this.form));
      this.rules = rules;
    },
    // 表单验证规则初始化 prop 校验的feild itemInfo
    _FormRuleInit(prop, itemInfo, rules) {
      let rule = [];
      let {
        props: { required, label },
      } = itemInfo;

      // 处理必填
      if (required) {
        let BASE_OPTION = {
          required: true,
          message: `${label}为必填字段`,
          trigger: "change",
        };
        if (itemInfo.type === "area") {
          BASE_OPTION.message = `区域为必填字段`;
          rule.push({ ...BASE_OPTION });
          BASE_OPTION.message = `分支为必填字段`;
          rules[itemInfo.branchKey] = [{ ...BASE_OPTION }];
        } else if (itemInfo.type && itemInfo.type.includes("range")) {
          BASE_OPTION.message = ``;
          rule = rule.concat({
            ...BASE_OPTION,
            validator: (rule, value, cb) => {
              let start = !this._isEmpty(this.form[itemInfo.propStart])
                ? this.form[itemInfo.propStart] + ""
                : "";
              let end = !this._isEmpty(this.form[itemInfo.propEnd])
                ? this.form[itemInfo.propEnd] + ""
                : "";
              if (!start || !start.trim()) {
                cb(new Error(`请填写区间开始值`));
                return;
              }
              if (!end || !end.trim()) {
                cb(new Error(`请填写区间结束值`));
                return;
              }
              cb();
            },
          });
        } else {
          rule.push({ ...BASE_OPTION });
        }
      }

      if (this._ArrayNotEmpty(itemInfo.props.rules)) {
        rule = rule.concat(itemInfo.props.rules);
      }

      return rule;
    },
    _FormVisibleInit(itemInfo) {
      this.$set(itemInfo, "visible", itemInfo.visible || true);
    },
    _SetDefaultFormValue(prop, itemInfo, form) {
      let props = itemInfo.props;
      form[prop] =
        itemInfo.defaultValue !== undefined ? itemInfo.defaultValue : null;
      if (itemInfo.type === "area") {
        form[prop] = null;
        form[itemInfo.branchKey] = null;
        if (props.multiple) {
          form[prop] = [];
          form[itemInfo.branchKey] = [];
        }
      }
    },
    _CellDefaultDataInit(cell, itemInfo) {
      if (cell.type === "select") {
        // 快捷配置字典
        if (cell.dictName) {
          this.$set(cell, "options", {
            data: [],
            value: "itemCode",
            label: "itemName",
          });
        }
      }
    },
    _CellDefaultPropsInit(cell, itemInfo) {
      this.$set(
        cell.props,
        "clearable",
        !this._isEmpty(cell.props.clearable) ? true : false
      );
      this.$set(
        cell.props,
        "filterable",
        !this._isEmpty(cell.props.filterable) ? true : false
      );
      if (this._isDatePicker(cell.type)) {
        this.$set(
          cell.props,
          "value-format",
          cell.props["value-format"] ||
            (cell.type.includes("year")
              ? "yyyy"
              : cell.type.includes("month")
              ? "yyyy-MM"
              : "yyyy-MM-dd")
        );
      }
      this._CellPlaceHolderInit(cell, itemInfo);
    },
    _CellPlaceHolderInit(cell, itemInfo) {
      let placeholder = "";
      let props = cell.props;
      if (this.readonly) {
        this.$set(props, "placeholder", placeholder);
        return;
      }
      if (
        this._isDatePicker(cell.type) ||
        ["select", "checkbox", "radio", "remote"].includes(cell.type)
      ) {
        placeholder = `请选择${itemInfo.props.label}`;
      } else {
        placeholder = `请填写${itemInfo.props.label}`;
      }
      if (props.placeholder) {
        placeholder = props.placeholder;
      }
      this.$set(props, "placeholder", placeholder);
    },
    // 数组是否为空
    _ArrayNotEmpty(list) {
      return Array.isArray(list) && list.length > 0;
    },
    /**
     * @description: 对于Input的类型不同时，input事件时做不同处理
     * @param {formItem} [Object] formitem
     * @param {cell} [Object] cell
     * @return 无
     */
    InputHandle(formItem, cell, index) {
      let cellProp = cell.prop;
      // ?这里改变值要放在nexttick里，否则页面会在下一次更新值时才会回显本次值
      this.$nextTick(() => {
        this.form[cellProp] = numberInputValueHandle(
          this,
          formItem,
          cell,
          index
        );
      });
      if (typeof this._getOV(cell.on, "input") === "function") {
        cell.on.input.call(null, this.form[cellProp]);
      }
    },
    InputBlurHandle(formItem, cell, index) {
      if (typeof this._getOV(cell.on, "blur") === "function") {
        // 测试一下
        cell.on.blur.call(null, this.form[cellProp]);
      }
    },
    /**
     * @description: 通过type确定formItem是否为Input，如果是则确认实际type的值
     * @param {type} [String]
     * @return {inInput: Boolean, type:String} [Object]
     */
    _inputTypeGet(type) {
      if (
        !type ||
        type === "input" ||
        type === "textarea" ||
        type === "digit" ||
        type === "number" ||
        type === "money" ||
        type === "digitrange"
      ) {
        return {
          isInput: true,
          type: type === "textarea" ? "textarea" : "input",
        };
      }
      return {
        isInput: false,
      };
    },
    _isDatePicker(type) {
      const datepickertype = [
        "year",
        "month",
        "date",
        "dates",
        " week",
        "datetime",
        "datetimerange",
        "daterange",
        "monthrange",
      ];
      return datepickertype.includes(type);
    },
    _propsResultGet(value, item, index) {
      let arg = [...arguments].slice(1);
      if (typeof value === "function") {
        return value.apply(null, arg);
      }
      return value;
    },
    _getOV(object, key) {
      return object ? object[key] : null;
    },
    _ObjectComplete(object) {
      let option = new Options();
      Object.entries(option).map(([key, value]) => {
        object[key] = object[key] || {};
        Object(object[key], value);
      });
    },
    /**
     * @description: 返回Object中不为空的Key值
     * @param {Object} object
     * @return {Array}
     */
    _getObjExistKey(object) {
      if (Object.prototype.toString.call(object) === "[object Object]") {
        return Object.keys(object).filter((key) => object[key]);
      }
      return [];
    },
    _isEmpty(value) {
      return value === null || value === "" || value === undefined;
    },
    /**
     * @description: 返回范围类型时，item的cell配置
     * @param {Object} object
     * @return {Array | null}
     */
    _getRangeCell(itemInfo) {
      let items = null;
      //  处理数字区间
      if (itemInfo.type === "digitrange" || itemInfo.type === "numberrange") {
        let type = itemInfo.type === "digitrange" ? "digit" : "number";
        let {
          min,
          max,
          propStart,
          propEnd,
          // 设置cell时 slots不要为空
          slots,
          placeholderStart,
          placeholderEnd,
          props: { label },
        } = itemInfo;
        items = [
          {
            type,
            prop: propStart,
            props: {
              min,
              max,
              placeholder: placeholderStart || `${label}-开始`,
            },
            slots: slots || {},
          },
          {
            type,
            prop: propEnd,
            props: {
              min,
              max,
              placeholder: placeholderEnd || `${label}-结束`,
            },
            slots: slots || {},
          },
        ];
      }
      return items;
    },
  },
  created() {
    this._FormModelInit();
    // console.log(this.config);
  },
  mounted() {
    // console.log(this.$refs);
    if (this.showAdvanceSearch) {
      this.expandChange(false);
    }
  },
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style lang="scss">
.bs-advance-search .bs-search-expand div:last-child {
  .expand {
    display: inline-block;
    line-height: 32px;
  }
}
.bs-search-expand {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1px 0px 10px;
  div:last-child:hover {
    color: #409eff;
  }
  div:last-child {
    cursor: pointer;
    line-height: 38px;
  }
}
.el-form-item__content {
  .bsform_digitrange,
  .bsform_numberrange {
    display: inline-block;
    &:first-child {
      box-sizing: border-box;
      position: relative;
      width: calc(50% + 18px);
      padding-right: 36px;
      &::after {
        position: absolute;
        width: 36px;
        text-align: center;
        content: "-";
      }
    }
    &:nth-child(2) {
      width: calc(50% - 18px);
    }
    .el-input {
      width: 100%;
    }
  }
}
.extend-form .el-select,
.extend-form .el-date-editor {
  width: 100%;
}
</style>
  