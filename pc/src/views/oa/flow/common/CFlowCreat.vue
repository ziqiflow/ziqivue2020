<template>
  <div class="flowcreat" >    
    <el-dialog :fullscreen="!isPc||isFullScreen" :close-on-click-modal="false" :title="title" :visible.sync="modalstatu" width="75%">

      <span v-if="isPc" class="maxzoom">
        <svg-icon v-if="isFullScreen" class="fz12" style="color: grey;" icon-class="exit-fullscreen" @click.native="toggleFullScreen" />
      <svg-icon v-else class="fz12" style="color: grey;" icon-class="fullscreen" @click.native="toggleFullScreen" /></span>

      <el-dialog :fullscreen="!isPc" :visible.sync="PreviewModalStatus" title="流程创建预览" width="65%" append-to-body>
        <div v-if="!!previewData">
          <flow-preview-submit v-if="PreviewModalStatus" :flowlevel='flowdata.level' ref="flowpreviewsubmit" :buttoninfo="buttoninfo" :previewdata="previewData" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="PreviewModalStatus=false">取 消</el-button>
          <el-button type="primary" @click="btnoksure">确定提交</el-button>
        </span>
      </el-dialog>

      <div v-loading="loading">
        <div v-if="!successShow" class="flowcreatBox">

          <el-dropdown v-if="!!tempflowdata" class="shortsave" size="mini" split-button @click="shortSaveClick">
            暂存
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="formDatatype=='temp'" @click.native="shortSaveToggle('new')">恢复原表单内容</el-dropdown-item>
              <el-dropdown-item v-else @click.native="shortSaveToggle('temp')">显示暂存内容</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-else class="shortsave" size="mini" @click="shortSaveClick" >暂存</el-button>
          <el-form label-position="top">

            <el-form-item v-if="mydepts.length>1" required label="选择您所在的部门：">
              <el-select v-model="flowdata.dept" placeholder="请选择">
                <el-option v-for="item in mydepts" :key="item.v" :label="item.n" :value="item.v"/>
              </el-select>
              <span class="fz12" style="color:red">*由于您同时属于多个部门，先选择你提交此申请的部门</span>

            </el-form-item>

            <el-form-item v-else>

              您所在的部门：
              <span class="mydeptname">
                {{ mydeptName }}
              </span>

            </el-form-item>

            <el-form-item required label="一句话简单描述：">
              <el-input v-model="flowdata.desc" placeholder="请一句话介绍申请内容（必填）" />
            </el-form-item>
          </el-form>

          <div v-if="!!widgetForm">

            <el-card :class="widgetForm.list.length==0?'nocard':''">
              <div v-if="widgetForm.list.length>0" style="margin-bottom:10px;color:#ff6600">需填写内容：
                <hr>
              </div>

              <fm-generate-form v-if="showgenerateForm" ref="generateForm" :data.sync="widgetForm" :remote="remoteFuncs" :value="widgetModels" class="generateForm">

                <template slot="blank" slot-scope="scope">
                  宽度：
                  <el-input v-model="scope.model.blank.width" style="width: 100px" />
                  高度：
                  <el-input v-model="scope.model.blank.height" style="width: 100px" />
                </template>

              </fm-generate-form>

            </el-card>

            <el-card style="margin-top: 14px;" shadow="never">
              <div class="mg-b5" style="font-weight:border;">文件附件：</div>
              <div>
                <file-list ref="filelist" :flowlistid="flowdata.Simulation_id" :flowdesignid="flowid" :file-list="flowdata.fileList" class="pd10"/>
              </div>
            </el-card>
          </div>
        </div>
        <div v-else>

          <flow-deal-success :data="submitdata" />
        </div>
      </div>
      <span v-if="!loading" slot="footer" class="dialog-footer">

        <span v-if="!!designer.nowfun&&!successShow"
          style="display: inline-block;color:red;
    float: left;">
          处理级别：
          <el-select  size="medium" v-model="flowdata.level" style="width:80px;" placeholder="级别">
            <el-option :value="0" label="普通">
              <v-icon class="level_normal mg-r5" name="star"></v-icon>
             普通
            </el-option>
            <el-option :value="100" label="紧急">
              <v-icon class="level_emergency mg-r5" name="star"></v-icon>
              紧急
            </el-option>
          </el-select>

        </span>

        <el-button size="medium" @click="cancel">取 消</el-button>
        <template v-if="!!designer.nowfun&&!successShow">
          <el-button v-for="(item,index) in designer.nowfun.btnGroup" :key="index" size="medium" @click="btnok(index)">{{ item.name }}</el-button>
        </template>
      </span>
    </el-dialog>

  </div>
</template>

<script>


// import {GenerateForm} from '@jinzhitiankai/form-making'
// import '@jinzhitiankai/form-making/dist/FormMaking.css'

// import GenerateForm from '_c/form-mark/src/components/GenerateForm.vue';
// import ChoseContact from '_c/chose-contact/chose-contact-group-modal'




import {
  FlowGetbyCreat,
  FlowCreat,
  FlowCreatPreviewMode,
  FlowTempFormSave
} from '@/api/oa'

import {
  tran_dealtype,
  initFormSetItem
} from '@/utils/u_flowdesign'

import FlowPreviewSubmit from './CFlowPreviewSubmit'

import FlowDealSuccess from './CFlowDealSuccess'

import FileList from './CFileList'

import flowEdit from '@/utils/mixins/flowEdit'

export default {
  name: 'Cflowcreat',
   mixins: [flowEdit],
  components: {
    FlowPreviewSubmit,
    FlowDealSuccess,
    FileList
  },
  data() {
    return {
      PreviewModalStatus: false,
      error: null,
      modalstatu: false,
      title: null,
      flowid: null,
      loading: false,
      designer: {
        nowfun: null
      },
      remoteFuncs: {}, 

      widgetForm: null, 
      submitdata: null,
      // newGetFlowId: null,
      widgetModels: {}, 
      flowdata: this.initFlowdata(),
      tempflowdata: null, 
      tempwidgetModels: {}, 
      
      formDatatype: 'new', 

      successShow: false,
      // successMsg: '',
      // nextMessages: [
      
      // ],
      // nextCC: [
      
      // ],
      previewData: null,
      buttoninfo: null,
      btnindex: null,
      mydeptName: null,
      isFullScreen: false,
      showgenerateForm: false
    }
  },
  watch: {
    // flowid() {
    
    // }
  },

  mounted() {
    if (this.mydepts.length == 0) {
      this.mydeptName = '全公司'
      this.flowdata.dept = '1'
    } else if (this.mydepts.length == 1) {
      this.mydeptName = this.mydepts[0].n
      this.flowdata.dept = this.mydepts[0].v
    }
  },
  methods: {
    initFlowdata() {
      return {
        Simulation_id: Date.parse(new Date()) / 1000 + '' + Math.ceil(Math.random() * 99999),
        desc: '',
        dept: null,
        fileList: [],
        level: 0
      }
    },
    shortSaveToggle(type) {
      
      this.formDatatype = type

      
      // [this.widgetModels,this.tempwidgetModels]=[this.tempwidgetModels,this.widgetModels];
      // [this.flowdata,this.tempflowdata]=[this.tempflowdata,this.flowdata];

      // [this.widgetModels,this.tempwidgetModels]=[this.copyobject(this.tempwidgetModels),this.copyobject(this.widgetModels)];
      // [this.flowdata,this.tempflowdata]=[this.copyobject(this.tempflowdata),this.copyobject(this.flowdata)];

      const tempwidgetModels = this.copyobject(this.$refs.generateForm.getDataWithOutValid())
      // console.log('tempwidgetModels',tempwidgetModels);
      const tempflowdata = this.copyobject(this.flowdata)

      this.widgetModels = this.copyobject(this.tempwidgetModels)
      // console.log(this.widgetModels);
      this.flowdata = this.copyobject(this.tempflowdata)

      this.tempwidgetModels = tempwidgetModels
      // console.log(this.tempwidgetModels);
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
        type: 'creat',
        flowid: this.flowid,
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
         this.loading = false
      })
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen
    },

    tran_dealtype(type) {
      return tran_dealtype(type)
    },
    
    btnoksure() {
      
      if (!this.flowdata.desc) {
        this.$message.error('申请内容未填写')
        return
      }

      const {
        funlist,
        sonflows
      } = this.$refs.flowpreviewsubmit.getdata()

      if (!funlist) return

      this.PreviewModalStatus = false 
      // console.log(funlist);
      // console.log(sonflow);

      this.$refs.generateForm.getData().then(data => {
        // alert('loging');
        const postformdata = this.filterDisableItem(data)
        console.log(postformdata)
        

        
        this.loading = true
        FlowCreat({
          flowdata: this.flowdata,
          btnindex: this.btnindex,
          funid: this.designer.nowfun.id,
          flowid: this.flowid,
          inputdata: postformdata,
          funlist: funlist,
          sonflows: sonflows
        }).then(({
          data: req
        }) => {
          this.loading = false

          if (req.success) {
            // this.$notify
            this.$notify({
              type: 'success',
              title: '成功',
              message: req.msg
            })
            this.submitdata = req
            this.successShow = true

            this.$emit('on-success')
            // this.successMsg = req.msg;
            // this.nextMessages = req.data.nextmessage;
            // this.nextCC = req.data.cc;
            console.log(req)
          } else {
            this.$message.error(req.msg)
          }
        })
      }).catch(e => {
        this.loading=false;
        // console.log(e)
        
        this.$message.error(e)
        // this.$refs.widgetPreview.end()
      })
    },
    
    btnok(btnindex) {
      if (this.$refs.filelist.getUnuploadLen()) {
        if (!confirm('您有未上传的文件，建议上传后提交，确定忽略吗？')) return
      }

      if (!this.flowdata.desc) {
        this.$message.error('申请内容未填写')
        return
      }

      if (!this.flowdata.dept) {
        this.$message.error('所属部门不可为空')
        return
      }
      this.previewData = null
      console.log(this.designer.nowfun)
      this.buttoninfo = this.designer.nowfun.btnGroup[btnindex]
      console.log('this.buttoninfo', this.buttoninfo)
      this.btnindex = btnindex

      this.$refs.generateForm.getData().then(data => {
        // alert('loging');
             console.log('generateFormData',data)
        const postformdata = this.filterDisableItem(data)
        console.log(postformdata)
        
        this.loading = true
        FlowCreatPreviewMode({
          flowdata: this.flowdata,
          btnindex: btnindex,
          funid: this.designer.nowfun.id,
          flowid: this.flowid,
          inputdata: postformdata
        }).then(({
          data: req
        }) => {
          this.loading = false
          if (req.success) {
            this.PreviewModalStatus = true
            this.previewData = req
            // this.$Message.info(req.msg);
            console.log(req)
          } else {
            this.$message.error(req.msg)
          }
        })
        // this.$refs.widgetPreview.end()
      }).catch(e => {
        console.log('loading',e)
        this.loading=false;
        // console.log(e)
        
        this.$message.error(e)
        // this.$refs.widgetPreview.end()
      })
    },
    cancel() {
      this.modalstatu = false
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
        if(!DataListItem){
          continue;
        }
        const key = DataListItem.key
        for (let k = 0; k < this.designer.nowfun.formEditLimit.length; k++) {
          const ele = this.designer.nowfun.formEditLimit[k]
          if (ele.key == key && ele.type == 'canedit') {
            nowdata[model] = data[model]
            break
          }
        }
      }
      return nowdata
    },

    
    
    leave_form_item_f2(list, formEditLimit) {
      for (let i = list.length - 1; i >= 0; i--) {
        let hasdelete=false;
        const item = list[i]
        if (
        // item.type == 'grid'
        // ||
          item.columns) {
          for (let k = 0; k < item.columns.length; k++) {
            const column = item.columns[k]
            this.leave_form_item_f2(column.list, formEditLimit)
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
                      this.addrequiredrule(item.rules, item.name, item)
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

                    list.splice(
                      i, 1
                    )
                    hasdelete=true

                    break
                  default:
                    break
                }

                break
              }
            }
          }

          
          if (!hasfind) {
            console.log('item', item)
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


          this.initFormDefaulValue(item,hasdelete)

          



        }
      }
    },
    addrequiredrule(rules, name, obj) {
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
        const insert = {
          'required': true,
          'message': name + '必须填写'
        }
        // if(obj.type=='custom'&&(obj.options.componentName=='chose-depts'||obj.options.componentName=='chose-users')){
        // insert.type='array';
        // insert.trigger='change';
        // }
        rules.push(insert)
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
    
    leave_form_item_f(list, requiredata) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (
        // item.type == 'grid'
        // ||
          item.columns) {
          for (let k = 0; k < item.columns.length; k++) {
            const column = item.columns[k]
            this.leave_form_item_f(column.list, requiredata)
          }
        } else {
          let hasfind = false
          for (let k = 0; k < requiredata.length; k++) {
            const reqdata = requiredata[k]
            if (item.key == reqdata) {
              hasfind = true
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

    copyobject(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    initFromset(designer) {
      let nowfun = null
      if (!designer.funlist) return null
      designer.funlist.forEach(fun => {
        if (fun.is_start) {
          nowfun = fun
        }
      })
      const nowfromset = this.copyobject(designer.formset)

      if (nowfun.formEditLimit) {
        this.leave_form_item_f2(nowfromset.list, nowfun.formEditLimit)
      } else {
        
        if (nowfun.requiredata.length == 0) {
          return null
        }
        if (nowfun) {
          this.leave_form_item_f(nowfromset.list, nowfun.requiredata)
        }
      }

      return nowfromset
    },
    creatform(flowid) {
      this.widgetForm = null

      this.modalstatu = true
      this.successShow = false
      this.flowid = flowid
      this.title = '加载中...'

      this.loading = true

      FlowGetbyCreat({
        _id: flowid
      }).then(({
        data: req
      }) => {
        this.loading = false
        if (req.success) {
          if (!req.data) {
            this.error = '没有查询到对应的流程'
            return
          }

          this.designer = req.data
          console.log(this.designer)
          
          
          if (this.designer.funlist) {
            this.designer.funlist.forEach(fun => {
              if (fun.is_start) {
                this.designer.nowfun = fun
                console.log('fun', this.designer.nowfun)
              }
            })
          }
          const form_save = req.data.form_save
          if (form_save) {
            
            this.formDatatype = 'temp'
            this.tempflowdata = this.copyobject(this.flowdata)
            this.tempwidgetModels = this.copyobject(this.widgetModels)
            this.flowdata = form_save.flowdata
            this.widgetModels = this.filterDisableItem(form_save.inputdata)
            
          }

          this.title = `新建 ${this.designer.name}`
          this.widgetForm = this.initFromset(this.designer)
          console.log('widgetForm', JSON.stringify(this.widgetForm))

          if (!this.isPc) {
            this.widgetForm.config.labelWidth = null
            this.widgetForm.config.labelPosition = 'top'
          }
          this.showgenerateForm = true
        } else {
          this.error = req.msg
        }
      }).catch(e=>{
         this.loading = false
      })
    }

  }
}
</script>

<style scoped>

.level_emergency{
  color: #ec3203
}

.level_normal{
  color: rgb(173, 173, 173);
}


.flowcreatBox {
    position: relative;
}

.flowcreatBox .shortsave {
    position: absolute;
    right: 0px;
    top: -2px;
        z-index: 3;
}

.maxzoom {
    position: absolute;
    right: 43px;
    top: 20px;
    cursor: pointer;
}

.mydeptname {
    display: inline;
    padding: 4px 5px;
    border: 1px solid #c0c4cc;
    border-radius: 5px;
}



</style>

<style lang="less">
.flowcreat{
.el-dialog__body {
        padding: 10px 20px;
    }

    .nocard{
        .el-card__body{
            padding: 0;
        }
    }

}

.flowcreatBox {

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
