<template>
<div>
    <el-card>

           <el-form-item  v-if="sync_value.length==0">未指派给任何人权限</el-form-item>

        <div style="position: relative;    border-bottom: 1px #9E9E9E solid;
    margin-bottom: 10px;" v-for="(item,index) in sync_value" :key="index">



            <div class="index">{{index+1}}</div>
            <div class="romove">
                <el-button @click="removeItem(sync_value,index)" icon="el-icon-delete"></el-button>
            </div>

            <el-form-item label="允许权限">
                <el-select clearable multiple style="width:330px" v-model="item.allow" placeholder="请选择">
                    <el-option label="查看" value="watch" />
                    <el-option label="撤回" value="revoke" />
                     <el-option label="重发消息" value="resend" />
                    <el-option label="取消" value="cancel" />
                    <el-option label="导出" value="export" />
                </el-select>
            </el-form-item>

            <el-form-item label="参与员工">
                <chose-contact-group-modal :whitelist="['dept_user','role']" :dept-with-son="true" test-type="onlyspread" :with-advance-set="false" :group-list="item.deptuser"></chose-contact-group-modal>

            </el-form-item>

             <el-form-item label="管理部门">
                 <el-select filterable v-model="item.admindept" multiple placeholder="为空默认为<全公司>">
                            <el-option v-for="item in DeptTree" :key="item.id" :label="item.label" :value="item.id" />
                        </el-select>
                        <span style="font-size:12px;color:red">此项目一般和运行作用域关联
                             <el-tooltip
                  slot="append"
                  effect="light"
                  content="比如创建者是A公司x部门,那么设置成全公司或A公司或x部门都可以看到此流程"
                  placement="top-start"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
            
                        </span>

            </el-form-item>

        </div>
        <el-form-item>
            <el-button @click="addvalue" type="primary" icon="el-icon-plus" size="mini">添加权限组</el-button>
        </el-form-item>
    </el-card>
</div>
</template>

<script>
import propsync from 'vue-propsync'
import ChoseContactGroupModal from './chose-contact/chose-contact-group-modal'
// import ChoseUser from './CChoseUser'

import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'

export default {
    name: 'FlowPermission',
    mixins: [propsync],
    components: {
        ChoseContactGroupModal
        // ChoseUser
    },
    props: {
        value: {
            type: Array,
            default: () => {
                return [
                    // {
                    
                    // deptuser: [],
                    // admindept:[]
                    // }
                ]
            },
            isSync: true
        },
    },
    data() {
        return {
                DeptTree: [] 
            // dayinmonth:()=>{
            //     let arr=[];
            //     for(let i=1;i<=31;i++){
            //         arr.push(i);
            //     }
            //     return arr;
            // }

        }
    },
    mounted() {

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

    },
    computed: {
        ...mapGetters([
            'requireDataList'
        ]),
           ...mapState({
            userByDepts: state => state.contact.userByDepts
        })

    },
    methods: {
         ...mapActions([
            'getUserByDeptData'
        ]),

        minutesto(time) {
            if (!time) return 0;
            let arr = time.split(':')

            if (arr.length == 2) {
                return Number(arr[0]) * 60 + Number(arr[1]);
            }

            return 0;

        },
        addvalue() {
            this.sync_value.push({
                allow:[],
                    deptuser: [],
                    admindept:[]
            });
        },

        removeItem(list, index) {
            list.splice(index, 1);
        },

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

<style scoped>
.index,
.romove {
    background-color: #00b0ff;
    position: absolute;
    color: white;
    border-radius: 50%;
    line-height: 30px;
    text-align: center;
    font-weight: bolder;
    top: 2px;
}

.index {
    height: 30px;
    width: 30px;
}

.romove {
    right: 10px;
    z-index: 3;
}
</style>
