<template>
<div>
    <el-dialog width="75%" :fullscreen="!isPc||isFullScreen" :close-on-click-modal="false" :title="title" :visible.sync="modalstatu">


        <span class="maxzoom" v-if="isPc">
            <svg-icon  v-if="isFullScreen" @click.native="toggleFullScreen" class="fz12" style="color: grey;" icon-class="exit-fullscreen" />
            <svg-icon  @click.native="toggleFullScreen" v-else class="fz12" style="color: grey;" icon-class="fullscreen" />
            
        </span>
        <div v-if="modalstatu">
            <div v-if="!successShow">
                <el-tabs v-model="tabname" type="card">
                    <el-tab-pane label="审核流程" name="flow.dealer">
                        <div v-if="tabname=='flow.dealer'">
                            <flow-dealer @on-revoke-success="revokeSuccess" @on-deal-success="dealSuccess" @on-cancel-success="cancelSuccess" :flowmsgid.sync="flowmsgid" />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="流程信息" name="flow.detail">
                        <div v-if="tabname=='flow.detail'">
                            <flow-detail :nowfunid.sync="nowfunid" :flow-oi-id.sync="flowOi_id" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
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

import FlowDealer from './CFlowDealer'
import FlowDetail from './CFlowDetail'

import {
    mapState
} from 'vuex'

export default {
    name: 'Cmodaldealer',

    computed: {
        ...mapState({
            flowBadge: state => state.user.flowBadge
            //  messageReadedList: state => state.employee.messageReadedList,
        })
    },
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
            nowfunid: null,
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
        toggleFullScreen(){
            this.isFullScreen=!this.isFullScreen;
        },
        revokeSuccess() {
            this.modalstatu = false;
            this.flowBadge.waiting--;
            this.$emit('need-refresh');
        },
        dealSuccess() {
            this.flowBadge.waiting--;
            this.$emit('need-refresh');
        },
        cancelSuccess() {
            this.modalstatu = false;
            this.flowBadge.waiting--;
            this.$emit('need-refresh');
        },

        cancel() {
            this.modalstatu = false
        },
        loadmodal(msgid, flowOi_id, title, nowfunid) {
            this.flowOi_id = flowOi_id
            this.flowmsgid = msgid
            this.title = title
            this.modalstatu = true
            this.nowfunid = nowfunid;
            console.log('nowfunidmodal', nowfunid);
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
