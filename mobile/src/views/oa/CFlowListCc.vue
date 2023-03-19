<template>
<div v-loading="loading">

    <div class="headerhandle">
        <div class="pilian" v-if="isEditMode" @click="isEditMode=false"><i class="el-icon-close"></i>取消</div>
        <div class="pilian" v-else @click="isEditMode=true"><i class="el-icon-edit"></i>批量</div>
        <div class="v-search" style="  padding-right: 46px;">
            <van-search placeholder="搜索" v-model="search.flowname" @search="searchdata(1)" @clear="searchdata(1)" />
        </div>

        <div class="shaixuan" @click='shaixuanMode=!shaixuanMode'>
            <v-icon name="shaixuan"></v-icon>筛选
        </div>

    </div>

    <div class="shaixuanBox" v-if="shaixuanMode">

        <el-radio-group @change="shaixuanRadioChanged" v-model="search.readstatus" size="small">

            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="unread">未读</el-radio-button>
            <el-radio-button label="read">已读</el-radio-button>
        </el-radio-group>

    </div>

    <van-pull-refresh v-model="pullloading" @refresh="searchdata(1)">

        <van-list v-model="listloading" :finished="this.page.finished" finished-text="没有更多了" @load="listload">

            <van-checkbox-group v-model="nowCheckResult">

                <div class="msglist" v-for="(row,index) in msgList" :key="index">
                    <div class="time">{{ friendlytimejs(row.created_at) }}</div>

                    <div class="checkbox" v-if="isEditMode">
                        <van-checkbox :name="row._id"></van-checkbox>
                    </div>

                    <div class="main" :class="isEditMode?'editmode':''" @click="gotonext(row)">

                        <div class="hasread" v-if="!row.hasread"></div>
                        <div class="arrow-right" v-if="!isEditMode"><i style="font-size: 20px;" class="el-icon-arrow-right"></i></div>
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

                            <div><span class="label warning">  {{row.NowFunName}}</span>
                                来自 <span class="label success fz12">{{row.PreFunName }}</span>
                            </div>
                        </div>

                         <div class="workname">文号:{{row.flowlistOi.workname }}</div>



                    </div>
                </div>
            </van-checkbox-group>
        </van-list>
    </van-pull-refresh>

    <div class="footer" v-if="isEditMode">
        <van-checkbox style="display: inline-block;margin: 6px 0 0 10px;" v-model="AllChecked">全选</van-checkbox>
        <el-button @click="isEditMode=false" style="float:right;margin-left: 10px;" size="small">取消</el-button>
        <el-button @click="setReaded" style="float:right;" type="primary" :disabled="!nowCheckResult.length" size="small">标记为已读
            <span v-if='nowCheckResult.length'>
          ({{nowCheckResult.length}})
          </span></el-button>

    </div>

</div>
</template>

<script>
import {
    FlowCc,
    FlowSetRead
} from '@/api/oa'

import flowlist from '@/utils/mixins/flowList'

export default {
    name: 'Cflowlist',
    components: {
        //FlowLog
    },
    mixins: [flowlist],

    data() {
        return {
            searchFun: FlowCc,
            AllChecked: false,
            isEditMode: false,
            nowCheckResult: [],
            loading: false,
            shaixuanMode: false,
        }
    },
    mounted() {},
    watch: {
        AllChecked(newValue, oldValue) {
            if (this.AllChecked) {
                let nowCheckResult = [];
                this.msgList.forEach(ele => {
                    nowCheckResult.push(ele._id);
                })
                this.nowCheckResult = nowCheckResult;

            } else {
                this.nowCheckResult = [];
            }

        },
        nowCheckResult() {

            this.AllChecked = this.nowCheckResult.length == this.msgList.length

        }
    },
    methods: {

        shaixuanRadioChanged() {
            localStorage.setItem('cc.readstatus', this.search.readstatus == 'read' ? 'all' : this.search.readstatus);
            this.searchdata(1);
        },

        initsearch() {
            
            let readstatus = localStorage.getItem('cc.readstatus');
            if (!this.inArray(readstatus, ['unread', 'read', 'all'])) {
                readstatus = 'unread';
            }
            this.$set(this.search, "readstatus", readstatus);
        },

        inArray(val, arr) {
            return arr.some(v => {
                return val === v;
            })
        },

        setReaded() {

            this.loading = true;

            if (this.nowCheckResult.length == 0) {
                return;
            }
            FlowSetRead({
                msgid: this.nowCheckResult.join('-')
            }).then(({
                data: req
            }) => {
                this.loading = false;
                if (req.success) {
                    this.$message.success(req.msg);

                    this.flowBadge.cc = this.flowBadge.cc - req.data;
                    this.msgList.forEach(ele => {
                        if (this.inArray(ele._id, this.nowCheckResult)) {
                            ele.hasread = 1;
                        }
                    })

                } else {
                    this.$message.error(req.msg);
                }

                this.isEditMode = false;
                this.nowCheckResult = [];
                this.AllChecked = false;
            })

        },
        gotonext(mesObj) {

            if (this.isEditMode) return;
            if (!mesObj.hasread) {

                FlowSetRead({
                    msgid: mesObj._id
                }).then(({
                    data: req
                }) => {
                    if (req.success) {
                        mesObj.hasread = 1
                        this.flowBadge.cc--;
                    }
                })

            }
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
