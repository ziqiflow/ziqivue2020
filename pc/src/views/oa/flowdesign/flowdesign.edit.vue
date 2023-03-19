<template>
  <div>

    <el-card v-loading="editloading" class="box-card">
      <el-alert v-if="!!error" :title="error" :closable="false" type="error"/>

      <el-form v-else ref="FormID" :model="formItem" :rules="ruleValidate" style="width:500px" status-icon label-width="150px">

        <el-form-item label="流程名称" prop="name">
          <el-input v-model="formItem.name" autocomplete="off" placeholder="Enter something..."/>
        </el-form-item>
        <el-form-item label="一句话简单介绍" prop="description">
          <el-input placeholder="请一句话简单描述此流程用途，方便申请者快速理解" v-model="formItem.description" type="textarea"/>
        </el-form-item>

        <el-form-item label="是否启用" prop="canuse">
           <el-checkbox v-model="formItem.canuse"></el-checkbox>
        </el-form-item>

                <el-form-item label="所属分类">

            <el-select v-if='category.length>0' filterable v-model="formItem.category" multiple placeholder="选择分类">
              <el-option v-for="item in category" :key="item.id" :label="item.label" :value="item.id"/>
            </el-select>
            <router-link v-else to="/oaset/flowdesign_category">
            <el-button type="text">
               点击编辑分类
            </el-button></router-link>

        </el-form-item>

        <el-form-item>

          <el-button type="primary" @click="handleSubmit">
            <span v-if="edittype=='add'">添加</span>
            <span v-else>保存</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  FlowdesignsAdd,
  FlowdesignsGet,
  FlowdesignsEdit,
  FlowdesignsAddMGet,
  FlowdesignsEditMGet,
  
} from '@/api/flowdesign'
export default {
  name: 'FlowdesignAdd',
  data() {
    return {
      flowid:null,
      error: null,
      edittype: '',
      editloading: false,
      category:[],
      formItem: {
        name: '',
        description:'',
        canuse:false,
        category:[]
      },
      ruleValidate: {
        name: [{
          required: true,
          message: '流程名称不可为空',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '流程简述不可为空',
          trigger: 'blur'
        }]
      }
    }
  },
  activated() {
    console.log('activated')
  },
  mounted() {
    console.log('mounted');
    let initHanderFun=null;
    // getTableData().then(res => {
    //     this.tableData = res.data
    // })
    
    const id = this.$route.params.id
    this.flowid=id;
    if (id) {
      this.edittype = 'edit'
      this.editloading = true
      
      FlowdesignsGet({
        _id: id
      }).then(({ data: req }) => {
        console.log(req)
        //this.loading = false
        if (req.success) {
          if (!req.data) {
            this.error = '没有查询到对应的流程'
            return
          }
          console.log(req.data)

          // this.formItem = req.data
          for(let key in this.formItem){
              if(typeof req.data[key]!="undefined"){
                this.formItem[key]=req.data[key];
              }
          }
          this.formItem._id=req.data._id;

          // console.log(this.$route);
          // this.$route.name='bianjiliucheng111';

          // this.$router.meta.title="bianjigeg";
        } else {
          this.error = req.msg
        }
      });

      initHanderFun=FlowdesignsEditMGet;
      
    } else {
      //this.loading = false
      this.edittype = 'add'
      initHanderFun=FlowdesignsAddMGet;
    }
    
    //
      
      initHanderFun({}).then(({ data: req }) =>{

         this.editloading = false

          if(req.success){
            this.formItem.category=[];
             this.category=this.getCatList(req.data);
          }
          console.log('category',this.category);

      })


  },
  methods: {

    copyobject(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    getCatList(list, titiles = []) {
      
      let arr = []
      for (let i = 0; i < list.length; i++) {
        
        const titileArr = this.copyobject(titiles)
        const ele = list[i]
        
        if(this.edittype=='edit'&&!!ele.flowlist&&ele.flowlist.includes(this.flowid)){
             this.formItem.category.push(ele.id);
        }

        if (ele.name) {
          const newobj = {
            label:
                            // this.intend(titileArr.length)
                            (titileArr.join('-') ? titileArr.join('-') + '-' : '') +
                            ele.name
          }
          titileArr.push(ele.name)
          // if (type == 'multiple') {
          newobj.id = ele.id
          // } else {
          //   newobj.id = null
          // }

          arr.push(newobj)

          if (!!ele.lists) {
            if (ele.lists.length > 0) {
              const back = this.getCatList(ele.lists, titileArr)
              if (back.length > 0) {
                arr = arr.concat(back)
                // newobj.children=back;
              }
            } else {
              continue
            }
          }
          // arr.push(newobj)
        }
      }
      // console.log('arr', arr)
      return arr
    },

    handleSubmit() {
      this.editloading = true
      this.$refs['FormID'].validate(valid => {
        this.editloading = false
        console.log(valid)
        if (valid) {
          // this.$Message.success("Success!");

          if (this.edittype == 'edit') {
            FlowdesignsEdit(this.formItem).then(({ data: res }) => {
              
              if (res.success) {
                this.$message.info('更新成功')
                this.$router.push({ path: '/oaset/flowdesign_list' })
              } else {
                this.$message.error(res.msg)
              }
              console.log(res)
            })

            return
          }
          FlowdesignsAdd(this.formItem).then(({ data: res }) => {
            
            if (res.success) {
              this.$message.info('创建成功')

              this.$router.push({ path: '/oaset/flowdesign_list' })
              // this.$router.push({
              //     path: "home",
              //     id:res.data._id
              // });
            } else {
              this.$message.error(res.msg)
            }
            console.log(res)
          })
        } else {
          this.$message.error('格式不符合规定!')
        }
      })
    },
    handleDelete(params) {
      console.log(params)
    }
  }
}
</script>

<style>
</style>
