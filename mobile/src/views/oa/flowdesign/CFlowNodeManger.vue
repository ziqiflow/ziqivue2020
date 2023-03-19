<template>
  <div class="nodemanger">
    <diagram v-if="showDiagram" ref="diag" :model-data="diagramData" style="border: solid 1px black; width:100%; height:250px" />
    <div class="mt20">
      <ul class="leftlist">
        <li class="head">已创建的节点</li>
        <li v-if="funlist.length==0">未创建任何流程</li>
        <draggable v-model="funlist">
          <li v-for="(fun,index) in funlist" :key="fun.id">
            <a :class="{nowchose: choseIndex==index}" @click="choseIndex=index">
              > <span v-if="choseIndex==index">></span>
              <span v-if="fun.is_start">【开始节点】</span>
              {{ fun.name }}
            </a>
            <v-icon
              name="Trash"
              style="cursor: pointer;position: absolute;
    right: 0px;
    top: 3px;"
              @click="deletefun(index)" />
          </li>
        </draggable>

        <div style="margin-top:20px;">
          <el-button icon="el-icon-plus" type="danger" size="small" round @click="creatFunNode">创建流程节点</el-button>
        </div>
      </ul>
      <div class="editbox">

        <div v-if="funlist.length==0" class="pd10">当前未创建任何节点</div>

        <div v-else>
          <div v-if="!!nowfun">
            <div class="title pd10">编辑 <b>{{ nowfun.name }}</b> 节点</div>

            <el-form label-position="right" style="padding: 0px 20px;" class="form" label-width="120px">
              <Divider title="基本信息" />

              <el-form-item label="是否开始流程：">
                <span v-if="nowfun.is_start">是（start）</span>
                <span v-else>否</span>
              </el-form-item>

              <el-form-item required label="流程名称：">
                <el-input v-model="nowfun.name" size="small" style="width: 190px" placeholder="请输入流程名称" />
              </el-form-item>
              <el-form-item label="流程说明：">
                <el-input v-model="nowfun.desc" type="textarea" placeholder="可输入流程说明" />
              </el-form-item>

              <div v-if="nowfun.is_start||nowfun.dealtype!='message'">
                <Divider title="表单设置" />
                <form-limit v-if="showformlimit" v-model="nowfun.formEditLimit"/>
              </div>

              <div v-if="nowfun.is_start||nowfun.dealtype!='message'">
                <Divider title="流程走向" />
                <el-form-item label="按键组：">
                  <btn-group :group.sync="nowfun.btnGroup" />
                  <span style="color:red">*会签只能有一个按键哦。如多个按键只显示第一个按键</span>
                </el-form-item>
              </div>

              <Divider title="流程配置" />

              <div v-if="nowfun.is_start">

                <el-form-item required label="允许创建人：">
                  <chose-contact-group-modal :whitelist="['dept_user','role']" :with-advance-set="false" :dept-with-son="true" :group-list="nowfun.creatPermission" test-type="onlyspread" />
                </el-form-item>
              </div>

              <div v-else>

                <el-form-item required label="接受者：">
                  <chose-contact-group-modal :dept-with-son="false" :with-advance-set="true" :group-list="nowfun.dealers" test-type="spread" />
                </el-form-item>

                <el-form-item label="抄送人：">
                  <chose-contact-group-modal :dept-with-son="false" :with-advance-set="true" :group-list="nowfun.cc" test-type="spread" />
                </el-form-item>

                <el-form-item required label="执行方式：">

                  <el-select v-model="nowfun.dealtype" size="small" style="width:100%">
                    <el-option v-for="item in dealtypelist" :label="item.n" :value="item.v" :key="item.v">{{ item.n }}</el-option>
                  </el-select>

                </el-form-item>

                <div v-if="nowfun.dealtype!='message'">

                  <el-form-item required label="执行时效：">

                    <el-select v-model="nowfun.timeexpired" size="small" style="width:100%">
                      <el-option v-for="item in exectimelist" :label="item.n" :value="item.v" :key="item.v">{{ item.n }}</el-option>
                    </el-select>

                  </el-form-item>

                </div>
                <Divider title="触发节点事件" />

                <el-form-item label="处理后："> 后期根据功能加入，暂时不做功能</el-form-item>

              </div>

            </el-form>
          </div>
          <div v-loading="true" v-else style="height:500px;"/>
        </div>

      </div>

    </div>

  </div>
</template>

<style>
.nodemanger .el-form-item__label {
    font-size: 13px;
}

.nodemanger .el-form-item__content {
    font-size: 13px;
}

a {
    color: #318fff;
}
</style>

<style scoped>
.nodemanger {
    font-size: 13px;
}

.mt20 {
    margin-top: 20px;
}

.mg20 {
    margin: 20px;
}

.leftlist {
    float: left;
    width: 30%;
    padding: 10px;
    border: solid 1px salmon;
    min-height: 180px;
    margin: 0;
}

.leftlist .head {
    font-size: 15px;
    font-weight: bold;
    line-height: 32px;
}

.leftlist li {
    display: block;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: 1px solid #adadad;
    background-color: white;
    position: relative;
}

.leftlist li a:hover {
    cursor: pointer;
}

.leftlist li a.nowchose {
    color: coral
}

.editbox {
    float: left;
    width: 68%;
    border: solid 1px black;
}

.pd5 {
    padding: 5px;
}

.pd10 {
    padding: 10px;
}

.editbox .title {
    line-height: 20px;
    border-bottom: solid 1px black;
}

.editbox .form .ivu-divider {
    font-size: 13px;
    margin: 8px 0;
}

.editbox .form .ivu-form-item {
    margin-bottom: 8px;
}
</style>

<script>
// import {} from '@/libs/util.js'
import diagram from './GoDiagramTreeLayout'
import btnGroup from './CBtnGroup'
import Divider from './CDivider'
import FormLimit from './CFormLimit'

import {
  creatDiagramData
} from '@/utils/u_flowdesign'

import ChoseContactGroupModal from './chose-contact/chose-contact-group-modal'

import draggable from 'vuedraggable'

import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters
} from 'vuex'
import { loadJs } from '../../../utils'

export default {
  name: 'FlowNodeManger',
  components: {
    diagram,
    ChoseContactGroupModal,
    Divider,
    btnGroup,
    draggable,
    FormLimit
  },
  data() {
    return {
      showformlimit: true,
      dealtypelist: [{
        n: '或签',
        v: 'orsign'
      }, {
        n: '会签',
        v: 'andsign'
      }, {
        n: '通知',
        v: 'message'
      }],
      execdolist: [{
        n: '不执行',
        v: 'null'
      }
        // ,
        // {
        //     n: '',
        //     v: 'null'
        // },
      ],
      exectimelist: [{
        n: '3小时',
        v: 3 * 60 * 60
      },
      {
        n: '6小时',
        v: 6 * 60 * 60
      },
      {
        n: '12小时',
        v: 12 * 60 * 60
      },
      {
        n: '24小时',
        v: 24 * 60 * 60
      },
      {
        n: '2天',
        v: 2 * 24 * 60 * 60
      },
      {
        n: '3天',
        v: 3 * 24 * 60 * 60
      },
      {
        n: '4天',
        v: 4 * 24 * 60 * 60
      },
      {
        n: '5天',
        v: 5 * 24 * 60 * 60
      },
      {
        n: '一个星期',
        v: 7 * 24 * 60 * 60
      },
      {
        n: '2个星期',
        v: 14 * 24 * 60 * 60
      },
      {
        n: '30天',
        v: 30 * 24 * 60 * 60
      },
      {
        n: '90天',
        v: 90 * 24 * 60 * 60
      },
      {
        n: '180天',
        v: 180 * 24 * 60 * 60
      },
      {
        n: '无限',
        v: 0
      }
      ],

      choseIndex: 0,
      nowfun: null,
      
      nowrequiredata: [],
      
      
      canseedata: [], 
      lastDiagramDataStr: '',
      showDiagram: false,
      diagramData: { // passed to <diagram> as its modelData
        nodeDataArray: [{
          key: 1,
          text: 'Alpha',
          color: 'lightblue'
        },
        {
          key: 2,
          text: 'Beta',
          color: 'orange'
        },
        {
          key: 3,
          text: 'Gamma',
          color: 'lightgreen'
        },
        {
          key: 4,
          text: 'Delta',
          color: 'pink'
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
      }
    }
  },
  watch: {
    choseIndex() {
      this.initnowdata()
    },
    
    funlist: {
      handler(newValue, oldValue) {
        this.initnowdata()
      },
      deep: true
    }
  },
  mounted() {
    loadJs(window.baseURL + '/dist/lib/go-js/go-debug.js').then(() => {
      this.showDiagram = true
    })

    console.log('modmomo')
    console.log('this.diagramData222', this.diagramData)
    // this.diagramData={
    //     nodeDataArray:[],
    //     linkDataArray:[]
    // }
    this.initnowdata()
  },
  computed: {
    ...mapState({
      funlist: state => state.flowdesign.funList,
      layoutset: state => state.flowdesign.layoutset
      //  messageReadedList: state => state.employee.messageReadedList,
    })
    // ,
    // ...mapGetters([
    //     'requireDataList'
    // ])
  },
  methods: {
    ...mapMutations([
      'setLayOutSet'
    ]),
    ToggleFormLimit() {
      this.showformlimit = false
      setTimeout(() => {
        this.showformlimit = true
      }, 100)
    },
    tran_dealtype(dealtype) {
      for (let i = 0; i < this.dealtypelist.length; i++) {
        const element = this.dealtypelist[i]
        if (element.v == dealtype) {
          return element.n
        }
      }

      return '无'
    },
    getLayoutInfo() {
      const layoutset = []
      console.log('this.diagramData', this.diagramData)

      this.diagramData.nodeDataArray.forEach(ele => {
        if (ele.loc) {
          layoutset.push({
            key: ele.key,
            loc: ele.loc
          })
        }
      })
      if (layoutset.length) {
        this.setLayOutSet(layoutset)
        console.log('setLayOutSet2222')
        // this.layoutset = layoutset;
        
      }
      console.log('layoutset', layoutset)
      return layoutset
    },
    initnowdata() {
      console.log('initnowdata')
      console.log(this.funlist.length)
      // this.nowfun=null;
      this.nowfun = this.funlist[this.choseIndex] ? this.funlist[this.choseIndex] : null
      // setTimeout(() => {
      // }, 30);
      
      // let nodeDataArray = []
      console.log('funlist', this.funlist)
      // let linkDataArray = []
      this.getLayoutInfo()

      const {
        linkDataArray,
        nodeDataArray
      } = creatDiagramData(this.funlist, this.layoutset)

      const str1 = JSON.stringify({
        nodeDataArray: nodeDataArray,
        linkDataArray: linkDataArray
      })

      if (
        str1 !=
                this.lastDiagramDataStr) {
        this.lastDiagramDataStr = str1
        this.diagramData = {
          nodeDataArray: nodeDataArray,
          linkDataArray: linkDataArray
        }
      }
    },

    deletefun(index) {
      if (!confirm('确定删除此流程节点')) return
      if (this.funlist[index].is_start) {
        if (!confirm('此为开始节点，删除后务必重新创建，确定删除')) return
      }
      this.funlist.splice(index, 1)
    },

    is_start() {
      for (let i = 0; i < this.funlist.length; i++) {
        const ele = this.funlist[i]
        if (ele.is_start) {
          return false
        }
      }
      return true
    },
    
    creatFunNode() {
      var id = new Date().getTime() + '' + parseInt(Math.random() * 100000)

      this.funlist.push({
        id: id,

        name: '流程节点:' + id, 
        desc: '', 
        is_start: this.is_start(),
        // requiredata: [],
        formEditLimit: [],

        
        
        
        
        
        
        // NextFun: [],
        
        
        
        btnGroup: [{
          name: '同意',
          defaultFunId: [], 
          defaultSonFlowId: [], 
          NextFun: [ 
            // {if: null,funId: []，SonFlowId：[]}
          ],
          
          handler: {
            funId: [],
            SonFlowId: [] 
          }
        }], 
        

        
        creatPermission: [{
          chosetype: 'or',
          chosed: [{
            type: 'dept',
            id: '1',
            name: '全公司',
            data: { coverage: 'n' }
          }],
          runRoots: [],
          runRoottype: null,
          runRoot: '' 
        }], 
        

        
        Previous: [
          // {
          
          //     FunId: 1
          // },
          // {
          
          //     FunId: 0
          // },
        ],
        timeexpired: 0, 
        expireddo: [],
        cc: [], 
        dealtype: 'orsign', 
        
        dealers: []
        //     {
        //     type: 'user',
        
        
        
        //     chose: {
        //         type: 'user',
        //         userId: 1
        //     },
        // }

      })

      this.choseIndex = this.funlist.length - 1
      this.initnowdata()
    }

  }
}
</script>
