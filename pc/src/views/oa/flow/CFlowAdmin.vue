<template>
<div class="flowAdmin">
    
    <el-alert v-if="!!error" :title="error" :closable="false" type="error" />

    <div v-else>
        <div v-if="searchloading" class="box  pd10 mg10 text-center">
            正在加载中。。。
        </div>
        <div v-else>

            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
             <div class="pd10" v-if="CatTreeList.length==0">无可管理流程</div>
            <el-tree v-if="CatTreeList.length>0" class="filter-tree pd10" node-key="id" :default-expanded-keys="expandedKeys" :data="CatTreeList" :props="defaultProps" :filter-node-method="filterNode" ref="tree2">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div :class="!data.isleaf?'tree-cat':'tree-item'">
                        <span class="title">
<div v-if="!!data.isleaf">
    <div class="leaflabel" :title="node.label">{{ node.label }}</div>
    <div class="leafdesc" :title="node.label">{{data.desc}}</div>
    </div>
          <span v-else>{{ node.label }}</span>
                        </span>          
                       <router-link :to="'/flowadmin/'+data.id">
          <el-button v-if="!!data.isleaf" style="position: absolute;   right: 10px;    top: 10px;"
            type="text"
            size="mini">
            查看
          </el-button></router-link></div>
                </div>

            </el-tree>

        </div>
    </div>

</div>
</template>

<script>
import {
    // FlowDesignsCanList
    FlowDesignsCanAdminTreeList
} from '@/api/flowdesign'


export default {
    name: 'FlowdesignLists',

    components: {
        // FlowCreat
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

        FlowDesignsCanAdminTreeList({}).then(({
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
            this.searchloading=false
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
.flowAdmin .el-tree-node__content {
    height: auto;
}

.flowAdmin .el-tree-node__content:hover{
    background: white;
}
</style>

<style scoped>
.custom-tree-node {}

.custom-tree-node .tree-cat {
    padding: 8px;
}

.custom-tree-node .tree-item {
      padding: 10px 37px 10px 10px;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
width: 280px;
    position: relative;
        margin-top: 5px;
}

.leaflabel,.leafdesc{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.leafdesc{
       margin-top: 7px;
    margin-left: 5px;
    font-size: 12px;
    color: grey;    

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
