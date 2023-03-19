<template>
<div>
    <treeselect :placeholder="placeholder" :disable-branch-nodes="true" @input="inputhander" ref="myTree" v-if="!disabled" :value-consists-of="LEAF_PRIORITY" v-model="users" :multiple="true" :options="multipleDeptTree" />
    <div v-else>
        <span v-if="sync_value.length==0">无</span>
        <span v-for="(item,key) in sync_value" :key="key" class="usertag">{{item.name}}
        </span>
    </div>

</div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import {
    mapState,
    mapActions
} from 'vuex'

import propsync from 'vue-propsync'

export default {
    name: 'choseUsers',
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
            type: Array,
            default: () => {
                return []
            },
            isSync: true
        },
        disabled: {
            type: Boolean,
            default: () => {
                return false;
            }
        },

         placeholder:{
            type:String,
            default:()=>{
                return '请选择人员'
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
            multipleDeptTree: [],
            LEAF_PRIORITY: 'LEAF_PRIORITY',
            users: []
        }
    },
    watch: {
        users: function () {
            let list = [];
            this.users.forEach(ele => {

                let arr = ele.split('__');

                if (arr.length > 1) {
                    list.push({
                        id: arr[1],
                        name: arr[2],
                        deptid: arr[0]
                    })
                }

            })

            // for (let i = this.users.length - 1; i >= 0; i++) {
            //     let arr = this.users[i].split('__');
            //     if (arr.length == 1) {
            //         this.users.slice(i, 1);
            //         console.log(this.users)
            //     }
            // }

            this.sync_value = list;
            //
            // this.emitinput(this.sync_value);
            // setTimeout(() => {
            //       this.emitinput(this.sync_value);
            // }, 10);

        }
    },

    mounted() {
        if (this.disabled) return;
        let users = [];
        
        if(this.sync_value.constructor!=Array)this.sync_value=[];
        
        for (let i = 0; i < this.sync_value.length; i++) {
            const ele = this.sync_value[i];
            users.push(
                ele.deptid + '__' + ele.id + '__' + ele.name
            );
        }
        this.users = users;

        if (this.disabled) {
            return;
        }

        if (this.userByDepts.length == 0) {
            this.getUserByDeptData().then(res => {
                //this.singleDeptTree = this.getnowUserdeptList(this.userByDepts, 'single')
                // console.log('this.singleDeptTree',this.singleDeptTree)
                this.multipleDeptTree = this.getnowUserdeptList(this.userByDepts, 'multiple')
            })
        } else {
            //this.singleDeptTree = this.getnowUserdeptList(this.userByDepts, 'single')
            // console.log('this.singleDeptTree',this.singleDeptTree)
            this.multipleDeptTree = this.getnowUserdeptList(this.userByDepts, 'multiple')
        }

    },
    methods: {
        ...mapActions([
            'getUserByDeptData',
            // 'ChangeUser'
        ]),
        inputhander(){
               //
           
            setTimeout(() => {
                  this.emitinput(this.sync_value);
            }, 10);

             setTimeout(() => {
                  this.emitinput(this.sync_value);
            }, 20);

    
        },

        emitinput(val) {

            let myTree = this.$parent || this.$root;
            console.log(myTree);
            window.myTree = myTree;
            if (myTree.unFristRender) {
                myTree.$emit.apply(myTree, ['el.form.change'].concat(val));
            } else {
                myTree.unFristRender = true;
            }

            //  console.log(parent);
            //    let name = parent.$options.componentName;
            //        console.log(name);
            //          console.log(val);
            //          parent.$emit('input',val)
            //   parent.$emit.apply(parent, ['el.form.input'].concat(val));
            //parent

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
                        id: deptid + '__' + ele._uuid + '__' + ele.username, //
                        label: (!!deptname ? '<' + deptname + '>' : '') + ele.username
                    })
                }
            }
            return arr
        },
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
