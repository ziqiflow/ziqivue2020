<template>
<div v-loading="loading">

     <flow-creat  @on-success="CreatSuccessHander" v-if="cancreat" ref="flowcreat" />


    <div class="headerhandle">
        <div class="pilian" v-if="isEditMode" @click="isEditMode=false"><i class="el-icon-close"></i>取消</div>
        <div class="pilian" v-else @click="isEditMode=true"><i class="el-icon-edit"></i>批量</div>
        <div class="v-search" style="  padding-right: 46px;">
            <van-search placeholder="搜索" v-model="search.flowname" @search="searchdata(1)" @clear="searchdata(1)" />
        </div>
        <div class="shaixuan" @click='shaixuanMode=!shaixuanMode'>
            <v-icon name="shaixuan"></v-icon>筛选
        </div>
    </div>

    <div class="shaixuanBox" v-if="shaixuanMode">

        <el-radio-group @change="shaixuanRadioChanged" v-model="search.creatstatus" size="small">

            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="uncreat">未创建</el-radio-button>
            <el-radio-button label="creat">已创建</el-radio-button>
        </el-radio-group>

    </div>

    <van-pull-refresh v-model="pullloading" @refresh="searchdata(1)">

        <van-list v-model="listloading" :finished="this.page.finished" finished-text="没有更多了" @load="listload">

            <van-checkbox-group v-model="nowCheckResult">

                <div class="msglist" v-for="(row,index) in msgList" :key="index">
                    <div class="time">{{ friendlytimejs(row.created_at) }}</div>

                    <div class="checkbox" v-if="isEditMode">
                        <van-checkbox :name="row._id"></van-checkbox>
                    </div>

                    <div class="main" :class="isEditMode?'editmode':''">

                        <div class="hasread"  v-if="!row.hasdone"></div>
                        <div class="headerTitle">
                            {{row.flowname}}
                        </div>
                        <div class="descTitle">
                            {{row.desc}}
                            <el-button  @click="gotonext(row)" style="float:right" v-if="!isEditMode" size="mini" type="primary" plain >创建</el-button>   
                            <div style="clear:both"></div>
                        </div>
                    

                    </div>
                </div>
            </van-checkbox-group>
        </van-list>
    </van-pull-refresh>

    <div class="footer" v-if="isEditMode">
        <van-checkbox style="display: inline-block;margin: 6px 0 0 10px;" v-model="AllChecked">全选</van-checkbox>
        <el-button @click="isEditMode=false" style="float:right;margin-left: 10px;" size="small">取消</el-button>
        <el-button @click="setReaded" style="float:right;" type="primary" :disabled="!nowCheckResult.length" size="small">标记为已创建
            <span v-if='nowCheckResult.length'>
          ({{nowCheckResult.length}})
          </span></el-button>

    </div>

</div>
</template>

<script>
import {
    FlowNeedCreat,
    FlowAlertDone
} from '@/api/oa'
import FlowCreat from './common/CFlowCreat'
import flowlist from '@/utils/mixins/flowList'

export default {
    name: 'Cflowlist',
    components: {
        //FlowLog
        FlowCreat
    },
    mixins: [flowlist],

    data() {
        return {
            cancreat:false,
            searchFun: FlowNeedCreat,
            AllChecked: false,
            nowItem:null,
            isEditMode: false,
            nowCheckResult: [],
            shaixuanMode: false,
            loading: false
        }
    },
    mounted() {},
    watch: {
        AllChecked(newValue, oldValue) {
            if (this.AllChecked) {
                let nowCheckResult = [];
                this.msgList.forEach(ele => {
                    nowCheckResult.push(ele._id);
                })
                this.nowCheckResult = nowCheckResult;

            } else {
                this.nowCheckResult = [];
            }

        },
        nowCheckResult() {

            this.AllChecked = this.nowCheckResult.length == this.msgList.length

        }
    },
    methods: {

            
            initresultdata: function() {

      let query=this.$route.query;
      if(!!query.showid){
          

          this.msgList.forEach(ele=>{

              if(ele._id==query.showid&&!ele.hasdone){
                  console.log(ele);
                  this.gotonext(ele);
              }

          })

        

      }
    //   console.log();
    //   console.log(this.page)
    },


         setDone(row) {
            if (!row) return;
            FlowAlertDone({
                id: row._id
            }).then(({
                data: req
            }) => {
                if (req.success) {
                    row.hasdone = true;
                    this.flowBadge.needcreat--;
                    this.$message.success("标记成功");
                } else {
                    this.$message.error("标记失败");
                }
            });
        },


        CreatSuccessHander() {
            console.log('创建成功');
            this.setDone(this.nowItem);

        },

        shaixuanRadioChanged() {
            localStorage.setItem('message.creatstatus', this.search.creatstatus == 'creat' ? 'all' : this.search.creatstatus);
            this.searchdata(1);
        },

        initsearch() {
            
            let creatstatus = localStorage.getItem('message.creatstatus');
            if (!this.inArray(creatstatus, ['uncreat', 'creat', 'all'])||!!this.$route.query.showid) {
                creatstatus = 'uncreat';
            }
            this.$set(this.search, "creatstatus", creatstatus);

            
        },

        inArray(val, arr) {
            return arr.some(v => {
                return val === v;
            })
        },

        setReaded() {

            this.loading = true;

            if (this.nowCheckResult.length == 0) {
                return;
            }
            
            FlowAlertDone({
                id: this.nowCheckResult.join('-')
            }).then(({
                data: req
            }) => {
                this.loading = false;
                if (req.success) {
                    this.$message.success(req.msg);

                    this.flowBadge.needcreat = this.flowBadge.needcreat - req.data;
                    this.msgList.forEach(ele => {
                        if (this.inArray(ele._id, this.nowCheckResult)) {
                            ele.hasdone = 1;
                        }
                    })

                } else {
                    this.$message.error(req.msg);
                }

                this.isEditMode = false;
                this.nowCheckResult = [];
                this.AllChecked = false;
            })

        },
        gotonext(obj) {

            if (this.isEditMode) return;

               this.nowItem = obj;


            this.cancreat = false;

            setTimeout(() => {
                this.cancreat = true;

                setTimeout(() => {
                    this.$refs.flowcreat.creatform(obj.flowid);
                }, 100);

            }, 100);



            // this.$router.push({
            //     name: 'flowdetail',
            //     query: {
            //         msgid: mesObj._id,
            //         flowlistid: mesObj.flowlistid,
            //         nowfunid: mesObj.NowFunid
            //     }
            // });
        }
    }
}
</script>

<style src="./list.css" scoped></style>
