<template>
  <div class="searchForm">
    <modal-watch-form ref="watchform" />
    <modal-cancel ref="cancelflow" @on-cancel-success="cancelSuccess" />
    <modal-revoke ref="revokeflow" @on-revoke-success="revokeSuccess" />

    <modal-flow-detail ref="flowdetail" :is-admin="true" />
    <el-card v-if="afterinit">
      <div v-if="!!widgetForm&&widgetForm.list.length>0" class="searchWidget">
        <fm-generate-form ref="generateForm" :data="widgetForm" :remote="remoteFuncs" :value="search.form" class="generateForm"/>
      </div>

      <divider title="排序"/>
      <order-by v-model="search.orderby" :orderbylist="orderby_list" style="margin-left: 100px;"/>

      <div style="margin-left: 100px;margin-top: 15px;">
        <el-button type="primary" class="searchbutton" @click="search_submit">搜索</el-button>
        <span v-if="!!searchinfo.info" :class="searchinfo.type">{{ searchinfo.info }}</span>
      </div>

      <slot name="aftersearchform"/>
      <slot name="searchresult">
        <el-card v-loading="searchloading" style="margin-top:20px;min-height:200px;">

          <div v-if="!!display_set" style="margin-bottom: 10px;">

            <span v-for="(opra,index2) in display_set.topbtns" :key="index2" class="topbtns">
              <span v-if="opra.type=='button'" class="topbtn_item">
                <el-button :icon="opra.icon" :type="opra.btnclass" size="mini" @click="button_click({},opra.funName)">{{ opra.name }}</el-button>
              </span>
              <span v-if="opra.type=='custom'" class="topbtn_item">
                <component :is="opra.customName" :showname="opra.name"/>
              </span>
              <span v-if="opra.type=='outlink'" class="topbtn_item">
                <el-button :icon="opra.icon" :type="opra.btnclass" size="mini" @click="outlink_click({},opra)">{{ opra.name }}</el-button>
              </span>
              <span v-if="opra.type=='innerlink'" class="topbtn_item">
                <el-button :icon="opra.icon" :type="opra.btnclass" size="mini" @click="innerlink_click({},opra)">{{ opra.name }}</el-button>
              </span>
            </span>

          </div>

          <div v-if="!searchloading" class="result">
            <div style="margin-bottom:10px;">

              共搜索到
              <span class="totalItems">{{ page.totalItems }}</span>条记录

              <el-button v-if="showexport()" type="text" size="mini" @click="exportData">根据当前搜索内容导出数据</el-button>
            </div>

            <el-table v-if="page.totalItems" ref="multipleTable" :data="page.result" :max-height="pageset.display_set.tablemaxheight" :row-class-name="tableRowClassName" stripe border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column v-if="pageset.display_set.checkbox" :selectable="checkboxT" type="selection" width="35">
              </el-table-column>

              <el-table-column v-for="(item,index) in pageset.display_list" v-if="!item['hide']" :key="index" :label="item.zh_name" :prop="item.name" :fixed="item.fixedtype" :width="item.width">
                <template slot-scope="scope">
                  <div v-if="!scope.row['___type']" :class="item['class']" :style="toJSON(item['style'])">
                    <template v-if="item.type=='operate'">
                      <span v-for="(opra,index2) in item.operates" :key="index2" class="operates">
                        <span v-if="!opra.hide&&button_show(scope.row,opra.showFunName)">
                          <span v-if="opra.type=='button'" class="operate_item">
                            <el-button :type="opra.btnclass" size="mini" @click="button_click(scope.row,opra.funName)">{{ opra.name }}</el-button>
                          </span>
                          <span v-if="opra.type=='custom'" class="operate_item">
                            <component :is="opra.customName" :data="row" :showname="opra.name"/>
                          </span>
                          <span v-if="opra.type=='outlink'" class="operate_item">
                            <el-button :type="opra.btnclass" size="mini" @click="outlink_click(scope.row,opra)">{{ opra.name }}</el-button>
                          </span>
                          <span v-if="opra.type=='innerlink'" class="operate_item">
                            <el-button :type="opra.btnclass" size="mini" @click="innerlink_click(scope.row,opra)">{{ opra.name }}</el-button>

                        </span></span>
                      </span>
                    </template>
                    <template v-else-if="1">
                      <span
                        v-if="item.type!='operate'"
                      >
                        <template v-if="item._isformdata">
                          <el-switch
                            v-if="item._formset.type==&quot;switch&quot;"
                            v-model="scope.row[item.name]"
                            disabled/>
                          <el-button v-else-if="item._formset.type==&quot;table&quot;" type="text" size="mini" @click="watchTable(item,scope.row)">查看表格</el-button>
                          <span v-else-if="1">{{ scope.row[item.name+js_filter_mark_str] }}</span>
                        </template>
                        <template v-else-if="!!item.jsfilter&&scope.row[item.name+js_filter_mark_str]">
                          {{ scope.row[item.name+js_filter_mark_str] }}
                        </template>
                        <template v-else-if="1">
                          {{ scope.row[item.name] }}
                        </template>
                      </span>
                    </template>
                  </div>
                  <div v-else-if="1">
                    <el-tooltip v-if="!!item.aggregate" :content="getAggregateName(item.aggregate,item.name)" class="item" effect="light" placement="top">
                      <span>{{ scope.row[item.name] }}</span>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <div style="margin:10px 0;padding:10px 0;">

              <div style="float:left">
                <el-button v-if="hasMulp" size="mini" @click="toggleTable">全选/全不选</el-button>

                <span v-for="(opra,index2) in MulpOperates" :key="index2" class="MulpOperates">
                  <span v-if="opra.batchupdate&&!opra.hide&&button_show(multipleSelection,opra.showFunName)">

                    <span v-if="opra.type=='button'" class="MulpOperate_item">
                      <el-button :disabled="!multipleSelection.length" :type="opra.btnclass" size="mini" @click="button_click(multipleSelection,opra.funName)">{{ opra.name }}({{ multipleSelection.length }})</el-button>
                    </span>
                    <span v-if="opra.type=='custom'" class="MulpOperate_item">
                      <component :disabled="!multipleSelection.length" :showname="opra.name" :is="opra.customName" :data="multipleSelection"/>
                    </span>
                    <span v-if="opra.type=='outlink'" class="MulpOperate_item">

                      <el-button :disabled="!multipleSelection.length" :type="opra.btnclass" size="mini" @click="outlink_click(multipleSelection,opra)">{{ opra.name }}({{ multipleSelection.length }})</el-button>

                    </span>
                    <span v-if="opra.type=='innerlink'" class="MulpOperate_item">
                      <el-button :disabled="!multipleSelection.length" :type="opra.btnclass" size="mini" @click="innerlink_click(multipleSelection,opra)">{{ opra.name }}({{ multipleSelection.length }})</el-button>

                  </span></span>
                </span>

              </div>

              <div style="float:right">
                <el-pagination :current-page="page.currentPage" :page-size="page.pageSize" :pager-count="5" :total="page.totalItems" background layout="prev, pager, next" @current-change="handleCurrentChange"/>
              </div>
              <div class="clear"/>
            </div>
          </div>
        </el-card>
      </slot>
    </el-card>

    <div v-if="iframedialogVisible">
      <el-dialog :visible.sync="iframedialogVisible" :width="iframewidth" custom-class="iframeDialog" append-to-body>
        <iframe :src="iframesrc" :style="{height:iframeheight}" frameborder="0" style="width: 100%;"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import OrderBy from './common/COrderBy.vue'
import Divider from './common/CDivider.vue'
import searchform from '@/utils/mixins/searchform'
import ModalFlowDetail from './common/CModalFlowDetail'
import ModalWatchForm from './common/CModalWatchForm'
import ModalCancel from './common/CModalCancel.vue'
import ModalRevoke from './common/CModalRevoke.vue'



export default {
  name: 'SearchFormCommon',
  // mixins: [searchform],
  components: {
    OrderBy,
    Divider,
    ModalFlowDetail,
    ModalWatchForm,
    ModalCancel,
    ModalRevoke
  },

  props: {
    isMongodb: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    pageSet: {
      type: Object
    },
    default: {
      type: Object
    },
    dbId: {
      type: String
    },
    submitUrl: {
      type: String,
      default: () => {
        return ''
      }
    }
  },

  data() {
    return {
      mongo_split_str: '___________',
      js_filter_mark_str: '_______js_filter',
      iframedialogVisible: false,
      iframewidth: null,
      iframeheight: null,
      iframesrc: null,
      multipleSelection: [],
      MulpOperates: [],
      // isPc:,
      searchinfo: {
        type: '', //
        info: ''
      },
      currentPage: 1, 
      searchloading: true,
      afterinit: false,
      display_set: null,
      search: {
        form: {},
        orderby: []
      },
      page: {
        result: [],
        totalItems: 0,
        pageSize: 20,
        currentPage: 1
      },
      pageset: {
        display_set: {},
        display_list: []
      },
      orderby_list: [],
      remoteFuncs: {}, 
      
      widgetForm: null 
    }
  },

  computed: {
    hasMulp() {
      return this.MulpOperates.some(v => {
        return v.batchupdate
      })
    }
  },
  mounted() {
    console.log('pageSet')
    console.log('pageSet', this.pageSet)
    console.log('search', this.search)

    this.initdata()
    this.afterinit = true
    setTimeout(() => {
      this.search_submit()
    }, 19)
  },

  methods: {

    button_click_creat() {
      this.$message.info('创建')
    },
    button_click_sort() {
      this.$message.info('排序')
    },
    addclass(stylestr) {
      const style = document.createElement('style')

      style.type = 'text/css'

      try {
        style.appendChild(document.createTextNode(stylestr))
      } catch (ex) {
        style.styleSheet.cssText = stylestr 
      }

      const head = window.document.getElementsByTagName('head')[0]

      head.appendChild(style)
    },
    openiframe(url, width, height) {
      console.log(width)
      console.log(height)

      this.iframesrc = url
      this.iframewidth = width
      if (this.iframewidth) {
        this.iframewidth += ''
        this.addclass('.iframeDialog{width:' + this.iframewidth + 'px}')
      }

      setTimeout(() => {
        this.iframedialogVisible = true
      }, 300)
      this.iframeheight = height ? height + 'px' : '500px'
    },
    topx(str) {
      

    },
    
    toggleTable() {
      this.page.result.forEach(row => {
        if (!row.___type) { 
          this.$refs.multipleTable.toggleRowSelection(row)
        }
      })
    },
    
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    replaceAll(str, from, to) {
      

      const len = str.split(from).length - 1
      for (let i = 0; i < len; i++) {
        str = str.replace(from, to)
      }

      return str
    },

    replaceUrlkey(row, url) {
      

      if (row.constructor === Array) {
        if (row.length > 0) {
          for (const key in row[0]) {
            

            console.log(url.indexOf('$[' + key + ']') != -1)

            if (url.indexOf('$[' + key + ']') != -1) {
              const arr = []
              for (let k = 0; k < row.length; k++) {
                const ele = row[k]
                arr.push(ele[key])
              }
              console.log(arr)
              url = this.replaceAll(url, '$[' + key + ']', JSON.stringify(arr))
            }

            
          }
        }
      }

      if (row.constructor === Object) {
        for (const key in row) {
          url = this.replaceAll(url, '$[' + key + ']', row[key])
          
        }
      }

      return url
    },

    outlink_click(row, operate) {
      const url = this.replaceUrlkey(row, operate.url)

      if (operate.urltarget == '_blank') {
        window.open(url, '_blank')
        return
      }
      if (operate.urltarget == 'dialog') {
        this.openiframe(url, operate.dialogwidth, operate.dialogheight)

        return
      }
      window.location.href = url
    },
    innerlink_click(row, operate) {
      
      console.log(operate)
      if (this.$router) {
        this.$router.push(this.replaceUrlkey(row, operate.url))
      }
    },
    
    showpic2(row) {
      

      if (row.constructor === Array) {
        let str = ''
        row.forEach(ele => {
          str += ele.name
        })

        this.$message.info(str)
      }

      if (row.constructor === Object) {
        this.$message.info(row.name)
      }
    },
    // button_show_funname(row){return false},
    button_show(row, funName) {
      if (!funName) return true
      console.log('funName', funName)
      switch (funName) {
        // case 'showpic':
        //     this.$message.info('showpic')
        //     break;

        default:
          if (this[funName]) return this[funName](row) 
          break
      }
      return true
    },
    button_click(row, funName) {
      

      
      switch (funName) {
        case 'showpic':
          this.$message.info('showpic')
          break

        default:
          if (this[funName]) this[funName](row) 
          break
      }
    },

    
    filterFun(funname, row, rowname, paradata = null) {
      
      
      switch (funname) {
        case 'pic':
          return row[rowname] + 'pic' + paradata.join('---')
          break
        default:
          if (this[funname]) {
            return this[funname](row, rowname, paradata) 
          }
          return row[rowname]
          break
      }
    },

    GetDataSource(str) {
      const pos = str.indexOf(':')
      const head = str.substr(0, pos)
      const body = str.substr(pos + 1)
      switch (head) {
        case 'json':
          try {
            return JSON.parse(body)
          } catch (e) {
            console.log(e)
            return null
          }
          break

        default:
          break
      }
      return null
    },
    
    
    
    // tranfilter_str(){},
    tranfilterResult(list) {
      this.pageset.display_list.forEach(display => {
        if (!display.hide && display.type != 'operate') {
          list.forEach(item => {
            if (!item['___type'] && !!display.jsfilter) {
              item[display.name + this.js_filter_mark_str] = this.tranfilter(item, display.name, display.jsfilter)
            }
          })
        }
      })
      console.log('tranfilterResult', list)
    },
    tranfilter(row, rowname, jsfilter) {
      
      if (!jsfilter) {
        return row[rowname]
      }

      console.log('jsfilter', jsfilter)
      const pos = jsfilter.indexOf('@')
      const pos2 = jsfilter.indexOf('#')

      
      if (pos == -1) {
        if (pos2 == -1) {
          return this.filterFun(jsfilter, row, rowname)
        } else {
          const filterFun = jsfilter.substr(0, pos2)
          const paradata = jsfilter.substr(pos2 + 1) 
          return this.filterFun(filterFun, row, rowname, paradata.split('#'))
        }
      }
      
      
      let filterFun = null
      let dataSource = null
      if (pos2 == -1) {
        filterFun = jsfilter.substr(0, pos) 
        dataSource = jsfilter.substr(pos + 1) 
      } else {
        filterFun = jsfilter.substr(0, pos)
        // dd($filterFun);
        dataSource = jsfilter.substr(pos + 1, pos2 - pos - 1) 
      }

      const Sdata = this.GetDataSource(dataSource)

      if (Sdata) {
         for (let i=0;i<Sdata.length;i++) {
                    let ele=Sdata[i];
                    if (ele.v == row[rowname]) {
                        return ele.n;
                        // row[rowname] = ele.n;
                    }
                }
      }

      if (pos2 == -1) {
        return this.filterFun(filterFun, row, rowname)
      }

      const paradata = jsfilter.substr(pos2 + 1) 
      return this.filterFun(filterFun, row, rowname, paradata.split('#'))
      // explode('#',paradata))
    },
    getAggregateName(key, colname) {


      switch (key) {
        case 'sum':
          return '对' + colname + '列 的 汇总（SUM）'
          break
        case 'average':
          return '对' + colname + '列 的 平均（Average）'
          break
        default:
          return ''
          break
      }
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      if (row['___type']) {
        console.log('___type', row)
        return 'aggregete-row'
      }
      return ''
    },
    
    checkboxT(row, index) {
      console.log(row)
      if (row['___type']) {
        return 0
      } else {
        return 1
      }
    },
    toJSON(jsonstr) {
      if (!jsonstr) {
        return null
      }
      try {
        return JSON.parse(jsonstr)
      } catch (e) {
        console.log(e)
        return null
      }
    },
    initdata() {
      
      this.widgetForm = this.initFormset(this.pageSet.searchFormSet)
      this.orderby_list = this.pageSet.orderby_list
      this.display_set = this.pageSet.display_set

      // console.log('search', this.search)
      
      if (this.default.search) {
        this.search = Object.assign(this.search, this.default.search) 
      }
      
      if (this.search.orderby.length == 0 && this.orderby_list.length > 0) {
        this.search.orderby.push({
          name: this.orderby_list[0].name,
          by: 'desc'
        })
      }
    },
    CopyObject(obj) {
      return JSON.parse(JSON.stringify(obj))
    },

    splicerequiredrule(rules) {
      if (!rules) return
      let hasfind = false
      for (let i = rules.length - 1; i >= 0; i--) {
        const element = rules[i]
        if (typeof element.required !== 'undefined') {
          hasfind = true
          element.required = false
        }
      }
    },
    FormItemRest(list) {
      
      
      for (let i = list.length - 1; i >= 0; i--) {
        const ele = list[i]
        if (ele.type == 'grid' && !!ele.columns) {
          if (ele.columns.length) {
            for (let k = 0; k < ele.columns.length; k++) {
              const elek = ele.columns[k]

              this.FormItemRest(elek.list)
            }
          }
        } else {
          
          
          this.initFormSetItem(ele)
          if (ele.type == 'table' || ele.type == 'placeholderhtml') {
            list.splice(i, 1)
          } else {
            ele.model = this.replaceAll(ele.model, '.', this.mongo_split_str)
            ele.options.required = false
            this.splicerequiredrule(ele.rules)
          }
        }
      }
    },
    initFormSetItem(item) {
      if (!item.rules) item.rules = []

      // item.options.defaultValue;
      
      if (Object.keys(item.options).indexOf('options') >= 0 && item.options.remote == false) {
        const vallist = item.options.options.map(v => {
          return v.value
        })

        if (item.options.defaultValue) {
          if (item.options.defaultValue.constructor == Array) {
            for (let k = item.options.defaultValue.length - 1; k >= 0; k--) {
              const ele = item.options.defaultValue[k]
              if (!vallist.some(v => {
                return v == ele
              })) {
                item.options.defaultValue.splice(k, 1)
              }
            }
          }

          if (item.options.defaultValue.constructor == String) {
            if (!vallist.some(v => {
              return v == item.options.defaultValue
            })) {
              item.options.defaultValue = null
            }
          }
        }
      }

      
    },
    initFormset(set) {
      
      this.FormItemRest(set.list)
      return set
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search_submit()
    },
    DropDownSaveSearch() {},
    DropDownClearSearch() {},
    DropDownSaveTable() {},
    DropDownClearTable() {},
    DropDownGotoedit() {
      window.open('/admin/dbctrl3/edit/' + this.dbId, '_blank')
    },

    AfterSearch(req) {
      if (!req.success) {
        this.$message.error(req.msg)
        this.searchinfo = {
          type: 'error',
          info: req.msg
        }
        return
      } else {
        this.searchinfo = {
          type: 'info',
          info: req.msg
        }

        setTimeout(() => {
          this.searchinfo.info = null
        }, 3000)
      }

      const {
        pageset,
        pagedata
      } = req.data
      this.pageset = pageset
      this.multipleSelection = []
      

      this.tranfilterResult(pagedata.result, );

      this.page = {
        result: pagedata.result,
        totalItems: pagedata.totalItems,
        pageSize: pagedata.pageSize,
        currentPage: pagedata.currentPage
      }
      
      this.display_list = pageset.display_list

      this.MulpOperates = []

      this.display_list.forEach(ele => {
        if (!ele['hide']) {
          if (ele.type == 'operate') {
            this.MulpOperates = this.MulpOperates.concat(ele.operates)
          }
        }
      })

      console.log('MulpOperates', this.MulpOperates)

      if (this.page.result.length > 0 && !!pagedata.aggregete && pagedata.aggregete.length) {
        pagedata.aggregete[0].___type = 'a' 
        this.page.result.push(pagedata.aggregete[0])
      }
    },
    getpostdata() {
      const postdata = {
        search: this.CopyObject(this.search),
        currentPage: this.currentPage
      }

      for (const key in postdata.search.form) {
        console.log(key)
        if (key.indexOf(this.mongo_split_str) != -1) {
          postdata.search.form[this.replaceAll(key, this.mongo_split_str, '.')] = postdata.search.form[key]
          delete postdata.search.form[key]
        }
      }

      return postdata
    }

  }
}
</script>

<style>
.searchForm .el-table .aggregete-row,
.searchForm .el-table .aggregete-row:hover {
    background: #ffc107;
    color: black;
}

.searchForm .searchWidget .el-input__inner {
    width: auto;
}

.searchForm .searchWidget .el-form-item.is-success .el-input__inner,
.searchForm .searchWidget .el-form-item.is-success .el-input__inner:focus,
.searchForm .searchWidget .el-form-item.is-success .el-textarea__inner,
.searchForm .searchWidget .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #DCDFE6;
}
</style>

<style scoped>
.operates .operate_item {
    margin-bottom: 5px;
    display: inline-block;
}

.error,
.default,
.info {
    font-size: 12px;
    margin-left: 10px;
}

.error {
    color: red;
}

.info {
    color: green;
}

.totalItems {
    color: #ff6600;
    font-size: 13px;
}

.result {
    font-size: 13px;
}

.toppageset {
    position: absolute;
    right: 23px;
    top: 19px;
}
</style>
