<template>
  <div v-loading="loading" style="margin:10px">

    <h3>医生表</h3>

    <el-card>

      <el-table :data="doctors" stripe style="width: 100%">
        <el-table-column label="医生姓名" width="180">

          <template slot-scope="{row}">

            <el-input v-model="row.name"/>

          </template>

        </el-table-column>

        <el-table-column label="医生工号" width="180">

          <template slot-scope="{row}">

            <el-input v-model="row.code"/>

          </template>

        </el-table-column>

        <el-table-column label="医生简介" width="300">

          <template slot-scope="{row}">

            <el-input v-model="row.desc" type="textarea"/>

          </template>

        </el-table-column>

        <el-table-column label="操作" width="180">

          <template slot-scope="{row,$index}">

            <el-buttton :type="text" @click="remove(doctors,$index)">删除</el-buttton>

          </template>

        </el-table-column>
      </el-table>

      <div style="padding:10px">
        <el-button @click="adddoctor" >添加</el-button>
      </div>
    </el-card>

    <h3>排班表</h3>

    <el-card>

      <el-table :data="schedule" stripe style="width: 100%">
        <el-table-column label="日期" width="180">

          <template slot-scope="{row}">

            <div>{{ row.date }}</div>

          </template>

        </el-table-column>

        <el-table-column label="星期" width="180">

          <template slot-scope="{row}">

            {{ tranweekchinese(row.date) }}

          </template>

        </el-table-column>

        <el-table-column label="医生工号" width="180">

          <template slot-scope="{row}">

            <el-input :disabled="!!row.pass" v-model="row.codes" placeholder="用,符合分割"/>

          </template>

        </el-table-column>

        <el-table-column label="医生名称" width="180">

          <template slot-scope="{row}">

            {{ trancodes(row.codes) }}

          </template>

        </el-table-column>

        <el-table-column label="操作" width="180">

          <template slot-scope="{row,$index}">

            <el-buttton v-if="$index==schedule.length-1" :type="text" @click="remove(schedule,$index)">删除</el-buttton>

          </template>

        </el-table-column>

      </el-table>

      <div style="padding:10px">
        <el-button @click="adddays('day')" >加一天</el-button>

        <el-button @click="adddays('week')" >加一周</el-button>

        <el-button @click="adddays('month')">加一月</el-button>
      </div>

    </el-card>

    <div style="padding:10px">
      <el-button type="primary" @click="save">保存</el-button>
    </div>

  </div>
</template>

<script>
import {
  setDoctorSchedule,
  readDoctorSchedule
} from '@/api/sickregister'

import moment from 'moment'

export default {
  // directives: { permission },
  name: 'Workbench',
  data() {
    return {
      loading: false,
      doctors: [],
      schedule: []
    }
  },

  mounted() {
    // 从后台读取资料。
    this.loading = true

    readDoctorSchedule({}).then(({
      data: res
    }) => {
      console.log(res)
      this.doctors = res.data.doctors
      this.schedule = res.data.schedule
      // 初始化的时候判断是否过期；
      const today = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')
      this.schedule.forEach(ele => {
        if (moment(ele.date, 'YYYY-MM-DD') < today) {
          ele.pass = true
        }
      })
      this.loading = false
    }).catch(e => {
      this.loading = false
    })
  },
  methods: {

    save() {
      this.loading = true

      setDoctorSchedule({ data: { doctors: this.doctors, schedule: this.schedule }}).then(({
        data: res
      }) => {
        this.loading = false

        if (res.success) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },

    adddoctor() {
      this.doctors.push({
        name: '',
        code: '',
        desc: ''
      })
    },
    trancodes(codes) {
      if (!codes) return ''
      const arr = codes.split(',')
      const nameList = []
      arr.forEach(ele => {
        if (ele) {
          this.doctors.forEach(e => {
            if (e.code) {
              if (ele.trim() == e.code.trim()) {
                nameList.push(e.name)
              }
            }
          })
        }
      })

      return nameList.join(',')
    },
    tranweek(w) {
      switch (Number(w)) {
        case 0:
          return '周日'
          break
        case 1:
          return '周一'
          break
        case 2:
          return '周二'
          break
        case 3:
          return '周三'
          break
        case 4:
          return '周四'
          break
        case 5:
          return '周五'
          break
        case 6:
          return '周六'
          break
        default:
          break
      }
      return '无'
    },

    tranweekchinese(date) {
      return this.tranweek(moment(date, 'YYYY-MM-DD').format('d'))
    },
    remove(list, index) {
      list.splice(index, 1)
    },
    adddays(type) {
      let day = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').subtract(1, 'days') // 默认的
      if (this.schedule.length == 0) {
        day = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').subtract(1, 'days') // .format('YYYY-MM-DD');
      } else {
        // 检查 如果这个时间大于 当天的话，
        const temp = moment(this.schedule[this.schedule.length - 1].date, 'YYYY-MM-DD')
        if (temp > day) {
          day = temp
        }
      }

      let lastday = day.clone()

      switch (type) {
        case 'day':
          lastday = lastday.add(1, 'days').format('x')
          break
        case 'month':
          lastday = lastday.add(1, 'months').format('x')
          break
        case 'week':
          lastday = lastday.add(1, 'weeks').format('x')
          break
        default:
          break
      }

      let x = 0

      // console.log(lastday.format('YYYY-MM-DD'));

      while (1) {
        console.log('day', day.format('YYYY-MM-DD'))
        // console.log('lastday',lastday.format('YYYY-MM-DD'));

        x++
        if (x > 100) {
          break
        }

        day = day.add(1, 'days')
        if (day.format('x') > lastday) break

        this.schedule.push({
          date: day.format('YYYY-MM-DD'),
          codes: null
        })
      }
    }

  }
}
</script>

<style lang="less">
</style>
