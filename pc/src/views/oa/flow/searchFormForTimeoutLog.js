import { FlowTimeoutLogPost, FlowTimeoutLogExport } from '@/api/oa'

import edit from './searchFormCommon.vue'
export default {
  extends: edit,
  props: {

  },
  methods: {
    funtool_timetrans(date) {
      var date = new Date(date * 1000) // 如果date为13位不需要乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return Y + M + D + h + m + s
    },
    filterfun_int_to_datetime(row, rowname, paradata) {
      // console.log('filterfun_to_friendlytimejs',JSON.stringify(row),rowname)

      if (!row[rowname]) return null
      try {
        return this.funtool_timetrans(row[rowname].$date.$numberLong / 1000)
        // console.log('row',row)
        // return FriendlyTime(this.funtool_timetrans(row[rowname].$date.$numberLong/1000),new Date())
      } catch (e) {
        console.log(e)
        // row[rowname]=null
        return null
      }
    },

    button_click_showdetail(row) {
      console.log('row', row)
      this.$refs.flowdetail.loadmodal(row.flowlistid.$oid, `查看 ${row.flowname} 明细`)
    },
    showexport() { return true },
    exportData() {
      this.$confirm('确定导出数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.generateForm
          .getData()
          .then(data => {
            this.search.form = data

            const postdata = this.getpostdata()

            FlowTimeoutLogExport(postdata).then((
              res
            ) => {
              console.log(res)
              // console.log(res.data.constructor);
              if (!!res.data && res.data.constructor == ArrayBuffer) {
                var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                var objectUrl = URL.createObjectURL(blob)
                var a = document.createElement('a')
                document.body.appendChild(a)
                a.setAttribute('style', 'display:none')
                a.setAttribute('href', objectUrl)
                a.setAttribute('download', '超时日志')
                a.click()
                URL.revokeObjectURL(objectUrl)
              } else {
                this.$message.error(res.data.msg)
              }
            })
          })
          .catch(e => {
            console.log(e)
            console.log('有需求信息没有填写')
            // this.$refs.widgetPreview.end()
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      })
    },
    search_submit() {
      this.searchloading = true
      this.searchinfo = {
        type: 'default',
        info: '加载中'
      }

      this.$refs.generateForm
        .getData()
        .then(data => {
          this.search.form = data

          const postdata = this.getpostdata()
          postdata.flowid = this.flowid,

          FlowTimeoutLogPost(postdata).then(({ data: res }) => {
            this.searchloading = false
            this.AfterSearch(res)
          })
        })
        .catch(e => {
          console.log(e)
          console.log('有需求信息没有填写')
          // this.$refs.widgetPreview.end()
        })
    }

  }
}

// const SearchFormNew = {
//     extends: edit,
//     mounted() {
//         //this.sfloading=true;
//     },
//     methods: {
//         button_click_delete() {
//         },
//     }
// }
