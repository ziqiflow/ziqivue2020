<template>
<div v-loading="loading" v-if="!!this.flowdesignid">
    <div v-if="fileList.length==0">当前未添加任何文件</div>
    <div v-else>
          <draggable v-model="funlist">
    <div v-for="(file,index) in fileList" :key="index" class="fz12">
               <span>{{file.name}} </span>
                                <a class="mg-r5" target="_blank" :href="file.url"><v-icon  name="eye" /></a>

                                  <i class="el-icon-delete mg-r5 pointer"  @click="removefile(index)"></i>
                    
    </div>
    </draggable></div>
    <el-upload ref="upload" class="editor-slide-upload" action="" :on-change="handleChange" 
    :on-success="handleSuccess" 
    :auto-upload="false" 
    :file-list="nowfileList"
    multiple>
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">可上传word,excel,图片等格式(txt/png/jpg/jpeg/doc/xlsx/xls/docx/doc)，且不超过3Mb</div>
    </el-upload>

</div>
</template>

<script>

import {
    mapActions,
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'
import draggable from 'vuedraggable'
import {
    FlowEditFileUpload,FlowEditFileDelete
} from '@/api/flowdesign'

export default {
    name: 'FileList',
    computed: {
        ...mapState({
            fileList: state => state.flowdesign.fileList
        })
    },
    components: {
        draggable
    },
    props: {
        flowdesignid: {
            type: String
        }
    },
    data() {
        return {
            extend_data: {},
            nowfileList: [],
            NowFileList: [],
            loading:false
        }
    },
    methods: {
        ...mapMutations([
            'setfileList'
        ]),
        submitUpload() {
            // this.$refs.upload.submit();
            console.log(this.NowFileList);
            if (this.NowFileList.length == 0) {
                return;
            }

            let formData = new FormData()

            this.NowFileList.forEach(item => {
                formData.append('filename[]', item.raw,item.raw.filename)
                
            })

            for (let x in this.extend_data) {
                formData.append(x, this.extend_data[x])
            }

            this.loading=true;

            FlowEditFileUpload(formData).then(({
                data: res
            }) => {

                this.loading=false;

                if (!res.success) {
                    this.$message.error(res.msg);
                    return;
                }

                this.setfileList(res.data)
                this.nowfileList = [];
                this.NowFileList=[];

            }).catch(err => {
                this.$message.error('上传失败，请重新上传')
            })

        },
        // handleBeforeUpload(file) {
        
        //     console.log(file);
        // },
        handleChange(file, fileList) {
            console.log(fileList);
            this.NowFileList = fileList;
        },
        // upload(item) {

        // },
        handlePreview(file) {
            this.$message.info('查看文件' + file.name);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handleError(err, file, filelist) {
            this.$message.error('上传错误,请重新试试');
        },
        handleSuccess(response, file) {

            console.log('response', response);
        },

        removefile(index){
            
            let file=this.fileList[index];
            
            this.$confirm('此操作将永久删除该文件['+file.name+'], 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
        }).then(() => {
                this.deletefile(index)
        }).catch(() => {
        //   this.$message({
        //     type: 'info',
        
        //   });          
        });

            
        },
        deletefile(index){

             FlowEditFileDelete({flowid:this.flowdesignid,fileid:this.fileList[index].fileid}).then(({
                data: res
            }) => {
                if (!res.success) {
                    this.$message.error(res.msg);
                    return;
                }
                this.$message.success(res.msg);

                this.setfileList(res.data)

            }).catch(err => {
                this.$message.error('删除文件失败')
            })

        }

    },
    mounted() {
        this.extend_data = {
            flowid: this.flowdesignid
        }

       
    },
    watch: {
        flowdesignid(newValue, oldValue) {
            this.extend_data = {
            
                flowid: this.flowdesignid
            }
               }
    }
}
</script>

<style scope>
</style>
