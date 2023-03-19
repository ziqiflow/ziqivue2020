<template>
  <div>
    <flow-creat ref="flowcreat"/>

    <el-alert v-if="!!error" :title="error" :closable="false" type="error"/>

    <div v-else>

      <el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>

<el-tree
  class="filter-tree"
  :data="data2"
  :props="defaultProps"
  default-expand-all
  :filter-node-method="filterNode"
  ref="tree2">
</el-tree>


      <div v-if="searchloading" class="box  pd10 mg10 text-center">
        正在加载中。。。
      </div>
      <div v-if="page.result.length==0&&!searchloading" class="box pd10 mg10 text-center">无任何记录</div>

      <div v-if="page.result.length!=0" class="box">

        <div>共搜索到
        <span>{{ page.totalItems }}</span> 条信息</div>

        <el-table :data="page.result" stripe style="width: 100%">
          <el-table-column prop="name" label="名称" width="180"/>
          <el-table-column prop="description" label="备注" width="180"/>
          <el-table-column prop="created_at" label="创建时间"/>
          <el-table-column prop="_id" label="id"/>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">

              <el-button type="text" size="small" @click="creatflow(scope.$index)">创建流程</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination :current-page="page.currentPage" :page-size="page.pageSize" :total="page.totalItems" background layout="prev, pager, next" @current-change="handerPageChange"/>

      </div>
    </div>

  </div>
</template>

<script>
import {
  FlowDesignsCanList
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
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      
    ,

      error: null,
      columns: [{
        title: '名称',
        key: 'name'
      },
      {
        title: '备注',
        key: 'remark'
      },
      {
        title: '创建时间',
        key: 'created_at'
      },
      {
        title: 'id',
        key: '_id'
      }, {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 120,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: () => {
                  this.creatflow(params.index)
                }
              }
            }, '创建流程')

          ])
        }
      }
      ],

      searchloading: false,
      search_list: null,
      orderby_list: null,
      display_list: null,
      search: {
        s_isorder: null,
        s_orderby: null
      }, 
      page: {
        result: [],
        totalItems: 0,
        pageSize: 20,
        currentPage: 1
      }

    }
  },
  activated() {

  },
  mounted() {
    this.searchdata(1)
  },
  watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
  methods: {

     filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },

    handerPageChange(nowpage) {
      // alert(nowpage);
      this.searchdata(nowpage)
    },

    edit: function(index) {
      this.$router.push({
        path: `flowdesign_edit/${this.page.result[index]._id}`
      })
    },

    editSenior: function(index) {
      this.$router.push({
        path: `flowdesign_edit_senior/${this.page.result[index]._id}`
      })
    },

    creatflow: function(index) {
      const result = this.page.result[index]

      this.$refs.flowcreat.creatform(result._id)

      console.log(result)
    },

    searchdata: function(currentPage) {
      if (this.searchloading) {
        this.$Message.warning('请勿重复提交表单')
        return
      }
      this.searchloading = true
      this.page.result = []

      FlowDesignsCanList({
        nowpage: currentPage
      }).then(({
        data: req
      }) => {
        console.log(req)
        this.page = req.data
        this.searchloading = false
      })
    }

  }
}
</script>

<style>
</style>
