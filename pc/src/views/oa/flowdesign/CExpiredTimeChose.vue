<template>
<div>
    <div v-if="mode=='select'">
        <el-select  @change="value_inner=sync_value" v-model="sync_value" size="small" style="width:150px;">
            <el-option v-for="item in exectimelist" :label="item.n" :value="item.v" :key="item.v">{{ item.n }}</el-option>
        </el-select>
        <el-button @click="mode='advanced'" type="text">自定义</el-button>
    </div>
    <div v-if="mode=='advanced'">
        <div>
        <span>日：</span>
        <el-slider class="advanced-slider" v-model="dayValue" :max="365"></el-slider></div>
         <div><span>时：</span>
        <el-slider class="advanced-slider" v-model="hourValue" :max='24'></el-slider></div>
        <div> <span>分：</span>
        <el-slider class="advanced-slider" v-model="minuteValue" :max='60'></el-slider></div>

        预览：{{dateCount(sync_value)}}

        <el-button @click="mode='select'" type="text">切换到选择模式</el-button>
    </div>

</div>
</template>

<script>
import propsync from 'vue-propsync'

export default {
    name: 'CExpiredTimeChose',
    mixins: [propsync],
    props: {
        value: {
            type: Number,
            default: 0,
            isSync: true
        }
    },
    watch: {

        sync_value() {
            this.init();
        },

        dayValue(newValue, oldValue) {
            this.whenSliderMove()
        },
        hourValue(newValue, oldValue) {
            this.whenSliderMove()
        },
        minuteValue(newValue, oldValue) {
            this.whenSliderMove()
        }
    },
    data() {
        return {
            value_inner:null,
            dayValue: null,
            hourValue: null,
            minuteValue: null,

            mode: 'select', //advanced
            exectimelist: [{
                    n: '3小时',
                    v: 3 * 60 * 60
                },
                {
                    n: '6小时',
                    v: 6 * 60 * 60
                },
                {
                    n: '12小时',
                    v: 12 * 60 * 60
                },
                {
                    n: '24小时',
                    v: 24 * 60 * 60
                },
                {
                    n: '2天',
                    v: 2 * 24 * 60 * 60
                },
                {
                    n: '3天',
                    v: 3 * 24 * 60 * 60
                },
                {
                    n: '4天',
                    v: 4 * 24 * 60 * 60
                },
                {
                    n: '5天',
                    v: 5 * 24 * 60 * 60
                },
                {
                    n: '一个星期',
                    v: 7 * 24 * 60 * 60
                },
                {
                    n: '2个星期',
                    v: 14 * 24 * 60 * 60
                },
                {
                    n: '30天',
                    v: 30 * 24 * 60 * 60
                },
                {
                    n: '90天',
                    v: 90 * 24 * 60 * 60
                },
                {
                    n: '180天',
                    v: 180 * 24 * 60 * 60
                },
                {
                    n: '无限',
                    v: 0
                }
            ],
        }

    },

    mounted() {

        // console.log('sync_value', this.sync_value);
        //
        this.value_inner=this.sync_value;

        this.mode = this.exectimelist.some(e => {
            return e.v == this.sync_value
        }) ? 'select' : 'advanced';

        this.init();

    },
    methods: {

        init() {

            if(this.value_inner!=this.sync_value){
              this.mode = this.exectimelist.some(e => {
                          return e.v == this.sync_value
                      }) ? 'select' : 'advanced';
            }

            if (this.dayValue * 24 * 60 * 60 + this.hourValue * 60 * 60 + this.minuteValue * 60==this.sync_value)return;
            var diff =this.sync_value;
            var days = diff /24/60/60
            
            var day = Math.floor(days)
            var hours = (diff-day*24*60*60)/60/60
            var hour = Math.floor(hours)
            var minutes = (diff-day*24*60*60-hour*60*60)/60
            var minute = Math.floor(minutes)
            // var seconds =  diff-day*3600*24-hour*3600-minute*60
            var second = diff-day*60*60*24-hour*60*60-minute*60

            this.dayValue = day;

            this.hourValue = hour;

            this.minuteValue = minute;
        },

        dateCount(diff) {
            if (!diff) return '';
            
            // var date = new Date()
            // var until = new Date(nowtime)
            
          var days = diff /24/60/60
            
            var day = Math.floor(days)
            var hours = (diff-day*24*60*60)/60/60
            var hour = Math.floor(hours)
            var minutes = (diff-day*24*60*60-hour*60*60)/60
            var minute = Math.floor(minutes)
            // var seconds =  diff-day*3600*24-hour*3600-minute*60
            var second = diff-day*60*60*24-hour*60*60-minute*60

            let str = ''

            if (day) {
                str += Math.abs(day) + '天'
            }

            if (hour) {
                str += hour + '小时'
            }

            if (minute) {
                str += minute + '分钟'
            }

            return str
        },
        whenSliderMove() {
            // console.log('abcdef')
            this.sync_value = this.dayValue * 24 * 60 * 60 + this.hourValue * 60 * 60 + this.minuteValue * 60;
            this.value_inner=this.sync_value;
        }
    }
}
</script>

<style scope>

.advanced-slider{
}
</style>
