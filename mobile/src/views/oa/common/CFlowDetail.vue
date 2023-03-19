<template>
<div v-loading="loading" class="flowdetail">
    <div>
        <el-alert v-if="!!error" :title="error" :closable="false" type="error" />
        <el-tabs v-model="activeName" v-else>
            <el-tab-pane label="表单" name="表单">
                <div v-if="!!flowOi">

                    <div id="printData" class="printData" ref="printData">
                        <el-button class="no-print printbtn" size="mini" icon='el-icon-printer' @click="print">打印</el-button>

                        <el-alert v-if="!!flowOi.workname" style="margin-bottom:10px;font-weight:bolder" :title="'文号：'+flowOi.workname" :closable="false" type="error" />

                        <div v-if="!!flowOi.desc">
                            <el-alert style="margin-bottom:10px;font-weight:bolder" :title="'流程描述：'+flowOi.desc" :closable="false" type="success" />
                        </div>

                        <div v-if="!!widgetForm&&widgetForm.list.length>0">
                            <fm-generate-form class="generateForm" ref="generateForm" :data="widgetForm" :remote="remoteFuncs" :value="widgetModels">
                            </fm-generate-form>
                        </div>

                        <el-form style="margin-top:20px" label-position="top">
                            <el-form-item label="历史审批建议" v-if="!!flowOi.suggests&&flowOi.suggests.length>0">
                                <timeline>
                                    <span v-for="(suggest,index) in flowOi.suggests" :key="index">
                                        <timeline-item color="green" v-if="!!suggest.text">
                                            <div class="fz12">
                                                <v-icon name="person" />
                                                <span v-if="!!suggest.todeptstr">[{{suggest.todeptstr}}]</span>
                                                <span>
                                                    {{ suggest.user }}</span>

                                                <span>于{{ friendlytimejs(suggest.created_at) }}</span>
                                                <span class="label warning" v-if="!!suggest.funname">{{suggest.funname}}</span>
                                            </div>
                                            <div>
                                                <span style="font-weight: bolder;">
                                                    {{suggest.text}}</span>
                                            </div>

                                        </timeline-item>
                                    </span>
                                </timeline>
                            </el-form-item>
                        </el-form>

                    </div>

                    <el-collapse v-if="!!flowOi.filelistlog&&flowOi.filelistlog.length>0" accordion value="4">
                        <el-collapse-item name="4">
                            <template slot="title">
                                文件上传日志
                            </template>

                            <flow-file-log :filelistlog="flowOi.filelistlog"></flow-file-log>

                        </el-collapse-item>
                    </el-collapse>

                </div>
            </el-tab-pane>
            <el-tab-pane label="日志" name="日志">
                <div v-loading="log_msg_list_has_loading" style="min-height:80px;">
                <div v-if="log_msg_list_has_load">
                <timeline>
                    <timeline-item v-for="log in logList" :key="log._id" color="green">
                        <flow-log :log="log" :designer="designer" :flow-obj="flowOi" :is-admin="isAdmin" />
                    </timeline-item>
                </timeline>
                </div>
                </div>

            </el-tab-pane>

            <el-tab-pane label="消息实例图" name="消息实例图">
                <div v-loading="log_msg_list_has_loading" style="min-height:80px;">
                <div v-if="log_msg_list_has_load">
                <diagrambox v-if="activeName=='消息实例图'" ref="diag2" :angle="90" :model-data="msgsdiagramData" 
                style="border: solid 1px black; width:100%; height:500px" />
                </div>
                </div>
            </el-tab-pane>

            <el-tab-pane label="甘特图" name="甘特图">
                
                <div v-loading="log_msg_list_has_loading" style="min-height:80px;">
                <div v-if="log_msg_list_has_load">
                <gantt v-if="activeName=='甘特图'" :tasks='ganttData'></gantt>
                </div>
                </div>

            </el-tab-pane>

            <el-tab-pane label="设计流程图" name="设计流程图">
                <diagram v-if="activeName=='设计流程图'" ref="diag" :readonly="true" :angle="90" :model-data="diagramData" style="border: solid 1px black; width:100%; height:500px" />
            </el-tab-pane>
            <el-tab-pane label="设计备注" name="设计备注">

                <div v-if="activeName=='设计备注'">

                    <div class="remarkbox" v-html="designer.remark"></div>

                    <div class="fileList">
                        <div v-for="(file,index) in designer.fileList" :key="index" class="fz12">
                            <span>{{file.name}} </span>
                            <a class="mg-r5" target="_blank" :href="file.url">
                                <v-icon name="eye" /></a>
                        </div>
                    </div>
                </div>
            </el-tab-pane>

        </el-tabs>

    </div>

</div>
</template>

<style scoped>
.label {
    border-radius: 4px;
    color: white;
    padding: 2px 3px;
    display: inline-block;
    line-height: 16px;
}

.label.warning {
    background-color: #ff9900;
}
</style>

<style lang="less">
.printData {
    position: relative;
}

.printbtn {
    position: absolute;
    right: 0px;
    top: 4px;
    z-index: 3;
}

// .printData{

// }

.printData {

    .timeline {
        margin: 0px 15px;
    }

    .timeline-item {
        margin: 0px 0 0 15px;
        padding-bottom: 0;

    }

    .timeline-circle {
        left: -20px;
    }

    .el-table__empty-block {
        height: 100px;
    }

    .el-input.is-disabled .el-input__inner {
        color: #414246;
    }

    .remarkbox img {
        max-width: 100%;
        height: auto;
    }

    .el-radio__input.is-disabled .el-radio__inner,
    .el-radio__input.is-disabled.is-checked .el-radio__inner {
        background-color: #ffffff;
        border-color: #080808;
    }

    .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: #ffffff;
        border-color: #080808;
    }

    .el-checkbox__input.is-disabled+span.el-checkbox__label {
        color: #656565
    }

    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
        border-color: #000000;
    }

    .el-input.is-disabled .el-input__inner,
    .el-textarea.is-disabled .el-textarea__inner {
        background-color: #ffffff;
        color: black;
    }

    .el-radio__input.is-disabled+span.el-radio__label {
        color: #656565
    }

    .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
        background-color: black
    }

}
</style>

<script>
import {
    FlowDetail,FlowDetailLogsMsgs
} from '@/api/oa'

import {
    Timeline,
    TimelineItem,
    TimelineTitle
} from 'vue-cute-timeline'
import {
    creatDiagramData,
    tran_dealtype,
    initFormSetItem
} from '@/utils/u_flowdesign'

import {
    FriendlyTime
} from "@/utils/friendlytimejs";

import diagram from '@/views/oa/flowdesign/GoDiagramTreeLayout'
import diagrambox from '@/views/oa/flowdesign/GoDiagramTreeBox'

import FlowLog from './CFlowLog'

import FlowFileLog from './CFlowFileLog'
import Vue from 'vue'
import moment from 'moment';
import Gantt from './CGantt'

import Print from '@/utils/print'
// https://github.com/xyl66/vuePlugs_printjs
//http://www.jq22.com/demo/jQueryPrint201709110307/files/Print.js
//console.log('print',Print)

Vue.use(Print);
export default {
    name: 'Cflowdetail',
    components: {
        diagram,
        diagrambox,
        FlowLog,
        Timeline,
        TimelineItem,
        TimelineTitle,
        FlowFileLog,
        Gantt
    },
    // use:{Print},
    props: {
        flowOiId: {
            type: String,
            default: () => {
                return ''
            }
        },
        nowfunid: {
            type: String
        },

        isAdmin: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    data() {
        return {
            error: null,
            title: null,
            // flowOi_id: null,
            loading: false,
            flowOi: null,
            designer: null,
            // suggests:[],
            log_msg_list_has_load:false,
            log_msg_list_has_loading:false,
            logList: [],
            msgList: [],
            remoteFuncs: {}, 
            widgetModels: {}, 
            widgetForm: null, 
            activeName: '表单',

            msgsdiagramDataTest: { // passed to <diagram> as its modelData
                nodeDataArray: [{
                        key: 1,
                        text: 'Alpha',
                        color: 'lightblue',
                        loc: '355 85'
                    },
                    {
                        key: 2,
                        text: 'Beta',
                        color: 'orange',
                        loc: '355 85'
                    },
                    {
                        key: 3,
                        text: 'Gamma',
                        color: 'lightgreen',
                        loc: '355 85'
                    },
                    {
                        key: 4,
                        text: 'Delta',
                        color: 'pink',
                        loc: '355 85'
                    }
                ],
                linkDataArray: [{
                        from: 1,
                        to: 2
                    },
                    {
                        from: 1,
                        to: 3
                    },
                    {
                        from: 3,
                        to: 4
                    }
                ]
            },

            diagramData: { // passed to <diagram> as its modelData
                nodeDataArray: [],
                linkDataArray: []
            },
            msgsdiagramData: { // passed to <diagram> as its modelData
                nodeDataArray: [],
                linkDataArray: []
            },
            ganttData: null,
        }
    },
    watch: {
        // flowid() {
        
        // }
        activeName(){
            console.log(this.activeName);
            if(['日志','消息实例图','甘特图'].includes(this.activeName)){
                    this.whenlog_msg_change();
            }
         
        }
    },

    mounted() {
        // alert(this.flowOiId);
        // alert(this.nowfunid);
        this.getinfo(this.flowOiId)
    },
    methods: {

        whenlog_msg_change(){

            if(this.log_msg_list_has_load||this.log_msg_list_has_loading)return;
            this.log_msg_list_has_loading=true;
            
            FlowDetailLogsMsgs({
                flowOi_id: this.flowOiId
            }).then(({
                data: req
            }) => {
                // console.log(req)
                this.log_msg_list_has_loading = false
                this.log_msg_list_has_load=true;
                if (req.success) {

                    const {
                        logList,
                        msgList
                    } = req.data


                    this.logList = logList
                    this.msgList = msgList

                    this.flowOi.msgList=msgList;
                    this.flowOi.logList=logList;
                    

                    this.logList.forEach(log => {
                        log.msgobj = null
                        if (log.flowmsgid) {
                            this.msgList.forEach(msg => {
                                if (log.flowmsgid == msg._id) {
                                    log.msgobj = msg
                                }
                            })
                        }
                    })


                    this.msgsdiagramData = this.creatMsgDiagramData(this.flowOi.msgList, this.flowOi.logList, this.designer.funlist);

                    this.ganttData = this.creatGanttData(this.flowOi.msgList, this.designer.funlist);
                    // console.log('msgsdiagramData', this.msgsdiagramData);
                } else {
                    this.$message.error(req.msg);
                    // this.error = req.msg
                }
            })


        },

        friendlytimejs(timestr) {
            return FriendlyTime(timestr, new Date());
        },

          dateCount(diff) {
              if(!diff)return '';
            
            // var date = new Date()
            // var until = new Date(nowtime)
            
            // var days = diff / 3600 / 24
            
            // var day = Math.floor(days)
            // var hours = (days - day) * 24
            // var hour = Math.floor(hours)
            // var minutes = (hours - hour) * 60
            // var minute = Math.floor(minutes)
            // var seconds = (minutes - minute) * 60
            // var second = Math.floor(seconds)

               var days = diff /24/60/60
            
            var day = Math.floor(days)
            var hours = (diff-day*24*60*60)/60/60
            var hour = Math.floor(hours)
            var minutes = (diff-day*24*60*60-hour*60*60)/60
            var minute = Math.floor(minutes)
            var second = diff-day*60*60*24-hour*60*60-minute*60

            let str = ''

            if (day) {
                str += Math.abs(day) + '天'
            }

            if (hour) {
                str += hour + '小时'
            }

            if (minute) {
                str += minute + '分钟'
            }

            return str
        },

        isDingTalk() {
            let ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf('dingtalk') != -1;
        },
        print() {
            // this.$refs.printData.print();
            

            if (this.isDingTalk()) {
                this.$confirm('当前位于钉钉浏览器，由于钉钉暂不支持打印，是否前往浏览器打印?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    window.open(window.location.href, '_blank');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '程序猿已经尽力了😢'
                    });
                });
                return;
            }
            this.$print(this.$refs.printData)
            // window.Print('#printData');
        },
        creatGanttData(msgList, funlist) {

            let addtonodeDataArray=(msg,depend_msg_id)=>{

                
                 let timeexpired=0;
                 funlist.forEach(e=>{
                     if(e.id==msg.NowFunid){
                            //NowFunid
                            //timeexpired
                            timeexpired=e.timeexpired;
                     }
                 })


                 nodeDataArray.push({
                                start: msg.created_at,
                                end: moment(msg.created_at).add(timeexpired,'seconds').format("YYYY-MM-DD HH:mm:ss"),
                                name: `[计划${this.dateCount(timeexpired)}]${msg.NowFunName}[ ${msg.creater} ][${tran_dealtype(msg.dealtype)}]`,
                                id: "_"+msg._id,
                                progress: 100,
                                isplan:true,
                                 dependencies:'_'+depend_msg_id
                            })
                let end=msg.finished_at;
                if(!!end&& typeof end =="object"){
                    end= moment(end.$date.$numberLong,'x').format("YYYY-MM-DD HH:mm:ss");
                }
                let diff=0;
               if(!!end){
                   console.log('end',end);
                    diff=moment(end).diff( moment(msg.created_at))/1000;
               }
             
               
               let style='fill:#67c23a';
               if(timeexpired>0&&diff>timeexpired){
                   style='fill:#ec0352';
               }
              
              if(msg.status==1){
                        nodeDataArray.push({
                                start: msg.created_at,
                                end: moment().format('YYYY-MM-DD HH:mm:ss'),
                                isplan:false,
                                name: `[未完成][实际]                                ${msg.NowFunName} [ ${msg.creater}][${tran_dealtype(msg.dealtype)}]`,
                                id: msg._id,
                                style:style,
                                progress: 0,
                                isfinish:false
                                //dependencies:"_"+depend_msg_id
                            })
              }else{
                   nodeDataArray.push({
                                start: msg.created_at,
                                end: end,
                                isplan:false,
                                name: `[实际${this.dateCount(diff)}]
                                ${msg.NowFunName} [ ${msg.creater}][${tran_dealtype(msg.dealtype)}]`,
                                id: msg._id,
                                style:style,
                                progress: !!msg.finished_at?100:0,
                                isfinish:!!msg.finished_at?true:false
                                //dependencies:"_"+depend_msg_id
                            })
              }

                // let diff =             
                           


            }

            let findson =  (msg_id)=> {

                msgList.forEach(msg => {

                    console.log('msg',msg)

                    
                    if(!(msg.status==1||msg.status==3)){
                        return;
                    }
                    if(msg.dealtype=='message'){
                        return;
                    }

                    if (!!msg.PreMsgIds) {

                        if (msg.PreMsgIds.some(v => {
                                return v == msg_id
                            })) {

                            addtonodeDataArray(msg,msg_id)   
                            findson(msg._id);

                        }

                    } else {
                        if (msg.PreMsgId == msg_id) {

                            addtonodeDataArray(msg,msg_id)   
                            findson(msg._id);

                        }
                    }

                })
            }

            let nodeDataArray = [];

            msgList.forEach(msg => {
                if (!msg.PreMsgId) {
                    // console.log('msg', msg);
                    //nodeDataArray.push(displaynode(msg));
                    nodeDataArray.push({
                        start: msg.created_at,
                        end: msg.created_at,
                        name: '[开始节点]' + msg.NowFunName + '[' + msg.creater + ']',
                        id: '_'+msg._id,
                        isplan:true,
                        
                        progress: 100,
                    })

                    nodeDataArray.push({
                        start: msg.created_at,
                        end: msg.created_at,
                        name: '[开始节点]' + msg.NowFunName + '[' + msg.creater + ']',
                        id: msg._id,
                        isplan:false,
                        progress: 100,
                        isfinish:true
                    })

                    // linkDataArray.push({
                    //     from: 1,
                    //     to: msg._id
                    // })

                    findson(msg._id);
                    
                }
            })


            nodeDataArray.forEach(e=>{

                if(!!e.end&& typeof e.end =="object"){
                    e.end=moment(e.end.$date.$numberLong,'x').format("YYYY-MM-DD HH:mm:ss");
                }else if(!e.end){
                    e.end=e.start;
                }

                

            })

            console.log(nodeDataArray)

            return nodeDataArray;

        },


        creatMsgDiagramData(msgList, LogList, funlist) {

            // console.log('msglist',msgList)
            // this.flowOi.msgList;logList;designer.funlist
            
            let showdepts = function (depts) {

                let arr = [];
                depts.forEach(dept => {
                    arr.push(dept.n)
                })
                if (arr.length == 0) {
                    return '';
                }
                return '[' + arr.join('|') + ']'

            }
            let displaynode = function (msg) {

                let log = '无';

                if (!!msg.log) {
                    log = '点击<' + msg.log.button + '>';
                }

                let status = '';
                let color = "#515a6e";

                switch (msg.status) {
                    case 1:
                        status = '等待处理';
                        color = '#ff9900';
                        break;
                    case 2:
                        status = '取消';
                        color = '#a7a7a7';
                        break;

                    case 3:
                        status = '结束';
                        color = "#61afff";

                        break;

                    case 4:
                        status = '结束';
                        color = "#61afff";
                        break;

                    case 5:
                        status = '';
                        break;

                    case 6:
                        status = '';
                        break;

                    case 7:
                        status = '结束';
                        color = "#61afff";
                        break;

                    case 8:
                        status = '撤回后取消';
                        color = "#a7a7a7";
                        break;

                    default:
                        break;
                }

                if (!!status) {
                    status = '[状态:' + status + ']';
                }

                let hasread = '';

                if (msg.dealtype == 'message') {
                    hasread = '[' + (msg.hasread == 0 ? '未读' : '已读') + ']';
                }
                let level = '';
                if (msg.level == 100) {
                    level = '[紧急]'
                }

                // if(msg._id=='')

                return {
                    key: msg._id,
                    title: status + msg.NowFunName + hasread + level,
                    PreFunName: "上一节点：" + msg.PreFunName,
                    content: "处理内容：" + log,
                    dealtype: '处理方式：' + tran_dealtype(msg.dealtype),
                    to: '处理人：' + (!!msg.todepts ? showdepts(msg.todepts) : "") + msg.toer, //findtouser(),

                    color: color,
                    stroke: 'white'
                };
            }

            let addtonodeDataArray = function (nodeDataArray, node) {

                

                if (!nodeDataArray.some(v => {
                        return v.key == node.key
                    })) {
                    nodeDataArray.push(node);
                }

            }

            let nodeDataArray = [];
            let linkDataArray = [];

            let findson = function (msg_id) {

                msgList.forEach(msg => {

                    if (!!msg.PreMsgIds) {

                        if (msg.PreMsgIds.some(v => {
                                return v == msg_id
                            })) {
                            linkDataArray.push({
                                from: msg_id,
                                to: msg._id
                            })
                            //console.log('linkDataArray1111', linkDataArray);
                            addtonodeDataArray(nodeDataArray, displaynode(msg))
                            findson(msg._id);

                        }

                    } else {
                        if (msg.PreMsgId == msg_id) {

                            linkDataArray.push({
                                from: msg_id,
                                to: msg._id
                            })
                            //console.log('linkDataArray', linkDataArray);
                            addtonodeDataArray(nodeDataArray, displaynode(msg))
                            //nodeDataArray.push(displaynode(msg));
                            findson(msg._id);

                        }
                    }

                })
            }
            
            



            // console.log('msgList', msgList);

            msgList.forEach(msg => {
                if (!msg.PreMsgId) {
                    // console.log('msg', msg);
                    //nodeDataArray.push(displaynode(msg));
                    nodeDataArray.push({
                        key: msg._id,
                        title: '[开始节点]' + msg.NowFunName,
                        PreFunName: "上一节点：无",
                        content: "处理内容：无",
                        dealtype: '处理方式：无',
                        to: '申请人：' + (!!msg.todepts ? showdepts(msg.todepts) : "") + msg.creater,
                        color: '#67c23a',
                        stroke: 'white'
                    })

                    // linkDataArray.push({
                    //     from: 1,
                    //     to: msg._id
                    // })

                    findson(msg._id);
                    
                }
            })

            // linkDataArray=[];

            //console.log('nodeDataArray',nodeDataArray);
            return {
                nodeDataArray,
                linkDataArray
            }

        },
        tran_dealtype(type) {
            return tran_dealtype(type)
        },
        creatdiag(funlist) {
            const {
                linkDataArray,
                nodeDataArray
            } = creatDiagramData(this.funlist, this.nowfunid)
            this.diagramData = {
                nodeDataArray: nodeDataArray,
                linkDataArray: linkDataArray
            }
        },
        initsuggests(suggests, funlist) {

            suggests.forEach(ele => {

                for (let i = 0; i < funlist.length; i++) {

                    const fun = funlist[i];

                    if (fun.id == ele.funid) {
                        ele.funname = fun.name;
                        break;
                    }

                }

            })

        },
        getinfo(flowOi_id) {
            this.modalstatu = true
            this.successShow = false
            this.title = '加载中...'

            this.loading = true
            FlowDetail({
                flowOi_id: flowOi_id
            }).then(({
                data: req
            }) => {
                // console.log(req)
                this.loading = false
                if (req.success) {
                    if (!req.data) {
                        this.error = '没有查询到对应的流程'
                        return
                    }

                    // console.log('this.flowOi', req.data)
                    this.flowOi = req.data
                    // this.designer.this.flowOi.designer;
                    const {
                        designer,
                        // logList,
                        // msgList
                    } = this.flowOi

                    if (!!this.flowOi.suggests) {
                        this.initsuggests(this.flowOi.suggests, designer.funlist);
                    }

                    this.designer = designer

                    this.diagramData = creatDiagramData(this.flowOi.designer.funlist, this.flowOi.designer.layoutset, this.nowfunid)

                    // console.log('msgsdiagramData', this.msgsdiagramData);

                    this.widgetForm = this.initFromset(this.designer, this.flowOi.formdata)

                    if (!this.isPc) {
                        this.widgetForm.config.labelWidth = null;
                        this.widgetForm.config.labelPosition = "top"
                    }

                    // console.log('this.widgetForm ', this.widgetForm)
                    // console.log('this.widgetForm ', JSON.stringify(this.widgetForm))

                    this.widgetModels = this.copyobject(this.flowOi.formdata)
                } else {
                    this.error = req.msg
                }
            })
        },
        cancel() {
            this.modalstatu = false
        },
        copyobject(obj) {
            return JSON.parse(JSON.stringify(obj))
        },
        initFromset(designer, formdata) {
            const nowfromset = this.copyobject(designer.formset)
            // console.log('formdata', formdata)
            this.leave_form_item_f2(nowfromset.list, designer.set.formEditLimit, formdata)
            return nowfromset
        },
        
        
        leave_form_item_f2(list, formEditLimit, formdata) {
            for (let i = list.length - 1; i >= 0; i--) {
                const item = list[i]
                if (
                    // item.type == 'grid'
                    // ||
                    item.columns) {
                    for (let k = 0; k < item.columns.length; k++) {
                        const column = item.columns[k]
                        this.leave_form_item_f2(column.list, formEditLimit, formdata)
                    }
                } else {

                    initFormSetItem(item);

                    let hasfind = false

                    if (!this.isAdmin && !!formEditLimit) {
                        
                        for (let k = 0; k < formEditLimit.length; k++) {
                            const limit = formEditLimit[k]

                            if (!limit.type) continue;

                            if (item.key == limit.key) {

                                hasfind = true

                                if (item.type == 'table') {

                                    item.options.table_delete = false;
                                    item.options.table_add = false;
                                    item.options.table_edit = false;
                                    item.options.tableset.forEach(row => {
                                        let hasfind2 = false;
                                        if (!!limit.son) {
                                            limit.son.forEach(son => {

                                                if (son.key == row.code) {
                                                    hasfind2 = true;
                                                    row.required = son.required;
                                                    row.limittype = son.type;
                                                }

                                            })
                                        }
                                        if (!hasfind2) {
                                            row.required = false;
                                            row.limittype = 'readonly'
                                        }
                                    })

                                }

                                switch (limit.type) {
                                    case 'canedit':

                                        // console.log(limit);

                                        item.options.disabled = false;
                                        if (limit.required) {
                                            item.options.required = true; 
                                            this.addrequiredrule(item.rules, item.name)
                                        } else {
                                            item.options.required = false;
                                            this.splicerequiredrule(item.rules)
                                        }

                                        break;
                                    case 'readonly':

                                        item.options.disabled = true;
                                        item.options.required = false;
                                        this.splicerequiredrule(item.rules)

                                        break;
                                    case 'hidden':

                                        list.splice(
                                            i, 1
                                        )

                                        break;
                                    default:
                                        break;
                                }
                                break;

                            }
                        }
                    }

                    
                    //
                    if (!hasfind) {
                        

                        if (!Object.keys(formdata).some(item2 => {
                                return item2 == item.model
                            })) {

                            list.splice(
                                i, 1
                            )

                        } else {
                            item.options.disabled = true;
                            item.options.required = false;

                            if (item.type == 'table') {
                                item.options.table_delete = false;
                                item.options.table_add = false;
                                item.options.table_edit = false;
                                item.options.tableset.forEach(row => {
                                    row.limittype = 'readonly';
                                    row.required = false;
                                })
                            }

                            this.splicerequiredrule(item.rules)
                        }

                    }
                }
            }
        },
        addrequiredrule(rules, name) {
            if (!rules) return
            // console.log('rules', rules);
            // console.log('name', name);

            // {
            //             "required": true,
            
            //         }
            let hasfind = false;
            for (let i = 0; i < rules.length; i++) {
                const element = rules[i];
                if (typeof element.required != 'undefined') {
                    hasfind = true;
                    element.required = true;
                }
            }
            if (!hasfind) {
                rules.push({
                    "required": true,
                    "message": name + "必须填写"
                })
            }
        },
        splicerequiredrule(rules) {
            if (!rules) return
            let hasfind = false;
            for (let i = rules.length - 1; i >= 0; i--) {
                const element = rules[i];
                if (typeof element.required != 'undefined') {
                    hasfind = true;
                    element.required = false;
                }
            }
        },
        leave_form_item_f(list, formdata) {
            for (let i = list.length - 1; i >= 0; i--) {
                // for (let i = 0; i < list.length; i++) {
                const item = list[i]
                if (
                    // item.type == 'grid'
                    // ||
                    item.columns) {
                    for (let k = 0; k < item.columns.length; k++) {
                        const column = item.columns[k]
                        this.leave_form_item_f(column.list, formdata)
                    }
                } else {
                    // let hasfind = false;
                    
                    for (const key in formdata) {
                        // if (key == item.model) {
                        // hasfind = true;
                        item.options.disabled = true
                        item.options.required = false
                        item.rules = []
                        
                        
                        // }
                    }
                }
            }
        }

    }
}
</script>
