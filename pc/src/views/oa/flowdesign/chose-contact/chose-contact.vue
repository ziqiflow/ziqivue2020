<template>
  <div style="height:300px;" class="chose-contact">
    <div class="left" style="border-right: 1px dashed #d4d4d4;">
      选择：
      <div>

        <el-tabs v-model="tabname">

          <el-tab-pane v-if="tabshow('dept_user')" class="dept_user" label="组织架构" name="dept_user">

            <el-input v-model="searchkey" clearable placeholder="输入人员名称或部门名称" @keyup.enter.native="searchname" />

            <div class="treelist">
              <div style="margin:5px;">
                导航：<a @click="navclick(0)">/</a>
                <span v-for="(nav,index) in navlist" :key="nav.id">
                  ->
                  <a @click="navclick(index+1)">
                    {{ nav.name }}
                  </a>
              </span></div>

              <ul class="nowshowlist">
                <li v-if="nowshowlist.length==0">没有任何信息哦</li>
                <li v-for="item in nowshowlist" :key="item.id">
                  <div v-if="item.type=='user'">

                    <el-checkbox v-model="item.checked" @change="change_nowshow(item)">
                      <v-icon name="person" />
                      {{ item.name }}
                    </el-checkbox>

                  </div>
                  <div v-if="item.type=='dept'" style="cursor: pointer;">

                    <el-checkbox v-model="item.checked" @change="change_nowshow(item)" />
                    <span @click="toChildren(item)">
                      <v-icon name="ios-folder-open"/>
                      {{ item.name }}
                      <v-icon style="float:right;" name="ios-arrow-dropright" />
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="tabshow('role')" label="角色" name="role">
            <el-input v-model="rolefilterText" style="margin-bottom:10px;" placeholder="输入角色名称" clearable/>

            <div class="treelist">
              <el-tree
                ref="roletree"
                :filter-node-method="filterNode"
                :data="rolelist"
                :default-checked-keys="role_checked_keys"
                node-key="id"
                default-expand-all
                show-checkbox
                @check="change_role_tree" />
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="tabshow('conditions')&&withGroupChose&&ShowFunChose" label="附加条件" name="conditions">
            <div class="treelist" style="    line-height: 24px;">
              <div v-for="(item,index) in funlist" :key="index" class="fz13">
                <i class="el-icon-circle-plus-outline pointer" @click="addfun(item)"/>
                <el-tooltip :content="item.tip" effect="light" placement="top-start">
                  <span>{{ item.label }} </span>
                </el-tooltip>
              </div>

              <span style="color:red" class="fz12">*后期根据使用需求加其他条件</span>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="tabshow('form')" label="表单控件" name="form">
            <div class="treelist">
              <div v-if="canformList(requireDataList).length==0" style="font-size: 12px;">未添加相关的人员/部门/角色选择表单</div>
              <div v-for="(item,index) in canformList(requireDataList)" :key="index">
                <div class="fz12">
                  <i class="el-icon-circle-plus-outline pointer" @click="addform(item)"/>
                  <span>{{ item.name }} </span>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane v-if="tabshow('formif')" label="表单条件控件" name="formif">
            <div class="treelist">
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="addformif">添加条件</el-button>
            </div>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>

    <div class="right">
      已选：
      <ul class="chosedlist">
        <li v-if="chosed.length==0">未选择任何对象</li>
        <li v-for="(item,index) in chosed" :key="index">
          <chose-show-item :dept-with-son="deptWithSon" :index="index" :chose="item"/>
          <v-icon name="iostrashoutline" style="cursor: pointer;position: absolute;right: 4px;top: 3px;" @click="deletechosed(index)" />
        </li>
      </ul>

    </div>
    <div class="clear" />
  </div>
</template>

<style>
.chose-contact .el-tabs__item {
    padding: 0 10px;
}

.chose-contact .dept_user .el-checkbox {
    margin-right: 5px;
}
</style>
<style scoped>
.clear {
    clear: both;
}

.left,
.right {
    float: left;
    width: 50%;
    padding: 5px 10px;

}

.treelist {
    height: 180px;
    overflow: auto;

}

.nowshowlist,
.chosedlist {
    margin: 0;
    padding: 0;
}

.nowshowlist li {
    padding: 5px;
    list-style: none;
    line-height: 18px;
    font-size: 13px;
    border-bottom: solid 1px #e6e6e6;

}

.chosedlist li {
    padding: 5px;
    list-style: none;
    line-height: 20px;
    font-size: 14px;
    border-bottom: solid 1px #e6e6e6;
    position: relative;
}

.chosedlist li:hover {
    background-color: #eef1c8;
}
</style>

<script>
import ChoseShowItem from './chose-show-item.vue'
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters
} from 'vuex'

export default {
  name: 'ChoseContact',
  components: {
    ChoseShowItem
  },
  props: {
    // grouplist:{
    //   type:Array,
    //   default:()=>{
    //     return [];
    //   }
    // },
    
    whitelist: {
      type: Array,
      default: () => {
        return ['dept_user', 'role', 'conditions', 'form', 'formif']
      }
    },
    blacklist: {
      type: Array,
      default: () => {
        return []
      }
    },
    deptWithSon: {
      type: Boolean,
      default: () => {
        return true
      }
    },

    chosed: {
      type: Array,
      default: () => {
        return []
      }
    },

    ShowFunChose: {
      type: Boolean,
      default: () => {
        return true
      }

    },

    
    withGroupChose: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      // choseShowItemOpen:false,
      showItem: [],
      rolefilterText: '',
      searchkey: '',
      tabname: 'dept_user',
      rolelist: [],
      nowshowlist: [], 
      navlist: [], 
      // [id:'',name:'']
      modal1: false,
      funs: [{
        n: '创建者自己',
        v: 'CreatID',
        t: '本流程的创建者'
      }, {
        n: '上一审核人',
        v: 'LastUserID',
        t: '上一流程节点的审核人'
      },
      {
        n: '创建者的直接上级',
        v: 'directSuperByCreat',
        t: '创建者的直接上级主管'
      },
      {
        n: '创建者上级管理员',
        v: 'SupersByCreat',
        t: '创建者的上级主管，如果上一级没有主管，会沿着部门树上找主管。直到找到'
      },
      {
        n: '上一审核人的直接上级',
        v: 'directSuperByLastUser',
        t: '上一个审核人的直接上级主管'
      },
      {
        n: '上一审核人上级管理员',
        v: 'SuperByLastUser',
        t: '上一个审核人的上级主管，如果上一级没有主管，会沿着部门树上找主管。直到找到'
      },
      {
        n: '上一审核人上级管理员而且角色=',
        v: 'SuperByLastUser=role',
        t: '上一个审核人的上级主管中而且角色您选择的角色，如果上一级没有查询到，会沿着部门树上找主管。直到找到'
      },
      {
        n: '上一审核人上级管理员而且部门=',
        v: 'SuperByLastUser=dept',
        t: '上一个审核人的上级主管中而且部门您选择的部门，如果上一级没有查询到，会沿着部门树上找主管。直到找到'
      },
      {
        n: '上级管理员',
        v: 'Super',
        t: '上级管理员，可以根据条件配置'
      }
        //,
        // {n:'',v:''},
      ],
      funlist: [],
      role_checked_keys: []

      // chosed:[],
      // chosed: [
      
      //     {
      //         type: 'user',
      //         id: 1,
      
      //     },
      //     {
      //         type: 'role',
      //         id: 1,
      
      //     },
      //     //type id name
      //     //role dept user
      // ]
    }
  },
  watch: {
    rolefilterText(val) {
      this.$refs.roletree.filter(val)
    },
    // choseIndex() {
    //     this.initnowdata();
    // },
    // funlist() {
    //     this.initnowdata();
    // }
    RoleTrees() {
      this.getRoleList()
    },
    userByDepts() {
      this.getnowUserdeptList()
    }
  },
  mounted() {
    this.chosed.forEach((v, index) => {
      console.log(index)
      if (v.type == 'dept') {
        if (!v.data) {
          this.$set(this.chosed[index], 'data', {
            coverage: null
          })
        }

        if (!this.deptWithSon) {
          if (v.id == '1') {
            
            
            if (!v.data || !v.data.coverage) {
              this.$set(this.chosed[index], 'data', {
                coverage: 'n'
              }) 
            }
          }
        }
      }
    })

    // setTimeout(() => {
    //      this.choseShowItemOpen=true;
    // }, 100);

    this.showItem = [] 
    console.log('this.whitelist', this.whitelist)
    console.log('this.blacklist', this.blacklist)
    for (let i = 0; i < this.whitelist.length; i++) {
      const ele = this.whitelist[i]
      let hasfind = false
      for (let k = 0; k < this.blacklist.length; k++) {
        if (this.blacklist[k] == ele) {
          hasfind = true 
          break
        }
      }
      if (!hasfind) {
        this.showItem.push(ele)
      }
    }
    console.log('showItem', this.showItem)

    console.log('requireDataList', this.requireDataList)
    console.log('this.userByDepts2')
    console.log(this.userByDepts)
    if (this.userByDepts.length == 0) {
      this.getUserByDeptData().then(res => {
        this.getnowUserdeptList()
      })
    } else {
      this.getnowUserdeptList()
    }
    if (this.RoleTrees.length == 0) {
      this.GetRoleTree().then(res => {
        setTimeout(() => {
          this.getRoleList()
        }, 300)
      })
    } else {
      this.getRoleList()
    }

    this.getFunList()
  },
  computed: {
    ...mapState({
      userByDepts: state => state.contact.userByDepts,
      RoleTrees: state => state.contact.RoleTrees
      //  messageReadedList: state => state.employee.messageReadedList,
    }),

    ...mapGetters([
      'requireDataList'
    ])
  },
  methods: {

    ...mapActions([
      'GetRoleTree',
      'getUserByDeptData'
    ]),

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    tabshow(str) {
      // this.showItem.indexOf(str)
      return this.showItem.some(v => {
        return v == str
      })
    },
    canformList(requireDataList) {
      const list = []
      requireDataList.forEach(ele => {
        if (['chose-depts', 'chose-users', 'chose-contact'].indexOf(ele.type) != -1) {
          list.push(ele) 
        }
      })
      return list
    },

    addformif(item) {
      this.$prompt('请输入条件简称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '条件名称不可为空',
        inputPlaceholder: '输入条件简称，比如 表单项目是xx 跳到xx',
        inputValidator: (val) => {
          return !!val
        }
      }).then(({
        value
      }) => {
        this.chosed.push({
          type: 'formif',
          id: Date.parse(new Date()) / 1000 + '' + Math.ceil(Math.random() * 99999),
          name: value,
          data: null
        })
      }).catch(() => {

      })

      // this.chosed.push({
      //     type: 'formif',
      //     id: item.key,
      //     name: item.name,
      //     data: item.type
      // })
    },

    addform(item) {
      this.chosed.push({
        type: 'form',
        id: item.key,
        name: item.name,
        data: item.type
      })
    },
    addfun(item) {
      let data = {}
      if (item.id == 'Super') {
        data = {
          chosetype: 'creater',
          findtype: 'tree',
          roles: [],
          depts: []
        }
      }
      if (item.id == 'SuperByLastUser=role') {
        data = {
          roles: []
        }
      }
      if (item.id == 'SuperByLastUser=dept') {
        data = {
          depts: []
        }
      }

      this.chosed.push({
        type: 'fun',
        id: item.id,
        name: item.label,
        data: data
      })
    },
    addtogroup() {
      this.$emit('on-addgroup-click', {
        chosed: this.chosed
      })
      this.chosed = []
      this.whenChosedChange()
    },
    change_role_tree(e) {
      // console.log(e);
      this.change_tree(this.$refs.roletree.getCheckedNodes(), 'role')
      return
      this.change_tree(e, 'role')
    },
    change_fun_tree(e) {
      this.change_tree(this.$refs.conditionstree.getCheckedNodes(), 'fun')
      return
      this.change_tree(e, 'fun')
    },
    change_tree(e, type) {
      console.log(e)
      
      for (let i = 0; i < e.length; i++) {
        const ele = e[i]
        if (ele.children) continue
        // if (!ele.nodeKey) continue
        let hasfind = false
        for (let k = 0; k < this.chosed.length; k++) {
          const elek = this.chosed[k]
          if (elek.type != type) continue

          if (ele.id == elek.id) {
            hasfind = true
            break
          }
        }
        
        if (!hasfind) {
          this.chosed.push({
            type: type,
            id: ele.id,
            name: ele.label
          })
        }
      }

      console.log(this.chosed)

      
      for (let k = this.chosed.length - 1; k >= 0; k--) {
        const elek = this.chosed[k]

        if (elek.type != type) continue
        let hasfind = false
        for (let i = 0; i < e.length; i++) {
          const ele = e[i]
          if (ele.children) continue
          // if (!ele.nodeKey) continue
          if (ele.id == elek.id) {
            hasfind = true
            break
          }
        }
        if (!hasfind) {
          
          this.chosed.splice(k, 1)
        }
      }
    },
    
    change_nowshow(item) {
      console.log(item)
      if (item.checked) {
        
        this.addtochecked(item.type, item.id, item.name)
      } else {
        //
        this.deletetochecked(item.type, item.id, item.name)
      }
    },
    addtochecked(type, id, name) {
      let hasfind = false
      
      for (let i = 0; i < this.chosed.length; i++) {
        const ele = this.chosed[i]
        if (ele.type == type && ele.id == id) {
          hasfind = true
          break
        }
      }
      if (!hasfind) {
        const insert = {
          type: type,
          id: id,
          name: name,
          data: null
        }
        if (type == 'dept') {
          insert.data = {
            coverage: null
          }
          if (id == '1') {
            insert.data = {
              coverage: 'n'
            }
          }
        }
        this.chosed.push(insert)
      }
    },
    deletetochecked(type, id) {
      for (let i = 0; i < this.chosed.length; i++) {
        const ele = this.chosed[i]
        if (ele.type == type && ele.id == id) {
          this.chosed.splice(i, 1)
          break
        }
      }
    },

    deletechosed(index) {
      //
      this.chosed.splice(index, 1)
      this.whenChosedChange()
    },
    
    whenChosedChange() {
      console.log('whenChosedChange')
      
      this.nowshowlist = this.before_nowshowlist(this.nowshowlist)
      
      this.getRoleList()
      this.getFunList()
    },

    searchname() {
      this.tabname = 'dept_user'
      if (!this.searchkey) {
        return
      }
      
      const arr = this.find_f_bysearch(this.searchkey, this.userByDepts)
      const back = this.unique_group_by_key(arr, 'id')
      this.nowshowlist = this.before_nowshowlist(back.unique)
    },
    checkhasinChosed(item, type) {
      for (let i = 0; i < this.chosed.length; i++) {
        const ele = this.chosed[i]
        // console.log(item.type)
        if (ele.type == type) {
          if (type == 'role' && item._uuid == ele.id) {
            return true
          }
          if (type == 'fun' && item.v == ele.id) {
            return true
          }
        }
      }
      return false
    },
    before_nowshowlist(list) {
      
      console.log('this.chosed', this.chosed)

      for (let k = 0; k < list.length; k++) {
        const ele2 = list[k]
        ele2.checked = false
        for (let i = 0; i < this.chosed.length; i++) {
          const ele = this.chosed[i]
          if (ele2.type == ele.type && ele2.id == ele.id) {
            ele2.checked = true
          }
        }
      }
      return list
    },

    unique_group_by_key(data, key) {
      let obj = {},
        arr = []
      for (var a = 0; a < data.length; a++) {
        if (!obj[data[a][key]]) {
          obj[data[a][key]] = [data[a]]
          arr.push(data[a])
        } else {
          obj[data[a][key]].push(data[a])
        }
      }

      return {
        unique: arr,
        group: obj
      }
    },

    find_f_bysearch(name, list) {
      let arr = []

      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        if (!!ele.deptname && ele.deptname.indexOf(name) != -1) {
          arr.push({
            type: 'dept',
            name: ele.deptname,
            id: ele._uuid,
            checked: false
          })
        }
        if (!!ele.username && ele.username.indexOf(name) != -1) {
          arr.push({
            type: 'user',
            name: ele.username,
            id: ele._uuid,
            checked: false
          })
        }

        if (ele.children) {
          arr = arr.concat(this.find_f_bysearch(name, ele.children))
        }
      }

      return arr
    },

    // ok() {
    //     this.$Message.info('Clicked ok')
    // },
    // cancel() {
    //     this.$Message.info('Clicked cancel')
    // },
    toChildren(item) {
      this.navlist.push({
        id: item.id,
        name: item.name
      })
      console.log('this.navlist')
      console.log(this.navlist)
      this.getnowUserdeptList()
    },
    navclick(start) {
      // /->0
      
      // console.log(this.navlist);
      if (this.navlist.length != start) {
        this.navlist.splice(start, this.navlist.length - start)
      }

      this.getnowUserdeptList()
    },
    
    find_f_inlist(list, id) {
      // console.log(list);
      //  console.log(id);
      //  return;

      
      if (id == '1') return list
      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        console.log(ele._uuid + '=' + id)
        if (id == ele._uuid) {
          return ele.children
        }
      }

      for (let i = 0; i < list.length; i++) {
        const ele = list[i]
        if (!!ele.children && ele.children.length > 0) {
          const back = this.find_f_inlist(ele.children, id)
          if (back.length > 0) return back
        }
      }
      return []
    },
    getnowUserdeptList() {
      let children = []

      if (this.navlist.length == 0) {
        console.log('this.userByDepts')
        console.log(this.userByDepts)
        // children = this.userByDepts;
        
        children = [{
          children: this.userByDepts,
          deptname: '全公司',
          parent_id: 0,
          _uuid: '1'
        }]
      } else {
        
        console.log('this.navlist[this.navlist.length - 1].id')
        console.log(this.navlist[this.navlist.length - 1].id)
        children = this.find_f_inlist(this.userByDepts, this.navlist[this.navlist.length - 1].id)
        console.log('children', children)
      }

      
      const arr = []
      for (let i = 0; i < children.length; i++) {
        const ele = children[i]

        if (ele.deptname) {
          arr.push({
            type: 'dept',
            name: ele.deptname,
            children: ele.children,
            id: ele._uuid,
            checked: false
          })
        }
        if (ele.username) {
          arr.push({
            type: 'user',
            name: ele.username,
            id: ele._uuid,
            checked: false
          })
        }
      }

      // if (this.navlist.length == 0) {
      //     arr = [{
      //         type: 'dept',
      
      //         children: arr,
      //         id: 0,
      //         checked: false
      //     }];
      // }

      this.nowshowlist = this.before_nowshowlist(arr)
    },
    getFunList() {
      const arr = []
      this.funs.forEach(fun => {
        arr.push({
          id: fun.v,
          label: fun.n,
          tip: fun.t,
          checked: this.checkhasinChosed(fun, 'fun')
        })
      })
      this.funlist = arr
    },
    getRoleList() {
      
      console.log('RoleTrees改变了')
      console.log(this.RoleTrees)

      this.role_checked_keys = []

      const arr = []
      for (let i = 0; i < this.RoleTrees.length; i++) {
        const ele = this.RoleTrees[i]

        const son_arr = []
        if (ele.children) {
          for (let k = 0; k < ele.children.length; k++) {
            const elek = ele.children[k]
            // elek.type='role';
            const item =
                        {
                          id: elek._uuid,
                          label: elek.rolename,
                          checked: this.checkhasinChosed(elek, 'role')
                        }

            son_arr.push(item)

            if (item.checked) {
              this.role_checked_keys.push(elek._uuid)
            }
          }
        }

        arr.push({
          id: ele._uuid,
          label: ele.groupname,
          children: son_arr,
          disableCheckbox: true,
          expand: true,
          disabled: true
        })
      }

      console.log('rolelist', arr)

      this.rolelist = arr
    }

  }
}
</script>
