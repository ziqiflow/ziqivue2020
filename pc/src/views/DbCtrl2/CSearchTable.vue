<template>
<div>
    <div class="box pd10 mg10 text-center" v-if="page.result.length==0">无任何记录</div>

    <div class="box" v-if='page.result.length!=0'>

        <div>共搜索到
            <span>{{page.totalItems}}</span> 条信息</div>

        <el-table ref="multipleTable" :data="page.result" border size="mini" style="width: 100%">

            <template v-for="displayer in display_list">

                <el-table-column v-if="!displayer.hide" :key="displayer.$index" :prop="displayer.name" :label="displayer.zh_name">
                </el-table-column>

            </template>

        </el-table>

        <div class="pd10 mg10">
            <div class="float-right">
                <el-pagination @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" background :total="page.totalItems" layout="prev, pager, next">
                </el-pagination>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'SearchPage',
    props: ['page', 'display_list'],
    components: {},
    computed: {

        // ...mapState({
        //     dbIdObj: state => state.dbctrl2.dbIdObj
        // })
    },
    data() {
        return {
            loading: false,
            search: {
                s_isorder: null,
                s_orderby: null
            },

        }
    },

    methods: {

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`); 
            //this.dbCurd.setPagesize(val);
            //this.searchdata(1);

        },
        handleCurrentChange(val) {
            
            this.$emit('on-page-change', {
                currentPage: val
            });
        },
    },
    mounted() {

    }
}
</script>

<style>
</style>
