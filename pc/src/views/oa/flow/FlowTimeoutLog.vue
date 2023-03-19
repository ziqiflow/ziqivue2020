<template>
  <div style="margin:10px;">
    <el-alert v-if="error" :closable="false" :title="error" type="error"/>

    <div v-loading="loading" v-else>

      <div v-if="!!pageset">
        <h3 style="margin:10px;">流程超时日志</h3>
        <search-form-common v-if="!!pageset" :page-set="pageset" :default="searchdefault"/>
      </div>
    </div>
  </div>
</template>

<script>
import searchFormCommon from './searchFormForTimeoutLog'

import {
  FlowTimeoutLogGet
} from '@/api/oa'

// import {
//     FlowDesignsCanAdminTreeList
// } from '@/api/flowdesign'

export default {
  name: 'FlowAdmin',
  components: {
    searchFormCommon
  },
  data() {
    return {
      loading: false,
      show: false,
      flowid: null,
      error: null,
      flowname: null,
      choseAdminShow: false,
      pageset: null,
      searchdefault: null,
      LEAF_PRIORITY: 'LEAF_PRIORITY',
      nowchoseflowid: null,
      CatTreeList: null,
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.lists
        }
      }

    }
  },
  mounted() {
    this.loading = true
    FlowTimeoutLogGet({}).then(({
      data: res
    }) => {
      this.loading = false
      this.pageset = res.data.pageset
      this.searchdefault = res.data.DefaultData
    })
  },
  methods: {

  }
}
</script>

<style>
</style>
