<template>
<div v-if="showTableVisible">
    <el-dialog :fullscreen="!isPc||isFullScreen" :title="title" :visible.sync="showTableVisible" width="75%" append-to-body>


      <span class="maxzoom" v-if="isPc">
            <svg-icon  v-if="isFullScreen" @click.native="toggleFullScreen" class="fz12" style="color: grey;" icon-class="exit-fullscreen" />
            <svg-icon  @click.native="toggleFullScreen" v-else class="fz12" style="color: grey;" icon-class="fullscreen" /></span>


        <el-table border :data="tabledata" :style="styles">
            <span v-for="(item2,index) in set" :key="index">
            <el-table-column v-if="isAdmin||!item2.hide" :label="item2.name"  :width="item2.width">
                <template slot-scope="{row:dataitem}">
                        {{showv(dataitem[item2.code])}}
                </template>
            </el-table-column>
           
        
            </span>  
            
               <el-table-column  label="创建者"  width="140">
                <template slot-scope="{row:dataitem}">
                        <div class="fz12">{{dataitem._creater}}</div>
                        <div class="fz12"> {{funtool_timetrans(dataitem._c_at)}}</div>
                </template>
            </el-table-column>  
            <el-table-column  label="更新者"  width="140">
                <template slot-scope="{row:dataitem}" >
                        <div class="fz12">{{dataitem._updater}}</div>
                        <div class="fz12">{{funtool_timetrans(dataitem._u_at)}}</div>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
    <el-button @click="showTableVisible = false">取 消</el-button>
  </span>
    </el-dialog>

</div>
</template>

<script>
export default {
    name: "CModelSeeTable",
    props: {
        isAdmin:{
            type:Boolean,
            default:()=>{
                return false
            }
        }
    },
    data() {
        return {
            title: null,
            showTableVisible: false,
            tabledata: null,
            set: null, 
            isFullScreen:false
        }
    },
    mounted() {

    },
    methods: {
 toggleFullScreen(){
            this.isFullScreen=!this.isFullScreen;
        },
          funtool_timetrans(date){
              if(!date) return '';
            var date = new Date(date*1000);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
            return Y+M+D+h+m+s;
        },

        showv(v) {


            if (!!v&&v.constructor == Array) {
                return v.join(',');
            }
            return v;
        },

        set_a_table(title, set, data) {
            this.title = title;
            this.tabledata = data;
            this.set = set;
            this.showTableVisible = true;
        }

    }

}
</script>

<style scoped>
    .maxzoom {
    position:absolute;
        right: 43px;
    top: 20px;
    cursor: pointer;
}
</style>