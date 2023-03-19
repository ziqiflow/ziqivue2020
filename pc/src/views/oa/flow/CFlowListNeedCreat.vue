<template>
<div>
    <flow-creat @on-success="CreatSuccessHander" v-if="cancreat" ref="flowcreat" />

    <el-alert v-if="!!error" :title="error" :closable="false" type="error" />
    <div v-else>
        <el-card :body-style="{padding:'0px'}" style="margin-bottom:20px">
            <div slot="header" class="clearfix" :body-style="{padding:'0px'}">
                <span>
            <i class="el-icon-search"></i>
            搜索栏
          </span>
                <el-button v-if="!searchbarShow" @click="toggleSearchbarShow" style="float: right; padding: 3px 0" type="text">展开</el-button>
                <el-button v-else @click="toggleSearchbarShow" style="float: right; padding: 3px 0" type="text">关闭</el-button>
            </div>

            <el-form  class="searchform_oa" size="mini" v-if="searchbarShow" label-width="120px" style="margin:10px;">
                <el-form-item label="流程名称">
                    <el-input v-model="search.flowname"></el-input>
                </el-form-item>

                <el-form-item v-if="!!search.creatstatus" label="是否已创建">
                    <el-radio-group v-model="search.creatstatus">
                        <el-radio label="creat">已创建</el-radio>
                        <el-radio label="uncreat">未创建</el-radio>
                        <el-radio label="all">全部</el-radio>
                    </el-radio-group>
                </el-form-item>

            


                <el-form-item>
                    <el-button type="primary" @click="searchSummit">搜索</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card>
            <div v-if="searchloading" class="box pd10 mg10 text-center">正在加载中。。。</div>
            <div v-if="page.result.length==0&&!searchloading" class="box pd10 mg10 text-center">无任何记录</div>

            <div v-if="page.result.length!=0" class="box">
                <div>
                    共搜索到
                    <span>{{ page.totalItems }}</span>条信息
                </div>

                <el-table :data="page.result" stripe style="width: 100%;">
                    <el-table-column label="流程名称" width="220">
                        <template slot-scope="scope">
                            <strong>{{ scope.row.flowname }}</strong>
                        </template>
                    </el-table-column>

                    <el-table-column label="提醒时间" width="100">
                        <template slot-scope="scope">{{ friendlytimejs(scope.row.created_at) }}</template>
                    </el-table-column>

                    <el-table-column label="描述" width="220">
                        <template slot-scope="scope">{{ scope.row.desc }}</template>
                    </el-table-column>

                    <el-table-column label="状态" width="100">
                        <template slot-scope="scope">{{ scope.row.hasdone?'已创建':'未创建' }}</template>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" width="220">
                        <template slot-scope="{row}">
                            <el-button type="primary" size="mini" style="margin-right: 5px" @click="creatflow(row)">创建</el-button>
                            <el-button @click="setDone(row)" size="mini" v-if="!row.hasdone">标记为完成</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination :current-page="page.currentPage" :page-size="page.pageSize" :total="page.totalItems" background layout="prev, pager, next" @current-change="handerPageChange" />
            </div>
        </el-card>
    </div>
</div>
</template>

<script>
import {
    FlowNeedCreat,
    FlowAlertDone
} from "@/api/oa";

import flowlist from "@/utils/mixins/flowList";

import FlowCreat from "./common/CFlowCreat";

export default {
    name: "Cflowlist",
    components: {
        FlowCreat
    },
    mixins: [flowlist],
    data() {
        return {
            cancreat: false,
            searchFun: FlowNeedCreat,
            nowItem: null
        };
    },
    activated() {},
    mounted() {
        // this.searchdata(1)
    },
    methods: {
         initresultdata: function() {

      let query=this.$route.query;
      if(!!query.showid){
          
          this.page.result.forEach(ele=>{
              if(ele._id==query.showid&&!ele.hasdone){
                  this.creatflow(ele);
              }
          })
      }
    },
        initsearch() {
            
            // Object.assign(this.search,{
            //   readstatus:'all'
            // })
            this.$set(this.search, "creatstatus", "uncreat");
        },

        CreatSuccessHander() {
            console.log('创建成功');
            this.setDone(this.nowItem);

        },
        setDone(row) {
            if (!row) return;
            FlowAlertDone({
                id: row._id
            }).then(({
                data: req
            }) => {
                if (req.success) {
                    row.hasdone = true;
                    this.flowBadge.needcreat--;
                    this.$message.success("标记成功");
                } else {
                    this.$message.error("标记失败");
                }
            });
        },

        creatflow: function (row) {
            // const result = this.page.result[index]

            this.nowItem = row;
            this.cancreat = false;

            setTimeout(() => {
                this.cancreat = true;

                setTimeout(() => {
                    this.$refs.flowcreat.creatform(row.flowid);
                }, 100);
            }, 100);

            //console.log(result)
        }
    }
};
</script>

<style scoped>
.label {
    border-radius: 4px;
    color: white;
    padding: 2px 3px;
    display: inline-block;
}

.label.success {
    background-color: #19be6b;
}

.label.warning {
    background-color: #ff9900;
}

.person {
    border-radius: 4px;
    color: white;
    padding: 0px 2px;
    display: inline-block;
    background-color: #515a6e;
}
</style>
