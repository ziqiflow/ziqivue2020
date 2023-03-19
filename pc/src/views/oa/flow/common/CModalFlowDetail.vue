<template>
  <div>

    <el-dialog :fullscreen="!isPc||isFullScreen"
      :title="title"
      width="75%"
      :visible.sync="modalstatu"
      :close-on-click-modal="false"
    >

      <span class="maxzoom" v-if="isPc">
            <svg-icon  v-if="isFullScreen" @click.native="toggleFullScreen" class="fz12" style="color: grey;" icon-class="exit-fullscreen" />
            <svg-icon  @click.native="toggleFullScreen" v-else class="fz12" style="color: grey;" icon-class="fullscreen" /></span>

      <div v-if="modalstatu">
        <flow-detail :nowfunid.sync="nowfunid" :flow-oi-id.sync="flowOi_id"  :is-admin="isAdmin" />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

// import {
//     FlowdesignsGet,
//     FlowCreat
// } from '@/api/oa'
// import { forEach } from '@/libs/tools';

import FlowDetail from './CFlowDetail'

export default {
  name: 'Cmodaldetail',
  props: {
        isAdmin:{
            type:Boolean,
            default:()=>{
                return false
            }
        }
  },
  components: {
    FlowDetail
  },
  data() {
    return {
      error: null,
      modalstatu: false,
      title: null,
      successShow: false,
      tabname: 'flow.dealer',
      flowmsgid: null,
      flowOi_id: null,
      nowfunid:null,
      isFullScreen:false
    }
  },
  watch: {
    // flowid() {
    
    // }
  },

  mounted() {

  },
  methods: {

  },
  methods: {
    cancel() {
      this.modalstatu = false
    },
      toggleFullScreen(){
            this.isFullScreen=!this.isFullScreen;
        },
    loadmodal(flowOi_id, title,nowfunid) {
      this.flowOi_id = flowOi_id
      console.log('flowOi_id', flowOi_id)
      this.title = title
      this.modalstatu = true
      this.nowfunid=nowfunid;
    }

  }
}
</script>

<style scoped>
    .maxzoom {
    position:absolute;
        right: 43px;
    top: 20px;
    cursor: pointer;
}
</style>