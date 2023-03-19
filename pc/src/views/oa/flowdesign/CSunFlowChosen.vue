<template>
  <div class="fz12">

    <span v-if="!chose||chose.length==0"><a class="fz12" @click="start">添加外部流程</a></span>
    <div v-else>
      <span>{{ label }}</span>
      <span v-for="(item,index) in chose" :key="index" class="sonflow">{{ item.n }}</span>
      <a style="margin-left:10px;" @click="start">编辑</a>

    </div>

    <el-dialog
      :visible.sync="modalFlowChosen"
      title="选择子流程"
      append-to-body
      width="50%"
    >

      <el-alert
        :closable="false"
        title="外部子流程选取自之前创建的流程。不建议创建太多的外部子流程。"
        class="mg10"/>
      <el-alert
        :closable="false"
        title="选择的外部流程默认走第一个按键的流程。而且表单填写数据为空。"
        type="error"
        class="mg10"/>

      <el-transfer
        :titles="['全部流程','已选择子流程']"
        :data="transferData"
        v-model="targetKeys"
        :filter-method="filterMethod"
        filterable

      >
      </el-transfer>

      <div slot="footer" class="dialog-footer">

        <el-button @click="cancel">取消</el-button>
        <el-button type="success" @click="ok">确定</el-button>

      </div>

    </el-dialog>

  </div>
</template>

<style>
.sonflow {
    padding: 2px 3px;
    display: inline-block;
    border: 1px solid #bbbbbb;
    border-radius: 4px;
    margin: 3px;
    line-height: 16px;
}
</style>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters
} from 'vuex'

export default {
  name: 'Csunflowchosen',
  components: {},
  props: {
    label: {
      type: String,
      default: () => {
        return '默认外部子流程：'
      }
    },
    chose: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      modalFlowChosen: false,
      transferData: [],
      targetKeys: []
    }
  },
  computed: {
    ...mapState({
      flowCanSonList: state => state.flowdesign.flowCanSonList
      //  messageReadedList: state => state.employee.messageReadedList,
    })
  },
  methods: {

    ...mapActions([
      //'getFlowAllList',
      'getFlowCanSonList'
    ]),
    cancel() {
      this.modalFlowChosen = false
    },
    ok() {
      this.modalFlowChosen = false
      const chose = []
      this.targetKeys.forEach(key_id => {
        this.flowCanSonList.forEach(flow => {
          if (key_id == flow._id) {
            chose.push({
              n: flow.name,
              v: key_id
            })
          }
        })
      })
      // this.chose=;
      this.$emit('update:chose', chose)
      // this.chose
    },
    start() {
      this.modalFlowChosen = true
      // console.log(this.flowCanSonList.length);

      this.targetKeys = []
      if (this.chose) {
        this.chose.forEach(ele => {
          this.targetKeys.push(ele.v)
        })
      }
      // this.targetKeys=
      console.log(this.targetKeys)

      if (this.flowCanSonList.length == 0) {
        this.getFlowCanSonList().then(res => {
          this.initdata()
        })
      } else {
        this.initdata()
      }
    },
    copyObject(json) {
      return JSON.parse(JSON.stringify(json))
    },
    // handleChange(newTargetKeys) {
    //     console.log(newTargetKeys)
    //     this.targetKeys = newTargetKeys;
    // },
    filterMethod(query, data) {
      return data.label.indexOf(query) > -1
    },

    initdata() {
      this.transferData = []

      this.flowCanSonList.forEach(ele => {
        this.transferData.push({
          key: ele._id,
          label: ele.name

        })
      })

      console.log(this.transferData)
    }

  },
  watch: {},
  mounted() {

  }
}
</script>
