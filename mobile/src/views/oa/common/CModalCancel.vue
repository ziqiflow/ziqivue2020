<template>
<el-dialog style="padding-bottom:0" :fullscreen="!isPc" v-loading="loading" title="可取消流程列表" :visible.sync="cancelModalStatus" width="50%" append-to-body>

    <div v-if="cancelModalStatus">
        <el-alert v-if="error" :closable="false" :title="error" type="error">
        </el-alert>
        <div v-else>
            <div v-if="!canAllCancel&&canCancelList.length==0">无可取消消息</div>
            <div class="pd5" v-for="(item,index) in canCancelList" :key='index'>
                <el-checkbox @change="whenAllCheckChange(item)" border v-model="item.allcheck" :indeterminate="item.indeterminate" size="medium">
                    {{item.NowFunName}}——{{tran_dealtype(item.dealtype)}}
                </el-checkbox>
                <el-checkbox-group @change="whenCheckChange(item)" class="cancheckbox_to" v-model="item.check" style="margin-left:20px;">
                    <el-checkbox size="mini" v-for="msg in item.group" :key="msg._id" :label="msg._id">{{msg.toer}}</el-checkbox>
                </el-checkbox-group>
            </div>
            <hr />
            <div class="pd10" v-if="canCancelList.length!=0||canAllCancel">
                <el-form>
                    <el-form-item required label="取消原因" style="margin-bottom: 0;">
                        <el-input type="textarea" :rows="2" placeholder="请输入取消原因" v-model="cancelReason">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>

        <span slot="footer" class="dialog-footer" >

<el-tooltip effect="light" v-if="canAllCancel" content="取消该流程发出去的所有流程，包含通知与抄送，并标记为作废" placement="top-start">
                <el-button @click="sureAllCancelFlow"  size="small" class="text-right" type="error">全流程作废取消（包含通知与抄送）</el-button>
            </el-tooltip>

  <el-tooltip effect="light" v-if="canCancelList.length!=0" content="只取消上面勾选的流程" placement="top-start">{{CancelCheckedNum}}
                <el-button @click="sureCancelFlow" size="small" type="danger" :disabled="CancelCheckedNum==0">
                    确定取消
                    <span v-if="CancelCheckedNum>0">({{CancelCheckedNum}})</span>
        </el-button>
        </el-tooltip>

        </span></div>
    </div>

</el-dialog>
</template>

<script>
import {
    FlowCanCancelList,
    FlowMsgCancel,
    FlowALLCancel,
} from '@/api/oa'

import {
    tran_dealtype
} from '@/utils/u_flowdesign'

export default {
    name: "CModelCancel",
    props: {},
    data() {
        return {
            cancelModalStatus: false,
            canCancelList: [],
            CancelCheckedNum: 0,
            cancelReason: '',
            loading: false,
            flowlistid: null,
            canAllCancel: false,
            error: null,
        }
    },
    mounted() {

    },
    watch: {
        canCancelList: {
            handler(newValue, oldValue) {
                let num = 0;
                this.canCancelList.forEach(item => {
                    num += item.check.length;
                })
                // console.log('num',num);
                this.CancelCheckedNum = num;
            },
            deep: true
        }
    },

    methods: {
        tran_dealtype(type) {
            return tran_dealtype(type)
        },
        loadCancelView(flowlistid) {

            // this.flowCancelNum=flowCancelNum;
            this.flowlistid = flowlistid;
            this.init();

        },

        init() {

            this.cancelModalStatus = true;
            this.loading = true;

            this.canCancelList = [];
            this.CancelCheckedNum = 0;
            this.cancelReason = '';
            this.error = null;

            FlowCanCancelList({
                flowOi_id: this.flowlistid
            }).then(({
                data: req
            }) => {
                this.loading = false
                if (req.success) {
                    let canCancelList = req.data.list;
                    this.canAllCancel = req.data.canAllCancel;

                    

                    canCancelList.forEach(item => {
                        item.allcheck = true;
                        item.check = [];
                        item.indeterminate = false;
                        //item.
                        item.group.forEach(groupitem => {
                            // groupitem.check=true;
                            item.check.push(groupitem._id);
                        })
                    })
                    this.canCancelList = canCancelList;

                } else {
                    this.$message.error(req.msg)
                    this.error = req.msg;
                }
            }).catch(e=>{
                 this.loading = false
            })

            
            
            
            //     type: 'error'
            // }).then(() => {

            

            // }).catch(() => {

            // });

        },
        getcanCancelChecked() {
            let msglist = [];
            this.canCancelList.forEach(item => {
                msglist = msglist.concat(item.check);
            })
            return msglist;
        },

        sureCancelFlow() {

            if (!this.cancelReason) {
                this.$message.warning('请输入取消原因');
                return;
            }

            let canCancelChecked = this.getcanCancelChecked();

            if (canCancelChecked.length == 0) {
                return;
            }

            this.loading = true;

            FlowMsgCancel({
                flowOi_id: this.flowlistid, // this.msgObj.flowlistOi._id,
                flowmsgIdList: canCancelChecked,
                cancelReason: this.cancelReason
            }).then(({
                data: req
            }) => {
                this.loading = false
                if (req.success) {
                    //this.canCancelList=req.data;
                    this.cancelModalStatus = false;
                    this.$message.success(req.msg);
                    this.$emit('on-cancel-success')
                } else {
                    this.$message.error(req.msg);
                    //this.$message.error(req.msg)
                }
            }).catch(e=>{
                  this.loading = false
            })

        },
        whenAllCheckChange(group) {

            group.indeterminate = false;
            if (group.allcheck == true) {
                // flow.forEach()
                let all = [];
                group.group.forEach(msg => {
                    all.push(msg._id);
                })
                group.check = all;
            } else {
                group.check = [];
            }
        },

        whenCheckChange(group) {

            if (group.check.length == 0) {
                group.allcheck = false;
                group.indeterminate = false;
                return;
            }
            if (group.check.length == group.group.length) {
                group.allcheck = true;
                group.indeterminate = false;
            } else {
                group.indeterminate = true;
            }

        },
        sureAllCancelFlow() {

            if (!this.cancelReason) {

                this.$message.warning('请输入取消原因');
                return;

            }

            this.$confirm('此操作会把本流程相关的所有的通知、抄送、下发流程取消, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {

                this.loading = true;

                FlowALLCancel({
                    flowOi_id: this.flowlistid, //this.msgObj.flowlistOi._id,
                    cancelReason: this.cancelReason
                }).then(({
                    data: req
                }) => {
                    this.loading = false
                    if (req.success) {
                        //this.canCancelList=req.data;
                           this.cancelModalStatus = false;
                        this.$message.success(req.msg);
                        this.$emit('on-cancel-success')
                    } else {
                        this.$message.error(req.msg);
                        //this.$message.error(req.msg)
                    }
                })

            }).catch(() => {
   this.loading = false
            });

        },

    }

}
</script>

<style scoped>

</style>
