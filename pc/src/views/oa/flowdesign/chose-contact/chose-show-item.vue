<template>
<div>

    <el-dialog v-if="ModalIfFormVisible" append-to-body title="编辑表单条件" :visible.sync="ModalIfFormVisible" width="50%">
        <el-form label-width="80px">
            <el-form-item label="条件名称">
                <el-input v-model="formif.name"></el-input>
            </el-form-item>

            <el-form-item label="条件判断">
                <if-test v-model="formif.data.ifstr"></if-test>
            </el-form-item>

            <el-form-item label="指定给">
                <chose-contact-group-modal :can-test="false" :blacklist='["formif"]' test-type="spread" :dept-with-son="false" :with-advance-set="false" :group-list="formif.data.to"></chose-contact-group-modal>

                <el-alert  title="此处选人与全局设置无关"  :closable="false" type="warning" ></el-alert>

            </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
    <el-button @click="ModalIfFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveIfForm">确 定</el-button>
  </span>
    </el-dialog>
    {{ index+1 }}
    <span v-if="chose.type=='role'">[角色]</span>
    <span v-if="chose.type=='user'">[个人]</span>
    <span v-if="chose.type=='dept'">[部门]
       <el-popover  placement="top"
  v-model="visible3"
  width="350">
<el-form label-width="80px" v-if="visible3">
    <h3>设置部门范围</h3>

  <el-form-item label="覆盖范围">
     <el-select v-model="chose.data.coverage" :placeholder="CoveragePlaceholder">
     <el-option label="包含第1级" value="1"/>
     <el-option label="包含第2级" value="2"/>
          <el-option label="包含第3级" value="3"/>
               <el-option label="包含第4级" value="4"/>
                    <el-option label="包含第5级" value="5"/>
                      <el-option label="包含第6级" value="6"/>
                        <el-option label="包含第7级" value="7"/>
                                                <el-option label="包含第8级" value="8"/>
                                                                        <el-option label="包含第9级" value="9"/>
                         <el-option label="全包含不论层级" value="n"/>
  </el-select>
  </el-form-item>
 <el-alert title="什么是覆盖范围？比如A部门下有a,b,c三个员工和一个B部门(有员工d,f)；那么选择第一级就是a\b\c三个员工;包含第二级选到就是a\b\c\d\f 5个员工"  :closable="false" class="mg-t5" type="error" >    </el-alert>



    </el-form>
    <i slot="reference" class="el-icon-setting setting"></i>
    </el-popover>
    </span>
    <span v-if="chose.type=='form'">[表单]</span>
    <span v-if="chose.type=='formif'">[表单条件]
    <i @click="editIfForm(chose)" class="el-icon-setting setting"></i>
    </span>

    <span v-if="chose.type=='fun'">[条件]
              <el-popover v-if="chose.id=='Super'||chose.id=='SuperByLastUser=role'||chose.id=='SuperByLastUser=dept'"
  placement="top"
  v-model="visible2"
  width="350">
<el-form label-width="80px" v-if="visible2">
    <h3>设置<上级管理员></h3>
  <el-form-item label="判断依据" v-if="chose.id=='Super'">
     <el-select v-model="chose.data.chosetype" placeholder="请选择">
     <el-option label="流程创建者" value="creater"/>
              <el-option label="按上一节点提交者" value="lastuser"/>
  </el-select>
  </el-form-item>

  <el-form-item label="查找方式" v-if="chose.id=='Super'">
     <el-select v-model="chose.data.findtype" placeholder="请选择查找方式">
     <el-option label="直接上级" value="direct"/>
              <el-option label="向上逐级查找主管直到找到" value="tree"/>
    </el-select>
  </el-form-item>
      <el-form-item label="满足角色" v-if="chose.id=='Super'||chose.id=='SuperByLastUser=role'">

          <treeselect
          v-model="chose.data.roles"
  :options="rolelist"  
  multiple
  :disable-branch-nodes="true"
  :show-count="true"
  placeholder="可选择角色"
  />
  </el-form-item>
    <el-form-item label="满足部门" v-if="chose.id=='Super'||chose.id=='SuperByLastUser=dept'">
         <el-select style="width:100%" v-model="chose.data.depts" multiple placeholder="可选择部门">
              <el-option v-for="item in DeptTree" :key="item.id" :label="item.label" :value="item.id"/>
            </el-select>
           <span style="color:red" class="fz12">
               *如果选择多个部门，只要有一个部门满足条件即可
           </span>
    </el-form-item>

    </el-form>
    <i slot="reference" class="el-icon-setting setting"></i>
    </el-popover>
    </span>
    {{ chose.name }}
        <sup v-if="chose.type=='dept'" class="fz12" style="color: #FF5722;">
            ({{!chose.data.coverage?(deptWithSon?'n':'1'):chose.data.coverage}})
        </sup>
</div>
</template>

<script>
import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

// import ChoseContactGroupModal from './chose-contact-group-modal'

// console.log('ChoseContactGroupModal',ChoseContactGroupModal);

import IfTest from './CIfTest'

export default {
    name: 'ChoseShowItem',
    components: {
        Treeselect,
        IfTest
        // ,
        // ChoseContactGroupModal
    },
    props: {

        deptWithSon:Boolean,
        chose: {
            type: Object,
            required: true,
            default: () => {
                return {}
            }
        },
        index: {
            type: Number
        }
    },
    computed: {
        ...mapState({
            userByDepts: state => state.contact.userByDepts,
            RoleTrees: state => state.contact.RoleTrees
            //  messageReadedList: state => state.employee.messageReadedList,
        })
    },
    data() {
        return {
            CoveragePlaceholder:'',
            ModalIfFormVisible: false,
            nowIfForm: null,
            modal1: false,
            visible2: false,
            visible3: false,
            rolelist: [],
            DeptTree: [] 
                ,
            testDepts: [],
            formif: {
                name: null,
                data: {
                    ifstr: null,
                    to: []
                }
            }

        }
    },
    mounted() {
        // if (!this.chose.data) {
            
        if(this.deptWithSon){
                 this.CoveragePlaceholder='默认不论层级'
        }else{
              this.CoveragePlaceholder='默认第一级'
        }

        // }
        this.init();
    },
    methods: {
        ...mapActions(
            [
                'getUserByDeptData',
                'GetRoleTree'
            ]),
        init() {

            if (this.RoleTrees.length == 0) {
                this.GetRoleTree().then(res => {
                    setTimeout(() => {
                        this.getRoleList()
                    }, 300)
                })
            } else {
                this.getRoleList()
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
            console.log('this.DeptTree');
            console.log(this.DeptTree);

        },
        getRoleList() {
            
            console.log('RoleTrees改变了')
            console.log(this.RoleTrees)

            const arr = []
            for (let i = 0; i < this.RoleTrees.length; i++) {
                const ele = this.RoleTrees[i]

                const son_arr = []
                if (ele.children) {
                    for (let k = 0; k < ele.children.length; k++) {
                        const elek = ele.children[k]
                        // elek.type='role';
                        son_arr.push({
                            id: elek._uuid,
                            label: elek.rolename,
                        })
                    }
                }

                arr.push({
                    id: ele._uuid,
                    label: ele.groupname,
                    children: son_arr,
                    // disableCheckbox: true,
                    // expand: true,
                    // disabled: true
                })
            }
            console.log(arr)
            this.rolelist = arr;
            console.log(this.rolelist);
        },
        ok() {
            this.$Message.info('Clicked ok')
        },
        cancel() {
            this.$Message.info('Clicked cancel')
        },
        copyobject(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        saveIfForm() {
            this.ModalIfFormVisible = false;
            this.nowIfForm.name = this.formif.name;
            this.nowIfForm.data = this.copyobject(this.formif.data);

        },
        editIfForm(chose) {

            this.nowIfForm = chose;

            this.ModalIfFormVisible = true;

            this.formif = {
                name: chose.name,
                data: {
                    ifstr: (!!chose.data && !!chose.data.ifstr) ? chose.data.ifstr : null,
                    to: (!!chose.data && !!chose.data.to) ? this.copyobject(chose.data.to) : []
                }
            }

            

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
            // console.log('arr', arr)
            return arr
        }
    }
}
</script>

<style scoped>
.setting {
    position: absolute;
    right: 21px;
    top: 6px;
    cursor: pointer;
}
</style>
