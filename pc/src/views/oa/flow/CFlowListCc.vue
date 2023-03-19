<template>
<div>
    <el-alert v-if="!!error" :title="error" :closable="false" type="error" />
    <div v-else>

        <el-card :body-style="{padding:'0px'}" style="margin-bottom:20px">
            <div slot="header" class="clearfix" :body-style="{padding:'0px'}">
                <span>
                  <i class="el-icon-search"></i>
                  搜索栏</span>
                <el-button v-if="!searchbarShow" @click="toggleSearchbarShow" style="float: right; padding: 3px 0" type="text">展开</el-button>
                <el-button v-else @click="toggleSearchbarShow" style="float: right; padding: 3px 0" type="text">关闭</el-button>
            </div>

            <el-form  class="searchform_oa" size='mini' v-if="searchbarShow" label-width="80px" style="margin:10px;">
                <el-form-item label="流程名称">
                    <el-input v-model="search.flowname"></el-input>
                </el-form-item>

                <el-form-item label="文号">
                    <el-input v-model="search.workname"></el-input>
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
                <div style="margin-bottom:10px;">
                    <div style="float:left">
                        共搜索到
                        <span>{{ page.totalItems }}</span> 条信息
                    </div>
                    <div style="float:right">
                        <el-button type="primary" @click="setAllRead">全部标记已读</el-button>
                    </div>
                    <div style="clear:both" />

                </div>

                <el-table :data="page.result" border stripe style="width: 100%;" :row-class-name="tableRowClassName" >

                    <el-table-column label="流程名称" width="180">
                        <template slot-scope="scope">
                            <strong>{{ scope.row.flowname }}</strong>
                        </template>
                    </el-table-column>

                    <el-table-column label="文号" width="180">
                        <template slot-scope="{row}">
                                   <span class="emergency_label" v-if="row.level==100">紧急</span>
                            {{ row.flowlistOi.workname }}
                        </template>
                    </el-table-column>

                       <el-table-column label="状态" width="90">
                        <template slot-scope="{row}">
                            {{ row.hasread?'已读':'未读'}}
                        </template>
                    </el-table-column>

                    

                    <el-table-column label="流程描述" width="200">
                        <template slot-scope="{row}">
                            {{ row.flowlistOi.desc }}
                        </template>
                    </el-table-column>



                    <el-table-column label="时间" width="180">
                        <template slot-scope="{row}">
                            创建于 {{ row.flowlistOi.created_at }}<br>
                            抄送我：{{ row.created_at }}
                        </template>
                    </el-table-column>

                    <el-table-column label="处理节点" width="180">
                        <template slot-scope="scope">
                            <span class="label warning">
                {{ scope.row.NowFunName }}
              </span>

                            来自
                            <span class="label success fz12">{{ scope.row.PreFunName }}</span>

                            <v-icon style="cursor: pointer;margin-left:5px;" name="ios-git-network" @click="showflowgraph" />

                        </template>
                    </el-table-column>

                    <el-table-column label="最近日志" width="300">
                        <template slot-scope="{row}">
                            <div style="padding:10px;">
                                <flow-log :show-next="false" :log="row.lastlog" />
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" width="230">
                        <template slot-scope="{row}">
                            <el-button type="error" size="small" @click="seedetail_and_set_read(row,'cc')">查看流程</el-button>
                            <el-button v-if="!row.hasread" type="primary" size="small" style="margin-left: 5px" @click="setRead(row)">标记为已读</el-button>

                        </template>
                    </el-table-column>

                </el-table>

                <el-pagination :current-page="page.currentPage" :page-size="page.pageSize" :total="page.totalItems" background layout="prev, pager, next" @current-change="handerPageChange" />

            </div>
        </el-card>
    </div>

    <modal-flow-detail ref="flowdetail" />

</div>
</template>

<script>
import {
    FlowCc,
    FlowSetRead,
    FlowSetAllRead
} from '@/api/oa'

import flowlist from '@/utils/mixins/flowList'

import ModalFlowDetail from './common/CModalFlowDetail'

import FlowLog from './common/CFlowLog'

export default {
    name: 'Cflowlist',
    components: {
        ModalFlowDetail,
        FlowLog
    },
    mixins: [flowlist],

    data() {
        return {
            searchFun: FlowCc,
            columns: [{
                    title: '流程名称',
                    slot: 'flowdesignername'
                },
                {
                    title: '流程描述',
                    slot: 'flow_desc'
                },
                {
                    title: '时间',
                    slot: 'flow_created_at'
                },
                {
                    title: '处理节点',
                    slot: 'flowstatusat'
                },
                {
                    title: '最近日志',
                    slot: 'lastlog',
                    width: 300
                },

                {
                    title: '可操作',
                    slot: 'action',
                    width: 250,
                    align: 'center'
                }
            ]
        }
    },
    activated() {},
    mounted() {
        // this.searchdata(1)
    },
    methods: {
        initsearch() {
            this.$set(this.search, "readstatus", 'unread');
        },
        setAllRead() {
            FlowSetAllRead({
                type: 'cc'
            }).then(({
                data: req
            }) => {
                if (req.success) {
                    this.flowBadge.cc = 0
                    this.$message.info('标记成功')
                    this.page.result.forEach(ele => {
                        ele.hasread = 1
                    })
                } else {
                    this.$message.error('标记失败:' + req.msg)
                }
            })
        },
        setRead(row) {
            FlowSetRead({
                msgid: row._id
            }).then(({
                data: req
            }) => {
                if (req.success) {
                    row.hasread = 1
                    this.flowBadge.cc--
                    //    this.$notify({
                    //             type: 'success',
                    
                    //             message: req.msg
                    //         });
                    this.$message.info('标记成功')
                } else {
                    this.$message.error('标记失败')
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
</style>
