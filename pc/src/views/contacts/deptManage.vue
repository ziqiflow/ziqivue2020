<template>
  <div>

    <svg-icon icon-class="iosbookoutline" />

    <el-card class="box-card">
      <el-alert
        v-if="!!error"
        :title="error"
        :closable="false"
        type="error"/>
      <div v-else>
        部门管理
        <tree-table :expand-all="true" :columns="columns" :data="deptTree">
        </tree-table>

      </div>
    </el-card>
  </div>
</template>

<script>
// import {
//     getDeptData
// } from "@/api/contacts";
import treeTable from '@/components/TreeTable'

import {
  mapActions,
  mapState
} from 'vuex'

export default {
  name: 'Deptmanage',
  components: {
    treeTable
  },
  data() {
    return {
      error: null,
      columns: [{
        text: '部门名称',
        value: 'name',
        width: '400px'
      }]
    }
  },

  computed: {
    ...mapState({
      deptTree: state => state.contact.deptTree
    })
    //,
    // ...mapGetters([
    //   'messageUnreadCount',
    //   'messageReadedCount',
    //   'messageTrashCount'
    // ])
  },

  methods: {
    ...mapActions([
      'getDeptData'
    ])
  },

  activated() {
    console.log('activated')
  },
  mounted() {
    console.log('mounted')
    
    this.getDeptData().then(res => {
      console.log(res)
    })
    // setTimeout(() => {
    //     console.log(this.deptTree);
    // }, 1000);
  }
}
</script>

<style>
</style>
