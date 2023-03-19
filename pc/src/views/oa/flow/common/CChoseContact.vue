<template>
  <div>
    <div v-if="!disabled">
      <chose-contact-group-modal :placeholder="placeholder" :whitelist="['dept_user','role','conditions']" :dept-with-son="true" :with-advance-set="false" :group-list="sync_value" test-type="spread"/>
    </div>
    <div v-else>
      <chose-contact-group-modal :disabled="true" :placeholder="placeholder" :whitelist="['dept_user','role','conditions']" :dept-with-son="true" :with-advance-set="false" :group-list="sync_value" test-type="spread"/>
    </div>
  </div>
</template>

<script>
import propsync from 'vue-propsync'

// import ChoseContactGroupModal from './chose-contact/chose-contact-group-modal'

export default {
  name: 'ChoseContact',
  components: {
  },
  mixins: [propsync],
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      },
      isSync: true
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return '请选择通讯录联系人'
      }
    }

    

    // users: {
    //     type: Array,
    //     default: () => {
    //         return []
    //     }
    // }
  },
  data() {
    return {
      DeptTree: []
    }
  },
  watch: {
    sync_value: function() {
      this.$emit('input', this.sync_value)
    },
    placeholder:function(){
      if(!this.placeholder){
        this.placeholder='请选择通讯录联系人';
    }
    }
  },
  mounted() {

    if(!this.placeholder){
        this.placeholder='请选择通讯录联系人';
    }
  },
  methods: {
  }
}
</script>

<style>
   </style>
