<template>
<div>
    <van-search placeholder="搜索" v-model="search.flowname" @search="searchdata(1)" @clear="searchdata(1)" />

    <van-pull-refresh v-model="pullloading" @refresh="searchdata(1)" >

        <van-list v-model="listloading" :finished="this.page.finished" finished-text="没有更多了" @load="listload">

            <div class="msglist" v-for="(row,index) in msgList" :key="index" @click="gotonext(row)" >
                    <div class="main">

  <div class="hasread" v-if="!row.hasread"></div>

                <div class="time">{{ friendlytimejs(row.created_at) }}</div>
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
                    <span class="label warning">  {{row.NowFunName}}</span>
                    来自 <span class="label success fz12">{{row.PreFunName }}</span>
                </div>

                <div class="workname">文号:{{row.flowlistOi.workname }}</div>
            </div></div>
        </van-list>
    </van-pull-refresh>

</div>
</template>

<script>
import {
    FlowWaiting,
        FlowSetRead
} from '@/api/oa'

import flowlist from '@/utils/mixins/flowList'
import {
    mapState
} from 'vuex'

export default {
    name: 'Cflowlist',
    computed: {
        ...mapState({
            flowBadge: state => state.user.flowBadge
            //  messageReadedList: state => state.employee.messageReadedList,
        })
    },

    components: {},
    mixins: [flowlist],
    data() {
        return {
            searchFun: FlowWaiting,
            //mounttimer:0,
        }
    },
    activated() {
        // console.log('nihao2');
        // console.log('ni',this.flowBadge);
        //    console.log('nihaoactivate');
        if (this.flowBadge.waitingListRefresh) {
            this.searchdata(1);
        }
        
    },
    mounted() {
        // this.mounttimer++;
        // console.log('nihao1');
        this.flowBadge.waitingListRefresh = false;
    },
    methods: {
        gotonext(mesObj) {


            if (!mesObj.hasread) {

                mesObj.hasread = 1
                
                // FlowSetRead({
                //     msgid: mesObj._id
                // }).then(({
                //     data: req
                // }) => {
                //     if (req.success) {
                //         mesObj.hasread = 1
                //     }
                // })

            }




            this.$router.push({
                name: 'flowdeal',
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
