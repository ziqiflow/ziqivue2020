<template>
  <div>
    <el-alert v-if="!!error" :title="error" :closable="false" type="error"/>
    <div v-else>

     <el-card :body-style="{padding:'0px'}" style="margin-bottom:20px">
            <div slot="header" class="clearfix" :body-style="{padding:'0px'}">
                <span>
                  <i class="el-icon-search"></i>
                  搜索栏</span>
                <el-button v-if="!searchbarShow" @click="toggleSearchbarShow" style="float: right; padding: 3px 0" type="text">展开</el-button>
                <el-button v-else @click="toggleSearchbarShow" style="float: right; padding: 3px 0" type="text">关闭</el-button>
            </div>

            <el-form class="searchform_oa" size='mini' v-if="searchbarShow" label-width="80px" style="margin:10px;">
                <el-form-item label="流程名称">
                    <el-input v-model="search.flowname"></el-input>
                </el-form-item>

                     <el-form-item label="文号">
                    <el-input v-model="search.workname"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="searchSummit">搜索</el-button>
                </el-form-item>

            </el-form>

        </el-card>

        
      <el-card>
      <div v-if="searchloading" class="box  pd10 mg10 text-center">
        正在加载中。。。
      </div>
      <div v-if="page.result.length==0&&!searchloading" class="box pd10 mg10 text-center">无任何记录</div>

      <div v-if="page.result.length!=0" class="box">
        <div>共搜索到
        <span>{{ page.totalItems }}</span> 条信息</div>
        <el-table :data="page.result" stripe style="width: 100%;" :row-class-name="tableRowClassName" >

          <el-table-column label="流程名称" width="180">
            <template slot-scope="scope">
              <strong>{{ scope.row.flowname }}</strong>
            </template>
          </el-table-column>

           <el-table-column label="文号" width="180">
            <template slot-scope="{row}">
                     <span class="emergency_label" v-if="row.level==100">紧急</span>
              <strong>{{ row.flowlistOi.workname }}</strong>
            </template>
          </el-table-column>

          <el-table-column label="流程描述" width="200">
            <template slot-scope="{row}">
              {{ row.flowlistOi.desc }}
            </template>
          </el-table-column>

             <el-table-column label="处理节点" width="180">
            <template slot-scope="scope">
              <span class="label warning">
                {{ scope.row.NowFunName }}
              </span>

            </template>
          </el-table-column>

          <el-table-column label="我的审批建议" width="180">
            <template slot-scope="{row}">
              <span v-if="!!row.log.suggest">{{ row.log.suggest }}</span>
            </template>
          </el-table-column>

            <el-table-column label="处理时间" width="180">
            <template slot-scope="scope">
                <div>
                  {{ friendlytimejs(scope.row.finished_at) }}
                </div>
            </template>
          </el-table-column>

          <el-table-column label="流程创建时间" width="180">
            <template slot-scope="scope">
                <div>
              创建于 {{ friendlytimejs(scope.row.flowlistOi.created_at) }}
                <span class="person"> {{scope.row.flowlistOi.creater}}</span> 
                </div>
                <div class="mg-t5">
              转到你：{{ friendlytimejs(scope.row.created_at) }}</div>
            </template>
          </el-table-column>

      
          <el-table-column fixed="right" label="操作" width="180">
            <template slot-scope="{row}">
              <el-button type="error" size="small" @click="seedetail(row)" >查看当前</el-button>
            </template>
          </el-table-column>

        </el-table>

        <el-pagination :current-page="page.currentPage" :page-size="page.pageSize" :total="page.totalItems" background layout="prev, pager, next" @current-change="handerPageChange"/>
      </div>
      </el-card>
    </div>

    <modal-flow-detail ref="flowdetail"/>

  </div>
</template>

<script>
import {
  FlowFinish
} from '@/api/oa'

import flowlist from '@/utils/mixins/flowList'

import ModalFlowDetail from './common/CModalFlowDetail'

export default {
  name: 'Cflowlist',
  components: {
    ModalFlowDetail
  },
  mixins: [flowlist],
  data() {
    return {
      searchFun: FlowFinish,
      columns: [{
        title: '流程名称',
        slot: 'flowdesignername'
      },
      {
        title: '流程描述',
        slot: 'flow_desc'
      },
      {
        title: '我的审批建议',
        slot: 'flow_suggest'
      },
      {
        title: '我的Action',
        slot: 'flow_action'
      },

      {
        title: '流程创建时间',
        slot: 'flow_created_at'
      },
      {
        title: '处理节点',
        slot: 'flowstatusat'
      },
      {
        title: '可操作',
        slot: 'action',
        width: 150,
        align: 'center'
      }
      ]
    }
  },
  activated() {},
  mounted() {
    // this.searchdata(1)
  },
  methods: {}
}
</script>

<style scoped>
.label ,.emergency_label{
    border-radius: 4px;
    color: white;
    padding: 2px 3px;
    display: inline-block;
}

.emergency_label{
    background-color: #ff3d00;
    color: white;
    line-height: 17px
}
.label.success {
    background-color: #19be6b
}

.label.warning {
    background-color: #ff9900;
}
</style>
