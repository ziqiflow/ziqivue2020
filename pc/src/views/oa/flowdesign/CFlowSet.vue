<template>
<div class="flowset">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>全局设置</span>
        </div>

        <div>
            <el-form label-width="150px">

                <divider title="名称/文号"></divider>

                <flow-work-name v-model='flowset.workname'> </flow-work-name>

                <div>
                    <divider title="显示表单配置"></divider>
                    <el-alert title="未设置的情况下会以只读的方式显示已填写的数据,应用于查看流程信息（包含通知，抄送）（默认为只读）" :closable="false" type="warning"></el-alert>
                    <form-limit usetype="read" v-model="flowset.formEditLimit"></form-limit>
                </div>

                <div>
                    <divider title="权限设置"></divider>
                    <div>
                        <flow-permission v-model="flowset.permissions"></flow-permission>
                    </div>
                </div>

                <div>
                    <divider title="运行作用域"></divider>
                    <el-form-item label="部门Root：">
                        <el-select filterable v-model="flowset.runRoots" multiple placeholder="默认是组织架构最高层<全公司>">
                            <el-option v-for="item in DeptTree" :key="item.id" :label="item.label" :value="item.id" />
                        </el-select>
                        匹配Root模式
                        <el-select v-model="flowset.runRoottype" placeholder="默认模式是流程创建者">
                            <el-option label="流程创建者" value="creater" />
                            <el-option label="按上一节点提交者" value="lastuser" />
                        </el-select>

                        <el-alert :closable="false" class="mg-t5" type="error" title="*什么是部门ROOT?">
              部门Root是指该流程运行的组织架构中的环境；默认是全公司；
                            <br>
              比如组织架构上总公司->A分公司。
              那么由A分公司员工创建的流程只在A分公司下; <br>
              也可以在局部流程节点上设置。

            </el-alert>

                            <el-alert :closable="false" class="mg-t5" type="error" title="*什么是匹配Root模式?">
              匹配模式是指在计算下一个节点接收人的时候，按创建者所在的部门计算 还是 上一个流程接受者所在的流程计算<br>
              比如现有流程：A(属于宁波公司)->B(属于宁波公司)->C(属于杭州公司)，如果按创建者所在部门计算，那么C下一步的条件会在宁波公司下选人；如果是按上一审核人所在部门计算，那么C下一步的条件会在杭州公司下选人
              
            </el-alert>
                    </el-form-item>

                </div>

                <div>

                    <divider title="外部流程设置"></divider>
                    <el-form-item label="可作为外部流程">

                        <el-switch v-model="flowset.canBeSonFlow">
                        </el-switch>

                    </el-form-item>

                    <el-card v-if="flowset.canBeSonFlow">

                        <el-form-item label="外部流程的接受者">

                            <chose-contact-group-modal :whitelist="['dept_user','role','conditions']" test-type="spread" :dept-with-son="false" :with-advance-set="true" :group-list="flowset.dealers"></chose-contact-group-modal>

                        </el-form-item>

                        <el-form-item label="执行方式">

                            <el-select v-model="flowset.dealtype" size="small">
                                <el-option v-for="item in dealtypelist" :label="item.n" :value="item.v" :key="item.v">{{ item.n }}</el-option>
                            </el-select>

                        </el-form-item>

                        <el-form-item label="执行时效">

                            <el-select v-model="flowset.timeexpired" size="small">
                                <el-option v-for="item in exectimelist" :label="item.n" :value="item.v" :key="item.v">{{ item.n }}</el-option>
                            </el-select>

                        </el-form-item>

                    </el-card>
                </div>

                <div>
                    <divider title="提醒创建"></divider>

                    <el-form label-width="150px">

                        <el-form-item label="可提醒创建">
                            <el-switch v-model="flowset.canautoalert">
                            </el-switch>
                            <span style="font-size:12px;color:red">
                                    会自动发通知给创建人，要求创建人创建。提醒人不易太多；
                                </span>

                        </el-form-item>
                        <div v-if="flowset.canautoalert">
                            <flow-auto-alert v-model="flowset.autoalerts"></flow-auto-alert>
                        </div>
                    </el-form>

                </div>

            </el-form>
        </div>

    </el-card>

</div>
</template>

<style>

</style>

<style scoped>
</style>

<script>
import Divider from './CDivider'
import ChoseContactGroupModal from './chose-contact/chose-contact-group-modal'
import FormLimit from './CFormLimit'

import FlowAutoAlert from './CFlowAutoAlert'
import FlowPermission from './CFlowPermission'
import FlowWorkName from './CFlowWorkName'

import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'

export default {
    name: 'FlowSet',
    components: {
        Divider,
        ChoseContactGroupModal,
        FormLimit,
        FlowAutoAlert,
        FlowPermission,
        FlowWorkName
    },
    computed: {
        ...mapState({
            flowset: state => state.flowdesign.set,
            userByDepts: state => state.contact.userByDepts
        })
    },
    data() {
        return {
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
            dealtypelist: [{
                n: '或签',
                v: 'orsign'
            }, {
                n: '会签',
                v: 'andsign'
            }],
            DeptTree: [] 

        }
    },
    mounted() {
        console.log('flowset', this.flowset)

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

        if (!this.flowset.autoalerts) {
            this.flowset.autoalerts = [{
                type: 'month',
                month: null, 
                week: null, 
                day: null, 
                time: null, 
                deptuser: [],
                disminutes: null
                //Distance minutes
            }];
        }

        if (!this.flowset.workname) {
            this.flowset.workname = {
                auto_len: 3,
                auto_name: '{Y}{M}{D}{H}{I}{S}{RUN}',
                auto_step: 1
            };
        }

    },
    methods: {
        ...mapActions([
            'getUserByDeptData'
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
