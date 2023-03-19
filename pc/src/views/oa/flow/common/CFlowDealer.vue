<template>
  <div v-loading="loading" class="flowdealer">

    <modal-cancel ref="cancelflow" @on-cancel-success="cancelSuccess" />
    <modal-revoke ref="revokeflow" @on-revoke-success="revokeSuccess" />

    <div>
      <div v-if="!!error">
        {{ error }}
      </div>

      <el-dialog :fullscreen="!isPc" :visible.sync="PreviewModalStatus" title="下一步流程预览" width="65%" append-to-body>
        <div v-if="!!previewData">
          <flow-preview-submit :flowlevel='msgObj.level' v-if="PreviewModalStatus" ref="flowpreviewsubmit" :buttoninfo="buttoninfo" :previewdata="previewData" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="PreviewModalStatus=false">取 消</el-button>
          <el-button type="primary" @click="btnoksure">确定提交</el-button>
        </span>
      </el-dialog>

      <div v-if="!successShow">

        <div v-if="!!msgObj">

          <div v-if="!!msgObj.level&&msgObj.level==100">

            <svg-icon class="emergency_tag"  icon-class="紧急订单" />

          </div>
          <el-alert v-if="!!msgObj.flowlistOi.workname" :title="'文号：'+msgObj.flowlistOi.workname" :closable="false" style="margin-bottom:10px;font-weight:bolder" type="error" />

          



          <el-alert v-if="!!msgObj.flowlistOi.desc" :title="'申请内容：'+msgObj.flowlistOi.desc" :closable="false" style="margin-bottom:10px;font-weight:bolder" type="success" />

          <el-form label-position="right" style="margin-top: 10px;">
            <div class="flowdealBox">

              <el-dropdown v-if="!!tempflowdata" class="shortsave" size="mini" split-button @click="shortSaveClick">
                暂存
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="formDatatype=='temp'" @click.native="shortSaveToggle('new')">恢复原表单内容</el-dropdown-item>
                  <el-dropdown-item v-else @click.native="shortSaveToggle('temp')">显示暂存内容</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button v-else class="shortsave" size="mini" @click="shortSaveClick">暂存</el-button>

            </div>
            <el-form-item v-if="mydepts.length>1" required label="选择您所在的部门：">
              <el-select v-model="flowdata.dept" placeholder="请选择">
                <el-option v-for="item in mydepts" :key="item.v" :label="item.n" :value="item.v"/>
              </el-select>
              <el-tooltip content="由于您同时属于多个部门，先选择你提交此申请的部门">
                <span class="fz12" style="color:red">*选择提交此申请的部门</span>
              </el-tooltip>

            </el-form-item>
            <el-form-item v-else>
              您所在的部门：
              <span class="mydeptname">{{ mydeptName }}</span>
            </el-form-item>
          </el-form>
          <div v-if="!!widgetForm">
            <el-card :class="widgetForm.list.length==0?'nocard':''">
              <fm-generate-form v-if="showgenerateForm" ref="generateForm" :data="widgetForm" :remote="remoteFuncs" :value="widgetModels" class="generateForm">
                <template slot="blank" slot-scope="scope">
                  宽度：
                  <el-input v-model="scope.model.blank.width" style="width: 100px" />
                  高度：
                  <el-input v-model="scope.model.blank.height" style="width: 100px" />
                </template>
              </fm-generate-form>
            </el-card>
          </div>

          <el-form style="margin-top:20px" label-position="top">
            <el-form-item label="历史审批建议">
              <timeline>
                <span v-for="(msg,index) in msgObj.timeline" :key="msg._id">
                  <timeline-item v-if="!!msg.log&&!!msg.log.suggest" color="green">
                    <div class="fz12">
                      <v-icon name="person" />
                      <span v-if="!!msg.todeptstr">[{{ msg.todeptstr }}]</span>
                      <span>
                        {{ msg.toer }}</span>

                      <span>于{{ friendlytimejs(msg.finished_at) }}</span>
                      <span class="label warning">{{ msg.NowFunName }}</span>
                    </div>
                    <div>
                      <span :class="index==0?'label firstsuggest':''" style="font-weight: bolder;">
                        {{ msg.log.suggest }}</span>
                    </div>

                </timeline-item></span>
              </timeline>
            </el-form-item>
          </el-form>

          <el-form class="mg-t5" label-position="top">
            <el-form-item label="您的审批建议">
              <el-input :rows="2" v-model="flowdata.suggest" type="textarea" placeholder="可输入建议文字" />
            </el-form-item>

          </el-form>

          <el-card style="margin-top: 10px; margin-bottom:10px;" shadow="never">
            <el-collapse v-if="!!msgObj.flowlistOi.filelistlog&&msgObj.flowlistOi.filelistlog.length>0" accordion value="4">
              <el-collapse-item name="4">
                <template slot="title">
                  文件上传日志
                </template>

                <flow-file-log :filelistlog="msgObj.flowlistOi.filelistlog"/>

              </el-collapse-item>
            </el-collapse>
            <div class="mg-b5 fz13" style="font-weight:border;margin-top:10px">上传新的文件附件：</div>
            <div>
              <file-list ref="filelist" :flowlistid="msgObj.flowlistid" :flowdesignid="msgObj.flowid" :file-list="flowdata.fileList" class="pd10"/>
            </div>

          </el-card>

          <template v-if="!!msgObj.NowFun">

            <el-button size="small" type="info" icon="el-icon-caret-left" @click="revokeflow">撤回到以前</el-button>

            <el-checkbox v-if="ShowignoreFormMd5" v-model="flowdata.ignoreFormMd5" style="margin-left:8px">强制提交表单</el-checkbox>

            <div class="btns">
              <span v-for="(item,index) in msgObj.NowFun.btnGroup" :key="index" >
                <span v-if="msgObj.NowFun.dealtype=='andsign'">
                  <el-button v-if="index==0" size="medium" @click="btnok(index)">{{ item.name }}</el-button>
                </span>
                <span v-else>
                  <el-button size="medium" @click="btnok(index)">{{ item.name }}</el-button>
                </span>
              </span>
            </div>
          </template>
        </div>
      </div>
      <div v-else>

        <flow-deal-success :data="submitdata" />

      </div>

    </div>

  </div>
</template>

<script>


import {
  FlowDealByMsgid,
  FlowDeal,
  FlowDealPreviewMode,
  FlowTempFormSave
} from '@/api/oa'

import flowEdit from '@/utils/mixins/flowEdit'

import {
  Timeline,
  TimelineItem,
  TimelineTitle
} from 'vue-cute-timeline'

import {
  tran_dealtype,
  initFormSetItem
} from '@/utils/u_flowdesign'

import {
  FriendlyTime
} from '@/utils/friendlytimejs'

import FlowPreviewSubmit from './CFlowPreviewSubmit'
import FlowDealSuccess from './CFlowDealSuccess'
import FileList from './CFileList'
import ModalCancel from './CModalCancel.vue'
import ModalRevoke from './CModalRevoke.vue'
import FlowFileLog from './CFlowFileLog.vue'
import contact from '@/store/modules/contact';

export default {
  name: 'Cflowdealer',
  components: {
    FlowPreviewSubmit,
    FlowDealSuccess,
    FileList,
    FlowFileLog,
    Timeline,
    TimelineItem,
    TimelineTitle,
    ModalCancel,
    ModalRevoke
  },
     mixins: [flowEdit],
  props: {
    
    flowmsgid: {
      type: String,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      error: null,
      title: null,
      loading: false,
      msgObj: null,
      designer: {
        nowfun: null
      },
      remoteFuncs: {}, 
      widgetModels: {}, 
      widgetForm: null, 
      // successShow: false,
      // newGetFlowId: null,
      submitdata: null,

      
      flowdata: this.initFlowdata(),

      tempflowdata: null, 
      tempwidgetModels: {}, 
      
      formDatatype: 'new', 
      showgenerateForm: false,

      successShow: false,

      PreviewModalStatus: false,
      previewData: null,
      buttoninfo: null,
      btnindex: null,
      ShowignoreFormMd5: false
    }
  },

  mounted() {
    if (this.mydepts.length == 0) {
      this.mydeptName = '全公司'
      this.flowdata.dept = '1'
    } else if (this.mydepts.length == 1) {
      this.mydeptName = this.mydepts[0].n
      this.flowdata.dept = this.mydepts[0].v
    }

    console.log(this.flowmsgid)
    this.loading = true

    FlowDealByMsgid({
      _id: this.flowmsgid
    }).then(({
      data: req
    }) => {
      this.loading = false
      console.log(req)

      if (req.success) {
        if (!req.data) {
          this.error = '没有查询到对应的流程'
          return
        }

        this.msgObj = req.data
        this.designer = this.msgObj.flowdesigner

        this.flowdata.formmd5 = this.msgObj.formmd5
        

        this.msgObj.NowFun = this.getflowfunByfunid(this.designer, this.msgObj.NowFunid)
        // this.msgObj.PreFun = this.getflowfunByfunid(this.designer, this.msgObj.PreFunid)

        // this.msgObj.flowlistOi.formdata
        console.log(this.msgObj)

        this.widgetForm = this.initFromset(this.designer,
          this.msgObj.NowFun,
          this.msgObj.flowlistOi.formdata)

        if (!this.isPc) {
          this.widgetForm.config.labelWidth = null
          this.widgetForm.config.labelPosition = 'top'
        }
        console.log('this.widgetForm ', this.widgetForm)
        this.widgetModels = this.copyobject(this.msgObj.flowlistOi.formdata)

        console.log(this.widgetForm)

        const form_save = req.data.form_save

        if (form_save) {
          form_save.flowdata.ignoreFormMd5 = false 
          if (this.msgObj.formmd5 != form_save.flowdata.formmd5) {
            this.$alert('您暂存的表单部分内容之后被其他人修改过，系统默认显示原表单，如需切换到暂存的表单请点击右上角的 显示暂存表单', '提示', {
              confirmButtonText: '好的',
              callback: action => {}
            })

            this.tempflowdata = form_save.flowdata
            this.tempwidgetModels = this.reloaddisableData(this.filterDisableItem(form_save.inputdata))
            
          } else {
            
            this.formDatatype = 'temp'
            this.tempflowdata = this.copyobject(this.flowdata)
            this.tempwidgetModels = this.copyobject(this.widgetModels)
            this.flowdata = form_save.flowdata
            this.widgetModels = this.reloaddisableData(this.filterDisableItem(form_save.inputdata))
            
          }
        }

        this.showgenerateForm = true
        // this.designer.funlist.forEach(fun => {
        //     if (fun.is_start) {
        //         this.designer.nowfun = fun;
        //         console.log(this.designer.nowfun);
        //     }
        // })
      } else {
        this.error = req.msg
      }
    }).catch(e=>{
      this.loading=false
    })
  },
  methods: {

    reloaddisableData(nowdata) {
      // return nowdata;
      const formdata = this.msgObj.flowlistOi.formdata
      for (const key in formdata) {
        if (typeof nowdata[key] === 'undefined') {
          nowdata[key] = formdata[key]
        }
      }
      return nowdata
    },

    initFlowdata() {
      
      return {
        suggest: null,
        dept: null,
        fileList: [],
        formmd5: null,
        ignoreFormMd5: false
      }
    },

    shortSaveToggle(type) {
      
      this.formDatatype = type

      const tempwidgetModels = this.copyobject(this.$refs.generateForm.getDataWithOutValid())

      const tempflowdata = this.copyobject(this.flowdata)

      this.widgetModels = this.copyobject(this.tempwidgetModels)

      this.flowdata = this.copyobject(this.tempflowdata)

      this.tempwidgetModels = tempwidgetModels

      this.tempflowdata = tempflowdata

      this.showgenerateForm = false
      setTimeout(() => {
        this.showgenerateForm = true
      }, 100)
    },
    shortSaveClick() {
      // alert('ddd');

      if (this.formDatatype == 'new' && !!this.tempflowdata) {
        if (!confirm('确定暂存当前表单内容吗？')) return
      }

      
      this.loading = true

      FlowTempFormSave({
        type: 'deal',
        msgid: this.flowmsgid,
        flowdata: this.flowdata, 
        inputdata: this.filterDisableItem(this.$refs.generateForm.getDataWithOutValid())
        
      }).then(({
        data: req
      }) => {
        this.loading = false

        if (req.success) {
          // this.$notify

          if (this.formDatatype == 'new') {
            
            this.formDatatype = 'temp'
            
            this.tempflowdata = null
            this.tempwidgetModels = {}
          }

          this.$message.success(req.msg)
        } else {
          this.$message.error(req.msg)
        }
      }).catch(e=>{
        this.loading=false
      })
    },

    cancelSuccess() {
      this.$emit('on-cancel-success') 
    },
    revokeSuccess() {
      this.$emit('on-revoke-success') 
    },

    friendlytimejs(timestr) {
      return FriendlyTime(timestr, new Date())
    },
    // test(){
    //     this.$emit('on-cancel-success',{
    //     userName: 'ddd',
    //     password: 'ddddd'
    //   })
    // },

    cancelflow() {
      
      this.$refs.cancelflow.loadCancelView(this.msgObj.flowlistOi._id)
    },
    revokeflow() {
      this.$refs.revokeflow.loadRevokeView(this.flowmsgid)
    },

    tran_dealtype(type) {
      return tran_dealtype(type)
    },
    getflowfunByfunid(designer, funid) {
      for (let i = 0; i < designer.funlist.length; i++) {
        const fun = designer.funlist[i]
        if (fun.id == funid) {
          return fun
        }
      }
      return null
    },
    btnoksure() {
      const {
        funlist,
        sonflows
      } = this.$refs.flowpreviewsubmit.getdata()

      if (!funlist) return

      

      this.PreviewModalStatus = false 

      this.$refs.generateForm.getData().then(data => {
        // alert('loging');
        // console.log(data);
        
        

        const postformdata = this.filterDisableItem(data)
        console.log('postformdata', postformdata)

        // const newdata = {}
        // for (const key in data) {
        //     const keymatch = key.match(/\d{13}_\d{1,}/g)
        //     let datakey = null
        //     if (keymatch) {
        //         datakey = keymatch[0]
        //     }
        //     // let hasfind=false;
        //     this.msgObj.NowFun.requiredata.forEach(redata => {
        //         if (redata == datakey) {
        
        //             newdata[key] = data[key]
        //         }
        //     })
        // }

        this.loading = true

        FlowDeal({
          flowdata: this.flowdata,
          btnindex: this.btnindex,
          funid: this.msgObj.NowFun.id,
          flowmsgid: this.flowmsgid,
          inputdata: postformdata,
          funlist: funlist,
          sonflows: sonflows
        }).then(({
          data: req
        }) => {
          this.loading = false
          if (req.success) {
            this.$notify({
              type: 'success',
              title: '成功',
              message: req.msg
            })
            this.submitdata = req
            this.successShow = true
            this.$emit('on-deal-success')
          } else {
            this.$message.error(req.msg)
            if (req.data == 'formmd5error') {
              this.ShowignoreFormMd5 = true
            }
          }
        })
      }).catch(e => {
         this.loading = false
        //console.log(e)
        
        this.$message.error(e)
        // this.$refs.widgetPreview.end()
      })
    },
    btnok(btnindex) {
      if (this.$refs.filelist.getUnuploadLen()) {
        if (!confirm('您有未上传的文件，建议上传后提交，确定忽略吗？')) return
      }
      this.previewData = null

      this.buttoninfo = this.msgObj.NowFun.btnGroup[btnindex]
      this.btnindex = btnindex

      this.$refs.generateForm.getData().then(data => {
        // alert('loging');
        // console.log(data);
        
        
        const postformdata = this.filterDisableItem(data)
        console.log('postformdata', postformdata)

        this.loading = true

        FlowDealPreviewMode({
          flowdata: this.flowdata,
          btnindex: btnindex,
          funid: this.msgObj.NowFun.id,
          flowmsgid: this.flowmsgid,
          inputdata: postformdata
        }).then(({
          data: req
        }) => {
          this.loading = false
          if (req.success) {
            // this.$Message.info(req.msg);
            this.PreviewModalStatus = true
            this.previewData = req
            // this.$notify({
            //   type: 'success',
            
            //   message: req.msg
            // })
            // this.successShow = true
            // this.successMsg = req.msg

             } else {
            this.$message.error(req.msg)
            if (req.data == 'formmd5error') {
              this.ShowignoreFormMd5 = true
            }
          }
        })
      }).catch(e => {
          this.loading = false
        
        this.$message.error(!!e.message?e.message:e)
        // this.$refs.widgetPreview.end()
      })
    },
    
    
    leave_form_item_f(list, requiredata, formdata) {
      for (let i = list.length - 1; i >= 0; i--) {
        //            for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (
        // item.type == 'grid'
        // ||
          item.columns) {
          for (let k = 0; k < item.columns.length; k++) {
            const column = item.columns[k]
            this.leave_form_item_f(column.list, requiredata, formdata)
          }
        } else {
          let hasfind = false
          for (let k = 0; k < requiredata.length; k++) {
            const reqdata = requiredata[k]
            if (item.key == reqdata) {
              hasfind = true
            }
          }
          
          if (hasfind == false) {
            for (const key in formdata) {
              if (key == item.model) {
                hasfind = true
                item.options.disabled = true
                item.options.required = false
                item.rules = []
                
                
              }
            }
          }

          if (!hasfind) {
            
            list.splice(
              i, 1
            )
          }
        }
      }
    },

    getmax_u_at(list) {
      console.log('list', list)

      return Math.max(...list.map(v => {
        return v._u_at
      }))
    },

    diff_tabel_data(olddata, nowdata) {

      if(!olddata)return false;
      
      if (olddata.length != nowdata.length) {
        return false
      }
      const len = olddata.length

      for (let i = 0; i < len; i++) {
        const oldd = olddata[i]
        const newd = nowdata[i]

        for (const key in oldd) {
          if (!newd[key] || oldd[key] != newd[key]) {
            return false
          }
        }
      }

      return true
      
    },

    filterDisableItem(data) {
      const getDataListItemBymodel = (model) => {
        for (let i = 0; i < this.designer.datalist.length; i++) {
          const ele = this.designer.datalist[i]
          if (ele.model == model) {
            return ele
          }
        }
        return null
      }
      
      const nowdata = {}
      for (const model in data) {
        const DataListItem = getDataListItemBymodel(model)
        console.log('DataListItem', DataListItem)
        if(!DataListItem){
          continue;
        }
        const key = DataListItem.key
        for (let k = 0; k < this.msgObj.NowFun.formEditLimit.length; k++) {
          const ele = this.msgObj.NowFun.formEditLimit[k]

          if (ele.key == key && ele.type == 'canedit') {
            const olddata = this.msgObj.flowlistOi.formdata
            
            if (typeof data[model] === 'undefined') break 
            if (olddata[model] == data[model]) break 

            if (DataListItem.type == 'table') {
              

              if (this.diff_tabel_data(olddata[model], data[model])) {
                console.log('table 未做更新')
                break
              }
              // console.log(this.getmax_u_at(olddata[model]));
              // console.log(this.getmax_u_at(data[model]));
              
              // if(this.getmax_u_at(olddata[model])>= this.getmax_u_at(data[model])){
              
              //     break;
              // }
            }
            nowdata[model] = data[model]

            break
          }
        }
      }
      return nowdata
    },
    
    leave_form_item_f2(list, formEditLimit, formdata) {
      for (let i = list.length - 1; i >= 0; i--) {
        let hasdelete=false;
        const item = list[i]
        if (
        // item.type == 'grid'
        // ||
          item.columns) {
          for (let k = 0; k < item.columns.length; k++) {
            const column = item.columns[k]
            this.leave_form_item_f2(column.list, formEditLimit, formdata)
          }
        } else {
          initFormSetItem(item)

          if (item.type == 'table') {
            item.options.table_row_create = {
              _createid: this.userid,
              _creater: this.username
            }
            item.options.table_row_update = {
              _updateid: this.userid,
              _updater: this.username
            }
          }

          let hasfind = false

          if (formEditLimit) {
            for (let k = 0; k < formEditLimit.length; k++) {
              const limit = formEditLimit[k]
              if (!limit.type) continue
              if (item.key == limit.key) {
                hasfind = true

                if (item.type == 'table') {
                  item.options.table_delete = !!limit.table_delete
                  item.options.table_add = !!limit.table_add
                  item.options.table_edit = !!limit.table_edit
                  item.options.tableset.forEach(row => {
                    let hasfind2 = false
                    if (limit.son) {
                      limit.son.forEach(son => {
                        if (son.key == row.code) {
                          hasfind2 = true
                          row.required = son.required
                          row.limittype = son.type
                        }
                      })
                    }
                    if (!hasfind2) {
                      row.required = false
                      row.limittype = 'readonly'
                    }
                  })
                }

                switch (limit.type) {
                  case 'canedit':

                    console.log(limit)

                    item.options.disabled = false
                    if (limit.required) {
                      item.options.required = true 
                      this.addrequiredrule(item.rules, item.name)
                    } else {
                      item.options.required = false
                      this.splicerequiredrule(item.rules)
                    }

                    break
                  case 'readonly':

                    item.options.disabled = true
                    item.options.required = false
                    this.splicerequiredrule(item.rules)

                    break
                  case 'hidden':

                    hasdelete=true;

                    list.splice(
                      i, 1
                    )

                    break
                  default:
                    // hasfind=false
                    break
                }
                break
              }
            }
          }

          
          //
          if (!hasfind) {
            

            // console.log('item.model',item.model);
            // console.log(Object.keys(formdata).some(item2 => {
            //         return item2 == item.model
            //     }));

            if (!Object.keys(formdata).some(item2 => {
              return item2 == item.model
            })) {
              list.splice(
                i, 1
              )
            }
            // if(false){}
            else {
              item.options.disabled = true
              item.options.required = false

              if (item.type == 'table') {
                item.options.table_delete = false
                item.options.table_add = false
                item.options.table_edit = false
                item.options.tableset.forEach(row => {
                  row.limittype = 'readonly'
                  row.required = false
                })
              }

              this.splicerequiredrule(item.rules)
            }
          }


         this.initFormDefaulValue(item,hasdelete)

        }
      }
    },
    addrequiredrule(rules, name) {
      if (!rules) return
      console.log('rules', rules)
      console.log('name', name)

      // {
      //             "required": true,
      
      //         }
      let hasfind = false
      for (let i = 0; i < rules.length; i++) {
        const element = rules[i]
        if (typeof element.required !== 'undefined') {
          hasfind = true
          element.required = true
        }
      }
      if (!hasfind) {
        rules.push({
          'required': true,
          'message': name + '必须填写'
        })
      }
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
    copyobject(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    initFromset(designer, nowfun, formdata) {
      const nowfromset = this.copyobject(designer.formset)
      // if (nowfun.requiredata.length == 0) {
      //     return null;
      // }
      // console.log(' nowfun.requiredata', nowfun.requiredata)
      console.log('formdata', formdata)

      if (nowfun.formEditLimit) {
        this.leave_form_item_f2(nowfromset.list, nowfun.formEditLimit, formdata)
      } else {
        if (nowfun) {
          this.leave_form_item_f(nowfromset.list, nowfun.requiredata, formdata)
        }
      }

      return nowfromset
    }

  }
}
</script>

<style scoped>

.emergency_tag{
  font-size:60px;
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 10;
  transform:rotate(20deg);
-ms-transform:rotate(20deg); 	
-moz-transform:rotate(20deg); 	
-webkit-transform:rotate(20deg); 
-o-transform:rotate(20deg); 	

}
.flowdealBox {
    position: relative;
}

.flowdealBox .shortsave {
    position: absolute;
    right: 15px;
    top: 0px;
    z-index: 3;
}

.btns {
    float: right;
}

.label {
    border-radius: 4px;
    color: white;
    padding: 2px 3px;
    display: inline-block;
    line-height: 16px;
}

.label.warning {
    background-color: #ff9900;
}

.label.dark {
    background-color: #515a6e
}

.label.text {
    background-color: #515a6e
}

.label.firstsuggest {
    background-color: #03A9F4;
    line-height: 20px;
    padding: 3px 5px;
    font-weight: bold;
}

.mydeptname {
    display: inline;
    padding: 4px 5px;
    border: 1px solid #c0c4cc;
    border-radius: 5px;
}
</style>

<style lang="less">
.flowdealer {

 .nocard{
        .el-card__body{
            padding: 0;
        }
    }

    .timeline {
        margin: 0px 15px;
    }

    .timeline-item {
        margin: 0px 0 0 15px;
        padding-bottom: 0;

    }

    .timeline-circle {
        left: -20px;
    }

    .cancheckbox_to .el-checkbox__label {
        font-size: 12px;
    }

    .cancheckbox_to .el-checkbox {
        padding: 5px 0;
        margin: 0 5px;
    }

    .el-textarea.is-disabled .el-textarea__inner,
    .el-input.is-disabled .el-input__inner {
        color: #414246;
    }

    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
        border-color: #000000;
    }

    .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
        background-color: black
    }

    .el-radio__input.is-disabled .el-radio__inner,
    .el-radio__input.is-disabled.is-checked .el-radio__inner {
        border-color: #9b9b9c;
    }

    .el-radio__input.is-disabled+span.el-radio__label,
    .el-checkbox__input.is-disabled+span.el-checkbox__label {
        color: #797b7d
    }

    .el-checkbox__input.is-disabled .el-checkbox__inner {
        border-color: #8e8e8e;
    }


}
</style>
