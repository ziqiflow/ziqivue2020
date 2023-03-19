<template>

<div>
    <el-select placeholder="placeholder" v-model="modelvalue">
    <el-option 
      v-for="item in list"
      :key="item.v"
      :label="item.n"
      :value="item.v+''">
    </el-option>
  </el-select></div>
</template>


<style>

</style>


<script>
export default {
    name: 'sc-ele-select',
    model: {    
      prop: 'value',
      event: 'cc'
    },
    props: {
      value: { 
          default: '',
　　　　},
      data:{
        default: '',
      },
      placeholder:''


    },
    //['data','value'],
    // model: {
    
    
    //    },
    mounted() {

    

        console.log('som',this.data);
          let sourcedata=null;
          if(typeof this.data =='object'){
            sourcedata=this.data.data;
          }else{
            sourcedata=JSON.parse(this.data)['data'];
          }
         var DSgetdata= this.DSAnalyse(sourcedata);
            console.log(DSgetdata);
            if(typeof(DSgetdata.default)!= "undefined"){
              //(!!scope.ngModel)?'':(scope.ngModel=DSgetdata.default);
              (!!this.modelvalue)?'':(this.modelvalue=DSgetdata.default);
            }
            if(typeof(DSgetdata.list)!="undefined"){
              console.log(this.list);
                this.list=DSgetdata.list;
            }else{

            }


    },
    data() {
        return {
        list: null,
        modelvalue:this.value+''
      };
    },


    
    watch:{
      modelvalue:function () {
        console.log(this.modelvalue)
           this.$emit('cc', this.modelvalue) 
          
      },
      value:function () {
        this.modelvalue=this.value+''
      }
    }
,
    methods: {
    

      init:function() {
        this.list=[];

        this.search(1);

      },
     DSAnalyse:function(datasource){
              
                var data={};

                var i=datasource.indexOf(':');
                if(i=='-1'){
                    return;
                }
                var head=datasource.substr(0,i);
                var body=datasource.substr(i+1);

                var tmp=body.split('@');//['n':'','v':dd]
                //
                if(tmp.length>1){
                    data.default=tmp[1];
                }

                if(head=='json'){
                  console.log(tmp[0]);
                    data.list=JSON.parse(tmp[0]);
                    if(tmp.length>2){
                        data.list.unshift({n:tmp[2],v:tmp[1]})
                    }
                }
                return data;
            }

      }


    }
</script>