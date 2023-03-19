<template>
<div class="FlowSeeEmployee" style="margin:10px;">
    <el-alert v-if="error" :closable="false" :title="error" type="error" />

    <div>
        选择员工：
        <div style="line-height: 36px;">
        <change-user2 style="width:300px;display: inline-block;float: left;" v-model="userid"></change-user2> <el-button style="margin-left: 10px;" @click="queryData">查询</el-button>
        </div>
       
    </div>

    <el-dialog title="查看员工oa记录" :visible.sync="dialogVisible" width="80%">
        <div ref="iframevue" class="iframevue">
            <vue-friendly-iframe v-if="!!iframeSrc" style="height: 650px;" :src="iframeSrc"></vue-friendly-iframe>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>

</div>
</template>

<script>
import ChangeUser2 from '@/views/contacts/CchangeUser2'
import {
    setToken
} from '@/utils/auth';

import Lodash from 'lodash'
import VueFriendlyIframe from 'vue-friendly-iframe';

import {
    ChangeToReplaceEmployee
} from '@/api/login';


export default {
    name: 'FlowSeeEmployee',
    destroyed() {
        window.onresize = null;
    },
    components: {
        ChangeUser2,
        VueFriendlyIframe
        //workbenchEmployee
    },
    data() {
        return {
            dialogVisible: false,
            error: null,
            userid: null,
            wrapperHeight: null,
            // iframeSrc: 'http://www.baidu.com',
            iframeSrc:'/dingtalkReplace/index.html#/replace_employee'
        }
    },
    mounted() {
    },
    methods: {

        initiframe() {

            // console.log('add',this.$refs.iframevue.parentElement)

            this.wrapperHeight = this.$refs.iframevue.parentElement.offsetHeight;

            const that = this
            window.onresize = _.debounce(() => {
                console.log("onresize:")
                that.wrapperHeight = that.$refs.iframevue.parentElement.offsetHeight;
            }, 400)

        },

        queryData() {

            if (!this.userid) {
                this.$message.error('未选择员工')
                return;
            }
            let arr = this.userid.split('__')

            ChangeToReplaceEmployee({
                userid: arr[1]
            }).then(({
                data: res
            }) => {
                if (!res.success) {
                    this.$message.error(res.msg);
                    return;
                }
                setToken(res.data.token, window.env.replace_emp.CookieTokenKey);

                this.dialogVisible = true;

                setTimeout(() => {
                    this.initiframe();

                }, 500);

            })
            //   arr[0];
            //   arr[1];

        },

    }
}
</script>


<style>
.iframevue {
    height: 100%;
}
.FlowSeeEmployee .el-dialog__body{
    padding: 10px 10px;

}
.iframevue iframe {
    width: 100%;
    height: 100%;
    border: none;
}
</style>
