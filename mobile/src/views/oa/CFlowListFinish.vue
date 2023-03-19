<template>
<div>
    <van-search placeholder="搜索" v-model="search.flowname"   @search="searchdata(1)" @clear="searchdata(1)" />

    <van-pull-refresh v-model="pullloading" @refresh="searchdata(1)">

        <van-list v-model="listloading" :finished="this.page.finished" finished-text="没有更多了" @load="listload">

            <div class="msglist" v-for="(row,index) in msgList" :key="index" @click="gotonext(row)">
                <div class="time">{{ friendlytimejs(row.finished_at) }}</div>
                <div class="arrow-right"><i style="font-size: 20px;" class="el-icon-arrow-right"></i></div>
                <div class="headerTitle">

                        <span class="label emergency_label" v-if="row.level==100">紧急</span>

                    {{row.flowname}}
                </div>
                <div class="descTitle">
                    描述：
                    <span v-if="row.flowlistOi.desc" >{{row.flowlistOi.desc}}</span>
                    <span v-else>无</span>
                    <span class="person"> <v-icon style="font-size:12px;" name="person"></v-icon> {{row.flowlistOi.creater}}</span>
                </div>
                <div class="detail">
                    
                    <div>
                       处理节点：<span class="label warning">  {{row.NowFunName}}</span>
                    </div>

                    <div style="margin-top:3px;" v-if="!!row.log.suggest">
                      我的审批建议：
                       <span >{{ row.log.suggest }}</span>

                    </div>

                       <div class="workname">文号:{{row.flowlistOi.workname }}</div>


                </div>
            </div>
        </van-list>
    </van-pull-refresh>

</div>
</template>

<script>
import {
    FlowFinish
} from '@/api/oa'

import flowlist from '@/utils/mixins/flowList'

export default {
    name: 'Cflowlist',
    components: {
    },
    mixins: [flowlist],
    data() {
        return {
            searchFun: FlowFinish
        }
    },
    mounted() {
    },
    methods: {
        gotonext(mesObj) {
            this.$router.push({
                name: 'flowdetail',
                query: {
                    msgid: mesObj._id,
                    flowlistid: mesObj.flowlistid,
                    nowfunid: mesObj.NowFunid
                }
            });
        }
    }
}
</script>

<style src="./list.css" scoped></style>
<style scoped>
  .label.warning {
    background-color: #ff9900;
}
</style>