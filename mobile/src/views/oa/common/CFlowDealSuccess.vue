<template>
<div class="cflowdealsuccess fz13" style="line-height: 22px;">
    <div>{{ successMsg }}
        <span v-if="!!newGetFlowId"></span>

        <div v-if="nextMessages.length!=0" style="margin-top:10px;">
            已转发下一流程至：
            <div v-for="(msg,index) in nextMessages" :key="index" class="nextmsgList">  
                <div v-if="msg.dealtype=='wait_merge'">
                     流程名称：<span class="label warning">{{ msg.funname }}</span>;
                     等待以下流程合并：
                     <span class="label warning" v-for="(fun,indexfun) in msg.waitmergeFunids" :key="indexfun">{{fun.name}}</span>

                </div>
                <div v-else>
                流程名称： <span v-if="msg.list.length>0&&!!msg.level&&msg.level==100" class="label error">紧急</span><span class="label warning">{{ msg.funname }}</span>;
                处理人： <span v-for="(to,indexto) in msg.list" :key="indexto" class="label success">{{ to.name }}</span>
                <span v-if="msg.list.length==0">无</span>
                <span class="label error">{{ tran_dealtype(msg.dealtype) }}</span>
                </div>
               
            </div>
        </div>

        <div v-if="nextCC.length!=0" style="margin-top:10px">
            抄送至：
            <div v-for="(msg,index) in nextCC" :key="index" class="nextccList">
                流程名称：    <span v-if="msg.list.length>0&&!!msg.level&&msg.level==100" class="label error">紧急</span><span class="label warning">{{ msg.funname }}</span>
                ;
                抄送人：<span v-for="(to,indexto) in msg.list" :key="indexto" class="label success">{{ to.name }}</span>
                <span v-if="msg.list.length==0">无</span>
            </div>
        </div>

        <div v-if="nextFlows.length!=0" style="margin-top:10px">
            <span class="text-underline">已转发至外部流程：</span>
            <div v-for="(msg,index) in nextFlows" :key="index" class="sonflowList">
                流程名称：<span class="label dark">
            <v-icon name="md-git-branch" style="color:white" class="fz12"/>
             <span v-if="!!msg.level&&msg.level==100" class="label error">紧急</span>
            {{ msg.flowname }}</span>
                状态：<span v-if="!msg.flowlistid"><span class="label text">失败</span><span class="msg">{{ msg.msg }}</span></span>
                <span v-else><span class="label text">成功</span><span class="msg">{{ msg.msg }}</span><a target="_blank" :href="flowdetailherf+'='+msg.flowlistid" >查看</a> </span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    tran_dealtype
} from '@/utils/u_flowdesign'

export default {
    name: 'CFlowDealSuccess',
    components: {

    },
    props: {
        data: {
            
            type: Object,
            default: () => {
                return null
            }
        }
    },

    computed: {
        flowdetailherf() {
            return this.$router.resolve({
                path: '/flowdetail?flowlistid'
            }).href;
        }
    },

    data() {
        return {
            successMsg: '',
            nextMessages: [
                
            ],
            nextCC: [
                
            ],
            nextFlows: [],
            newGetFlowId: null

        }
    },
    activated() {},
    mounted() {
        this.initdata()
    },
    methods: {
        tran_dealtype(str) {
            return tran_dealtype(str)
        },
        initdata() {
            const req = this.data
            this.successMsg = req.msg
            if (!!req.data) {
                if (req.data.nextmessage) this.nextMessages = req.data.nextmessage
                if (req.data.cc) this.nextCC = req.data.cc
                if (req.data.sonflows) this.nextFlows = req.data.sonflows
                if (req.data.flowlistid) this.newGetFlowId = req.data.flowlistid
            }
        }
    }
}
</script>

<style scoped>
.label {
    border-radius: 4px;
    color: white;
    padding: 2px 3px;
    display: inline-block;
    margin-right: 8px;
}

.label.success {
    background-color: #19be6b
}

.label.warning {
    background-color: #ff9900;
}

.label.error {
    background-color: #ed4014
}

.label.dark {
    background-color: #515a6e
}
.label.text{
     background-color: #d4d4d4;
     color: #3a3a3a
}

.nextmsgList,.nextccList{
margin-bottom: 8px;
line-height: 20px;
}
</style>
