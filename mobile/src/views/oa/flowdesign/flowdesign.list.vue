<template>
<div>
    <el-card class="box-card">
        <el-alert v-if="!!error" :title="error" :closable="false" type="error" />
        <div v-else>
            <div v-if="searchloading" class="box  pd10 mg10 text-center">
                正在加载中。。。
            </div>
            <div v-if="page.result.length==0&&!searchloading" class="box pd10 mg10 text-center">无任何记录</div>

            <div v-if="page.result.length!=0" class="box">
                <div>共搜索到
                    <span>{{ page.totalItems }}</span> 条信息</div>

                <el-table :data="page.result" style="width: 100%">
                    <el-table-column prop="name" label="流程名称" width="200" />
                    <el-table-column prop="description" label="简单介绍" />
                    <el-table-column label="是否启用">
                        <template slot-scope="scope">
                            <span v-if="scope.row.canuse">是</span>
                            <span v-else>否</span>
                        </template></el-table-column>
                    <el-table-column prop="created_at" label="创建时间" />
                    <el-table-column prop="_id" label="_id" />

                    <el-table-column fixed="right" label="操作" width="230">
                        <template slot-scope="{row,$index}">

                            <el-button class="mg-b5" size="mini" @click="edit($index)">基础编辑</el-button>
                            <br>
                            <el-button class="mg-b5" size="mini" @click="editSenior($index)">高级编辑</el-button>
                            <br>
                            <el-button class="mg-b5" icon="el-icon-delete" size="mini" type="danger" @click="deleteflow($index)">删除</el-button>
                            
                        </template>
                    </el-table-column>

                </el-table>

                <el-pagination :current-page="page.currentPage" :page-size="page.pageSize" :total="page.totalItems" background layout="prev, pager, next" @current-change="handerPageChange" />

            </div>
        </div>

    </el-card>
</div>
</template>

<script>
import {
    FlowdesignsLists,
    FlowdesignsDelete
} from '@/api/flowdesign'

export default {
    name: 'FlowdesignLists',
    data() {
        return {
            error: null,
            searchloading: false,
            search_list: null,
            orderby_list: null,
            display_list: null,
            search: {
                s_isorder: null,
                s_orderby: null
            }, 
            page: {
                result: [],
                totalItems: 0,
                pageSize: 20,
                currentPage: 1
            }

        }
    },
    activated() {

    },
    mounted() {
        this.searchdata(1)
    },
    methods: {

        deleteflow(index) {
            this.$confirm('确定删除此条流程吗？谨慎删除，一旦删除，已经被创建的流程会失效').then(
                () => {
                    
                    FlowdesignsDelete({
                        id: this.page.result[index]._id
                    }).then(({
                        data: req
                    }) => {
                        if (req.success) {
                            this.$message.success(req.msg)
                            this.page.result.splice(index, 1)
                        } else {
                            this.$message.error(req.msg)
                        }
                    })
                }
            ).catch(
                () => {
                    
                }
            )
        },

        handerPageChange(nowpage) {
            // alert(nowpage);
            this.searchdata(nowpage)
        },

        edit: function (index) {
            this.$router.push({
                path: `flowdesign_edit/${this.page.result[index]._id}`
            })
        },

        editSenior: function (index) {
            this.$router.push({
                path: `flowdesign_edit_senior/${this.page.result[index]._id}`
            })
        },


        searchdata: function (currentPage) {
            if (this.searchloading) {
                this.$message.warning('请勿重复提交表单')
                return
            }
            this.searchloading = true
            this.page.result = []

            FlowdesignsLists({
                nowpage: currentPage
            }).then(({
                data: req
            }) => {
                console.log(req)
                this.page = req.data
                this.searchloading = false
            })
        }

    }
}
</script>

<style>
</style>
