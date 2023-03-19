<template>
  <div>
    <Card>

      <Alert v-if="!!error" type="error">{{ error }}</Alert>

      <div v-else>
        部门管理
      </div>

    </Card>
  </div>
</template>

<script>
export default {
  name: 'External',
  data() {
    return {
      error: null
    }
  },
  activated() {
    console.log('activated')
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
  }
}
</script>

<style>
</style>
