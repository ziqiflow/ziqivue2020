<template>
  <div class="dashboard-container">
    <fm-making-form :widget-form.sync="designer.formset"/>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      designer: {
        formset: this.initFormData()
      },
      currentRole: 'adminDashboard'
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'roles'
  //   ])
  // },

  computed: {
    widgetForm() {
      return this.designer.formset
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function(val) {
        // this.designer.datalist = getrequireDataList(val);
        console.log(this.designer.datalist)
        console.log(JSON.stringify(this.designer.datalist))
      }
    }
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  methods: {
    initFormData() {
      return {
        list: [],
        config: {
          labelWidth: 120,
          labelPosition: 'top'
        }
      }
    },
    initFormData2() {
      return { 'list': [{ 'type': 'input', 'name': '申请资产明细', 'icon': 'regular/keyboard', 'options': { 'width': '100%', 'defaultValue': null, 'required': true, 'dataType': 'string', 'pattern': null, 'placeholder': null, 'remoteFunc': 'func_1545880938000_67164' }, 'key': '1545880938000_67164', 'keyindex': 2, 'model': 'input_1545880938000_67164', 'rules': [{ 'type': 'string', 'message': '申请资产明细格式不正确' }, { 'required': true, 'message': '申请资产明细必须填写' }] }, { 'type': 'input', 'name': '预计金额', 'icon': 'regular/keyboard', 'options': { 'width': '100%', 'defaultValue': null, 'required': false, 'dataType': 'string', 'pattern': null, 'placeholder': null, 'remoteFunc': 'func_1545880948000_20320' }, 'key': '1545880948000_20320', 'keyindex': 3, 'model': 'input_1545880948000_20320', 'rules': [{ 'type': 'string', 'message': '申请资产明细格式不正确' }] }, { 'type': 'radio', 'name': '资产分类', 'icon': 'regular/dot-circle', 'options': { 'inline': true, 'defaultValue': null, 'showLabel': false, 'options': [{ 'value': '购买配送', 'label': '选项1' }, { 'value': '打单配送', 'label': '选项2' }, { 'value': '双方配送', 'label': '选项3' }, { 'value': '后勤处理' }], 'required': false, 'width': null, 'remote': false, 'remoteOptions': [], 'props': { 'value': 'value', 'label': 'label' }, 'remoteFunc': 'func_1545880973000_83793' }, 'key': '1545880973000_83793', 'keyindex': 4, 'model': 'radio_1545880973000_83793', 'rules': [] }], 'config': { 'labelWidth': 120, 'labelPosition': 'top' }}
    }
  }
}
</script>
