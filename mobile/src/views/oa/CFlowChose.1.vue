<template>
  <div>

 <flow-creat ref="flowcreat"/>

<van-search placeholder="请输入流程名称" v-model="flownamestring"  show-action
        @search="onSearch" >
          <div slot="action" @click="onSearch">搜索</div>
          </van-search>


 <div v-if="searchloading" class="box pd10 mg10 text-center">
        正在加载中。。。
      </div>
      <div v-if="page.result.length==0&&!searchloading" class="box pd10 mg10 text-center">无任何记录</div>

      <div v-if="page.result.length!=0" class="box">


        <van-cell v-for="(row,index) in page.result" :key="index" :title="row.name" :label="row.description">

              <div slot="right-icon" style="line-height: 45px;">
              <el-button  @click="creatflow(index)" size="mini"  icon="el-icon-plus" type="primary" plain>创建</el-button>
              </div>

        </van-cell>



      </div>




    

  </div>
</template>

<script>
import {
  FlowDesignsCanList
} from '@/api/oa'
import { Cell ,Search} from 'vant';



import FlowCreat from './common/CFlowCreat'

export default {
  name: 'FlowdesignLists',
  components: {
    FlowCreat,
    // vanList:List,
    vanCell:Cell,
    // vanPullRefresh:PullRefresh
    vanSearch:Search
  },
  data() {
    return {
      flownamestring:'',


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
    console.log(this.isPc)
  },
  methods: {
    onSearch(){

    },
    handerPageChange(nowpage) {
      // alert(nowpage);
      this.searchdata(nowpage)
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
