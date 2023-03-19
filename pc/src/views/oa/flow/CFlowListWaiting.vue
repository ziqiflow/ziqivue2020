<template>
<div>
    <el-alert v-if="!!error" :title="error" :closable="false" type="error" />
    <div v-else>
        <el-card :body-style="{padding:'0px'}" style="margin-bottom:20px">
            <div slot="header" :body-style="{padding:'0px'}" class="clearfix">
                <span>
                    <i class="el-icon-search" />
                    搜索栏</span>
                <el-button v-if="!searchbarShow" style="float: right; padding: 3px 0" type="text" @click="toggleSearchbarShow">展开</el-button>
                <el-button v-else style="float: right; padding: 3px 0" type="text" @click="toggleSearchbarShow">关闭</el-button>
            </div>

            <el-form v-if="searchbarShow" class="searchform_oa" size="mini" label-width="80px" style="margin:10px;">
                <el-form-item label="流程名称">
                    <el-input v-model="search.flowname" />
                </el-form-item>

                <el-form-item label="文号">
                    <el-input v-model="search.workname" />
                </el-form-item>

                <el-form-item v-if="!!search.readstatus" label="是否已读">

                    <el-radio-group v-model="search.readstatus">
                        <el-radio label="read">已读</el-radio>
                        <el-radio label="unread">未读</el-radio>
                        <el-radio label="all">全部</el-radio>
                    </el-radio-group>

                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="searchSummit">搜索</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card>
            <div v-if="searchloading" class="box  pd10 mg10 text-center">
                正在加载中。。。
            </div>
            <div v-if="page.result.length==0&&!searchloading" class="box pd10 mg10 text-center">无任何记录</div>

            <div v-if="page.result.length!=0" class="box">
                <div>共搜索到
                    <span>{{ page.totalItems }}</span> 条信息

                    <div style="float:right">
                        <el-button type="primary" @click="setAllRead">全部标记已读</el-button>
                    </div>

                </div>

                <el-table :data="page.result" stripe :row-class-name="tableRowClassName" style="width: 100%;">

                    <el-table-column label="流程名称" width="200">
                        <template slot-scope="scope">
                            <strong>{{ scope.row.flowname }}</strong>
                        </template>
                    </el-table-column>
      <el-table-column label="文号" width="180">
                        <template slot-scope="{row}"> <span class="emergency_label" v-if="row.level==100">紧急</span>
                            {{ row.flowlistOi.workname }}
                        </template>
                    </el-table-column>
                    <el-table-column label="流程描述" width="230">
                        <template slot-scope="{row}">
                            {{ row.flowlistOi.desc }}
                        </template>
                    </el-table-column>
                    
<el-table-column label="处理节点" width="220">
                        <template slot-scope="scope">

                            <span class="label warning">
                                {{ scope.row.NowFunName }}
                            </span>
                            来自

                            <span class="label success fz12">{{ scope.row.PreFunName }}</span>

                            <v-icon style="cursor: pointer;margin-left:5px;" name="ios-git-network" @click="showflowgraph" />

                        </template>
                    </el-table-column>
              

                    <el-table-column label="超时" width="120">
                        <template slot-scope="{row}">

                            <span v-if="row.timeexpired">

                                <el-tooltip :content="'过期时间：'+row.timeexpired" class="item" effect="dark" placement="top-start">
                                    <span>
                                        <span v-if="hasexpire(row.timeexpired)" style="color:red">
                                            [已超时]{{ dateCount(row.timeexpired) }}
                                        </span>
                                        <span v-else>
                                            剩余
                                            {{ dateCount(row.timeexpired) }}
                                        </span>

                                    </span>
                                </el-tooltip>

                            </span>

                            <span v-else>
                                无
                            </span>

                            <span v-if="!!row.expiredtimes" class="expiredtimes" title="超时次数">{{ row.expiredtimes }}</span>

                        </template>
                    </el-table-column>

                    <el-table-column label="状态" width="90">
                        <template slot-scope="{row}">
                            {{ row.hasread?'已读':'未读' }}
                        </template>
                    </el-table-column>

                    <el-table-column label="流程创建时间" width="200">
                        <template slot-scope="scope">
                            <div> 创建于 {{ friendlytimejs(scope.row.flowlistOi.created_at) }}
                                <span class="person"> {{ scope.row.flowlistOi.creater }}</span>
                            </div>
                            <div class="mg-t5">转到此处：{{ friendlytimejs(scope.row.created_at) }}
                                <span class="person"> {{ scope.row.creater }}</span></div>
                        </template>
                    </el-table-column>

                    

                    <el-table-column fixed="right" label="操作" width="180">
                        <template slot-scope="{row}">

                            <el-button type="primary" size="small" style="margin-right: 5px" @click="dealflow(row)">处理</el-button>
                            <el-button type="error" size="small" @click="seedetail_and_set_read(row,'waiting')">查看流程</el-button>

                        </template>
                    </el-table-column>

                </el-table>

                <el-pagination :current-page="page.currentPage" :page-size="page.pageSize" :total="page.totalItems" background layout="prev, pager, next" @current-change="handerPageChange" />

            </div>
        </el-card>
    </div>

    <modal-flow-dealer v-if="candeal" ref="flowdealer" @need-refresh="searchdata(1)" />
    <modal-flow-detail ref="flowdetail" />

</div>
</template>

<script>
import {
    FlowWaiting,
    FlowSetAllRead
} from '@/api/oa'

import flowlist from '@/utils/mixins/flowList'

import ModalFlowDealer from './common/CModalFlowDealer'
import ModalFlowDetail from './common/CModalFlowDetail'
import FlowLog from './common/CFlowLog'

export default {
    name: 'Cflowlist',
    components: {
        ModalFlowDealer,
        ModalFlowDetail,
        FlowLog
    },
    mixins: [flowlist],
    data() {
        return {
            searchFun: FlowWaiting
        }
    },
    activated() {},
    mounted() {
        // this.searchdata(1)
    },
    methods: {
        hasexpire(nowtime) {
            console.log(nowtime, new Date(nowtime) - new Date())
            return (new Date(nowtime) - new Date()) < 0
        },

        dateCount(nowtime) {
          
            
            var date = new Date()
            var until = new Date(nowtime)
            
            var diff= (date-until)/1000;
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
                str += minute + '分钟'
            }

            return str
        },

        initsearch() {
            this.$set(this.search, 'readstatus', 'all')
        },

        setAllRead() {
            // alert('ddd');
            FlowSetAllRead({
                type: 'waiting'
            }).then(({
                data: req
            }) => {
                if (req.success) {
                    this.$message.success('标记成功')
                    this.page.result.forEach(ele => {
                        ele.hasread = 1
                    })
                } else {
                    this.$message.error('标记失败:' + req.msg)
                }
            })
        }

    }
}
</script>


<style scoped>


.label ,.emergency_label{
    border-radius: 4px;
    color: white;
    padding: 2px 3px;
    display: inline-block;
}

.emergency_label{
    background-color: #ff3d00;
    color: white;
    line-height: 17px
}

.label.success {
    background-color: #19be6b
}

.label.warning {
    background-color: #ff9900;
}

.person {
    border-radius: 4px;
    color: white;
    padding: 0px 2px;
    display: inline-block;
    background-color: #515a6e
}

.expiredtimes {
    background-color: #F56C6C;
    border-radius: 10px;
    color: #FFF;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #FFF;
}
</style>
