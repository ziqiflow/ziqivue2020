<template>
<div>
    <el-dialog v-loading="statusloading" :fullscreen="!isPc" :visible.sync="msgStatusModal" title="查看状态" width="75%" append-to-body>

        <el-button class="download-msg-list" size="mini" type="text" icon="el-icon-download" @click="downtable">下载表格</el-button>

        <el-table v-if="msgStatusModal" :data="msgList" :default-sort="{prop: 'todeptstr', order: 'descending'}" :row-class-name="tableRowClassName" class="msgStatusListTable" style="width: 100%">
            <el-table-column label="部门" width="180" prop="todeptstr" sortable />

            <el-table-column label="处理人" width="120">
                <template slot-scope="{row}">
                    {{ row.toer }}
                </template>
            </el-table-column>

            <el-table-column label="状态" width="80">
                <template slot-scope="{row}">
                    {{ tran_msgstatus(row.status) }}
                </template>
            </el-table-column>

            <el-table-column label="通知状态" width="120">
                <template slot-scope="{row}">
                    <span v-if="row.hassend">已发</span>
                    <span v-else style="color:red">未发</span>
                </template>
            </el-table-column>

            <el-table-column label="是否已读" width="120">
                <template slot-scope="{row}">
                    <span v-if="row.hasread">已读</span>
                    <span v-else style="color:red">未读</span>
                </template>
            </el-table-column>

            <el-table-column v-if="nowStatusDealType!='message'" label="结束时间" width="180">
                <template slot-scope="{row}">
                    {{ row.finished_at }}
                </template>
            </el-table-column>

            <el-table-column v-if="nowStatusDealType!='message'" label="处理结果" width="180">
                <template slot-scope="{row}">

                    <span v-if="!!row.log">
                        点击了{{ row.log.button }}，审批建议：{{ row.log.suggest }}
                    </span>
                </template>
            </el-table-column>

        </el-table>

        <div style="margin-top:10px;">
            <el-button v-if="nowStatusDealType!='message'&&unDealNumList.length>0" type="warning" @click="reSendMessage(unDealNumList)">未处理重新发推送({{ unDealNumList.length }})</el-button>
            <el-button v-if="nowStatusDealType=='message'&&unReadNumList.length>0" type="warning" @click="reSendMessage(unReadNumList)">未读的重新发推送({{ unReadNumList.length }})</el-button>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="msgStatusModal = false">取 消</el-button>
        </span>
    </el-dialog>

    <modal-see-table ref="seetable" :is-admin="isAdmin" />

    <div v-if="!!log" class="log">
        <div>
            <v-icon name="person" />
            <span v-if="!!log.depts&&log.depts.length">
                [<span v-for="(dept,index) in log.depts" :key="dept.v">{{ dept.n }}<span v-if="index!=log.depts.length-1">|</span></span>]
            </span>
            <span class="logPerson">
                {{ log.creater }}</span>
            <span class="logType" style="margin:0 5px">{{ log.type }}</span>
            <span class="logCreated_at">于 {{ log.created_at }}
            </span>
        </div>

        <div v-if="log.type2==3||log.type2==7">
            <div v-if="!!log.reason">
                取消原因：
                <span class="label info"> {{ log.reason }}</span>
            </div>
            <div v-if="!!log.history">

                取消记录：
                <div style="margin-left:10px;">

                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>流程节点</td>
                                <td>类型</td>
                                <td>相关人</td>
                            </tr>
                            <tr v-for="(history,index) in log.history" :key="index">
                                <td><span class="label warning">{{ history.NowFunName }}</span></td>
                                <td>{{ tran_dealtype(history.dealtype) }}</td>
                                <td><span v-for="(group,index2) in history.group" :key="index2" style="margin-right:5px;">{{ group.toer }}</span>
                                </td>
                            </tr>

                        </tbody>
                    </table>

                </div>

            </div>
        </div>
        <div v-else-if="log.type2==6">

            <div v-if="!!log.reason">
                撤回原因：
                <span class="label info">{{ log.reason }}</span>
            </div>
            <div v-if="!!log.history">

                撤回记录：
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td style="width:60px" />
                            <td>节点名称</td>
                            <td style="width:80px">处理人</td>

                        </tr>
                        <tr>
                            <td>撤销前</td>
                            <td> {{ log.history.from.FunName }}</td>
                            <td> {{ log.history.from.toer }}</td>
                        </tr>
                        <tr>
                            <td>撤销到</td>
                            <td>{{ log.history.to.FunName }}</td>
                            <td> {{ log.history.to.toer }}</td>
                        </tr>
                    </tbody>
                </table>

            </div>

        </div>

        <div v-else>
            <div v-if="log.formdata.length>0" class="logForm">
                <span class="text-underline"> 填写表单：</span>
                <span v-for="(data,index) in log.formdata" :key="index" style="margin-right:8px">
                    <span v-if="isAdmin||!data.h">

                        {{ data.n }}:

                        <el-switch v-if="data.t==&quot;switch&quot;" v-model="data.v" disabled size="mini" />

                        <el-button v-else-if="data.t==&quot;table&quot;" type="text" size="mini" @click="showtable(data)">查看表格</el-button>

                        <span v-else>{{ showv(data) }}</span>

                    </span>
                </span>
            </div>
            <div class="logSuggest">
                <span class="text-underline">审批意见：</span>
                <span v-if="!!log.suggest" class="label info">{{ log.suggest }}</span>
                <span v-else>无</span>
            </div>
            <div v-if="!!log.button" class="logAction">
                <span class="text-underline"> 点击按键：</span>「{{ log.button }}」
                <span style="margin-left:10px">
                    <span v-if="!!log.PreFunName" class="label success"> {{ log.PreFunName }} </span>
                    <span v-else>/</span>
                    ->
                    <span v-if="!!log.NowFunName" class="label warning">
                        {{ log.NowFunName }}
                    </span>
                </span>
            </div>
        </div>

        <div v-if="showNext">

            <div v-if="log.type2!=3||log.type2!=6">
                <div v-if="!!log.nextmsg&&log.nextmsg.length!=0">
                    <span class="text-underline">已转发下一流程至：</span>
                    <div v-for="(msg,index) in log.nextmsg" :key="index" class="nextmsgList">
                        
                          <div v-if="msg.dealtype=='wait_merge'">
                     流程名称：<span class="label warning">{{ msg.funname }}</span>;
                     等待以下流程合并：
                     <span class="label warning" v-for="(fun,indexfun) in msg.waitmergeFunids" :key="indexfun">{{fun.name}}</span>

                </div>
                        <div v-else>
                        流程名称：
                        <span v-if="msg.list.length>0&&!!msg.level&&msg.level==100" class="label error">紧急</span>
                        <span class="label warning">{{ msg.funname }}</span>
                        ;
                        处理人： <span v-for="(to,indexto) in msg.list" :key="indexto" class="label success">{{ to.name }}</span>
                        <span v-if="msg.list.length==0">无</span>
                        <span class="label error">{{ tran_dealtype(msg.dealtype) }}</span>
                        <el-button v-if="!!log.flowmsgid&&msg.list.length>0" type="text" size="mini" @click="watchStatus(msg.dealtype,msg.dealtype,msg.funid,log.flowmsgid)">查看状态</el-button></div>


                    </div>
                </div>

                <div v-if="!!log.sonflow&&log.sonflow.length!=0">
                    <span class="text-underline">已转发至外部流程：</span>
                    <div v-for="(msg,index) in log.sonflow" :key="index" class="sonflowList">
                        流程名称：<span class="label dark">
                            <v-icon name="md-git-branch" style="color:white" class="fz12" />

                            <span v-if="!!msg.level&&msg.level==100" class="label error">紧急</span>
                            {{ msg.flowname }}

                        </span>
                        状态：<span v-if="!msg.flowlistid"><span class="label text">失败</span><span class="msg">{{ msg.msg }}</span></span>
                        <span v-else><span class="label text">成功</span>

                            <span class="msg">{{ msg.msg }}</span><a target="_blank" :href="flowdetailherf+'='+msg.flowlistid">查看</a> </span>
                    </div>
                </div>

                <div v-if="!!log.nextcc&&log.nextcc.length!=0">
                    <span class="text-underline">抄送至：</span>
                    <div v-for="(msg,index) in log.nextcc" :key="index" class="nextccList">
                        流程名称：
                        <span v-if="msg.list.length>0&&!!msg.level&&msg.level==100" class="label error">紧急</span>
                        <span class="label warning">{{ msg.funname }}</span>
                        ;
                        抄送人： <span v-for="(to,indexto) in msg.list" :key="indexto" class="label success">{{ to.name }}</span>
                        <el-button v-if="!!log.flowmsgid&&msg.list.length>0" type="text" size="mini" @click="watchStatus('cc','message',msg.funid,log.flowmsgid)">查看状态</el-button>
                        <span v-if="msg.list.length==0">无</span>
                    </div>
                </div>
            </div>

        </div>

        <div v-if="log.type2!=3||log.type2!=6">
            <div v-if="!!log.msg">
                自动化备注：
                {{ log.msg }}
            </div>
        </div>

    </div>
</div>
</template>

<script>
import {
    tran_dealtype,
    tran_msgstatus
} from '@/utils/u_flowdesign'

import {
    mapState
} from 'vuex'

import {
    FriendlyTime
} from '@/utils/friendlytimejs'

import ModalSeeTable from './CModalSeeTable'
import {
    FlowMessageCheckStatus,
    FlowMessageCheckStatusExport
} from '@/api/oa'

export default {
    name: 'Cflowlog',
    components: {
        ModalSeeTable
    },
    props: {
        flowObj: {
            
            type: Object,
            default: () => {
                return null
            }
        },
        log: {
            type: Object,
            default: () => {
                return null
            }
        },
        designer: {
            type: Object,
            default: () => {
                return null
            }
        },
        showNext: {
            type: Boolean,
            default: () => {
                return true
            }
        },
        isAdmin: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    computed: {
        ...mapState({
            userid: state => state.user.id
        }),
        flowdetailherf() {
            return this.$router.resolve({
                path: '/flowdetail?flowlistid'
            }).href;
        }
    },

    data() {
        return {

            msgStatusModal: false,
            statusloading: false,
            msgList: [],
            nowStatusDealType: '',

            unDealNumList: [],
            unReadNumList: [],
            reSendLimit: window.conf.flowReSendLimit,
            nowProps: {}
        }
    },
    activated() {},
    mounted() {
        // this.searchdata(1)
        
        
        // console.log('reSendLimit',this.reSendLimit);
    },
    methods: {

        reSendMessage(list) {
            if (list.length == 0) {
                return this.$message.error('无可发送消息')
            }

            this.statusloading = true

            const {
                dealtype,
                funid,
                premsgid
            } = this.nowProps

            FlowReSendMessage({
                msglist: list,

                dealtype: dealtype,
                funId: funid,
                preMsgId: premsgid

            }).then(({
                data: req
            }) => {
                this.statusloading = false
            })
        },
        canresendpermisson() {
            if (this.isAdmin) return true
            if (this.log.created_id == this.userid) return true
            if (!!this.flowObj && this.flowObj.created_id == this.userid) return true
            return false
        },
        
        canresend(sended_at) {
            

            if (!this.canresendpermisson()) return false
            

            if (!sended_at) return false
            // console.log(Date.parse(new Date(sended_at))/1000+this.reSendLimit*3600*24);

            if (Date.parse(new Date(sended_at)) / 1000 + this.reSendLimit * 3600 * 24 < Date.parse(new Date()) / 1000) {
                return true
            }
            return false
        },

        tableRowClassName({
            row,
            rowIndex
        }) {
            if (['andsign', 'orsign'].indexOf(this.nowStatusDealType) != -1) {
                
                
                
                // console.log(this.canresend(row.sended_at));
                return (row.status == 1 && this.canresend(row.sended_at)) ? 'warning-row' : ''
            }

            if (this.nowStatusDealType == 'message') {
                if (row.status == 5 || row.status == 6) { // console.log(v.hasread)
                    return !row.hasread && this.canresend(row.sended_at) ? 'warning-row' : ''
                } else {
                    return ''
                }
            }

            return ''

            // if (rowIndex === 1) {
            // return 'warning-row';
            // } else if (rowIndex === 3) {
            // return 'success-row';
            // }
            // return '';
        },

        showdepts(depts) {
            const arr = []
            depts.forEach(dept => {
                arr.push(dept.n)
            })
            if (arr.length == 0) {
                return ''
            }
            return arr.join(',')
        },
        showtable(data) {
            this.$refs.seetable.set_a_table('查看表格', data.str.set, data.v)
        },
        showv(item) {
            // item;
            
            if (typeof item.str === 'undefined') {
                return item.v
            }
            return item.str
        },
        friendlytimejs(timestr) {
            return FriendlyTime(timestr, new Date())
        },
        tran_dealtype(type) {
            return tran_dealtype(type)
        },
        tran_msgstatus(type) {
            return tran_msgstatus(type)
        },

        downtable() {
            const {
                dealtype,
                funid,
                premsgid
            } = this.nowProps

            this.statusloading = true
            FlowMessageCheckStatusExport({
                type: 'PermsgidFunid',
                dealtype: dealtype,
                funId: funid,
                preMsgId: premsgid
            }).then((res) => {
                this.statusloading = false
                console.log(res)
                // console.log(res.data.constructor);
                if (!!res.data && res.data.constructor == ArrayBuffer) {
                    var blob = new Blob([res.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    })
                    var objectUrl = URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    document.body.appendChild(a)
                    a.setAttribute('style', 'display:none')
                    a.setAttribute('href', objectUrl)
                    a.setAttribute('download', '流程状态导出')
                    a.click()
                    URL.revokeObjectURL(objectUrl)
                } else {
                    this.$message.error(res.data.msg)
                }
            }).catch(e=>{  this.statusloading = false})
        },
        watchStatus(dealtype, dealtypeinner, funid, premsgid) {
            this.nowProps = {
                dealtype,
                funid,
                premsgid
            }

            
            this.msgStatusModal = true
            this.statusloading = true
            this.msgList = []
            this.nowStatusDealType = dealtypeinner 

            FlowMessageCheckStatus({
                type: 'PermsgidFunid',
                dealtype: dealtype,
                funId: funid,
                preMsgId: premsgid
            }).then(({
                data: req
            }) => {
                this.statusloading = false
                if (req.success) {
                    
                    req.data.forEach(ele => {
                        if (!ele.todeptstr) {
                            if (ele.todepts) {
                                ele.todeptstr = this.showdepts(ele.todepts)
                            }
                        }
                    })

                    this.msgList = req.data

                    if (['andsign', 'orsign'].indexOf(this.nowStatusDealType) != -1) {
                        
                        

                        this.unDealNumList = this.msgList.filter(v => {
                            return v.status == 1 && this.canresend(v.sended_at)
                        }).map(v => {
                            return v._id
                        })

                        // this.unDealNum = this.msgList.filter(v => {
                        //     return v.status == 1&&this.canresend(v.sended_at)
                        // }).length;
                    }

                    if (this.nowStatusDealType == 'message') {
                        

                        this.unReadNumList = this.msgList.filter(v => {
                            if (v.status == 5 || v.status == 6) {
                                // console.log(v.hasread)
                                return !v.hasread && this.canresend(v.sended_at)
                            } else {
                                return false
                            }
                        }).map(v => {
                            return v._id
                        })
                    }
                } else {
                    this.$message.error(req.msg)
                }
            }).catch(e=>{
                 this.statusloading = false
            })
        }

    }
}
</script>

<style>
.msgStatusListTable .warning-row {
    background: oldlace;
}
</style>

<style scoped>
.padding10 {
    padding: 10px;
}

.text-underline {
    text-decoration: underline;
}

.label,
.logType {
    border-radius: 4px;
    color: white;
    padding: 2px 3px;
    display: inline-block;
    line-height: 15px;
    margin-right: 5px;
}

.label.success {
    background-color: #19be6b
}

.label.dark {
    background-color: #515a6e
}

.label.text {
    background-color: #515a6e
}

.logType {
    border: solid 1px black;
    color: black;
}

.label.warning {
    background-color: #ff9900;
}

.label.info {
    background-color: #2db7f5;
}

.label.error {
    background-color: #ed4014;
}

.log {
    line-height: 23px;
    font-size: 12px;
}

.nextccList {
    margin-left: 20px;
}

.nextmsgList {
    margin-left: 20px;
}

.sonflowList {
    margin-left: 20px;
}

.download-msg-list {
    float: right;
}
</style>
