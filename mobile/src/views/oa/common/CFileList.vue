<template>
  <div v-loading="loading">

    <div v-if="fileList.length==0" class="fz13" style="padding-bottom:10px">当前未添加任何文件</div>
    <div v-else style="padding-bottom:10px">

      <model-show-images ref="showimages" :files="fileList" type="files"/>
      <draggable v-model="fileList">
        <div v-for="(file,index) in fileList" :key="index" class="fz12 pd5">
          <span>{{ file.name }} </span>

          <i
            v-if="file.formats=='jpeg'||file.formats=='jpg'||file.formats=='png'"
            style="cursor: pointer;"
            class="el-icon-picture-outline mg-r5 image_file_preview"
            @click="showimage(file.fileid,fileList)"/>
              <i class="el-icon-download filedown mg-r5" @click="filedown(file)"></i>

              <i class="el-icon-delete mg-r5 pointer" @click="removefile(index)"></i>

        </div>
      </draggable>
    </div>
    <el-upload ref="upload" :on-remove="handleRemove" :on-change="handleChange" :on-success="handleSuccess" :auto-upload="false" :file-list="nowfileList" class="editor-slide-upload" action="" multiple>
      <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
      <el-button v-if="NowFileList.length" style="margin-left: 10px;" size="mini" type="success" @click="submitUpload">上传到服务器（{{ NowFileList.length }}）</el-button>
      <div slot="tip" class="el-upload__tip">可上传word,excel,图片等格式(txt/png/jpg/jpeg/doc/xlsx/xls/docx/doc)，且不超过{{ maxsize }}Mb</div>
    </el-upload>

  </div>
</template>

<script>

import {
  mapState
} from 'vuex'

import draggable from 'vuedraggable'
import {
  FlowFileUpload,
  FlowFileDelete
} from '@/api/oa'

import { filesignToken} from '@/utils/auth'



import ModelShowImages from './CModalShowImages'

export default {
  name: 'FileList',
  components: {
    draggable,
    ModelShowImages
  },

    computed: {
    ...mapState({
      userid: state => state.user.__realobj.id,
      
      //  messageReadedList: state => state.employee.messageReadedList,
    })
  },

  props: {
    fileList: {
      type: Array
    },
    flowlistid: {
      type: String
    },
    flowdesignid: {
      type: String
    },
    maxsize: {
      type: Number,
      default: () => {
        return 15
      }

    }
  },

  data() {
    return {
      extend_data: {},
      nowfileList: [],
      NowFileList: [],
      loading: false
    }
  },
  mounted() {
    this.extend_data = {
      flowlistid: this.flowlistid,
      flowdesign_id: this.flowdesignid
    }
  },
  methods: {

  
    filedown(file){
       window.open(`${window.baseURL}/file/oa/${file.fileid}/${encodeURI(file.name)}?${filesignToken(this.userid)}`, this.isPc?'_blank':'_self');
    },


    showimage(fileid, fileList) {
      this.$refs.showimages.showimage(fileid, fileList)
    },

    submitUpload() {
      // console.log(this.NowFileList);

      if (this.NowFileList.length == 0) {
        return
      }

      const formData = new FormData()

      this.NowFileList.forEach(item => {
        formData.append('filename[]', item.raw, item.raw.filename)
        
      })

      for (const x in this.extend_data) {
        formData.append(x, this.extend_data[x])
      }

      this.loading = true

      FlowFileUpload(formData).then(({
        data: res
      }) => {
        this.loading = false

        if (!res.success) {
          this.$message.error(res.msg)
          return
        }

        this.setfileList(res.data)
        this.nowfileList = []
        this.NowFileList = []
      }).catch(err => {
        console.log('err', err)
        this.$message.error('上传失败，请重新上传;' + err.message)
      })
    },
    getUnuploadLen() {
      return this.NowFileList.length
    },
    // handleBeforeUpload(file) {
    
    //     console.log(file);
    // },
    handleChange(file, fileList) {
      console.log('fileList', fileList)
      console.log('nowfileList', this.nowfileList)
      for (let k = fileList.length - 1; k >= 0; k--) {
        const file2 = fileList[k]
        if (file2.size / 1024 / 1024 >= this.maxsize) {
          this.$message.error(file2.raw.name + '文件大于' + this.maxsize + 'M')
          fileList.splice(k, 1)
        }
      }
      this.nowfileList = fileList

      this.NowFileList = fileList

      // this.NowFileList=[];
    },
    // upload(item) {

    // },
    handlePreview(file) {
      this.$message.info('查看文件' + file.name)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
      console.log(file)
      console.log(fileList)
      this.nowfileList = fileList
      this.NowFileList = fileList
    },
    handleError(err, file, filelist) {
      this.$message.error('上传错误,请重新试试')
    },
    handleSuccess(response, file) {
      console.log('response', response)
    },
    setfileList(list) {
      list.forEach(ele => {
        this.fileList.push(ele)
      })
    },

    removefile(index) {
      
      const file = this.fileList[index]

      this.$confirm('此操作将永久删除该文件[' + file.name + '], 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletefile(index)
      }).catch(() => {
        //   this.$message({
        //     type: 'info',
        
        //   });
      })
    },

    deletefile(index) {
      FlowFileDelete({
        // flowid: this.flowdesignid,
        fileid: this.fileList[index].fileid
      }).then(({
        data: res
      }) => {
        if (!res.success) {
          this.$message.error(res.msg)
          return
        }
        this.$message.success(res.msg)

        this.fileList.splice(index, 1)
      }).catch(err => {
        this.$message.error('删除文件失败')
      })
    }

  }

}
</script>

<style scope>

.image_file_preview {
    font-size:15px;color:#318fff;
}
.filedown{
  cursor: pointer;
}

.filedown:hover{
   color:#318fff;
}


</style>
