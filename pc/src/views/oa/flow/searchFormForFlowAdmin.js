
import edit from './searchFormCommon.vue'

import {
  // FlowDesignsCanList
  FlowAdminSearchForm, FlowAdminSearchFormExport } from '@/api/oa'
import { FriendlyTime } from '@/utils/friendlytimejs'

export default {
  extends: edit,
  data() {
    return {
      myPermissions: null
    }
  },
  props: {
    flowid: {
      type: String
    },
    flowname: {
      type: String
    }
  },
  methods: {
    showexport() {
      return this.myPermissions.some(v => {
        return v.allow.some(v => {
          return v == 'export'
        })
      })
    },
    exportData() {
      if (!this.showexport()) {
        this.$message.error('您没有导出的权限')
        return
      }

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
            postdata.flowid = this.flowid,

            FlowAdminSearchFormExport(postdata).then((
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
                a.setAttribute('download', this.flowname)
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
    watchTable(set, rowdata) {
      const formset = this.CopyObject(set._formset)
      formset.model = set._formset['type'] + '_' + set._formset['key']

      formset.options.table_edit = false
      formset.options.table_add = false
      formset.options.table_delete = false
      formset.options.disabled = true

      const widgetForm = {
        'config': {
          'labelWidth': 160,
          'labelPosition': 'top'
        },
        'list': [formset]
      }
      const widgetModels = {} // rowdata
      widgetModels[set._formset['type'] + '_' + set._formset['key']] = rowdata[set.name]
      console.log(widgetForm)
      console.log(widgetModels)

      this.$refs.watchform.set_a_table('查看表格', widgetForm, widgetModels)
    },

    // 按键显示

    button_show_watch(row) {
      // if(row.unFinishNum==0){
      //     return
      // }
      return true
    },
    checkUserHasPermission(dept_id_list, myPermissions, allow) {
      for (let k = 0; k < myPermissions.length; k++) {
        const permission = myPermissions[k]
        if (permission.allow.some(v => {
          return v == allow
        })) {
          if (permission['admindept'].some(p => {
            if (p == '1') return true
            return dept_id_list.some(l => {
              return l == p
            })
          })) {
            return true
          }

          // for (let j = 0; j < dept_id_list.length; j++) {
          //     const ele = dept_id_list[j]

          // }
        }
      }
      return false
    },

    button_show_revoke(row) {
      // return false // 暂时都不显示

      if (row.unFinishNum == 0) {
        return false
      }

      // 检查是否针对该流程由撤销权限。
      // "watch", "revoke", "cancel", "export"
      return this.checkUserHasPermission(row.dept_id_list, this.myPermissions, 'revoke')
    },
    button_show_cancel(row) {
      // alert('ddd')
      if (!row.isCancel && !!row.CancelNum) {
        return this.checkUserHasPermission(row.dept_id_list, this.myPermissions, 'cancel')
      }

      if (row.unFinishNum == 0) {
        return false
      }
      return this.checkUserHasPermission(row.dept_id_list, this.myPermissions, 'cancel')
    },
    // button_click_funname 按键操作
    button_click_watch(row) {
      // console.error(this.$refs.flowdetail)
      this.$refs.flowdetail.loadmodal(row._id.$oid, `查看 ${row.name} 明细`)
    },

    cancelSuccess() {
      this.search_submit() // 刷新页面
    },
    revokeSuccess() {
      this.search_submit() // 刷新页面
    },

    button_click_revoke(row) {
      if (!this.checkUserHasPermission(row.dept_id_list, this.myPermissions, 'revoke')) {
        this.$message.error('您没有操作撤回的权限')
        return
      }

      // this.$refs.revokeflow.loadRevokeView(row._id.$oid);//此处需要填写对应的messageid
    },
    button_click_cancel(row) {
      if (!this.checkUserHasPermission(row.dept_id_list, this.myPermissions, 'cancel')) {
        this.$message.error('您没有操作取消的权限')
        return
      }
      this.$refs.cancelflow.loadCancelView(row._id.$oid)
    },
    // 针对数据类型的过滤器；
    filterfun_formdata_type(row, rowname) {
      for (let k = 0; k < this.pageset.display_list.length; k++) {
        const ele = this.pageset.display_list[k]

        if (rowname != ele.name) continue
        // vue-form-marking 数据翻译
        if (Object.keys(ele._formset.options).indexOf('options') >= 0) {
          if (ele._formset.options.remote == false) {
            const labelArr = []
            let valuelist = []
            if (!!row[rowname] && row[rowname].constructor == Array) {
              valuelist = row[rowname]
            } else {
              valuelist = [row[rowname]]
            }
            // 不管数据是什么格式，都转换层数组形式；
            // 数据在options 中查找，如果找到那么就插入值到可显示区域，如果没有找到就插入原值进去。

            valuelist.forEach(v => {
              let hasfind = false
              for (let j = 0; j < ele._formset.options.options.length; j++) {
                const item = ele._formset.options.options[j]
                if (v == item['value']) {
                  hasfind = true
                  if (ele._formset.options.showLabel) {
                    labelArr.push(item['label'] ? item['label'] : item['value'])
                  } else {
                    labelArr.push(item['value'])
                  }
                  break
                }
              }
              if (!hasfind) {
                labelArr.push(v)
              }
            })

            if (labelArr.length) {
              return labelArr.join(',')
            } else {
              // 表示没有查询到
              return ''
            }
          }
        }

        switch (ele._formset.type) {
          case 'custom':
            if (['chose-depts', 'chose-users'].indexOf(ele._formset.options.componentName) != -1) {
              if (!!row[rowname] && row[rowname].constructor == Array) {
                return row[rowname].map(v => {
                  return v.name
                }).join(',')
              }
            }
            // console.log('_formset',ele._formset);

            break

          default:
            break
        }

        // options.options
        // options.showLabel
      }

      return row[rowname]
      console.log('row', row)
      console.log('rowname', rowname)
    },
    // js过滤函数
    filterfun_to_flowstatus(row, rowname) {
      if (row.isCancel) {
        return '已取消'
      }
      if (row[rowname] == 0) {
        return '已结束' + (row.CancelNum ? '(取消' + row.CancelNum + '次)' : '')
      } else {
        return '未结束(' + row[rowname] + ')'
      }
    },
    filterfun_int_to_datetime(row, rowname, paradata) {
      // console.log('filterfun_to_friendlytimejs',JSON.stringify(row),rowname)
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
    filterfun_to_friendlytimejs(row, rowname, paradata) {
      // console.log('filterfun_to_friendlytimejs',JSON.stringify(row),rowname)
      try {
        // return this.funtool_timetrans(row[rowname].$date.$numberLong/1000)
        // console.log('row',row)
        return FriendlyTime(this.funtool_timetrans(row[rowname].$date.$numberLong / 1000), new Date())
      } catch (e) {
        console.log(e)
        // row[rowname]=null
        return null
      }
    },
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

          FlowAdminSearchForm(postdata).then(({ data: res }) => {
            // res.data.pagedata.result.forEach(ele=>{
            //     console.log(ele)
            //     if(!!ele.formdata){
            //         console.log(ele.formdata)
            //         for(let key in ele.formdata){
            //             ele['formdata'+key]=ele.formdata[key]
            //         }
            //     }
            // })

            this.searchloading = false
            this.AfterSearch(res)
            console.log(res)

            if (res.success) {
              this.myPermissions = res.data.pagedata.permissions
            }
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
