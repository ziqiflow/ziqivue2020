<template>
<div>
    <div id="gantt-target">
    </div>

    <el-button-group>
        <el-button @click="change_view('Quarter Day')">6小时</el-button>
        <el-button @click="change_view('Half Day')">12小时</el-button>
        <el-button @click="change_view('Day')">天</el-button>
        <el-button @click="change_view('Week')">周</el-button>
        <el-button @click="change_view('Month')">月</el-button>
    </el-button-group>

</div>
</template>

<script>
import {
    loadJs
} from '@/utils/index.js'
import moment from 'moment';

export default {
    name: 'CGantt',

    props: {
        tasks: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            gantt_chart: null

        }
    },
    activated() {},
    mounted() {

        loadJs(window.baseURL + '/dist/lib/gantt/gantt.min.js').then(() => {
            this.init();
        })

    },
    methods: {

        change_view(type) {

            this.gantt_chart.change_view_mode(type)

        },

        dateCount(diff) {
              if(!diff)return '0秒';
            
            // var date = new Date()
            // var until = new Date(nowtime)
            
              var days = diff /24/60/60
            
            var day = Math.floor(days)
            var hours = (diff-day*24*60*60)/60/60
            var hour = Math.floor(hours)
            var minutes = (diff-day*24*60*60-hour*60*60)/60
            var minute = Math.floor(minutes)
            var second = diff-day*60*60*24-hour*60*60-minute*60

            let str = ''

            if (day) {
                str += Math.abs(day) + '天'
            }

            if (hour) {
                str += hour + '小时'
            }

            if (minute) {
                str += minute + '分'
            }

            if(!str&&second){
                  str += second + '秒'
            }

            return str
        },
        init() {

            console.log(this.tasks);
            this.gantt_chart = new Gantt("#gantt-target", this.tasks, {
                custom_popup_html:(task)=> {
                   
                    //window.task=task;
                    const end_date =  moment(task.end).format('YYYY-MM-DD HH:mm:ss');
                    const start_date =  moment(task.start).format('YYYY-MM-DD HH:mm:ss');
                    return `<div class="close">x</div>
        <div class="gantt-details-container" style="width:200px;">
          <h5>${task.name}</h5>
          <p>开始：${start_date} </p>
          <p>结束：${end_date}</p>
          `+  (task.isplan?'':`<p>实际${!task.isplan&&!task.isfinish?'已':''}用时：${this.dateCount(moment(task.end).diff( moment(task.start))/1000)}</p>`) +`
        </div>
      `;
                },
                on_click: function (task) {
                    console.log(task);
                },
                on_date_change: function (task, start, end) {
                    console.log(task, start, end);
                },
                on_progress_change: function (task, progress) {
                    console.log(task, progress);
                },
                on_view_change: function (mode) {
                    console.log(mode);
                },
                view_mode: 'Day', //Quarter Day, Half Day, Day, Week, Month
                language: 'zh',
                popup_trigger: 'mouseover'//'click' //mouseover
            });
        }
    }
}
</script>

<style scoped>

</style>
