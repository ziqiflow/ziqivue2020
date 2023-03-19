<template>
<div>
    <el-card class="box-card">

        <el-alert v-if="!!error" :title="error" :closable="false" type="error" />
        <div v-loading="loading" v-else class="box" style="min-height:500px;">
            <div v-if="!loading">
                <div class="buttons">
                    <el-button size="large" type="warning" @click="copyFlow">复制</el-button>
                    <el-button size="large" type="primary" @click="save">保存</el-button>
                </div>
                <H3>{{ designer.name }} 流程设计</H3>
                <br>
                <el-tabs v-model="tabtype">
                    <el-tab-pane label="流程设计" name="flowdesign">
                        <flow-node-manger ref="flownodemanger" />
                    </el-tab-pane>
                    <el-tab-pane label="表单设计" name="form">
                        <fm-making-form v-if="tabtype=='form'" :widget-form.sync="designer.formset" />
                    </el-tab-pane>
                    <el-tab-pane label="属性设置" name="set">
                        <flow-set v-if="tabtype=='set'" />
                    </el-tab-pane>
                    <el-tab-pane label="备注说明区" name="note">
                        <el-form v-if="tabtype=='note'" label-width="80px">
                            <el-form-item label="备注说明">
                                <tinymce :height="300" v-model="designer.remark" />
                            </el-form-item>

                            <el-form-item label="文件附件">
                                <file-list :flowdesignid="designer._id"></file-list>
                            </el-form-item>

                        </el-form>

                    </el-tab-pane>

                </el-tabs>

            </div>
        </div>

    </el-card>
</div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

import {
    FlowdesignsGet,
    FlowDesignSeniorEdit,
    FlowDesignSeniorCopy
} from '@/api/flowdesign'

import FlowNodeManger from './CFlowNodeManger'
import FlowSet from './CFlowSet'
import FileList from './CFileList'


import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'

import {
    getrequireDataList,
    finddatalist
} from '@/utils/u_flowdesign'
import {
    loadJs
} from '../../../utils';

export default {
    name: 'FlowdesignEditSenior',
    components: {
        FlowNodeManger,
        FlowSet,
        Tinymce,
        FileList,
        //ChoseUser
        //,
        // FmMakingForm
    },
    data() {
        return {
            error: null,
            loading: false,
            tabtype: 'flowdesign',
            designer: {
                formset: this.initFormData()
            }
            // widgetForm: null
        }
    },
    computed: {
        widgetForm() {
            return this.designer.formset
        }
    },
    watch: {

        tabtype() {
            if (this.tabtype == 'flowdesign') {
                this.$refs.flownodemanger.ToggleFormLimit();
            }
        },
        widgetForm: {
            deep: true,
            handler: function (val) {
                this.designer.datalist = getrequireDataList(val)
                console.log(this.designer.datalist)
                console.log(JSON.stringify(this.designer.datalist))
            }
        }
    },
    // updated() {

    //    this.$nextTick(() => {
    //     })
    // },
    methods: {

        copyFlow() {

            

            this.$prompt('请输入要复制的流程的id',
                '提示', {
                    confirmButtonText: '确定复制',
                    cancelButtonText: '取消',
                    inputValidator: (val) => {
                        return !!val;
                    },
                    inputPlaceholder: '请输入流程id',
                    inputErrorMessage: '流程id不可为空'
                }).then(({
                value
            }) => {

                this.$confirm('确定复制流程[' + value + ']上的流程数据到当前流程，复制成功后本流程原数据会被覆盖，请谨慎操作', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  
                  
                   FlowDesignSeniorCopy(
                     {
                       nowflowid:this.$route.params.idlist,
                       fromflowid:value
                    }
                   ).then(({
                    data: res
                    }) => {
                        //alert(res.msg)
                        if(res.success){
                          this.$message.success(res.msg);
                          window.location.reload();
                        }else{
                          this.$message.error(res.msg);
                        }

                    })


                  


                }).catch(() => {});

            }).catch(() => {

            });

        },
        ...mapMutations([
            'setformSet',
            'setfunList',
            'setflowSet',
            'setLayOutSet',
            'setfileList'
        ]),
        hasinfunlist(list, id) {
            for (let l = 0; l < list.length; l++) {
                const ele = list[l]
                if (ele.id == id) {
                    return true
                }
            }
            return false
        },
        checkfunId(funId, funlist) {
            console.log(funId)
            if (!funId) return true
            if (typeof funId !== 'object') {
                funId = [funId]
            }
            for (let p = 0; p < funId.length; p++) {
                const funid = funId[p]
                if (!this.hasinfunlist(funlist, funid)) {
                    return funid
                }
            }
            return true
        },
        checkfunlist(funlist) {
            
            

            let startnum = 0
            for (let i = 0; i < funlist.length; i++) {
                const ele = funlist[i]
                for (let i = 0; i < ele.btnGroup.length; i++) {
                    const btn = ele.btnGroup[i]

                    let back = this.checkfunId(btn.defaultFunId, funlist)
                    if (back !== true) {
                        this.$message.error('节点名为【' + ele.name + '】,按键名为：【' + btn.name + '】的跳转流程id：' + back + ' 不存在')
                        return false
                    }
                    console.log(btn.handler)

                    if (btn.handler) {
                        back = this.checkfunId(btn.handler.funId, funlist)
                        if (back !== true) {
                            this.$message.error('节点名为【' + ele.name + '】,按键名为：【' + btn.name + '】的触发跳转流程id：' + back + ' 不存在')
                            return false
                        }
                    }

                    for (let p = 0; p < btn.NextFun.length; p++) {
                        const ntxfun = btn.NextFun[p]

                        const back = this.checkfunId(ntxfun.funId, funlist)
                        if (back !== true) {
                            this.$message.error('节点名为【' + ele.name + '】,按键名为：【' + btn.name + '】的条件判断流程id：' + back + ' 不存在')
                            return false
                        }
                    }
                }

                if (!ele.name) {
                    this.$message.error('节点名称不可为空')
                    return false
                }
                
                if (ele.dealtype == 'andsign') { // ele.
                    if (ele.btnGroup.length == 0) {
                        this.$message.error('节点名为【' + ele.name + '】处理方式为会签，必须要有下一步处理的按键')
                        return false
                    }
                    if (ele.btnGroup.length > 1) {
                        this.$message.error('节点名为【' + ele.name + '】处理方式为会签，处理按键只能有一个，现在设置了多个')
                        return false
                    }
                }
                if (ele.dealtype == 'orsign') {
                    if (ele.btnGroup.length == 0) {
                        this.$message.error('节点名为【' + ele.name + '】处理方式为或签，必须要有下一步处理的按键')
                        return false
                    }
                }

                if (ele.dealtype == 'message') {
                    
                    
                    
                }

                if (ele.is_start) {
                    startnum++
                    

                    if (ele.creatPermission.length == 0) {
                        this.$message.error('节点名为【' + ele.name + '】允许创建人不可为空')
                        return false
                    }
                } else {
                    if (ele.dealers.length == 0) {
                        this.$message.error('节点名为【' + ele.name + '】流程接受者不可为空')
                        return false
                    }

                    if (!ele.dealtype) {
                        this.$message.error('节点名为【' + ele.name + '】执行方式不可为空')
                        return false
                    }

                    if (ele.timeexpired == null) {
                        this.$message.error('节点名为【' + ele.name + '】超时时间不可为空')
                        return false
                    }
                }
            }

            if (startnum == 0) {
                this.$message.error('未设置开始节点')
                return false
            }

            if (startnum > 1) {
                this.$message.error('不可思议，你怎么设置了多个开始节点')
                return false
            }

            return true
            // funlist.forEach(ele=>{
            // })
        },
        save() {
            
            if (!this.checkfunlist(this.designer.funlist)) return
            

            this.designer.layoutset = this.$refs.flownodemanger.getLayoutInfo();

            console.log(this.designer)
            // return;
            FlowDesignSeniorEdit(this.designer).then(({
                data: res
            }) => {
                alert(res.msg)
            })

        },

        handleSubmit() {},
        handleDelete(params) {
            console.log(params)
        },
        initFlowSet() {
            return {
                runRoots: [],
                runRoot: '',
                runRoottype: null,
                canBeSonFlow: false,
                dealers: [],
                timeexpired: null,
                dealtype: 'orsign'
            }
        },
        initFunList() {
            return []
        },
        initFormData() {
            return {
                list: [],
                config: {
                    labelWidth: 120,
                    labelPosition: 'top'
                }
            }
        }
    },
    activated() {
        console.log('activated')
    },
    mounted() {
        loadJs("https://cdn.bootcss.com/tinymce/4.8.0/tinymce.min.js");
        const id = this.$route.params.idlist
        // alert(id);
        if (id) {
            this.loading = true
            
            FlowdesignsGet({
                _id: id
            }).then(({
                data: req
            }) => {
                this.loading = false
                if (req.success) {
                    if (!req.data) {
                        this.error = '没有查询到对应的流程'
                        return
                    }
                    this.designer = req.data
                    if (!this.designer.formset) {
                        this.designer.formset = this.initFormData()
                    }
                    console.log('this.designer.formset')
                    console.log(this.designer.formset)
                    if (!this.designer.funlist) {
                        this.designer.funlist = this.initFunList()
                    }
                    if (!this.designer.set) {
                        this.designer.set = this.initFlowSet()
                    }
                    if (!this.designer.layoutset) {
                        this.designer.layoutset = []
                    }

                    if (!this.designer.remark) {
                        this.designer.remark = ''
                    }

                    if (!this.designer.fileList) {
                        this.designer.fileList = []; 
                    }

                    this.setflowSet(this.designer.set)
                    this.setformSet(this.designer.formset) 
                    this.setfunList(this.designer.funlist)
                    console.log('this.designer.layoutset', this.designer.layoutset);
                    this.setLayOutSet(this.designer.layoutset);
                    console.log('setLayOutSet1111');
                    this.setfileList(this.designer.fileList)

                    // console.log(this.$route);
                    // this.$route.name='bianjiliucheng111';

                    // this.$router.meta.title="bianjigeg";
                } else {
                    this.error = req.msg
                }
            })
        }
    }
}
</script>

<style scoped>
.box {
    position: relative;
}

.buttons {
    position: absolute;
    right: 20px;
    top: 20px;
}
</style>
