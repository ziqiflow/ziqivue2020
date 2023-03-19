<template>
<div class="cflowpreviewsubmit">
    <el-form :label-width="isPc?'180px':null">
        <el-form-item label="状态:">
            {{ previewdata.msg }}
        </el-form-item>
        <el-form-item v-if="!!previewdata.data&&!!previewdata.data.flowname" label="流程名称:">
            {{ previewdata.data.flowname }}
        </el-form-item>

        <div v-if="nextFlowList.length==0&&nextSonFlowList.length">
            <Divider title="无下一步环节" class="fz13" />
        </div>

        <Divider v-if="nextSonFlowList.length>0" title="下一步转交其他流程" style="margin-bottom:0px" />

        <el-form-item class="fz12">
            <div v-for="(flow,index) in nextSonFlowList" :key="index">
                <el-checkbox :disabled="!buttoninfo.canchoseflow" v-model="flow.check">
                    <span class="fz13">转发外部流程< {{ flow.flowname }}>
                    

                     <el-dropdown style="margin-left:10px" trigger="click" placement="bottom">
                    <span class="el-dropdown-link">

                         <v-icon  :class="flow.level==100?'level_emergency':'level_normal'"  name="star"></v-icon>

                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="flow.level=0">
                            <v-icon  class="level_normal mg-r5" name="star" />普通</el-dropdown-item>
                        <el-dropdown-item @click.native="flow.level=100">
                            <v-icon class="level_emergency mg-r5" name="star" />紧急</el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>

                    


                    </span>
                </el-checkbox>



            </div>

        </el-form-item>

        <Divider v-if="nextFlowList.length>0" title="下一步转交流程" style="margin-bottom:0px" />

        <el-form-item v-for="(flow,index) in nextFlowList" :key="index" class="fz12" style="border-bottom: 1px dashed #c1c1c0;">

            <div>
                <el-checkbox :disabled="!buttoninfo.canchoseflow" v-model="flow.check">
                    <span class="fz13">转发流程< {{ flow.funname }}>
                    </span>
                </el-checkbox>
            </div>

            <div v-if="flow.dealtype=='wait_merge'&&flow.waitmergeFunids.length">

                <b class="fz12">等待以下流程执行后合并</b>
                <div  class="fz12" v-for="(waitmerge,index) in flow.waitmergeFunids" :key="index">
                    > {{waitmerge.name}}
                </div>



            </div>

            <div v-if="flow.msglist.length==0&&flow.cclist.length==0&&flow.dealtype!='wait_merge'" style="padding-left:20px">无</div>

            <div v-if="flow.msglist.length>0" style="padding-left:20px">
                转交处理人<span class="label error">{{ tran_dealtype(flow.dealtype) }}</span>

                <el-dropdown style="margin-left:10px" trigger="click" placement="bottom">
                    <span class="el-dropdown-link">

                    <v-icon :class="flow.msglevel==100?'level_emergency':'level_normal'" name="star"></v-icon>
                       
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="flow.msglevel=0">
                           <v-icon class="level_normal mg-r5" name="star"></v-icon>

                          
                            普通</el-dropdown-item>
                        <el-dropdown-item @click.native="flow.msglevel=100">
                            <v-icon class="level_emergency mg-r5" name="star"></v-icon>

                            紧急</el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>

                <br>
                <el-checkbox :disabled="(flow.dealtype=='andsign'&&!buttoninfo.canchoseander)
                ||!flow.check
                ||(flow.dealtype=='orsign'&&!buttoninfo.canchoseorer)
              ||(flow.dealtype=='message'&&!buttoninfo.canchosecc)" :indeterminate="flow.msgisIndeterminate" v-model="flow.allmsgcheck" @change='whenallmsgcheckchange(flow)'>全/反选</el-checkbox>
                <div :class="{'mustshow':flow.msglist.length<minishownumber,'hide':flow.hidemsg,'show':!flow.hidemsg}" class="accordionBox">
                    <el-checkbox-group @change='whenmsgcheckchange(flow)' v-model="flow.msgcheck" :disabled="(flow.dealtype=='andsign'&&!buttoninfo.canchoseander)
                ||!flow.check
                ||(flow.dealtype=='orsign'&&!buttoninfo.canchoseorer)
              ||(flow.dealtype=='message'&&!buttoninfo.canchosecc)">
                        <span v-for="(msg,indexmsg) in flow.msglist" :key="indexmsg" class="namelist fz12">
                            <el-checkbox :label="msg.to">{{ msg.name }}</el-checkbox>
                        </span>
                    </el-checkbox-group>
                    <div class="accordionHandler" @click="flow.hidemsg=!flow.hidemsg">
                        <i v-if="flow.hidemsg" class="el-icon-arrow-down" />
                        <i v-else class="el-icon-arrow-up" />

                    </div>
                </div>

            </div>

            <div v-if="flow.cclist.length>0" style="padding-left:20px">
                抄送人：

                <el-dropdown style="margin-left:10px" trigger="click" placement="bottom">
                    <span class="el-dropdown-link">

    <v-icon :class="flow.cclevel==100?'level_emergency':'level_normal'" class="mg-r5" name="star"></v-icon>
                    
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="flow.cclevel=0">

                          <v-icon class="level_normal mg-r5" name="star"></v-icon>
                           普通</el-dropdown-item>
                        <el-dropdown-item @click.native="flow.cclevel=100">
                           <v-icon class="level_emergency mg-r5" name="star"></v-icon>
                            紧急</el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>

                <br>
                <el-checkbox :disabled="!flow.check||!buttoninfo.canchosecc" :indeterminate="flow.ccisIndeterminate" v-model="flow.allcccheck" @change='whenallcccheckchange(flow)'>全/反选</el-checkbox>
                <div :class="{'mustshow':flow.cclist.length<minishownumber,'hide':flow.hidecc,'show':!flow.hidecc}" class="accordionBox">

                    <el-checkbox-group @change='whencccheckchange(flow)' v-model="flow.cccheck" :disabled="!flow.check||!buttoninfo.canchosecc">
                        <span v-for="(cc,indexcc) in flow.cclist" :key="indexcc" class="namelist fz12">
                            <el-checkbox :label="cc.to">
                                {{ cc.name }}
                            </el-checkbox>
                        </span>
                    </el-checkbox-group>
                    <div class="accordionHandler" @click="flow.hidecc=!flow.hidecc">
                        <i v-if="flow.hidecc" class="el-icon-arrow-down" />
                        <i v-else class="el-icon-arrow-up" />
                    </div>
                </div>
            </div>

        </el-form-item>

    </el-form>
</div>
</template>

<script>
import Divider from './CDivider'

import {
    tran_dealtype
} from '@/utils/u_flowdesign'

export default {
    name: 'CFlowPreviewSubmit',
    components: {
        Divider
    },
    props: {
        flowlevel: {
            type: Number | String,
            default: () => {
                return 0
            }
        },
        previewdata: {
            type: Object,
            default: () => {
                return null
            }
        },
        buttoninfo: {
            type: Object,
            default: () => {
                return null
            }
        }
    },
    data() {
        return {
            nextFlowList: [],
            nextSonFlowList: [],
            minishownumber: 30
        }
    },
    activated() {},
    mounted() {
        this.initdata()
    },
    methods: {
        whenmsgcheckchange(flow) {
            console.log('whenmsgcheckchange')
            if (flow.msgcheck.length == 0) {
                flow.allmsgcheck = false;
                flow.msgisIndeterminate = false;
                return;
            }
            if (flow.msgcheck.length == flow.msglist.length) {
                flow.allmsgcheck = true;
                flow.msgisIndeterminate = false;
            } else {
                flow.msgisIndeterminate = true;
            }
        },
        whencccheckchange(flow) {

            console.log('whencccheckchange')
            if (flow.cccheck.length == 0) {
                flow.allcccheck = false;
                flow.ccisIndeterminate = false;
                return;
            }
            if (flow.cccheck.length == flow.cclist.length) {
                flow.allcccheck = true;
                flow.ccisIndeterminate = false;
            } else {
                flow.ccisIndeterminate = true;
            }

        },
        whenallmsgcheckchange(flow) {

            flow.msgisIndeterminate = false;
            if (flow.allmsgcheck == true) {

                // flow.forEach()
                let all = [];
                flow.msglist.forEach(msg => {
                    all.push(msg.to);
                })
                flow.msgcheck = all;
            } else {

                flow.msgcheck = [];
            }

        },
        whenallcccheckchange(flow) {

            flow.ccisIndeterminate = false;
            if (flow.allcccheck == true) {
                // flow.forEach()
                let all = [];
                flow.cclist.forEach(msg => {
                    all.push(msg.to);
                })
                flow.cccheck = all;
            } else {
                flow.cccheck = [];
            }
        },
        getdata() {
            const newlist = []
            this.nextFlowList.forEach(ele => {
                newlist.push({
                    funid: ele.funid,
                    dealtype: ele.dealtype,
                    funname: ele.funname,
                    cccheck: ele.cccheck,
                    msgcheck: ele.msgcheck,
                    flowcheck: ele.check,
                    cclevel:ele.cclevel,
                    msglevel:ele.msglevel,
                })
            })

            let haserror = false

            newlist.forEach(ele => {
                if (ele.flowcheck) {
                    if (ele.dealtype == 'orsign') {
                        if (ele.msgcheck.length == 0) {
                            haserror = true
                            this.$message.error('<' + ele.funname + '>或签不可为空')
                        }
                    }

                    if (ele.dealtype == 'andsign') {
                        if (ele.msgcheck.length == 0) {
                            haserror = true
                            this.$message.error('<' + ele.funname + '>会签不可为空')
                        }
                    }
                }
            })

            if (haserror) return {}

            return {
                funlist: newlist,
                sonflows: this.nextSonFlowList
            }
        },
        tran_dealtype(str) {
            return tran_dealtype(str)
        },
        getcheckboxlist(list) {
            const arr = []
            list.forEach(ele => {
                arr.push(ele.to)
            })
            return arr
        },
        initdata() {
            
            // this.previewdata.data.nextmessage;
            // this.previewdata.data.cc;
            

            this.nextSonFlowList = []
            if (!!this.previewdata.data && this.previewdata.data.nextSonFlows) {
                this.previewdata.data.nextSonFlows.forEach(ele => {
                    this.nextSonFlowList.push({
                        flowname: ele.n,
                        flowid: ele.v,
                        check: true,
                        level:0
                    })
                })
            }

            this.nextFlowList = []


            if (!!this.previewdata.data && this.previewdata.data.nextmessage) {
                this.previewdata.data.nextmessage.forEach(msg => {
                    
                    let hascreat = false
                    let i = 0
                    for (; i < this.nextFlowList.length; i++) {
                        const next = this.nextFlowList[i]
                        if (next.funid == msg.funid) {
                            hascreat = true
                            break
                        }
                    }

                    if (hascreat) {
                        this.nextFlowList[i].msglist = msg.list
                        this.nextFlowList[i].msgcheck = this.getcheckboxlist(msg.list)
                        this.nextFlowList[i].hidemsg = msg.list.length > this.minishownumber;
                        this.nextFlowList[i].msglevel = this.flowlevel;
                        this.nextFlowList[i].cclevel = this.flowlevel;
                    } else {
                        this.nextFlowList.push({
                            allmsgcheck: true,
                            msgisIndeterminate: false,
                            ccisIndeterminate: false,
                            msglevel: this.flowlevel,
                            cclevel: this.flowlevel,

                            allcccheck: true,
                            check: true,
                            hidemsg: msg.list.length > this.minishownumber,
                            hidecc: false,
                            dealtype: msg.dealtype,
                            funname: msg.funname,
                            funid: msg.funid,
                            msglist: msg.list,
                            msgcheck: this.getcheckboxlist(msg.list),
                            cclist: [],
                            cccheck: [],
                            waitmergeFunids:!!msg.waitmergeFunids?msg.waitmergeFunids:[]
                        })
                    }
                })
            }

            if (!!this.previewdata.data && this.previewdata.data.cc) {
                this.previewdata.data.cc.forEach(cc => {
                    
                    let hascreat = false
                    let i = 0
                    for (; i < this.nextFlowList.length; i++) {
                        const next = this.nextFlowList[i]
                        if (next.funid == cc.funid) {
                            hascreat = true
                            break
                        }
                    }
                    if (hascreat) {
                        this.nextFlowList[i].cclist = cc.list
                        this.nextFlowList[i].cccheck = this.getcheckboxlist(cc.list)
                        this.nextFlowList[i].hidecc = cc.list.length > this.minishownumber
                    } else {
                        this.nextFlowList.push({
                            allmsgcheck: true,
                            allcccheck: true,
                            msgisIndeterminate: false,
                            ccisIndeterminate: false,
                            check: true,
                            hidemsg: false,
                            hidecc: cc.list.length > this.minishownumber,
                            dealtype: '',
                            funname: cc.funname,
                            funid: cc.funid,
                            cclist: cc.list,
                            cccheck: this.getcheckboxlist(cc.list),
                            msglist: [],
                            msgcheck: []
                        })
                    }
                })
            }
        }
    }
}
</script>

<style>
.cflowpreviewsubmit .el-popper[x-placement^=bottom] {
    margin-top: 0px;
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
    padding: 2px;
    display: inline-block;
    line-height: 15px;
    font-size: 13px;
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

.label.error {
    background-color: #ed4014
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

.namelist {
    padding-right: 10px;
}

.cflowpreviewsubmit .el-checkbox__label {
    font-size: 12px
}

.accordionBox {
    position: relative;
    padding-bottom: 20px;
}

.hide {
    height: 40px;
    overflow: hidden;
}

.mustshow.hide {
    height: auto;
}
.mustshow.show {
    padding-bottom: 0;
}

.mustshow .accordionHandler {
    display: none;
}

.accordionHandler {
    position: absolute;
    bottom: -7px;
    width: 100%;
    text-align: center;
}

.show .accordionHandler {
    bottom: 10px;
}

.accordionHandler i {
    cursor: pointer;
}

.cflowpreviewsubmit .el-checkbox__input.is-disabled+span.el-checkbox__label {
    color: #393a39;
}

.level_emergency {
    color: #ec3203
}

.level_normal {
    color: rgb(173, 173, 173);
}
</style>
