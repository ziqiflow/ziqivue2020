<template>
  <div>
    <el-dialog :fullscreen="true" :title="!!preview_file?preview_file.name:''" :visible.sync="image_preview_model" append-to-body>
      <div v-if="!!preview_file">
        <div>
          <div style="float:left">

            <div v-if="!!preview_file.funname" >来自流程：{{ preview_file.funname }}</div>
            文件信息：{{ preview_file.name }}<br>
            上传时间：{{ preview_file.created_at }}<br>
            文件大小：{{ preview_file.size }}<br>

          </div>

          <div style="float:left;padding:10px;">
            <div>

              <el-button :disabled="!preview_file.previous_fileid" size="mini" icon="el-icon-arrow-left" @click="showimage(preview_file.previous_fileid)"/>
              <el-button :disabled="!preview_file.next_fileid" size="mini" @click="showimage(preview_file.next_fileid)" ><i class="el-icon-arrow-right el-icon--right"/></el-button>
              <el-button size="mini" @click="rotateImage" ><i class="el-icon-refresh-right"/></el-button>

            </div>
          </div>

          <div class="clear"/>

        </div>

        <div style="text-align: center;">
          <div style="min-height: 150px;" >
            <el-image :src="preview_file.url" :style="preview_style" style="padding:10px">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>

               <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>图片加载失败
            </div>

          </el-image></div>

          <div style="position: fixed;    bottom: 10px;    width: 100%;">
            <el-button :disabled="!preview_file.previous_fileid" size="small" type="primary" icon="el-icon-arrow-left" @click="showimage(preview_file.previous_fileid)">上一张图片</el-button>
            <el-button :disabled="!preview_file.next_fileid" size="small" type="primary" @click="showimage(preview_file.next_fileid)" >下一张图片<i class="el-icon-arrow-right el-icon--right"/></el-button>
            <el-button size="small" type="primary" @click="rotateImage" >旋转<i class="el-icon-refresh-right el-icon--left"/></el-button>

        </div></div>

      </div>

    </el-dialog>
  </div>
</template>

<script>


import {
  mapState
} from 'vuex'

import { filesignToken} from '@/utils/auth'

export default {
  name: 'CModelShowImages',
  props: {

    type: {

      type: String,
      default: () => {
        return 'flowlog'// files
      }

    },
    filelistlog: {
      type: Array,
      default: () => {
        return []
      }
    },
    files: {
      type: Array,
      default: () => {
        return []
      }
    }

  },
  data() {
    return {
      image_preview_model: false,
      preview_file: null,
      preview_rotate: 0
    }
  },
  computed: {

    ...mapState({
      userid: state => state.user.__realobj.id,
      //  messageReadedList: state => state.employee.messageReadedList,
    }),
    preview_style() {
      return {
        transform: `rotate(${this.preview_rotate}deg)`
      }
    }

  },
  mounted() {

  },
  methods: {

    rotateImage() {
      this.preview_rotate = (this.preview_rotate + 90) % 360
    },

    showimage(fileid, files = null) {
      let Previous_fileid = null

      this.preview_file = null

      let filelistlog = []
      if (this.type == 'flowlog') {
        if (files) this.filelistlog = files
        filelistlog = this.filelistlog
      } else {
        if (files) this.files = files

        filelistlog = [{ files: this.files }]
      }

       let tokenparma= filesignToken(this.userid);

      filelistlog.forEach(flow => {
        flow.files.forEach(file => {
          if (file.fileid == fileid) {
            this.preview_file = Object.assign({}, file)
            this.preview_file.funname = flow.funname ? flow.funname : null
            this.preview_file.url = `${window.baseURL}/file/oa/${file.fileid}/${encodeURI(file.name)}?${tokenparma}`
            this.preview_file.previous_fileid = Previous_fileid
            this.preview_rotate = 0
            
            
          } else {
            if (file.formats == 'jpeg' || file.formats == 'jpg' || file.formats == 'png') {
              if (!this.preview_file) {
                Previous_fileid = file.fileid
              } else if (!this.preview_file.next_fileid) {
                this.preview_file.next_fileid = file.fileid
              }
            }
          }
        })
      })

      this.image_preview_model = true
     }

  }

}
</script>

<style scoped>

</style>
