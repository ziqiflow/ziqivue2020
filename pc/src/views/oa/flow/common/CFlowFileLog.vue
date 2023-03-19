<template>
  <div>

    <div v-if="!!filelistlog" class="log">
      <model-show-images ref="showimages" :filelistlog="filelistlog" type="flowlog"/>
      <timeline>
        <timeline-item v-for="log in filelistlog" :key="log._id" color="green">
          <div class="fz13">
            <v-icon name="person" />
            <span>{{ log.creater }}</span>
            <span class="funname">{{ log.funname }}</span>
            <span class="fz12" style="margin-right:5px;">{{ friendlytimejs(log.created_at) }}</span>
          </div>
          <div>
            <div v-for="(file,index) in log.files" :key="index" class="fz12">
              <span>{{ file.name }} </span>

              <i
                v-if="file.formats=='jpeg'||file.formats=='jpg'||file.formats=='png'"
                style="cursor: pointer;"
                class="el-icon-picture-outline mg-r5 image_file_preview"
                @click="showimage(file.fileid,filelistlog)"/>

                <i class="el-icon-download filedown mg-r5" @click="filedown(file)"></i>


            </div>
          </div>
        </timeline-item>
      </timeline>

    </div>
  </div>
</template>

<script>



import {
  mapState
} from 'vuex'

import { filesignToken} from '@/utils/auth'

import {
  Timeline,
  TimelineItem,
  TimelineTitle
} from 'vue-cute-timeline'

import ModelShowImages from './CModalShowImages'

import {
  FriendlyTime
} from '@/utils/friendlytimejs'

export default {
  name: 'Cflowlog',
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle,
    ModelShowImages
  },
  props: {
    filelistlog: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
      computed: {
    ...mapState({
      userid: state => state.user.__realobj.id,
      //  messageReadedList: state => state.employee.messageReadedList,
    })
  },
  data() {
    return {

    }
  },
  activated() {},
  mounted() {
    // this.searchdata(1)
  },
  methods: {

      filedown(file){
       window.open(`${window.baseURL}/file/oa/${file.fileid}/${encodeURI(file.name)}?${filesignToken(this.userid)}`, this.isPc?'_blank':'_self');
    },

    showimage(fileid) {
      this.$refs.showimages.showimage(fileid)
    },

    friendlytimejs(timestr) {
      return FriendlyTime(timestr, new Date())
    }

  }
}
</script>

<style scoped>
.filedown{
  cursor: pointer;
}

.filedown:hover{
   color:#318fff;
}

.timeline-item{
    margin-top: 0px;
        padding-bottom: 5px;
}

.funname{
       color: #505050;
    border: 1px solid #909090;
    border-radius: 3px;
    font-size: 12px;
    margin: 0 3px;
}

</style>
