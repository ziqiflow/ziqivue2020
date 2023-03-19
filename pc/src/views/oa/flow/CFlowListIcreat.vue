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

            <el-form  class="searchform_oa" size='mini' v-if="searchbarShow" label-width="80px" style="margin:10px;">
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

        <el-table :data="page.result" border stripe style="width: 100%;">

          <el-table-column label="流程名称" width="180">
            <template slot-scope="scope">
              <strong>{{ scope.row.name }}</strong>
            </template>
          </el-table-column>

           <el-table-column label="文号" width="180">
            <template slot-scope="{row}">
                 <span class="emergency_label" v-if="row.level==100">紧急</span>
              {{ row.workname }}
            </template>
          </el-table-column>

          <el-table-column label="流程描述" width="200">
            <template slot-scope="{row}">
              {{ row.desc }}
            </template>
          </el-table-column>

          <el-table-column label="流程创建时间" width="180">
            <template slot-scope="{row}">
              创建于 {{ friendlytimejs(row.created_at) }}<br>
            </template>
          </el-table-column>

          <el-table-column label="最近日志" width="300">
            <template slot-scope="{row}">
              <div style="padding:10px;">
                <flow-log :show-next="false" :log="row.lastlog"/>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="审批建议" width="200">
            <template slot-scope="{ row }">
              <span v-if="!!row.suggests">
                <span v-for="(suggest,index) in row.suggests" :key="index">{{ suggest.text }}</span>
              </span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="230">
            <template slot-scope="{row}">
              <el-button type="error" size="small" @click="seedetail(row)" >查看明细</el-button>
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
  FlowICreat
} from '@/api/oa'

import flowlist from '@/utils/mixins/flowList'

import ModalFlowDetail from './common/CModalFlowDetail'

import FlowLog from './common/CFlowLog'

export default {
  name: 'Cflowlist',
  components: {
    ModalFlowDetail, FlowLog
  },
  mixins: [flowlist],
  data() {
    return {
      searchFun: FlowICreat,
      columns: [{
        title: '流程名称',
        slot: 'flowdesignername'
      },
      {
        title: '流程描述',
        slot: 'flow_desc'
      }, {
        title: '流程创建时间',
        slot: 'flow_created_at'
      },

        // {
        
        //     slot: 'flow_action'
        // },

      {
        title: '最近日志',
        width: 300,
        slot: 'lastlog'
      }, {
        title: '审批建议',
        slot: 'flow_suggest'
      },
      {
        title: '可操作',
        slot: 'action',
        width: 100,
        align: 'center'
      }
      ]
    }
  },
  activated() {},
  mounted() {
    // this.searchdata(1)

  },
  methods: {
    seedetail(mesObj) {
      console.log('mesObj',mesObj);
      this.$refs.flowdetail.loadmodal(mesObj._id, `查看 ${mesObj.name} 明细`)
    }
  }
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
