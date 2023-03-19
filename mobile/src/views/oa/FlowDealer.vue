<template>
  <div  style="margin:10px;">

        <div v-if="!successShow&&flowmsgid">
          <el-tabs v-model="tabname" type="card">
            <el-tab-pane label="审核流程" name="flow.dealer">
              <div v-if="tabname=='flow.dealer'">
                <flow-dealer 
                @on-revoke-success="revokeSuccess" 
                @on-deal-success="dealSuccess" 
                @on-cancel-success="cancelSuccess" :flowmsgid.sync="flowmsgid"/>
              </div>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="flow.detail">
              <div v-if="tabname=='flow.detail'">
                <flow-detail :nowfunid.sync="nowfunid" :flow-oi-id.sync="flowOi_id"/>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
  </div>
</template>

<script>

// import {
//     FlowdesignsGet,
//     FlowCreat
// } from '@/api/oa'
// import { forEach } from '@/libs/tools';

import FlowDealer from './common/CFlowDealer'
import FlowDetail from './common/CFlowDetail'
import {
    mapState
} from 'vuex'
export default {
  name: 'Cmodaldealer',
  // props: {
  //     flowid: {
  //         type: string,
  //         default: () => {
  //             return []
  //         }
  //     }
  // },
  components: {
    FlowDealer,
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
      nowfunid:null
    }
  },
   computed: {
        ...mapState({
            flowBadge: state => state.user.flowBadge
            //  messageReadedList: state => state.employee.messageReadedList,
        })
    },
  watch: {
    // flowid() {
    
    // }
  },

  mounted() {

      console.log(this.$route.query);
      this.loadmodal(this.$route.query.msgid,this.$route.query.flowlistid,this.$route.query.nowfunid);
  },
  methods: {
    revokeSuccess() {
            this.flowBadge.waiting--;
            this.flowBadge.waitingListRefresh=true;
            // this.$emit('need-refresh');
        },
        dealSuccess() {
            this.flowBadge.waiting--;
                        this.flowBadge.waitingListRefresh=true;
            // this.$emit('need-refresh');
        },
        cancelSuccess() {
            this.flowBadge.waiting--;
                        this.flowBadge.waitingListRefresh=true;
            // this.$emit('need-refresh');
        },
    loadmodal(msgid, flowOi_id,nowfunid) {
        console.log(msgid);
      this.flowOi_id = flowOi_id
      this.flowmsgid = msgid
    //   this.title = title
    //   this.modalstatu = true
      this.nowfunid=nowfunid;
    //   console.log('nowfunidmodal',nowfunid);
    }

  }
}
</script>

<style>
</style>
