<template>
<div style="    position:relative;" v-loading="loading">
    <div v-if="!successShow&&flowOi_id" style="margin:10px 10px 50px;">
        <flow-detail :nowfunid.sync="nowfunid" :flow-oi-id.sync="flowOi_id" />
    </div>

    <div v-if="showMessageBox" class="showMessageBox">
        <el-button @click="setread" size="small" type="primary" style="margin-right:20px;">标记为已读</el-button>
    </div>

</div>
</template>

<script>

import {
  FlowMessageHasRead,
  FlowSetRead
} from '@/api/oa'
// import { forEach } from '@/libs/tools';



import FlowDetail from './common/CFlowDetail'

export default {
    name: 'Cmodaldealer',
    // props: {
    //     flowid: {
    //         type: string,
    //         default: () => {
    //             return []
    //         }
    //     }
    // },
    components: {
        FlowDetail
    },
    data() {
        return {
          loading:false,
            error: null,
            modalstatu: false,
            title: null,
            successShow: false,
            tabname: 'flow.dealer',
            flowmsgid: null,
            flowOi_id: null,
            nowfunid: null,
            showMessageBox:false   
        }
    },
    watch: {
        // flowid() {
        
        // }
    },

    mounted() {
        console.log('query', this.$route.query);
        let query = this.$route.query;
        if (!!query.type) {
            
            FlowMessageHasRead({msg_id:query.msgid}).then(({
            data: req
            }) =>{
            // console.log('req',req);
              this.showMessageBox= (req.data==1||req.data===null)?false:true;
            })
        }
        this.loadmodal(this.$route.query);
        //!!this.$route.query.msgid?:,this.$route.query.flowlistid,this.$route.query.nowfunid);
    },
    methods: {
        setread(){
                this.loading=true;
                FlowSetRead({
                    msgid: this.flowmsgid
                }).then(({
                    data: req
                }) => {
                    this.loading=false;
                    if (req.success) {
                      this.showMessageBox=false;  
                    }
                })


        },
        cancelSuccess() {
            this.modalstatu = false;
        },
        cancel() {
            this.modalstatu = false
        },
        loadmodal(query) {
            //console.log(msgid);
            this.flowOi_id = !!query.flowlistid ? query.flowlistid : null;
            this.flowmsgid = !!query.msgid ? query.msgid : null;
            //   this.title = title
            //   this.modalstatu = true
            this.nowfunid = !!query.nowfunid ? query.nowfunid : null;
            //   console.log('nowfunidmodal',nowfunid);
        }

    }
}
</script>

<style scoped>
.showMessageBox {
    width: 100%;
    height: 50px;
    position: fixed;

    bottom: 0;
    background-color: black;
    color: white;
    text-align: right;
    line-height: 50px
}
</style>
