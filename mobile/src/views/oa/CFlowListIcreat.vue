<template>
<div>
    <van-search placeholder="搜索" v-model="search.flowname" />

    <van-pull-refresh v-model="pullloading" @refresh="searchdata(1)">

        <van-list v-model="listloading" :finished="this.page.finished" finished-text="没有更多了" @load="listload">

            <div class="msglist" v-for="(row,index) in msgList" :key="index" @click="gotonext(row)">
                <div class="time">{{ friendlytimejs(row.created_at) }}</div>
                <div class="arrow-right"><i style="font-size: 20px;" class="el-icon-arrow-right"></i></div>
                <div class="headerTitle">

                        <span class="label emergency_label" v-if="row.level==100">紧急</span>
                        
                    {{row.name}}
                </div>
                <div class="descTitle">
                    描述：
                    <span v-if="row.desc" >{{row.desc}}</span>
                    <span v-else>无</span>
                </div>
                <div class="detail">
                   <el-card shadow="never">
                       最近日志：
                     <flow-log :show-next="false" :log="row.lastlog"/>
                  </el-card>

                </div>
            </div>
        </van-list>
    </van-pull-refresh>

</div>
</template>

<script>
import {
    FlowICreat
} from '@/api/oa'

import flowlist from '@/utils/mixins/flowList'


import FlowLog from './common/CFlowLog'

export default {
    name: 'Cflowlist',
    components: {
      FlowLog
    },
    mixins: [flowlist],
    data() {
        return {
            searchFun: FlowICreat
        }
    },
    mounted() {
    },
    methods: {
        gotonext(mesObj) {
            this.$router.push({
                name: 'flowdetail',
                query: {
                    // msgid: mesObj._id,
                    flowlistid: mesObj._id,
                    // nowfunid: mesObj.NowFunid
                }
            });
        }
    }
}
</script>
<style src="./list.css" scoped></style>