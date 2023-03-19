<template>
<div class="flowChose">
    
    <flow-creat v-if="cancreat" ref="flowcreat" />

    <el-alert v-if="!!error" :title="error" :closable="false" type="error" />

    <div v-else>
        <div v-if="searchloading" class="box  pd10 mg10 text-center">
            正在加载中。。。
        </div>
        <div v-else>

            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
             <div class="pd10" v-if="CatTreeList.length==0">无可发起流程</div>
            <el-tree v-if="CatTreeList.length>0" class="filter-tree pd10" node-key="id" :default-expanded-keys="expandedKeys" :data="CatTreeList" :props="defaultProps" :filter-node-method="filterNode" ref="tree2">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div :class="!data.isleaf?'tree-cat':'tree-item'">
                        <span class="title">
<el-tooltip v-if="!!data.isleaf" class="item" effect="dark" placement="top" :content="data.desc">
    <span>{{ node.label }}</span>
    </el-tooltip>
        
          <span v-else>{{ node.label }}</span>

                        </span>
                        <span>
          <el-button v-if="!!data.isleaf" style="margin-left:5px;" 
            type="text"
            size="mini"
            @click="creatflow(data.id)">
            创建
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
    // FlowDesignsCanList
    FlowDesignsCanTreeList
} from '@/api/flowdesign'

import FlowCreat from './common/CFlowCreat'

export default {
    name: 'FlowdesignLists',

    components: {
        FlowCreat
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

        FlowDesignsCanTreeList({}).then(({
            data: req
        }) => {
            this.searchloading = false

            if (req.success) {

                this.expandedKeys = [];
                req.data.forEach(ele => {
                    this.expandedKeys.push(ele.id);
                })
                // console.log(this.expandedKeys);

                this.CatTreeList = req.data;

                // this.flowlist=req.data.allList;
                // this.treeData.lists=req.data.CatTreeList;

            } else {
                this.$message.error(req.msg)
            }
        }).catch(e => {
            this.searchloading=false
            // console.log('error', e);
            // this.$message.error(e.message);
            // this.$refs.widgetPreview.end()
        })

    },
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    methods: {

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
</style>
