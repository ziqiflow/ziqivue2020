<template>
<div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">上传图片
    </el-button>
    <!-- {{extend_data}} -->
    <el-dialog :visible.sync="dialogVisible">
        <el-upload drag :data="extend_data" name="filename" accept="image/*" :multiple="true" :file-list="fileList" :show-file-list="true" :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeUpload" class="editor-slide-upload" :action="baseURL+'/api/oa/flowdesigns/uploadimage'" list-type="picture-card">
            <!-- http://127.0.0.1:8099 -->
            <i class="el-icon-upload"></i>
            将文件拖到此处，或<em>点击上传</em>
        </el-upload>
        <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button></span>
    </el-dialog>
</div>
</template>

<script>
// import { getToken } from 'api/qiniu'

import {
    getToken
} from '@/utils/auth'

export default {
    name: 'EditorSlideUpload',
    props: {
        color: {
            type: String,
            default: '#1890ff'
        }
    },

    data() {
        return {
            baseURL: window.baseURL,
            dialogVisible: false,
            listObj: {},
            fileList: [],
            extend_data: {}
        }
    },
    mounted() {
        let data = {
            _href: window.location.href
        };
        data[window.env.prod.postTokenKey] = getToken();
        this.extend_data = data;
    },
    methods: {
        checkAllSuccess() {
            return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
        },
        handleSubmit() {
            const arr = Object.keys(this.listObj).map(v => this.listObj[v])
            if (!this.checkAllSuccess()) {
                this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
                return
            }

            console.log('arrt', arr);

            this.$emit('successCBK', arr)
            this.listObj = {}
            this.fileList = []
            this.dialogVisible = false
        },
        handleSuccess(response, file) {
            //console.log(response);
            const uid = file.uid
            console.log('listObj', this.listObj);
            const objKeyArr = Object.keys(this.listObj)
            for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (this.listObj[objKeyArr[i]].uid === uid) {
                    this.listObj[objKeyArr[i]].url = response.data[0].url //.file
                    this.listObj[objKeyArr[i]].hasSuccess = true
                    return
                }
            }
            //console.log('listObj',this.listObj);
        },
        handleRemove(file) {
            const uid = file.uid
            const objKeyArr = Object.keys(this.listObj)
            for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (this.listObj[objKeyArr[i]].uid === uid) {
                    delete this.listObj[objKeyArr[i]]
                    return
                }
            }
        },
        beforeUpload(file) {
            const _self = this
            const _URL = window.URL || window.webkitURL
            const fileName = file.uid
            this.listObj[fileName] = {}
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.src = _URL.createObjectURL(file)
                img.onload = function () {
                    _self.listObj[fileName] = {
                        hasSuccess: false,
                        uid: file.uid,
                        width: this.width,
                        height: this.height
                    }
                }
                resolve(true)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
    margin-bottom: 20px;

    /deep/ .el-upload--picture-card {
        width: 100%;
    }
}

.upload-container .el-upload .el-upload-dragger {
    height: auto;
}
</style>
