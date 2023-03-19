<template>
<div class="flowChose">
    

    <el-alert v-if="!!error" :title="error" :closable="false" type="error" />

    <div v-else>
        <div v-if="searchloading" class="box  pd10 mg10 text-center">
            正在加载中。。。
    </div>
        <div v-else>

            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
            <el-tree v-if="CatTreeList.length>0" class="filter-tree pd10" node-key="id" :default-expanded-keys="expandedKeys" :data="CatTreeList" :props="defaultProps" :filter-node-method="filterNode" ref="tree2">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div :class="!data.isleaf?'tree-cat':'tree-item'">
                        <span class="title">
<el-tooltip v-if="!!data.isleaf" class="item" effect="dark" placement="top" :content="data.desc">
    <span>
        <span v-if="data.canuse" class="used">已启用</span>
                <span v-if="!data.canuse" class="unused">未启用</span>
        {{ node.label }}
        <span style="font-size:12px;padding: 0 10px;"> 创建于{{data.created_at}}</span>
       
        </span>
    </el-tooltip>        
          <span v-else>{{ node.label }}</span>

                        </span>
                        <span v-if="!!data.isleaf">
          <el-button  style="margin-left:5px;" 
            size="mini"
            @click="edit(data.id)">
            普通编辑
          </el-button>
          <el-button  style="margin-left:5px;" 
            size="mini"
            @click="editSenior(data.id)">
            高级编辑
          </el-button>
          <el-button  style="margin-left:5px;" 
             icon="el-icon-delete" size="mini" type="danger" 
            @click="deleteflow(data.id)">
            删除
          </el-button>
          
        </span></div>
                </div>

            </el-tree>

        </div>
    </div>

</div>
</template>

<script>
import {
    FlowDesignsAllTreeList,FlowdesignsDelete
} from '@/api/flowdesign'


export default {
    name: 'FlowdesignLists',
    components: {
    },
    data() {
        return {
            filterText: '',
            CatTreeList: [],
            expandedKeys: [],
            defaultProps: {
                children: 'lists',
                label: 'name'
            },
            error: null,
            searchloading: false,
            cancreat:false

        }
    },
    activated() {

    },
    mounted() {

        this.searchloading = true;

        FlowDesignsAllTreeList({}).then(({
            data: req
        }) => {
            this.searchloading = false

            if (req.success) {

                this.expandedKeys = [];
                req.data.forEach(ele => {
                    this.expandedKeys.push(ele.id);
                })
                console.log(this.expandedKeys);

                this.CatTreeList = req.data;

                // this.flowlist=req.data.allList;
                // this.treeData.lists=req.data.CatTreeList;

            } else {
                this.$message.error(req.msg)
            }
        }).catch(e => {
            console.log('error', e);
            this.$message.error(e.message);
            // this.$refs.widgetPreview.end()
        })

    },
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    methods: {

        edit: function (id) {
            this.$router.push({
                path: `flowdesign_edit/${id}`
            })
        },

        editSenior: function (id) {
            this.$router.push({
                path: `flowdesign_edit_senior/${id}`
            })
        },

        deleteflow(id) {
            this.$confirm('确定删除此条流程吗？谨慎删除，一旦删除，已经被创建的流程会失效').then(
                () => {
                    
                    FlowdesignsDelete({
                        id: id
                    }).then(({
                        data: req
                    }) => {
                        if (req.success) {
                            this.$message.success(req.msg)
                            window.location.reload();
                        } else {
                            this.$message.error(req.msg)
                        }
                    })
                }
            ).catch(
                () => {
                    
                }
            )
        },

        // creat(e) {
        //     console.log(e)
        // },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        creatflow: function (_id) {
            // const result = this.page.result[index]

            this.cancreat=false;

            setTimeout(() => {
                this.cancreat=true;
                
                setTimeout(() => {
                     this.$refs.flowcreat.creatform(_id);
                }, 100);
               
            }, 100);
            


            //console.log(result)
        }

    }
}
</script>

<style>
.flowChose .el-tree-node__content {
    height: auto;
}
</style>

<style scoped>
.custom-tree-node {}

.custom-tree-node .tree-cat {
    padding: 8px;
}

.custom-tree-node .tree-item {
    padding: 3px;
}

.custom-tree-node .tree-cat .title {
    font-weight: bolder;
    font-size: 15px;
}

.custom-tree-node .tree-item .title {
    font-size: 13px;
    font-weight: normal;
}

.used,.unused{
    padding: 2px 4px;
    font-size: 12px;
    border-radius: 3px
}

.used{
    background-color: #4CAF50;
    color: white;
}

.unused{
    background-color: #FF6600;
    color: white;
}

</style>
