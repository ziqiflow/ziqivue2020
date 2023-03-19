<template>
  <div style="margin:10px" class="workbench">

    <el-tabs ref="elTabs" v-model="tabname">
      <el-tab-pane  label="发起流程" name="flow.creat">
        <div v-if="tabname=='flow.creat'">
          <flow-chose/>
        </div>
      </el-tab-pane>

        <el-tab-pane  label="待我发起" name="flow.needcreat">

      <div slot="label">
          待我创建
          <el-badge v-if="flowBadge.needcreat!=0" :value="flowBadge.needcreat" class="item"/>
        </div>

        <div v-if="tabname=='flow.needcreat'">
          <flow-list-need-creat></flow-list-need-creat>
        </div>
      </el-tab-pane>


      <el-tab-pane name="flow.waithander">

        <div slot="label">
          待我处理
          <el-badge v-if="flowBadge.waiting!=0" :value="flowBadge.waiting" class="item"/>
        </div>

        <div v-if="tabname=='flow.waithander'">
          <flow-list-waiting/>
        </div>

      </el-tab-pane>
      <el-tab-pane name="flow.message">
        <div slot="label">
          通知我
          <el-badge v-if="flowBadge.message!=0" :value="flowBadge.message" class="item"/>
        </div>
        <div v-if="tabname=='flow.message'">
          <flow-list-message/>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我已处理" name="flow.finish">
        <div v-if="tabname=='flow.finish'">
          <flow-list-finish/>
        </div>
      </el-tab-pane>

      <el-tab-pane label="我发起的" name="flow.icreat">
        <div v-if="tabname=='flow.icreat'">
          <flow-list-icreat/>
        </div>
      </el-tab-pane>

      <el-tab-pane name="flow.cctome">

        <div slot="label">
          抄送我
          <el-badge v-if="flowBadge.cc!=0" :value="flowBadge.cc" class="item"/>
        </div>
        <div v-if="tabname=='flow.cctome'">
          <flow-list-cc/>
        </div>
      </el-tab-pane>

       <el-tab-pane  label="可管理的" name="flow.admin">
        <div v-if="tabname=='flow.admin'">
          <flow-admin/>
        </div>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
import FlowChose from './CFlowChose'
import FlowAdmin from './CFlowAdmin'
import FlowListWaiting from './CFlowListWaiting'
import FlowListFinish from './CFlowListFinish'
import FlowListIcreat from './CFlowListIcreat'
import FlowListMessage from './CFlowListMessage'
import FlowListCc from './CFlowListCc'
import FlowListNeedCreat from './CFlowListNeedCreat'


import {
  mapActions,
  mapState
} from 'vuex'

export default {
  // directives: { permission },
  name: 'Workbench',
  components: {
    FlowChose,
    FlowAdmin,
    FlowListWaiting,
    FlowListFinish,
    FlowListIcreat,
    FlowListCc,
    FlowListMessage,
    FlowListNeedCreat
  },
  computed: {
    ...mapState({
      flowBadge: state => state.user.flowBadge
      //  messageReadedList: state => state.employee.messageReadedList,
    })
  },
  data() {
    return {
      error: null,
      tabname: 'flow.creat',

      cctomeNumber: 0,
     

      waithanderNumber: 0,
     

      messageNumber: 0
     
    }
  },
  methods: {

    ...mapActions([
      'getFlowBadgeNumber'
    ])

  },

  mounted() {
    this.getFlowBadgeNumber().then(res => {
         let childrenRefs = this.$refs.elTabs.$children

this.$nextTick(() => {

  childrenRefs.forEach(child => child.$forceUpdate())

})
    })

    
    
    let query=this.$route.query;

    if(!!query.tab){
        if(['flow.creat','flow.needcreat','flow.waithander','flow.message','flow.finish','flow.icreat','flow.cctome','flow.admin'].indexOf("flow."+query.tab)!=-1){
          this.tabname="flow."+query.tab;
        }      
    }

    // FlowNumber({}).then(({
    //     data: req
    // }) => {
    // })
  }
}
</script>

<style lang="less">

.workbench .searchform_oa {

.el-form-item__label{
  font-size: 13px;
}

.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
      margin-bottom: 8px;
}

}

  
</style>
