<template>
<div class="flowChose">

    <flow-creat v-if="cancreat" ref="flowcreat" />

    <div v-if="searchloading" class="box pd10 mg10 text-center">
        正在加载中。。。
    </div>
    <div v-else>
  <van-search placeholder="请输入流程名称" v-model="filterText">
    </van-search>
            <el-tree style="padding-top:10px;" v-if="CatTreeList.length>0" class="filter-tree" node-key="id" :default-expanded-keys="expandedKeys" :data="CatTreeList" :props="defaultProps" :filter-node-method="filterNode" ref="tree2">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div :class="!data.isleaf?'tree-cat':'tree-item'">
                        <span class="title">
    <div v-if="!!data.isleaf">{{ node.label }}
      <div class="desc">{{data.desc}} 通知</div>
    </div>
        
          <span v-else>{{ node.label }}</span>

                        </span>
                        <span style="position: absolute;top: 5px;right: 10px;">
          <el-button v-if="!!data.isleaf" 
            size="mini"  icon="el-icon-plus" type="primary" plain
            @click="creatflow(data.id)">
            创建
          </el-button>
        </span></div>
                </div>

            </el-tree>



    </div>

</div>
</template>

<script>
import {
    FlowDesignsCanTreeList
} from '@/api/flowdesign'
import {
    Cell,
    Search
} from 'vant';

import FlowCreat from './common/CFlowCreat'

export default {
    name: 'FlowdesignLists',
    components: {
        FlowCreat,
        // vanList:List,
        vanCell: Cell,
        // vanPullRefresh:PullRefresh
        vanSearch: Search
    },
    data() {
        return {
cancreat: false,
          filterText: '',
            CatTreeList: [],
            expandedKeys: [],
            defaultProps: {
                children: 'lists',
                label: 'name'
            },
            flownamestring: '',

            error: null,

            searchloading: false,
          

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
                console.log(this.expandedKeys);

                this.CatTreeList = req.data;


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
onSearch(){},
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

      

        creatflow: function (_id) {

           this.cancreat = false;

            setTimeout(() => {
                this.cancreat = true;

                setTimeout(() => {
                    this.$refs.flowcreat.creatform(_id);
                }, 100);
            }, 100);

            // this.$refs.flowcreat.creatform(_id)

        },

        

    }
}
</script>

<style>
.flowChose .el-tree-node__content {
    height: auto;
}
</style>

<style scoped>
.custom-tree-node {
  width:90%;
  position: relative;
}

.custom-tree-node .tree-cat {
    padding: 5px;
}

.custom-tree-node .tree-item {
       padding: 5px 10px;
    border-bottom: 1px solid gainsboro;
    margin-bottom:5px;
}

.custom-tree-node .tree-cat .title {
    font-weight: bolder;
    font-size: 13px;
}

.custom-tree-node .tree-item .title {
    font-size: 13px;
    font-weight: normal;
        line-height: 22px;
}

.custom-tree-node .desc {
  font-size:12px;
  color:grey;
  padding-top:4px;
  padding-left:10px;
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
</style>
