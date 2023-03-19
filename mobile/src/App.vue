<template>
<div id="app" :class="isPc?'platform-pc':'platform-mobile'">
    <van-nav-bar fixed v-show="title" class="van-doc-nav-bar" :title="title" :left-arrow='visible' @click-left="onBack">
    </van-nav-bar>
    <div style="height:46px;"></div>
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
</div>
</template>

<script>
export default {
    name: 'App',
    activated: function () {
        this.$setgoindex()
    },
    computed: {
        title() {
            const {
                name
            } = this.$route.meta;
            return name ? name.replace(/-/g, '') : '';
        },

        visible() {
            console.log("path:" + this.$route.path);
            return [
                '/'
            ].indexOf(this.$route.path) == -1;
          
        }

    },
    methods: {
        onBack() {
            let nowpath = this.$route.path;
            if (window.history.length <= 1) {
                this.$router.push({
                    path: '/'
                })
                return false
            } else {
                this.$router.go(-1)
            }

            setTimeout(() => {
                //alert(this.$route.path)
                if (this.$route.path == nowpath && this.$route.path != '/') {
                    this.$router.push({
                        path: '/'
                    })
                }
            }, 500)
        }
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    font-size: 13px;
}

html,
body,
#app {
    height: 100%;
}

.van-field__body {
    height: 100%;
}

.pd5 {
    padding: 5px
}

.pd10 {
    padding: 10px
}

.mg10 {
    margin: 10px;
}

.mg-t5 {
    margin-top: 5px
}

.mg-b5 {
    margin-bottom: 5px
}

.mg-r5 {
    margin-right: 5px;
}

.pd-l {
    padding-left: 10px;
}

.pd-r {
    padding-right: 10px;
}

.pd-t {
    padding-top: 10px;
}

.pd-b {
    padding-bottom: 10px;
}

.width100 {
    width: 100%;
}

.fz15 {
    font-size: 15px;
}

.fz14 {
    font-size: 14px;
}

.fz13 {
    font-size: 13px;
}

.fz12 {
    font-size: 12px;
}

.pointer {
    cursor: pointer;
}

.text-right {
    text-align: right;
}

.table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    margin-bottom: 10px;
    font-size: 13px;
}

.table>tbody>tr>td,
.table>tbody>tr>th,
.table>tfoot>tr>td,
.table>tfoot>tr>th,
.table>thead>tr>td,
.table>thead>tr>th {
    padding: 4px;
    line-height: 1.42857143;
    vertical-align: top;
    border-top: 1px solid #ddd;
}

.table-bordered>tbody>tr>td,
.table-bordered>tbody>tr>th,
.table-bordered>tfoot>tr>td,
.table-bordered>tfoot>tr>th,
.table-bordered>thead>tr>td,
.table-bordered>thead>tr>th {
    border: 1px solid #ddd;
}

.table-bordered {
    border: 1px solid #ddd;
}

.table-bordered>tbody>tr>td,
.table-bordered>tbody>tr>th,
.table-bordered>tfoot>tr>td,
.table-bordered>tfoot>tr>th,
.table-bordered>thead>tr>td,
.table-bordered>thead>tr>th {
    border: 1px solid #ddd;
}

hr {
    background-color: #c1c1c1;
    height: 1px !important;
    border: none;
}

.pointer {
    cursor: pointer;
}

.text-center {
    text-align: center;
}

.van-nav-bar{
    z-index: 7 !important;
}

@media screen and (min-width: 260px) and (max-width: 450px) {
    .el-message-box {
        width: auto;
    }
    .el-select-dropdown.el-popper{
            left: 30px !important;
    }
}
.flowdealer .el-card__body,
.flowChose .el-card__body{
padding: 15px 10px;
}



</style>
