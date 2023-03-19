<template>

  <div>
    <span @click="modal1 = true">

      <a v-if="chosed.length==0">当前未选中任何角色或人员，点击选择</a>
      <a v-for="item in chosed" :key="item.id">
        <span v-if="item.type=='role'">[角色]{{ item.name }};</span>
        <span v-if="item.type=='user'">[个人]{{ item.name }};</span>
      </a>

    </span>

    <Modal v-model="modal1" title="选择人员" @on-ok="ok" @on-cancel="cancel">
      <chose-contact :chosed="chosed"/>
    </Modal>
  </div>
</template>

<script>

import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters
} from 'vuex'

import ChoseContact from './chose-contact'

import {
  FlowDesignsTestContact
} from '@/api/contacts'

export default {
  name: 'ChoseContactModal',

  components: {
    ChoseContact
  },
  props: {
    chosed: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      modal1: false
    }
  },
  mounted() {
  },
  methods: {
    ok() {
      this.$Message.info('Clicked ok')
    },
    cancel() {
      this.$Message.info('Clicked cancel')
    }
  }
}
</script>
