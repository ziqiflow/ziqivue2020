<template>
  <el-dialog :fullscreen="!isPc" v-loading="loading" title="可撤回流程节点" :visible.sync="revokeModalStatus" width="50%" append-to-body>
        <div>
            <table class="table table-bordered">
                <tbody>
                    <tr>
                        <td>节点名</td>
                        <td>处理人</td>
                        <td style="width:140px;">时间</td>
                        <td style="width:100px;">操作</td>
                    </tr>
                    <tr v-for="(revoke,index) in revokeList" :key="index">
                        <td>{{revoke.NowFunName}}</td>
                        <td>{{revoke.toer}}</td>
                        <td style="width:80px">{{revoke.finished_at}}</td>
                        <td>
                            <el-button type='text' size="mini" @click="revoketo(revoke)">撤回到此处</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </el-dialog>
</template>

<script>
import {
    FlowRevokeList,
    FlowRevokeTo
} from '@/api/oa'

import {
    tran_dealtype
} from '@/utils/u_flowdesign'

export default {
    name: "CModelRevoke",
    props: {},
    data() {
        return {
            revokeModalStatus: false,
            revokeReason: '',
            revokeList: [],
            loading: false,
            flowmsgid: null
        }
    },
    mounted() {

    },
    watch: {
      
    },

    methods: {
        tran_dealtype(type) {
            return tran_dealtype(type)
        },
        loadRevokeView(flowmsgid) {

            this.flowmsgid = flowmsgid;
            this.init();

        },

        init() {



            this.revokeModalStatus = true;
            this.revokeList=[];
            this.revokeReason='';
            this.loading = true;

            FlowRevokeList({
                msg_id: this.flowmsgid
            }).then(({
                data: req
            }) => {
                this.loading = false
                if (req.success) {
                    this.revokeList = req.data;
                } else {
                    this.$message.error(req.msg)
                }
            }).catch(e=>{
                this.loading = false
            })
           

        },

       
        revoketo(revoke) {
            this.$prompt('确定撤回到<' + revoke.NowFunName + '>,撤回后，当前流程节点以及与撤回节点之间分发的节点都会被取消',
                '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValidator: (val) => {
                        return !!val;
                    },
                    inputPlaceholder: '请输入撤回原因',
                    inputErrorMessage: '撤回原因不可为空'
                }).then(({
                value
            }) => {

                // console.log(value);

                // return;
                
                this.loading = true;

                FlowRevokeTo({
                    msg_id: this.flowmsgid,
                    msg_to_id: revoke._id,
                    reason: value
                    //,
                    //cancelReason:this.cancelReason
                }).then(({
                    data: req
                }) => {
                    this.loading = false
                    if (req.success) {
                        this.$message.success(req.msg);
                        this.$emit('on-revoke-success')
                    } else {
                        this.$message.error(req.msg);
                    }
                })

            }).catch(e => {
                this.loading = false
            });

        },

    }

}
</script>

<style scoped>

</style>
