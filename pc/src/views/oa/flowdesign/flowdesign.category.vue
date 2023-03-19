<template>
<div v-loading="loading">
    <el-card>
        <H3>流程分类管理</H3>

        <el-dialog :title="editType=='edit'?'编辑分类':'新建分类'" :visible.sync="editModelStatus" width="50%">

            <el-form :model="modelForm" :rules="rules" ref="modelForm" label-width="80px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="modelForm.name"></el-input>
                </el-form-item>

                <el-form-item label="相关流程">
                    <el-select v-model="modelForm.flowlist" multiple clearable filterable placeholder="请选择">
                        <el-option v-for="item in flowlist" :key="item._id" :label="item.name+(!item.canuse?'_[禁止]':'')" :value="item._id">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
    <el-button @click="editModelStatus = false">取 消</el-button>
    <el-button type="primary" @click="saveForm">确 定</el-button>
  </span>
        </el-dialog>

        <el-button @click="addDocument" type="primary">新建分类</el-button>

        <div v-if='treeData.lists.length==0' style="margin:20px 20px 60px;">未创建任何分类，<el-button @click="addDocument" type="text">点击创建</el-button>
        </div>

        <dragTreeTable v-if='treeData.lists.length>0' :data="treeData" :onDrag="onTreeDataChange" :isdraggable="true"></dragTreeTable>

        <el-button style="margin-top:10px;" @click="saveCategory" type="danger">保存</el-button>
    </el-card>
</div>
</template>

<script>
import dragTreeTable from 'drag-tree-table'
//    import { Tree, TreeNode } from 'vue-tree-list'
import {
    FlowDesignsSetCategoryGet,
    FlowDesignsSetCategorySet
} from '@/api/flowdesign'

// import  VueTreeList  from '@/components/ZTreeDrag/VueTreeList'
// console.log('VueTreeList',VueTreeList);
export default {
    name: 'FlowdesignCategory',
    components: {
        //  VueTreeList
        dragTreeTable
    },
    data() {
        return {
            loading: false,
            flowlist:[],
            modelForm: {

            },
            rules: {
                name: [{
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        message: '长度在 至少3字符 ',
                        trigger: 'blur'
                    }
                ]
            },
            editModelStatus: false,
            editType: 'add',
            nowEditObject: null,
            treeData: {
                lists: [

                ],
                columns: [{
                        type: 'selection',
                        title: '分类名称',
                        field: 'name',
                        width: 200,
                        align: 'center',
                        formatter: (item) => {
                            return '<a>' + item.name + '</a>'
                        }
                    },
                    {
                        title: '包含的流程',
                        field: 'flowlist',
                        width: 200,
                        align: 'left',
                        formatter: (item) => {
//                            console.log(item);
                            let str='';

                            item.flowlist.forEach(ele=>{
                                str+=this.tranformName(ele)+'<br>';
                            })

                            return str;
                            // return '<a>' + item.flowlist.join('-') + '</a>'
                        }
                    },
                    {
                        title: '操作',
                        type: 'action',
                        width: 350,
                        align: 'center',
                        actions: [{
                                text: '编辑',
                                onclick: this.editNode,
                                formatter: (item) => {
                                    return '<i style="margin-right:5px;">编辑</i>   '
                                }
                            },
                            {
                                text: '删除',
                                onclick: this.deleteNode,
                                formatter: (item) => {
                                    return '<i>删除</i>'
                                }
                            }
                        ]
                    },
                ]

            }

        }
    },
    activated() {
        console.log('activated')
    },
    mounted() {

        
        this.loading=true;
        FlowDesignsSetCategoryGet({}).then(({
            data: req
        }) => {
            this.loading = false

            if (req.success) {

                this.flowlist=req.data.allList;
                this.treeData.lists=req.data.CatTreeList;
        
            } else {
                this.$message.error(req.msg)
            }
        }).catch(e => {
            console.log('error',e);
            this.$message.error(e.message);
            // this.$refs.widgetPreview.end()
        })

    },
    methods: {
        saveCategory(){

             FlowDesignsSetCategorySet({tree:this.treeData.lists}).then(({
            data: req
        }) => {
            this.loading = false
            if (req.success) {
                this.$message.success(req.msg);
            } else {
                this.$message.error(req.msg)
            }
        }).catch(e => {
            this.$message.error(e.message)
            // this.$refs.widgetPreview.end()
        })

            

        },

        tranformName(id){
           
        //    console.log(id);
            for (let k = 0; k < this.flowlist.length; k++) {
                const ele = this.flowlist[k];
                if(ele._id==id){
                    return ele.name+(!ele.canuse?'[已暂停]':'')
                }
            }
            return id;

        },
        editNode(e) {
            console.log('编辑', e);
            this.nowEditObject = e;

            this.editModelStatus = true;
            this.editType = 'edit';
            
            this.modelForm = {
                name: e.name,
                flowlist: e.flowlist
            };

        },
        deleteNode(e) {
            
            if (this.removeNodebyId(this.treeData.lists, e.id)) {
                this.$message.success('删除成功');
            }
            console.log('删除', e);
        },
        removeNodebyId(list, id) {

            for (let k = 0; k < list.length; k++) {
                const ele = list[k];
                if (ele.id == id) {
                    list.splice(k, 1);
                    return true;
                }
                if (!!ele.lists&&ele.lists.length) {
                    if (this.removeNodebyId(ele.lists, id)) {
                        return true;
                    }
                }
            }
            return false; 
            // list.forEach(ele=>{
            //     if(ele.id==id)}
            // })

        },
        onTreeDataChange(list) {
            this.treeData.lists = list
        },
        addDocument() {
            this.editModelStatus = true;
            this.editType = 'add';
            
            this.modelForm = {
                name: '',
                flowlist: []
            };
        },
        saveForm() {
            this.$refs.modelForm.validate((valid) => {
                if (valid) {

                    if (this.editType == 'add') {

                        this.treeData.lists.push({
                            "id": Date.parse(new Date())/1000 + '_' + Math.ceil(Math.random() * 99999),
                            "name": this.modelForm.name,
                            "flowlist": this.modelForm.flowlist,
                             "open": true
                        })
                    } else {

                        this.nowEditObject.name = this.modelForm.name;
                        this.nowEditObject.flowlist = this.modelForm.flowlist;

                    }
                    this.editModelStatus = false

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        }

    }
}
</script>

<style>
</style>
