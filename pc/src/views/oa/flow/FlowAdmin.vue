<template>
  <div style="margin:10px;">

    <el-dialog
      :visible.sync="choseAdminShow"
      title="提示"
      width="40%">

      <treeselect :disable-branch-nodes="true" :value-consists-of="LEAF_PRIORITY" v-model="nowchoseflowid" :multiple="false" :options="CatTreeList" :normalizer="normalizer" style="line-height: 35px;" placeholder="请输入要切换的流程名称" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="choseAdminShow = false">取 消</el-button>
        <el-button type="primary" @click="changetoOther">切 换</el-button>

      </span>
    </el-dialog>

    <el-alert
      v-if="error"
      :closable="false"
      :title="error"
      type="error"/>

    <div v-else>
      <h3 style="margin:10px;">管理流程 ~{{ flowname }}  <a @click="changeAdmin">切换</a></h3>

      <search-form-common v-if="!!pageset" :flowname="flowname" :flowid="flowid" :page-set="pageset" :default="searchdefault"/>
    </div>

  </div>
</template>

<script>

// import searchFormCommon from './searchFormCommon.vue'
import searchFormCommon from './searchFormForFlowAdmin'

import { FlowAdminGetConf } from '@/api/oa'

import {
  FlowDesignsCanAdminTreeList
} from '@/api/flowdesign'

import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { RecursiveFormList,tran_dealtype } from '@/utils/u_flowdesign'

export default {
  name: 'FlowAdmin',
  components: {
    searchFormCommon,
    Treeselect

  },
  data() {
    return {
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
    this.flowid = this.$route.params.id
    console.log(this.$route.params.id)

    FlowAdminGetConf({
      flowid: this.flowid
    }).then(({
      data: req
    }) => {
      this.loading = false
      if (req.success) {
        // this.canCancelList=req.data;
        this.flowname = req.data.flowname
             let pageset = req.data.pageset
        this.filterSearchFormSet(pageset.searchFormSet.list)
  
        this.pageset=pageset;
        
        this.searchdefault = req.data.default
      } else {
        this.$message.error(req.msg)
        this.error = req.msg

        // this.$message.error(req.msg)
      }
    })
  },
  methods: {
    filterSearchFormSet(list){
        
        RecursiveFormList(list,(e)=>{
          if(/^\${.*}$/g.test(e.options.defaultValue)){
            e.options.defaultValue=null;
          }
        })
    },
    changetoOther() {
      if (!this.nowchoseflowid) {
        this.$message.error('还未选择流程')
        return
      }

      this.choseAdminShow = false

      this.$router.push({ name: 'flowadmin', params: { id: this.nowchoseflowid }})

      // /flowadmin/'+data.id

      // this.nowchoseflowid
    },

    changeAdmin() {
      if (!this.CatTreeList) {
        FlowDesignsCanAdminTreeList({}).then(({
          data: req
        }) => {
          this.searchloading = false
          if (req.success) {
            this.CatTreeList = req.data
            this.choseAdminShow = true
          } else {
            this.$message.error(req.msg)
          }
        }).catch(e => {
          console.log('error', e)
          this.$message.error(e.message)
        })
      } else {
        this.choseAdminShow = true
      }
    }

  }
}
</script>

<style>
</style>
