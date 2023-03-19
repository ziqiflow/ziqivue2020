<template>
<div v-loading="loading" class="pd10">

    <div>
        <h2>{{$route.meta.title}}</h2>
    </div>
    <div v-if="!!search_list">
        <search-from ref="searchform" :search_list="search_list" :orderby_list='orderby_list' @on-search='OnSearch'></search-from>
    </div>
    <div style="color:red;">{{searcherror}}</div>
    <div v-loading="searchloading">
        <search-table @on-page-change='OnPageChange' :page='page' :display_list='display_list'></search-table>
    </div>
    

</div>
</template>

<script>
import {
    getSearchForm,
    SearchData
} from '@/api/dbctrl2'

import SearchFrom from './CSearchFrom'
import SearchTable from './CSearchTable'

// console.log('SearchFrom',SearchFrom);

import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'

export default {
    name: 'SearchPage',
    components: {
        SearchFrom,
        SearchTable
    },
    props: ['dbid'],
    computed: {
        ...mapState({
            dbIdObj: state => state.dbctrl2.dbIdObj
        })
    },
    data() {
        return {
            loading: true,
            searchloading: false,

            searcherror:null,

            search_list: null, 

            currentPage: 1, 
            searchData: null, 
            display_list: null,
            orderby_list: null, 
            page: {
                result: [],
                totalItems: 0,
                pageSize: 20,
                currentPage: 1
            },
            title:null

        }
    },

    methods: {

        ...mapActions([
            'GetDbSet'
        ]),
        initdata() {
            this.loading = false;
            this.search_list = this.dbIdObj[this.dbid]['search_list']
            this.orderby_list = this.dbIdObj[this.dbid]['orderby_list']

            setTimeout(() => {
                            this.searchData=this.$refs.searchform.getSearchData();
                            console.log('this.searchData',this.searchData);
                            this.searchdata();
            }, 300);

        },
        AfterSearch(req) {
            
            if(!req.success){
                this.$message.error(req.msg);
                this.searcherror=req.msg;
                return;
            }


            let {
                page,
                pagedata
            } = req.data;
            this.page = {
                result: pagedata.result,
                totalItems: pagedata.totalItems,
                pageSize: page.perpageSize,
                currentPage: page.currentPage
            }
            this.display_list = pagedata.display_list;
        },
        searchdata() {

            if (this.searchloading) {
                this.$message.warning('请勿重复提交表单')
                return
            }
            this.searcherror=null;

            this.searchloading = true;
            let postdata = {
                id: this.dbid,
                search_form_arr: JSON.stringify(this.searchData),
                currentPage: this.currentPage
            };

            SearchData(postdata).then(({
                data: req
            }) => {
                this.AfterSearch(req)
                this.searchloading = false
            })
            
        },
        OnSearch({search}) {
            console.log('searchdata',search)
            this.searchData = search;
            this.searchdata();
        },
        OnPageChange({currentPage}) {
            this.currentPage = currentPage;
            this.searchdata();
        }

    },
    mounted() {

        console.log('this.$router',this.$route);
        //this.;

        if (!this.dbid) {
            this.$message.info('dbid不可为空');
            return;
        }

        if (!this.dbIdObj[this.dbid]) {
            this.GetDbSet({
                dbid: this.dbid
            }).then(res => {
                console.log('dbIdObj', this.dbIdObj);
                this.initdata();
            })

        } else {
            this.initdata()
        }

    }
}
</script>

<style>
</style>
