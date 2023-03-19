<template>
<div>
    <treeselect :value-consists-of="LEAF_PRIORITY" v-model="user" :multiple="false" :options="singleDeptTree" placeholder="请输入人员" />
</div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import {
    mapState,mapActions
} from 'vuex'

import propsync from 'vue-propsync'

export default {
    name: 'choseUser',
        mixins: [propsync],
    components: {
        Treeselect
    },
    computed: {
        ...mapState({
            userByDepts: state => state.contact.userByDepts
        })
    },
    props: {
         value: {
            type: Object,
            default: () => {
                return {deptid:null,userid:null}
            },
            isSync: true
        }
    },
    data() {
        return {
            singleDeptTree: [],
            LEAF_PRIORITY: 'LEAF_PRIORITY',
            user:null
        }
    },
    watch:{
      user:function () {
          if(!this.user){
            return;
          }
          let arr= this.user.split('__');
          this.sync_value.deptid=arr[0];
          this.sync_value.userid=arr[1];
        
      }
    },
    
    mounted() {
        //deptuser
        
        if(!this.sync_value){
            this.sync_value={deptid:null,userid:null,deptname:null,username:null}
        }

        if(!!this.sync_value.deptid&&!!this.sync_value.userid){
            this.user=this.sync_value.deptid+'__'+this.sync_value.userid;
        }

        console.log('user',this.user);


        if (this.userByDepts.length == 0) {
            this.getUserByDeptData().then(res => {
                this.singleDeptTree = this.getnowUserdeptList(this.userByDepts, 'single')
                // console.log('this.singleDeptTree',this.singleDeptTree)
                //this.multipleDeptTree = this.getnowUserdeptList(this.userByDepts, 'multiple')
            })
        } else {
            this.singleDeptTree = this.getnowUserdeptList(this.userByDepts, 'single')
            // console.log('this.singleDeptTree',this.singleDeptTree)
            //this.multipleDeptTree = this.getnowUserdeptList(this.userByDepts, 'multiple')
        }

    },
    methods:{
          ...mapActions([
            'getUserByDeptData',
            // 'ChangeUser'
        ]),
        getnowUserdeptList(list,type,deptid='1',deptname='') {
            
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
                            newobj.children = this.getnowUserdeptList(ele.children,type,ele._uuid,ele.deptname)
                        } else {
                            continue
                        }
                    }
                    arr.push(newobj)
                }
                if (ele.username) {
                    arr.push({
                        id: deptid+'__'+ele._uuid,//+'__'+ele.username,//
                        label: (!!deptname?'<'+deptname+'>':'')+ele.username
                    })
                }
            }
            return arr
        },
    }
}
</script>

<style scope>
</style>
