<template>
  <div>
    <div v-if="!disabled">
      <el-select v-model="deptids" :placeholder="placeholder" multiple clearable filterable>
        <el-option v-for="item in DeptTree" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
    </div>

    <div v-else>

      <span v-for="(item,index) in sync_value" :key="index" class="usertag">
        {{ item.name }}
      </span>
      <span v-if="sync_value.length==0">无</span>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'

import propsync from 'vue-propsync'

export default {
  name: 'ChoseDepts',
  components: {},
  mixins: [propsync],
  computed: {
    ...mapState({
      userByDepts: state => state.contact.userByDepts
    })
  },
  watch: {
    // sync_value: function () {
    //     this.deptids = [];
    //     this.sync_value.forEach(ele => {
    //         this.deptids.push(ele.deptid);
    //     });
    //     console.log('deptids',this.deptids);

    // },
    deptids: function() {
      // return;
      const list = []
      this.deptids.forEach(ele => {
        for (let k = 0; k < this.DeptTree.length; k++) {
          const dept = this.DeptTree[k]

          if (ele == dept.id) {
            list.push({
              name: dept.label,
              deptid: dept.id
            })
            break
          }
        }
      })
      this.sync_value = list

      this.$emit('input', this.sync_value)
    }
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      },
      isSync: true
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return '请选择部门'
      }
    }

    

    // users: {
    //     type: Array,
    //     default: () => {
    //         return []
    //     }
    // }
  },
  data() {
    return {
      DeptTree: [],
      deptids: []
    }
  },
  mounted() {
    if (this.disabled) return
    
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

    
    this.deptids = []
    if (typeof this.sync_value === 'string') {
      this.sync_value = []
    }
    this.sync_value.forEach(ele => {
      this.deptids.push(ele.deptid)
    })
  },
  methods: {
    ...mapActions([
      'getUserByDeptData'
      // 'ChangeUser'
    ]),

    copyobject(obj) {
      return JSON.parse(JSON.stringify(obj))
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

<style>
.usertag {
    border: 1px solid #bbbbbb;
    padding: 3px;
    border-radius: 5px;
    margin: 5px;
    word-break: keep-all;
}
</style>
