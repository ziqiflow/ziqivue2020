<template>
<div class="cbtngroup">
    <ul class="groupbtns">
        <li v-if="group.length==0">当前没有按键组</li>
    </ul>

    <ul class="groupbtns">
        <draggable v-model="group">
            <li v-for="(btn,index) in group" :key="index" class="btnli">

                <div class="opt_btn_group">
                    <a @click="Editnewbtn(btn,index)">编辑</a>
                    |
                    <a @click="removeBtn(group,index)">删除</a>
                </div>
                <div>
                    <el-badge :value="index+1" type="danger" style="margin-right:5px;" />
                    按键名称： <el-button round>{{ btn.name }}</el-button>
                    <div class="divier" />
                    <div style="margin-left:25px;">
                        默认流程：
                        <span v-for=" (name,index) in tranFlowName(btn.defaultFunId,btn.defaultSonFlowId)" :key="index">
                <span v-if="name.f=='inner'" class="flownametag">{{ name.n }}</span>
                        <span v-else class="flownametagouter">
                <v-icon name="md-git-branch" style="color:white" class="fz12"/>{{ name.n }}(外部)</span>
                        </span>
                    </div>

                    <div v-if="tranFlowName(btn.defaultFunId,btn.defaultSonFlowId,true)" class="divier" />
                    <div v-if="!!btn.handler&&!!btn.handler.funId" style="margin-left:25px;">
                        触发流程(必走)：

                        <span v-for=" (name,index) in tranFlowName(btn.handler.funId,btn.handler.SonFlowId)" :key="index">
                <span v-if="name.f=='inner'" class="flownametag">{{ name.n }}</span>
                        <span v-else class="flownametagouter">
                  <v-icon name="md-git-branch" style="color:white" class="fz12"/>
                  {{ name.n }}(外部)</span>
                        </span>

                        <div v-if="tranFlowName(btn.handler.funId,btn.handler.SonFlowId,true)" class="divier" />
                    </div>

                    <div v-if="btn.NextFun.length!=0" style="margin-left:25px;"> 条件流程:

                        <ul class="NextList">
                            <li v-for="(Next,index2) in btn.NextFun" :key="index2">
                                <el-badge :value="index2+1" type="info" style="margin-right:5px;" />
                                <span class="flowiftag">{{ Next.if }} </span> ->

                                <span v-for=" (name,index) in tranFlowName(Next.funId,Next.SonFlowId)" :key="index">
                    <span v-if="name.f=='inner'" class="flownametag">{{ name.n }}</span>
                                <span v-else class="flownametagouter">
                      <v-icon name="md-git-branch" style="color:white" class="fz12"/>
                      {{ name.n }}(外部)</span>
                                </span>

                            </li>

                        </ul>
                    </div>

                </div>

            </li>
        </draggable>
    </ul>

    <div>
        <el-button size="mini" type="primary" @click="Creatnewbtn">新建按键</el-button>
    </div>

    <el-dialog :title="modalEditTitle" :visible.sync="modalEditStatus" width="60%" append-to-body>
        <el-dialog :visible.sync="modalSonEditStatus" :title="modalSonEditTitle" width="60%" append-to-body>

            <el-form v-if="modalSonEditStatus" :model="nowNextFun" label-position="right" label-width="150px">

                <el-form-item label="条件表达式">

                    <if-test v-model="nowNextFun.if"></if-test>

                </el-form-item>

                <el-form-item label="满足条件后跳转到">

                    <el-select v-model="nowNextFun.funId" class="width100" multiple placeholder="请选择跳转流程">
                        <el-option v-for="item in funlist" :value="item.id" :key="item.id" :label="item.name" />
                    </el-select>
                    <sun-flow-chosen :chose.sync="nowNextFun.SonFlowId" label="+外部流程：" />
                </el-form-item>

            </el-form>

            <div slot="footer">
                <el-button @click="cancelSonEdit">取消</el-button>
                <el-button type="primary" @click="okSonEdit">确定</el-button>
            </div>

        </el-dialog>

        <div>

            <el-form :model="nowbtn" label-position="right" label-width="150px">

                <el-form-item label="按键名称：">
                    <el-input v-model="nowbtn.name" size="small" placeholder="Enter something..." />
                </el-form-item>

                <el-form-item label="默认下一个流程：">
                    <el-select v-model="nowbtn.defaultFunId" style="width:100%" multiple size="small" placeholder="请选择默认流程,如果没有请勿填写">
                        <el-option v-for="item in funlist" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <sun-flow-chosen :chose.sync="nowbtn.defaultSonFlowId" label="+默认外部流程：" />
                </el-form-item>

                <el-form-item label="条件判断流程：">

                    <span style="color:red" class="fz12">*优先级高于默认流程；</span>

                    <ul class="nextfunlist">
                        <li v-if="nowbtn.NextFun.length==0">无条件判断流程</li>

                        <draggable v-model="nowbtn.NextFun">
                            <li class="fz12" v-for="(Next,index) in nowbtn.NextFun" :key="index">
                                <div>
                                    条件： <span class="flowiftag">{{ Next.if }}</span>
                                    <br>
                    跳转到：

                                    <span v-for=" (name,index) in tranFlowName(Next.funId,Next.SonFlowId)" :key="index">
                      <span v-if="name.f=='inner'" class="flownametag">{{ name.n }}</span>
                                    <span v-else class="flownametagouter">
                        <v-icon name="md-git-branch" style="color:white" class="fz12"/>
                        {{ name.n }}(外部)</span>
                                    </span>
                                </div>
                                <div class="opt_btn_group">
                                    <a @click="editNextIF(Next,index)">编辑</a>
                                    |
                                    <a @click="removeNextIf(nowbtn.NextFun,index)">删除</a>
                                </div>
                            </li>
                        </draggable>
                    </ul>
                    <el-button icon="el-icon-plus" shape="circle" size="mini" type="primary" @click="creatCustomizeNextIF(nowbtn.NextFun)">
                        创建自定义条件
                    </el-button>

                    <div style="color:red" class="fz12">如果条件判断里面没有符合的下一步流程，那么就会执行默认下一个流程</div>


                </el-form-item>

                <hr>

                <el-form-item label="是否允许选择流程">

                    <el-radio-group v-model="nowbtn.canchoseflow">
                        <el-radio :label="0">不允许</el-radio>
                        <el-radio :label="1">允许</el-radio>
                    </el-radio-group>

                    <el-alert title="当匹配多个流程的时候，可以让审核人选择指定流程" class="mg-t5" type="error" />
                </el-form-item>
              
          <el-form-item label="是否允许选择或签人">

            <el-radio-group v-model="nowbtn.canchoseorer">
              <el-radio :label="0">不允许</el-radio>
              <el-radio :label="1">允许</el-radio>
            </el-radio-group>

          </el-form-item>

       <el-form-item label="是否允许选择会签人">

            <el-radio-group v-model="nowbtn.canchoseander">
              <el-radio :label="0">不允许</el-radio>
              <el-radio :label="1">允许</el-radio>
            </el-radio-group>
            <span style="color:red" class="fz12">*不推荐打开</span>    

          </el-form-item>

          <el-form-item label="是否允许选择抄送人">

            <el-radio-group v-model="nowbtn.canchosecc">
              <el-radio :label="0">不允许</el-radio>
              <el-radio :label="1">允许</el-radio>
            </el-radio-group>

             </el-form-item> 

                <Divider title="触发事件"></Divider>

                <el-form-item label="触发流程(必走)：">
                    <el-select v-model="nowbtn.handler.funId" style="width:100%" multiple size="small" placeholder="请选择默认流程,如果没有请勿填写">
                        <el-option v-for="item in funlist" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <sun-flow-chosen :chose.sync="nowbtn.handler.SonFlowId" label="+默认外部流程：" />
                </el-form-item>
            </el-form>

        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelEdit">取消</el-button>
            <el-button type="primary" @click="okEdit">确定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'



import draggable from 'vuedraggable'

import SunFlowChosen from './CSunFlowChosen'

import Divider from './CDivider'
import IfTest from './chose-contact/CIfTest'


export default {
    name: 'BtnGroup',
    components: {
        draggable,
        SunFlowChosen,
        Divider,
        IfTest
    },
    props: {
        // :dealtype.sync="nowfun.dealtype"
        // dealtype:{
        //   type:String,
        //   default:()=>{
        //     return 'message'
        //   }
        // },
        group: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            // modalsunflowchose:false,
         

            modalEditStatus: false,
            modalEditType: 'add',
            modalEditTitle: '',

            modalSonEditStatus: false,
            modalSonEditType: 'add',
            modalSonEditTitle: '',

            sonEditIndex: null,
            EditIndex: null,

            nowbtn: this.creatbtndata(),
            nowNextFun: this.creatNextIfdata(),
           
        }
    },
    watch: {

    },
    mounted() {
        console.log(this.group)
        // setTimeout(() => {
        //     console.log(this.requireDataList)
        // }, 1000)
    },
    computed: {

        ...mapState({
            funlist: state => state.flowdesign.funList
            //  messageReadedList: state => state.employee.messageReadedList,
        }),
        // ,
        // ...mapGetters([
        //     'requireDataList'
        // ])
    },
    methods: {

       

       

       

        copyobject(obj) {
            return JSON.parse(JSON.stringify(obj))
        },

       
       

        okEdit() {
            if (!this.nowbtn.name) {
                this.$message.error('按键名称不能为空')
                return
            }


            if (this.modalEditType == 'add') {
                this.group.push(this.copyobject(this.nowbtn))
            }
            if (this.modalEditType == 'edit') {
                

                this.group[this.EditIndex] = this.copyobject(this.nowbtn)
            }
            this.modalEditType = null
            // this.nowbtn=null;
            this.modalEditStatus = false
            this.modalSonEditStatus = false
        },
        okSonEdit() {
            // console.log(this.modalSonEditStatus);
            
            if (!this.nowNextFun.funId) {
                this.$message.error('满足条件后跳转的流程不可为空')
                return
            }
            if (!this.nowNextFun.if) {
                this.$message.error('条件表达式不可为空')
                return
            }

            if (this.modalSonEditType == 'add') {
                this.nowbtn.NextFun.push(this.copyobject(this.nowNextFun))
            }
            if (this.modalSonEditType == 'edit') {
                
                
                this.nowbtn.NextFun[this.sonEditIndex] = this.copyobject(this.nowNextFun)
            }
            this.modalSonEditType = null
            // this.nowbtn=null;
            this.modalSonEditStatus = false
        },
        cancelEdit() {
            this.modalEditStatus = false
            this.modalSonEditStatus = false
        },

        cancelSonEdit() {
            this.modalSonEditStatus = false
        },

        creatbtndata() {
            
            return {
                name: '同意',
                canchoseflow: 0,
                canchoseander:0,
                canchoseorer: 1,
                canchosecc: 1,
                defaultFunId: [], 
                defaultSonFlowId: [], 
                NextFun: [ 
                    // {if: null,funId: null，SonFlowId：null}
                ],
                
                handler: {
                    funId: [],
                    SonFlowId: [] 
                }
            }
        },
        creatNextIfdata() {
            return {
                if: null,
                funId: [],
                SonFlowId: []
            }
            // {
            //     if: null,
            //     funId: null
            // }
        },

        Editnewbtn(btn, index) {
            this.modalEditStatus = true
            this.modalSonEditStatus = false
            this.modalEditTitle = '编辑流程按键'

            this.EditIndex = index
            this.modalEditType = 'edit'
            const nowbtn = Object.assign(this.creatbtndata(), this.copyobject(btn))


            this.nowbtn = nowbtn
        },

        Creatnewbtn() {
            this.modalEditStatus = true
            this.modalSonEditStatus = false
            this.modalEditTitle = '新建流程按键'

            this.modalEditType = 'add'
            this.nowbtn = this.creatbtndata()
            console.log(this.nowbtn)
        },
        removeBtn(Group, index) {
            Group.splice(index, 1)
        },

        removeNextIf(NextFun, index) {
            NextFun.splice(index, 1)
        },
        tranFlowName(id, sonid = null, withcount = false) {
            // console.log(this.funList);
            console.log('id', id)

            let idlist = []
            if (!id) {
                idlist = []
            } else {
                if (typeof id === 'object') {
                    idlist = id
                } else {
                    idlist = [id]
                }
            }

            let sonidlist = []
            if (!sonid) {
                sonidlist = []
            } else {
                if (typeof sonid === 'object') {
                    sonidlist = sonid
                } else {
                    sonidlist = [sonid]
                }
            }

            // if (idlist.length == 0) {
            
            // }

            const idnamelist = []
            
            idlist.forEach(id => {
                this.funlist.forEach(fun => {
                    if (fun.id + '' == id + '') {
                        idnamelist.push({
                            n: fun.name,
                            f: 'inner'
                        })
                    }
                })
            })

            sonidlist.forEach(id => {
                idnamelist.push({
                    n: id.n,
                    f: 'outer'
                })
            })

            console.log(idnamelist)

            if (withcount) return idnamelist.length

            if (idnamelist.length == 0) {
                return [{
                    n: '无',
                    f: 'inner'
                }]
            }
            return idnamelist
        },

        editNextIF(next, index) {
            this.sonEditIndex = index

            this.modalSonEditTitle = '编辑条件流程'
            this.modalSonEditType = 'edit'
            this.nowNextFun = this.copyobject(next)

            this.modalSonEditStatus = true
        },
        creatCustomizeNextIF(NextFun) {
            this.modalSonEditTitle = '新建条件流程'

            this.modalSonEditType = 'add'
            this.nowNextFun = this.creatNextIfdata()

            this.modalSonEditStatus = true
        }
    }
}
</script>

<style>
.groupbtns,
.nextfunlist {
    padding: 0;
    margin: 0;
}

.groupbtns li {
    list-style: none;
}

.nextfunlist li,
.cbtngroup .groupbtns .btnli {
    cursor: grab;
    position: relative;
    padding: 5px 20px 0px 5px;
    list-style: none;
    margin: 0px;
    margin-bottom: 10px;
    border-bottom: 1px solid #d4d4d4;
    background-color: white;
}

.cbtngroup .groupbtns .btnli:last-child {
    border-bottom: none;
}

.nextfunlist li .opt_btn_group {
    position: absolute;
    right: 4px;
    top: 39px;
}

.cbtngroup .groupbtns .btnli .opt_btn_group {
    position: absolute;
    right: 4px;
    top: 6px;
}

.cbtngroup .NextList {
    margin-left: 10px;
}

.cbtngroup .ivu-tabs-bar {
    margin-bottom: 8px;
}

.flownametag,
.flownametagouter {
    color: white;
    font-weight: 500;
    border-radius: 3px;
    background-color: #ff6600;
    padding: 2px;
    margin-right: 5px;
}

.flownametagouter {
    background-color: #515a6e;
}

.flowiftag {
    color: white;
    font-weight: 500;
    background-color: #00cc00;
    padding: 2px;
}

.BadgeIndex {
    border-radius: 50%;
    color: white;
    font-size: 13px;
    font-weight: 500;
    background: #ff6600
}

.cbtngroup .ivu-divider {
    font-size: 13px;
    margin: 8px 0;
}

.divier {
    height: 1px;
    border-top: 1px #b7b7b7 dashed;
    margin: 2px 0px;
}
</style>
