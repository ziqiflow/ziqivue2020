<template>
<div>
    <el-card v-loading="loading" class="box-card">

        <el-alert v-if="!!error" :title="error" :closable="false" type="error" />
        <div v-else>
            内部联系人管理<br>
            <el-button @click="importDataFormDingtalk('dept')">第一步：企业云oa <- 同步到 <- 钉钉 （部门信息）</el-button> <br>
                    <el-button @click="importDataFormDingtalk('role')">第二步：企业云oa <- 同步到 <- 钉钉 （角色+角色组信息）</el-button> <br>
                            <el-button @click="importDataFormDingtalk('user')">第三步：企业云oa <- 同步到 <- 钉钉 （员工信息） </el-button> <hr>
                                    <el-tooltip effect="light" content="当对员工，部门，角色进行修改后，点击此处进行重新生成缓存数据" placement="top-start">
                                        <el-button @click="UserDeptRoleStoreDataRest" type="warning">重新生成缓存数据</el-button>
                                    </el-tooltip>

                                    <div>

                                        <el-tabs v-if="!loading" v-model="tabtype">
                                            <el-tab-pane label="组织架构" name="dept">
                                                <tree-table :expand-all="true" 
                                                row-key='_uuid'
                                                :columns="deptcolumns" :data="userByDepts">

                                                    <el-table-column label="角色" width="200">
                                                        <template slot-scope="{row}">
                                                            <span  v-if="row.type=='user'">

                                                              <span v-if="row.roles.length">

                                                                  <span v-for="(role,index) in row.roles" :key="role._uuid">
                                                                    {{role.rolename}}
                                                                    <span v-if="row.roles.length-1!=index">|</span>
                                                            </span>

                                                            </span>

                                                            </span>

                                                        </template>
                                                    </el-table-column>

                                                    <el-table-column label="操作" width="200">
                                                        <template slot-scope="{row}">
                                                            <el-button v-if="row.type=='user'" @click="SyncFromDingtalkByUserid(row._uuid)" type="text">钉钉同步</el-button>
                                                            <el-button @click="showdetail(row)" type="text">查看</el-button>
                                                        </template>
                                                    </el-table-column>

                                                </tree-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="角色" name="role">
                                                <tree-table                                                 row-key='_uuid' :expand-all="true" :columns="rolecolumns" :data="RoleTrees" />
                                            </el-tab-pane>
                                        </el-tabs>

                                    </div>

        </div>

    </el-card>
</div>
</template>

<script>
// import ChoseContact from '_c/chose-contact/chose-contact-group-modal'
import treeTable from '@/components/TreeTable'
import {
    GetDataFormDingtalk,
    GetRoleTree,
    getUserByDeptData,
    SyncFromDingtalkByUserid,
    UserDeptRoleStoreDataRest
} from '@/api/contacts'

import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'

// import {
//   ChoseContact
// } from './CChoseContact'

export default {
    name: 'Contacts',
    components: {
        // ChoseContact
        treeTable
    },

    data() {
        return {
            loading: false,
            error: null,
            tabtype: 'dept',
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
            ],
            rolecolumns: [{
                    text: '组名称',
                    value: 'groupname',
                    width: '150px'
                },
                {
                    text: '角色名称',
                    value: 'rolename',
                    width: '150px'
                }, {
                    text: '员工名',
                    value: 'username',
                    width: '150px'
                },

                {
                    text: '员工工号',
                    value: 'userjobid',
                    width: '150px'
                }
            ]
        }
    },
    computed: {
        ...mapState({
            userByDepts: state => state.contact.userByDepts,
            RoleTrees: state => state.contact.RoleTrees
            //  messageReadedList: state => state.employee.messageReadedList,
        })
    },
    methods: {
        ...mapActions([
            'GetRoleTree',
            'getUserByDeptData'
        ]),

        UserDeptRoleStoreDataRest() {
            this.loading = true;
            UserDeptRoleStoreDataRest().then(({
                data: res
            }) => {

                this.loading = false
                if (res.success) {
                    this.$message.success(res.msg)
                    //window.history.go(0)
                } else {
                    this.$message.error(res.msg)
                }

            })

        },

        showdetail(row) {
            
            let strhtml = '';
            if (row.type == 'dept') {
                strhtml = '<strong>' + row.deptname + '</strong>';
            }

            if (row.type == 'user') {

                strhtml = '<strong>' + row.username + '</strong>';

            }
            this.$alert(strhtml + '<br>' + '内部id号：' + row._uuid, '详细', {
                dangerouslyUseHTMLString: true
            });
        },

        SyncFromDingtalkByUserid(uuid) {

            this.loading = true;
            SyncFromDingtalkByUserid({
                uuid: uuid
            }).then(({
                data: res
            }) => {

                this.loading = false
                if (res.success) {
                    this.$message.success(res.msg)
                    //window.history.go(0)
                } else {
                    this.$message.error(res.msg)
                }
                console.log(res)
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
                    window.history.go(0)
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
            this.getUserByDeptData().then()
        }
        if (this.RoleTrees.length == 0) {
            this.GetRoleTree().then(res => console.log(res))
        }

        setTimeout(() => {
            console.log(this.RoleTrees)
        }, 3000)
    }
}
</script>

<style>
</style>
