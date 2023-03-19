<template>
<div>
    <el-card>
        <div style="position: relative;    border-bottom: 1px #9E9E9E solid;
    margin-bottom: 10px;" v-for="(item,index) in sync_value" :key="index">

            <div class="index">{{index+1}}</div>
            <div class="romove">
                <el-button @click="removeItem(sync_value,index)" icon="el-icon-delete"></el-button>
            </div>

            <el-form-item label="触发时间">
                <el-select style="width:120px" v-model="item.type" placeholder="请选择">
                      <el-option label="按年触发" value="year" />
                    <el-option label="按月触发" value="month" />
                    <el-option label="按周触发" value="week" />
                    <el-option label="按天触发" value="day" />
                </el-select>
                 <el-select style="width:120px" v-if="item.type=='year'" v-model="item.month" placeholder="那个月">
                    <el-option v-for="item in 12" :key="item" :label="'每年'+item+'月'" :value="item" />
                </el-select>
                <el-select style="width:120px" v-if="item.type=='month'||item.type=='year'" v-model="item.day" placeholder="那一天">
                    <el-option v-for="item in 31" :key="item" :label="'每月'+item+'号'" :value="item" />
                </el-select>
                <el-select style="width:120px" v-if="item.type=='week'" v-model="item.week" placeholder="那一天">
                    <el-option v-for="item in 7" :key="item" :label="'每周星期'+item+''" :value="item" />
                </el-select>

                <el-time-select style="width:150px" v-model="item.time" :picker-options="{
    start: '00:00',
    step: '00:05',
    end: '24:00'
  }" placeholder="选择时间">
                </el-time-select>

            </el-form-item>

            <el-form-item label="通知员工">
                <chose-contact-group-modal :whitelist="['dept_user','role']" :dept-with-son="true" test-type="onlyspread" :with-advance-set="false" :group-list="item.deptuser"></chose-contact-group-modal>
              
            </el-form-item>

        </div>
        <el-form-item>
            <el-button @click="addvalue" type="primary" icon="el-icon-plus" size="mini">添加</el-button>
        </el-form-item>
    </el-card>
</div>
</template>

<script>
import propsync from 'vue-propsync'
import ChoseContactGroupModal from './chose-contact/chose-contact-group-modal'
// import ChoseUser from './CChoseUser'

import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'

export default {
    name: 'FlowAutoRun',
    mixins: [propsync],
    components: {
        ChoseContactGroupModal
        // ChoseUser
    },
    props: {
        value: {
            type: Array,
            default: () => {
                return [{
                    type: 'month',
                    month:null,
                    week: null,
                    day: null,
                    time: null,
                    deptuser: [],
                    disminutes: null
                    //Distance minutes
                }]
            },
            isSync: true
        },
    },
    data() {
        return {



        }
    },
    watch: {

        sync_value: {
　　　　handler(newValue, oldValue) {
　　　　　　 this.sync_value.forEach(ele => {

                

                if (ele.type == 'year') {
                }


                if (ele.type == 'month') {
                    if (!!ele.day && !!ele.time) {
                        ele.disminutes = Number(ele.day - 1) * 1440 + this.minutesto(ele.time);
                    } else {
                        ele.disminutes = null;
                    }
                }
                if (ele.type == 'week') {

                    if (!!ele.week && !!ele.time) {
                        ele.disminutes = Number(ele.week - 1) * 1440 + this.minutesto(ele.time);
                    } else {
                        ele.disminutes = null;
                    }

                }
                if (ele.type == 'day') {
                    if (!!ele.time) {
                        ele.disminutes =this.minutesto(ele.time);
                    } else {
                        ele.disminutes = null;
                    }
                }

            })
　　　　},
　　　　deep: true
　　}
    },
    mounted() {

    },
    computed: {
        ...mapGetters([
            'requireDataList'
        ]),

    },
    methods: {
        minutesto(time) {
            if (!time) return 0;
            let arr = time.split(':')

            if (arr.length == 2) {
                return Number(arr[0]) * 60 + Number(arr[1]);
            }

            return 0;

        },
        addvalue() {
            this.sync_value.push({
                type: 'month',
                month:null,
                week: null,
                day: null,
                time: null,
                deptuser: [],
                disminutes: null
            });
        },

        removeItem(list, index) {
            list.splice(index, 1);
        }

    }
}
</script>

<style scoped>
.index,
.romove {
    background-color: #00BCD4;
    position: absolute;
    color: white;
    border-radius: 50%;
    line-height: 30px;
    text-align: center;
    font-weight: bolder;
    top: 2px;
}

.index {
    height: 30px;
    width: 30px;
}

.romove {
    right: 10px;
    z-index: 3;
}
</style>
