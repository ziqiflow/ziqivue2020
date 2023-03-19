<template>
<div>
    <el-form ref="form" label-width="120px">
        <el-form-item v-for="(searcher,index) in search_list" :key="index" v-if="!!searcher.isshow" :label="searcher.zh_name">

            <div v-if="searcher['widget_data']['directive']=='search-input-text'">
                <el-input :name="searcher.name" v-model="search[searcher.name]" :placeholder="searcher.placeholder" :style="searcher.style" clearable>
                </el-input>
                <span class="search_tishi">{{searcher.tip}}</span>
            </div>

            <div v-if="searcher['widget_data']['directive']=='search-input-select'">
                <sc-ele-select :style="searcher.style" v-model="search[searcher.name]" :data='searcher["widget_data"]'></sc-ele-select>
            </div>

        </el-form-item>

        <el-form-item v-if="!!orderby_list&&orderby_list.length>0" label="排序：">

            项目:
            <el-select v-model="search.s_orderby">
                <el-option v-for="item in orderby_list" :key="item.name" :label="item.zh_name" :value="item.name">
                </el-option>
            </el-select>
            顺序：
            <el-select v-model="search.s_isorder">
                <el-option label="↓" value="1">
                </el-option>
                <el-option label="↑" value="2">
                </el-option>
            </el-select>

        </el-form-item>

        <el-form-item>
            <el-button @click="searchform" type="primary">
                搜索
            </el-button>

        </el-form-item>

    </el-form>

</div>
</template>

<script>
import ScEleSelect from "./chlidren/ScEleSelect";

export default {
    name: 'SearchPage',
    props: ['search_list', 'orderby_list'],
    components: {
        ScEleSelect
    },
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
        getSearchData() {
            return this.search;
        },
        searchform() {
            this.$emit('on-search', {
                search: this.search
            })
        }
    },
    mounted() {

        if (this.orderby_list.length) {
            this.search.s_orderby = this.orderby_list[0].name;
        }
        this.search.s_isorder = '1';

    }
}
</script>

<style>
</style>
