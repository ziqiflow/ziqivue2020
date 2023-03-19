<template>
<div v-loading="loading">
    <el-alert v-if="!!error" :title="error" :closable="false" type="error" />
    <div v-else>
        <treeselect style="line-height: 35px;" :disable-branch-nodes="true" :value-consists-of="LEAF_PRIORITY" v-model="sync_value" :multiple="false" :options="singleDeptTree" placeholder="请输入要切换人的姓名" />
    </div>
</div>
</template>

<script>
// import ChoseContact from '_c/chose-contact/chose-contact-group-modal'
// import treeTable from '@/components/TreeTable'
import propsync from 'vue-propsync'

import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'

import {ChangeUser} from "@/api/login"

import {
    setToken
} from '@/utils/auth';

// import {
//   ChoseContact
// } from './CChoseContact'

export default {
    name: 'Contacts',
    mixins: [propsync],
    components: {
        // ChoseContact
        // treeTable
        Treeselect
    },
    props: {
        value: {
        type: String,
        default: () => {
            return null
        },
        isSync: true
        },
    },
    data() {
        return {
            loading: false,
            error: null,
            tabtype: 'dept',
            // nowuserid: null,
            singleDeptTree: [],
            LEAF_PRIORITY: 'LEAF_PRIORITY',
            deptcolumns: [{
                    text: '部门名称',
                    value: 'deptname',
                    width: '250px'
                }, {
                    text: '员工名称',
                    value: 'username',
                    width: '100px'
                },
                {
                    text: '员工工号',
                    value: 'userjobid',
                    width: '80px'
                }
            ]
        }
    },
    computed: {
        ...mapState({
            userByDepts: state => state.contact.userByDepts
        })
    },
    methods: {
        ...mapActions([
            'GetRoleTree',
            'getUserByDeptData',
            // 'ChangeUser'
        ]),
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
                        label: (!!deptname ? '<' + deptname + '>' : '') + ele.username
                    })
                }
            }
            return arr
        },
        initUserList() {

            this.userList = [];

            this.userByDepts.forEach(element => {
                //if(element.type=="user")
                this.userList.push(element);

            });

        },

        changetouser(userid) {

            if (!userid) {
                alert('用户名编号不可为空');
                return;
            }

            let arr = userid.split('__');

            ChangeUser({
                userid: arr[1]
            }).then(({
                data: res
            }) => {
                
                console.log(res, 'res');
                
                if (!res.success) {
                    this.$message.error(res.msg);
                    return;
                }
                setToken(res.data.token, window.env[window.envname].CookieTokenKey);
                //window.location.href=window.testUrl;
                window.history.go(0);
            })

        },

        importDataFormDingtalk(type = 'dept') {
            this.loading = true
            GetDataFormDingtalk(type).then(({
                data: res
            }) => {
                // if(res.success){
                this.loading = false
                if (res.success) {
                    this.$message.success(res.msg)
                } else {
                    this.$message.error(res.msg)
                }

                // }
                console.log(res)
            })
        }

    },
    activated() {
        console.log('activated')
    },
    mounted() {
        if (this.userByDepts.length == 0) {
            this.getUserByDeptData().then(res => {
                this.singleDeptTree = this.getnowUserdeptList(this.userByDepts, 'single')
            })
        } else {
            this.singleDeptTree = this.getnowUserdeptList(this.userByDepts, 'single')
        }
    }
}
</script>

<style>
</style>
