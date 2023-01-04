<template>
  <div>
    <el-collapse
      v-model="activeNames"
      :accordion="accordion"
      @change="handleChange"
    >
      <el-collapse-item
        v-for="(item, key) in collapseItems.filter((item) => !item.isHide)"
        :key="key"
        :title="item.title"
        :name="item.name"
      >
        <bsBaseForm
          v-if="item.type === 'form'"
          :ref="item.name"
          :model="item.form"
          :config="item.config">
          <template
            v-for="it in formItems.filter((it) => it.slot)"
            :slot="it.prop">
            <slot :name="it.prop"/>
            <!-- <slot :name="it.props.prop"/> -->
          </template>
        </bsBaseForm>
        <slot
          v-else-if="item.type === 'slot'"
          :name="item.name"/>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import bsBaseForm from '@/components/baseForm.vue'

export default {
  components: {
    bsBaseForm,
  },
  props: {
    collapseItems: {
      type: Array,
      default: () => {},
    },
    accordion: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    //   collapseItems: [],
      activeNames: [],
      formItems: [],
    }
  },
  computed: {

  },
  watch: {},
  mounted() {
    // console.log('$slots', this.$slots.customContent)
  },
  created() {
    this.initCollapse()
  },
  methods: {
    initCollapse() {
      const collapseItems = this.collapseItems

      if (!collapseItems) {
        throw new Error('collapseItem is Not Exist')
      }
      collapseItems.forEach((it) => {
        if (it.type === 'form') {
          // eslint-disable-next-line array-callback-return
          Object.entries(it.config.formItem).map(([prop, itemInfo]) => {
            console.log(prop)
            itemInfo.props.prop = prop
            this.formItems.push(itemInfo)
          })
        }
      })
      console.log('this.collapseItems', this.collapseItems)
    },
    handleChange(val) {
      console.log(val)
      console.log('this.activeNames', this.activeNames)
      this.$emit('change', val)
    },
  },
}
</script>
<style scoped>
</style>