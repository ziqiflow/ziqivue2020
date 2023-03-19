<template>
  <div style="margin:10px;">
    <el-alert v-if="error" :closable="false" :title="error" type="error"/>

    <div v-loading="loading" v-else>

      <div v-if="!!pageset">
        <h3 style="margin:10px;">流程超时汇总</h3>
        <search-form-common v-if="!!pageset" :page-set="pageset" :default="searchdefault" @afterSearch="afterSearch">

          <div slot="searchresult">

            <el-alert v-if="aftersearcherror" :closable="false" :title="aftersearcherror" type="error"/>

            <div v-else>

              <el-card>

                <el-table
                  :data="summaryresult"
                  :default-sort = "{prop: 'toer', order: 'descending'}"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="toer"
                    label="姓名"
                    sortable
                    width="130"/>
                  <el-table-column
                    prop="finishNum"
                    label="完成数量"
                    sortable
                    width="120"/>
                  <el-table-column
                    prop="unfinishNum"
                    label="未完成数量"
                    sortable
                    width="120"
                  />
                  <el-table-column
                    prop="expiredtimes"
                    label="超时次数"
                    sortable
                    width="120"
                  />
                  <el-table-column
                    prop="expirealltimeMinute"
                    label="超时总时长(分钟)"
                    sortable
                    width="120"
                  />

                  <el-table-column
                    prop="expirealltimeStr"
                    label="超时总时长"
                    width="120"
                  />

                </el-table>

              </el-card>

            </div>

          </div>

        </search-form-common>
      </div>
    </div>
  </div>
</template>

<script>
import searchFormCommon from './searchFormForTimeoutSummary'

import {
  FlowTimeoutSummaryGet
} from '@/api/oa'

// import {
//     FlowDesignsCanAdminTreeList
// } from '@/api/flowdesign'

export default {
  name: 'FlowTimeOutSummary',
  components: {
    searchFormCommon
  },
  data() {
    return {
      loading: false,
      error: null,
      aftersearcherror: null,
      summaryresult: []
    }
  },
  mounted() {
    this.loading = true
    FlowTimeoutSummaryGet({}).then(({
      data: res
    }) => {
      this.loading = false
      this.pageset = res.data.pageset
      this.searchdefault = res.data.DefaultData
      const date = new Date()
      this.searchdefault.search = {
        form: {
          first_expired_at: date.getFullYear() + '-' + (date.getMonth() + 1) + '-01'
        },
        orderby: []
      }
    }).catch(e=>{
      this.loading=false
    })
  },
  methods: {
    dateCount(diff) {
      
         var days = diff /24/60/60
            
            var day = Math.floor(days)
            var hours = (diff-day*24*60*60)/60/60
            var hour = Math.floor(hours)
            var minutes = (diff-day*24*60*60-hour*60*60)/60
            var minute = Math.floor(minutes)
            var second = diff-day*60*60*24-hour*60*60-minute*60

      let str = ''

      if (day) {
        str += Math.abs(day) + '天'
      }

      if (hour) {
        str += hour + '小时'
      }

      if (minute) {
        str += minute + '分钟'
      }

      return str
    },
    filtertimes(list) {

    },

    afterSearch(res) {
      console.log('afres', res)

      if (!res.success) {
        this.$message.error(res.msg)
        this.aftersearcherror = res.msg
        return
      }

      this.aftersearcherror = null

      res.data.forEach(list => {
        list.expirealltimeMinute = Math.floor(list.expirealltime / 60)
        list.expirealltimeStr = this.dateCount(list.expirealltime)
      })
      this.summaryresult = res.data
    }

  }
}
</script>

<style>
</style>
