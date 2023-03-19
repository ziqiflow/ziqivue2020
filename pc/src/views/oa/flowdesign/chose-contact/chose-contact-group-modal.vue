<template>
  <div class="chose-contact-modal">
    <span>
      <a class="addtogroup" v-if="groupList.length==0" @click="addtogroup">{{ placeholder }}</a>
      <ul class="group">
        <li v-for="(group,indexg) in groupList" :key="indexg">
          <span v-for="(chose,index) in group.chosed" :key="index">
            <span v-if="chose.type=='role'">[角色]{{ chose.name }}</span>
            <span v-if="chose.type=='user'">[个人]{{ chose.name }}</span>
            <span v-if="chose.type=='dept'">[部门]{{ chose.name }}

              <sup class="fz12" style="color: #FF5722;">
                ({{ !chose.data||!chose.data.coverage?(deptWithSon?'n':'1'):chose.data.coverage }})
              </sup>

            </span>
            <span v-if="chose.type=='form'">[表单]{{ chose.name }}</span>
            <span v-if="chose.type=='formif'">[表单条件]{{ chose.name }}</span>
            <span v-if="chose.type=='fun'">[条件]{{ chose.name }}</span>
            <span v-if="index+1!=group.chosed.length" style="padding:0 5px">
              |
            </span>
          </span>
          <el-tooltip v-if="group.chosetype=='and'" content="只取交叉部分的人员" placement="top">
          <span class="chosetype" >取交集</span></el-tooltip>
          <el-tooltip v-if="group.chosetype=='or'" content="取到所有的人" placement="top">
          <span class="chosetype" >取并集</span></el-tooltip>

          <div v-if="!disabled" class="opt_btn_group">
            <a @click="EditGroup(group,indexg)">编辑</a>
            |
            <a @click="removeGroup(groupList,indexg)">删除</a>
          </div>

          <Divider v-if="indexg+1!=groupList.length" title="Or"/>

        </li>
      </ul>
      <div v-if="groupList.length>0&&!disabled">
        <el-button style="margin-top:10px;margin-right:10px;" icon="el-icon-plus" size="mini" type="primary" @click="addtogroup">添加联系人方式</el-button>
        <el-button v-if="canTest" style="margin-top:10px" size="mini" type="success" @click="testcontactModal">
          <v-icon name="iosspeedometeroutline" style="font-size:12px;" />
          测试</el-button>
      </div>
    </span>

    <el-dialog :fullscreen="!isPc" :visible.sync="modaltestonlyspread" append-to-body title="测试结果" width="60%">

      <div v-if="testloading">加载中...</div>
      <div v-else>
        <div v-if="!!testResult&&!!testResult.persons">
          <div v-if="testType=='onlyspread'">
            人员({{ testResult.persons.length }})：
            <div v-if="testResult.persons.length==0">无匹配人员</div>
            <div v-else>
              <div v-for="person in testResult.persons" :key="person._uuid" class="label warning">{{ person.name }}</div>
            </div>
          </div>

        </div>
      </div>

      <div slot="footer">
        <el-button size="large" @click="modaltestonlyspread=false">取消</el-button>
      </div>

    </el-dialog>

    <el-dialog :fullscreen="!isPc" :visible.sync="modaltest" append-to-body title="测试数据填写" width="60%">

      <div v-if="modaltest">
        测试数据：
        <br>
        <div v-if="testType=='spread'&&!!testData">

          <div v-if="typeof testData.created_id!='undefined'" style="margin-top:10px;">
            流程申请者：
            <treeselect :value-consists-of="LEAF_PRIORITY" v-model="testData.created_id.data" :multiple="false" :options="singleDeptTree" placeholder="输入流程的创建者" />
          </div>

          <el-card v-if="testformList.length>0||testformifList.length>0" style="margin: 10px 0;">

            <div slot="header" class="clearfix">
            <span>表单数据</span></div>

            <el-form v-if="testformList.length" label-width="120px">
              <div v-for="(item,index) in testformList" :key="index">
                <el-form-item :label="item.name" class="fz13">
                  <component v-model="testData.formdata[item.key]" :is="item.componentName"/>
                </el-form-item>
              </div>
            </el-form>
            <el-form v-if="testformifList.length" label-width="120px">
              <div v-for="(item,index) in testformifList" :key="index">
                <el-form-item :label="item.name" class="fz13">
                  <el-input v-model="testData.formdata[item.key]" placeholder="输入测试数据" size="mini" />

                </el-form-item>
              </div>

              <span class="fz12" style="color:red">*如果测试的数据是多选情况，请用,隔开;比如宁波公司,杭州公司</span>
            </el-form>

          </el-card>

          <div v-if="typeof testData.lastuser_id!='undefined'" style="margin-top:10px;">
            上一级节点处理人：
            <treeselect :value-consists-of="LEAF_PRIORITY" v-model="testData.lastuser_id.data" :multiple="false" :options="singleDeptTree" placeholder="输入流程上一个节点处理人" />
          </div>

          <el-alert v-if="typeof testData.created_id=='undefined'&& typeof testData.lastuser_id=='undefined'" :closable="false" title="此类型无需测试数据" type="info" />

        </div>
        <div v-if="testType=='permission'&&!!testData">

          <div v-if="typeof testData.permission_id!='undefined'" style="margin-top:10px;">
            测试人：
            <treeselect :value-consists-of="LEAF_PRIORITY" v-model="testData.permission_id.data" :multiple="true" :options="multipleDeptTree" placeholder="输入测试人" />
            <span style="color:red">*请勿选择过多人。系统有限制</span>
          </div>
          <el-alert v-else :closable="false" title="此类型无需测试数据" type="info" />

        </div>

      </div>

      <el-alert title="返回结果：" type="success" style="margin-top:10px;">

        <div v-if="testloading">加载中...</div>
        <div v-else>
          <div v-if="!!testResult&&!!testResult.persons">
            <div v-if="testType=='spread'">
              人员：
              <div v-if="testResult.persons.length==0">无匹配人员</div>
              <div v-else>
                <div v-for="person in testResult.persons" :key="person._uuid" class="label warning">{{ person.name }}</div>
              </div>
            </div>
            <div v-if="testType=='permission'">
              <div v-if="testResult.persons.length==0">无匹配人员</div>
              <div v-else>
                <div v-for="person in testResult.persons" :key="person._uuid">{{ person.name }}:
                  <span v-if="person.hasPermission" class="label success">允许</span>
                  <span v-else class="label error">禁止</span>

                </div>
              </div>
            </div>
          </div>
        </div>

      </el-alert>

      <div slot="footer">
        <el-button size="large" @click="canceltest">取消</el-button>
        <el-button size="large" type="success" @click="oktest">测试</el-button>
      </div>

    </el-dialog>

    <el-dialog :fullscreen="!isPc" :visible.sync="modal1" append-to-body title="联系人组编辑器" width="60%">

      <el-form label-width="120px">
        <el-form-item label="已选择项目：">
          <span v-if="chosed.length==0">无</span>
          <span v-for="(chose,index) in chosed" :key="index">
            <span v-if="chose.type=='role'">[角色]{{ chose.name }}</span>
            <span v-if="chose.type=='user'">[个人]{{ chose.name }}</span>
            <span v-if="chose.type=='dept'">[部门]{{ chose.name }}

              <sup class="fz12" style="color: #FF5722;">
                ({{ !chose.data||!chose.data.coverage?(deptWithSon?'n':'1'):chose.data.coverage }})
              </sup>

            </span>
            <span v-if="chose.type=='form'">[表单]{{ chose.name }}</span>
            <span v-if="chose.type=='fun'">[条件]{{ chose.name }}</span>
            <span v-if="chose.type=='formif'">[表单条件]{{ chose.name }}</span>
            <span v-if="index+1!=chosed.length" style="padding:0 5px">
              <span v-if="chosetype=='and'">and</span>
              <span v-if="chosetype=='or'">or</span>
            </span>
          </span>
        </el-form-item>
        <el-form-item label="处理模式：">

          <el-radio-group v-model="chosetype">
            <el-radio label="or">
              <el-tooltip content="并集：比如A员工/B员工，两个人都会通知到；"><span>OR取并集</span></el-tooltip>
            </el-radio>
            <el-radio label="and">
              <el-tooltip content="交集：比如部门A+角色主管，会通知到A部门下的主管"><span>AND取交集</span></el-tooltip>
            </el-radio>
          </el-radio-group>
          <div style="color:red" class="fz12">
            说明：默认是并集： 联系人组之间是并集
          </div>
        </el-form-item>

      </el-form>

      <div class="chosebox">
        <chose-contact v-if="modal1" ref="chosecontact" :dept-with-son="deptWithSon" :blacklist="blacklist" :whitelist="whitelist" :chosed="chosed" :with-group-chose="true" />
      </div>

      <el-alert v-if="!deptWithSon" :closable="false" title="此处选择的部门默认会选取到此部门一级中查询到人员工，比如a，b属于X部门，c属于X部门下Y部门。如果部门选择为X那么会选择a,b；（全公司除外，全公司会选取所有人），也可通过部门设置扩展其包含的范围" class="mg-t5" type="error"/>
      <el-alert v-else :closable="false" title="此处选取的部门默认此部门的树状结构下匹配,不论层级，亦可在部门上修改属性" class="mg-t5" type="error"/>

      <div v-if="withAdvanceSet">

        <div style="margin-top:5px;">
          <div style="cursor: pointer;" @click="advanceSet">
            <i v-if="sensiorset" class="el-icon-caret-bottom"/>
            <i v-else class="el-icon-caret-right"/>
          <span>高级设置</span></div>
          <el-form v-if="sensiorset" label-width="120px">
            <el-form-item label="部门Root：">
              <el-select v-model="runRoots" multiple placeholder="默认按全局配置">
                <el-option
                  v-for="item in DeptTree"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"/>
              </el-select>
              匹配Root模式
              <el-select v-model="runRoottype" placeholder="默认按全局配置">
                <el-option
                  label="全局模式"
                  value=""/>
                <el-option
                  label="流程创建者"
                  value="creater"/>
                <el-option
                  label="按上一节点提交者"
                  value="lastuser"/>
              </el-select>

              <el-alert :closable="false" class="mg-t5" type="error" title="*什么是部门ROOT?">
                部门Root是指该流程运行的组织架构中的环境；默认是按全局配置为准
                <br>
                运行到该流程时候，会根据创建者或上一个流程接收者 计算其所在的部门下的 匹配联系人 作为下一个节点的接收人。
              </el-alert>

              <el-alert :closable="false" class="mg-t5" type="error" title="*什么是匹配Root模式?">
                匹配模式是指在计算下一个节点接收人的时候，按创建者所在的部门计算 还是 上一个流程接受者所在的流程计算
              </el-alert>
          </el-form-item></el-form>
        </div>
      </div>

      <div slot="footer">
        <el-button size="large" @click="cancel">取消</el-button>
        <el-button size="large" type="success" @click="ok">确定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>

import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import ChoseContact from './chose-contact'
import Divider from './../CDivider'

import {
  FlowDesignsTestContact
} from '@/api/contacts'

import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters
} from 'vuex'

export default {
  name: 'ChoseContactGroupModal',
  components: {
    ChoseContact,
    Treeselect,
    Divider
  },
  props: {
    // testWith:{
    //     type:Boolean,
    //     default:()=>{
    //         return false
    //     }
    // },

    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },

    placeholder: {
      type: String,
      default: () => {
        return '当前未选中联系人条件，点击创建'
      }
    },
    blacklist: {},
    whitelist: {},
    canTest: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    deptWithSon: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    testType: {
      type: String,
      default: () => {
        return 'spread'
        
        
        
      }
    },
    withAdvanceSet: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    groupList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState({
      userByDepts: state => state.contact.userByDepts,
      flowset: state => state.flowdesign.set
      //  messageReadedList: state => state.employee.messageReadedList,
    }),
    ...mapGetters([
      'requireDataList'
    ])
  },
  data() {
    return {
      sensiorset: false,
      modal1: false,
      modaltest: false,
      modaltestonlyspread: false,
      chosed: [],
      chosetype: 'or',
      nowchoseindex: null,
      edittype: '',
      testData: null,
      testformList: [], 
      testformifList: [],
      
      testResult: null,
      testloading: false,
      DeptTree: [], 
      singleDeptTree: [],
      multipleDeptTree: [],
      LEAF_PRIORITY: 'LEAF_PRIORITY',
      BRANCH_PRIORITY: 'BRANCH_PRIORITY',
      runRoots: [],
      runRoottype: null,
      showfun: true,

      options: [{
        //   id: 'a',
        label: 'a',
        // isDisabled: true,
        children: [{
          id: 'aa',
          label: 'aa'
          // isDisabled:false
        }, {
          id: 'ab',
          label: 'ab'
          // isDisabled:false
        }]
      }, {
        id: 'b',
        label: 'b'
      }, {
        id: 'c',
        label: 'c'
      }]
    }
  },
  methods: {
    ...mapActions([
      'getUserByDeptData'
    ]),
    advanceSet() {
      this.sensiorset = !this.sensiorset
    },
    unique(arr) {
      var n = []
      for (var i = 0; i < arr.length; i++) {
        if (n.indexOf(arr[i]) == -1) {
          n.push(arr[i])
        }
      }
      return n
    },

    readyTestifstr(ifstr) {
      
      if (!ifstr) {
        return
      }

      let match = ifstr.match(/@\[.+?\]/g)
      const matcharr = []
      if (match) {
        match = this.unique(match)
        match.forEach(mt => {
          const keymatch = mt.match(/\d{13}_\d{1,}/g)
          if (keymatch) {
            this.requireDataList.forEach(ele => {
              if (keymatch[0] == ele.key) {
                // const newele = this.copyobject(ele)
                // newele.value = 1
                // let hasfind=false;、

                if (
                  !this.testformifList.some(v => {
                    return v.key == ele.key
                  })) {
                  this.testformifList.push(ele)
                  // hasfind=true;
                }
              }
            })
          }
        })
      }

      // this.testformifList = matcharr
    },

    testcontactModal() {
      if (this.testType == 'onlyspread') {
        this.modaltestonlyspread = true

        this.testloading = true
        FlowDesignsTestContact({
          groupList: this.groupList,
          testType: this.testType
        }).then(({
          data: res
        }) => {
          this.testloading = false
          this.testResult = {
            persons: res.data
          }
        })

        return
      }

      console.log('this.userByDepts')
      console.log(this.userByDepts)
      if (this.userByDepts.length == 0) {
        this.getUserByDeptData().then(res => {
          this.singleDeptTree = this.getnowUserdeptList(this.userByDepts, 'single')
          // console.log('this.singleDeptTree',this.singleDeptTree)
          this.multipleDeptTree = this.getnowUserdeptList(this.userByDepts, 'multiple')
        })
      } else {
        this.singleDeptTree = this.getnowUserdeptList(this.userByDepts, 'single')
        // console.log('this.singleDeptTree',this.singleDeptTree)
        this.multipleDeptTree = this.getnowUserdeptList(this.userByDepts, 'multiple')
      }

      // setTimeout(() => {
      //   console.log(this.singleDeptTree);
      // }, 1000);

      
      this.modaltest = true
      this.testResult = null
      const groupstr = JSON.stringify(this.groupList)

      if (this.testType == 'permission') {
        this.testData = {}
        this.testData.permission_id = {
          data: []
        } 
        console.log(this.testData)
      }

      if (this.testType == 'spread') {
        const roottype = this.flowset.runRoottype ? this.flowset.runRoottype : 'creater'
        let hascreater = false
        let haslastuser = false
        this.testData = {
          formdata: {}
        }

        this.testformifList = []
        this.testformList = []

        // console.log('groupList',this.groupList);

        this.groupList.forEach(ele => {
          ele.chosed.forEach(ele2 => {
            if (ele2.type == 'form') {
              
              this.testformList.push({
                key: ele2.id,
                componentName: ele2.data,
                name: ele2.name
              })
            }
            if (ele2.type == 'formif') {
              
              console.log('ele.data.ifstr', ele2.data.ifstr)
              this.readyTestifstr(ele2.data.ifstr)
            }
          })

          if (ele.runRoottype == 'creater') {
            hascreater = true
          }
          if (ele.runRoottype == 'lastuser') {
            haslastuser = true
          }
          if (!ele.runRoottype) {
            if (roottype == 'creater') {
              hascreater = true
            }
            if (roottype == 'lastuser') {
              haslastuser = true
            }
          }
        })
        // alert(haslastuser);
        // || (!hascreater && roottype == 'creater')
        if (hascreater) {
          this.testData.created_id = {
            data: null
          }
        }
        // || (!haslastuser && roottype == 'lastuser')
        if (haslastuser) {
          this.testData.lastuser_id = {
            data: null
          }
        }

        if (groupstr.indexOf('ByCreat') != -1 || groupstr.indexOf('"Super"') != -1) {
          this.testData.created_id = {
            data: null
          } 
        }

        if (groupstr.indexOf('ByLastUser') != -1 || groupstr.indexOf('"Super"') != -1) {
          this.testData.lastuser_id = {
            data: null
          } 
        }
      }
    },
    RootTypeHasCreater() {
      const roottype = this.flowset.runRoottype ? this.flowset.runRoottype : 'creater'
    },
    RootTypeHasLastUser() {

    },
    testcontact() {

    },

    addtogroup() {

      if(this.disabled){
        this.$message.info('只读模式,无法选人');
        return;
      }
      this.modal1 = true

      this.chosed = []
      this.runRoots = []
      this.runRoottype = null,
      this.chosetype = 'or'
      this.edittype = 'add'
      this.initmodal1()
      // this.$refs.chosecontact.whenChosedChange();
    },
    copyobject(obj) {
      return JSON.parse(JSON.stringify(obj))
    },

    handerGroupAdd(nowchose) {
      console.log(nowchose)
    },
    oktest() {
      this.testloading = true
      FlowDesignsTestContact({
        flowset: this.flowset, 
        groupList: this.groupList,
        testType: this.testType,
        testData: this.filterPostTestData(this.testData),
        deptWithSon:this.deptWithSon
      }).then(({
        data: res
      }) => {
        this.testloading = false
        this.testResult = {
          persons: res.data
        }
      })
    },
    
    filterPostTestData(obj) {
      const newobj = {}
      for (const x in obj) {
        newobj[x] = obj[x]
        if (typeof obj[x].data !== 'undefined') {
          newobj[x] = obj[x].data
        }
      }
      return newobj
    },
    canceltest() {
      this.modaltest = false
    },

    ok() {
      console.log(this.edittype)
      console.log(this.nowchoseindex)

      if (this.chosed.length == 0) {
        this.$message.warning('联系人为空，无法编辑创建')
        return
      }
      if (this.edittype == 'edit') {
        this.groupList[this.nowchoseindex] = {
          chosetype: this.chosetype,
          chosed: this.copyobject(this.chosed),
          runRoots: this.copyobject(this.runRoots),
          runRoottype: this.runRoottype, 
          runRoot: '' 
        }
      }
      if (this.edittype == 'add') {
        this.groupList.push({
          chosetype: this.chosetype,
          chosed: this.copyobject(this.chosed),
          runRoots: this.copyobject(this.runRoots),
          runRoottype: this.runRoottype,
          runRoot: '' 
        })
        // this.group = this.copyobject(this.chosed);
      }
      this.modal1 = false;
      
      this.reloadGroupName();


    },
    reloadGroupName(){

      this.groupList.forEach(group=>{

          let nameArr=[];
          group.chosed.forEach(chose=>{

            if(chose.type=='role'){
              nameArr.push(`[角色]${chose.name}`)
            }
              if(chose.type=='user'){
              nameArr.push(`[个人]${chose.name}`)
            }
            if(chose.type=='dept'){
              nameArr.push(`[部门]${chose.name}(`+ (!chose.data||!chose.data.coverage?(this.deptWithSon?'n':'1'):chose.data.coverage )+`)`)
            }

            if(chose.type=='form'){
              nameArr.push(`[表单]${chose.name}`)
            }

            if(chose.type=='formif'){
              nameArr.push(`[表单条件]${chose.name}`)
            }

            if(chose.type=='fun'){
              nameArr.push(`[条件]${chose.name}`)
            }


          })
          let nameStr=nameArr.join(' | ')

          if(group.chosetype=='and'){
            nameStr+='【取交集】';
          }

           if(group.chosetype=='or'){
            nameStr+='【取并集】';
          }

         group.name=nameStr;


      })

      


    },
    cancel() {
      this.$message.info('Clicked cancel')
      this.modal1 = false
    },
    EditGroup(group, index) {
      this.nowchoseindex = index
      this.modal1 = true

      this.chosed = this.copyobject(group.chosed)
      this.runRoots = this.copyobject(group.runRoots)
      this.runRoottype = group.runRoottype
      this.chosetype = group.chosetype
      this.edittype = 'edit'
      this.initmodal1()
      // this.$refs.chosecontact.whenChosedChange();
    },
    removeGroup(groupList, index) {
      groupList.splice(index, 1);
            this.reloadGroupName();
    },
    intend(length) {
      let str = ''
      for (let i = 0; i < length; i++) {
        str += '---'
      }
      if (str == '') return ''
      return '+' + str
    },
    getdeptList(list, titiles = []) {
      
      let arr = []
      for (let i = 0; i < list.length; i++) {
        const titileArr = this.copyobject(titiles)
        const ele = list[i]
        if (ele.deptname) {
          const newobj = {
            label:
                            // this.intend(titileArr.length)
                            (titileArr.join('-') ? titileArr.join('-') + '-' : '') +
                            ele.deptname
          }
          titileArr.push(ele.deptname)
          // if (type == 'multiple') {
          newobj.id = ele._uuid
          // } else {
          //   newobj.id = null
          // }

          arr.push(newobj)

          if (ele.children) {
            if (ele.children.length > 0) {
              const back = this.getdeptList(ele.children, titileArr)
              if (back.length > 0) {
                arr = arr.concat(back)
                // newobj.children=back;
              }
            } else {
              continue
            }
          }
          // arr.push(newobj)
        }
      }
      console.log('arr', arr)
      return arr
    },
    getnowUserdeptList(list, type, deptid = '1', deptname = '') {
      
      const arr = []
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        if (ele.deptname) {
          const newobj = {
            label: ele.deptname
          }
          if (type == 'multiple') {
            newobj.id = ele._uuid
          } else {
            newobj.id = null
          }
          if (ele.children) {
            if (ele.children.length > 0) {
              newobj.children = this.getnowUserdeptList(ele.children, type, ele._uuid, ele.deptname)
            } else {
              continue
            }
          }
          arr.push(newobj)
        }
        if (ele.username) {
          arr.push({
            id: deptid + '__' + ele._uuid,
            label: (deptname ? '<' + deptname + '>' : '') + ele.username
          })
        }
      }
      return arr
    },
    initmodal1() {
      if (this.runRoots.length > 0 || !!this.runRoottype) {
        this.sensiorset = true
      } else {
        this.sensiorset = false
      }
      if (this.userByDepts.length == 0) {
        this.getUserByDeptData().then(res => {
          this.DeptTree = this.getdeptList(this.userByDepts)
          this.DeptTree.unshift({
            id: '1',
            label: '全公司'
          })
        })
      } else {
        this.DeptTree = this.getdeptList(this.userByDepts)
        this.DeptTree.unshift({
          id: '1',
          label: '全公司'
        })
      }
    }
    // editgroup(){
    //     //modal1=true
    //     this.modal1=true;
    //     this.chosed=this.copyobject(this.group);
    // },
    // deletegroup(grouplist,index){
    //         grouplist.splice(index,1);
    // }

  },
  mounted() {
    this.showfun = (this.testType != 'permission')
  }
}
</script>

<style scoped>

.addtogroup{
  color: #409eff;
}
.chose-contact-modal {
    position: relative;
}

.label,
.chosetype {
    border-radius: 4px;
    color: white;
    padding: 1px 3px;
    display: inline-block;
    margin: 3px;
}

.label.success {
    background-color: #19be6b
}

.label.warning {
    background-color: #ff9900;
}

.label.error {
    background-color: #ed4014;
}

.group {
    margin: 0;
    padding: 0;
}

.group li {
    list-style: none;
    cursor: pointer;
}

.group li {
    position: relative;
    list-style: none;
    margin: 0px;
    font-size: 13px;
    background-color: white;
}

.group li .opt_btn_group {
    position: absolute;
    right: 4px;
    top: 0px;
}

.title {
    font-size: 14px;
    font-weight: bold;
}

.chosebox {
    padding: 10px 10px;
    border-top: #d4d4d4 solid 1px;
    border-bottom: dashed 1px #e2e2e2;

}

.chose-contact-modal .ivu-tooltip-inner {
    max-width: 350px;
}

.testbtn {
    position: absolute;
    right: 10px;
    top: 10px;
}

.chosetype {
    background-color: #ff9900;
    line-height: 16px;
}
</style>

<style>
.chose-contact-modal .ivu-divider {
    margin: 0px;
    font-size: 12px;
    font-weight: 400;
    line-height: 8px;
}

.chose-contact-modal .ivu-tooltip-inner {
    max-width: 350px;
}
</style>
