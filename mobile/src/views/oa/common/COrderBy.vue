<template>
  <div>
    <div v-if="orderbylist.length>0">

      <div v-for="(item,index) in value" :key="index" style="margin-bottom: 5px;">

        项目:
        <el-select v-model="item.name" style="width: 150px">
          <el-option v-for="item in orderbylist" :key="item.name" :label="item.zh_name" :value="item.name"/>
        </el-select>
        顺序：
        <el-select v-model="item.by" style="width: 80px">
          <el-option label="↓" value="desc"/>
          <el-option label="↑" value="asc"/>
        </el-select>

        <el-tooltip v-if="index!=0" style="margin-left: 5px;" effect="dark" content="删除排序" placement="top-start">
          <i style="cursor: pointer" class="el-icon-remove-outline" @click="remove(index)"/>
        </el-tooltip>

        <el-tooltip v-if="index==value.length-1" style="margin-left: 5px;" effect="dark" content="添加排序" placement="top-start">
          <i style="cursor: pointer" class="el-icon-circle-plus-outline" @click="addorderby"/>
        </el-tooltip>

      </div>

    </div>

  </div>
</template>

<script>

export default {
  name: 'COrderBy',
  props: {
    orderbylist: {},
    value: {
      type: Array,
      default: () => {
        return [{ name: '', by: 'desc' }]
      }
    }
  },
  // props:['orderbylist'],
  data() {
    return {}
  },
  mounted() {
    if (this.value.length == 0) return

    
    if (!this.value[0].name) {
      if (this.orderbylist.length) {
        this.value[0].name = this.orderbylist[0].name
      }
    }
  },
  methods: {
    remove(index) {
      this.value.splice(index, 1)
    },
    addorderby() {
      this.value.push(
        { name: '', by: 'desc' }
      )
    }

  }

}
</script>

<style scoped>

</style>
