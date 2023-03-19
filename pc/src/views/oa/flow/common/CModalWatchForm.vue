<template>
    <div>
        <el-dialog :fullscreen="!isPc"
  :title="title"
  :visible.sync="dialogVisible"
  width="75%">
          <div v-if="!!widgetForm&&widgetForm.list.length>0">
                    <fm-generate-form class="generateForm" ref="generateForm" :data="widgetForm" :remote="remoteFuncs" :value="widgetModels">
                      
                    </fm-generate-form>
                </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关闭</el-button>
  </span>
</el-dialog>
 

    </div>
</template>

<script>
    
    export default {
        name: "CModelWatchForm",
        props: {
        },
        data(){
          return {
              widgetForm:null,
              remoteFuncs:[],
              widgetModels:null,
              title:null,
              dialogVisible:false
              }
        },
        mounted(){

        


        },
        methods:{
           
            set_a_table(title,widgetForm,widgetModels){
                this.widgetForm=null;
                this.title=title; 
                this.dialogVisible=true;

                setTimeout(() => {
                   

                    this.widgetForm=widgetForm;
                    this.widgetModels=widgetModels;

                }, 100);

            }

        }

    }
</script>

<style scoped>

</style>