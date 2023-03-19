import {
  mapState
} from 'vuex'

import { FriendlyTime } from '../friendlytimejs'

import {
  FlowSetRead
} from '@/api/oa'

export default {
  name: 'flowlist',
  computed: {
    ...mapState({
      flowBadge: state => state.user.flowBadge
      //  messageReadedList: state => state.employee.messageReadedList,
    })
  },
  components: {
  },
  data() {
    return {
      candeal: false,
      searchFun: null,
      error: null,
      columns: [
        {
          title: '流程名称',
          slot: 'flowdesignername'
        },
        {
          title: '流程描述',
          slot: 'flow_desc'
        },
        {
          title: '流程创建时间',
          slot: 'flow_created_at'
        },
        {
          title: '处理节点',
          slot: 'flowstatusat'
        },
        {
          title: '可操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      searchbarShow: false,

      searchloading: false,
      search_list: null,
      orderby_list: null,
      display_list: null,
      search: {
        s_isorder: null,
        s_orderby: null
      }, 
      page: {
        result: [],
        totalItems: 0,
        pageSize: 20,
        currentPage: 1
      }
    }
  },
  methods: {
    tableRowClassName({
      row
  }) {

      if (!row.level) {
          return '';
      }

      if (row.level == 100) {
          return 'emergency_row';
      }
      return '';
  },

    initsearch() {},
    searchSummit() {
      this.searchdata(1)
    },
    friendlytimejs(timestr) {
      return FriendlyTime(timestr, new Date())
    },
    seedetail(mesObj) {
      this.$refs.flowdetail.loadmodal(mesObj.flowlistid, `查看 ${mesObj.flowname} 明细`, mesObj.NowFunid)
    },

    
    seedetail_and_set_read(mesObj, from) {
      // hasread
      if (!mesObj.hasread) {
        FlowSetRead({
          msgid: mesObj._id
        }).then(({
          data: req
        }) => {
          if (req.success) {
            mesObj.hasread = 1

            if (from == 'message') {
              this.flowBadge.message--
            }
            if (from == 'cc') {
              this.flowBadge.cc--
            }
          }
        })
      }

      this.seedetail(mesObj)
    },

    // dealflow_and_set_read(mesObj, from) {
    //   if (!mesObj.hasread) {
    //     FlowSetRead({
    //       msgid: mesObj._id
    //     }).then(({
    //       data: req
    //     }) => {
    //       if (req.success) {
    //         mesObj.hasread = 1

    //         if (from == 'message') {
    //           this.flowBadge.message--
    //         }
    //         if (from == 'cc') {
    //           this.flowBadge.cc--
    //         }
    //       }
    //     })
    //   }

    //   this.dealflow(mesObj)
    // },

    dealflow(mesObj) {
      console.log('mesObj', mesObj)
      this.candeal = false
      setTimeout(() => {
        this.candeal = true
        setTimeout(() => {
          this.$refs.flowdealer.loadmodal(mesObj._id, mesObj.flowlistid, `审批${mesObj.flowname}<${mesObj.NowFunName}>`, mesObj.NowFunid)
        }, 100)
      }, 100)
      mesObj.hasread=1;
    },
    handerPageChange(nowpage) {
      this.searchdata(nowpage)
    },
    
    showflowgraph() {
      this.$message.info('此处后期显示流程图')
    },

    getflowfunByfunid(designer, funid) {
      for (let i = 0; i < designer.funlist.length; i++) {
        const fun = designer.funlist[i]
        if (fun.id == funid) {
          return fun
        }
      }
      return null
    },

    initresultdata: function() {
      // this.page.result.forEach(ele => {
      //     ele.NowFun = this.getflowfunByfunid(ele.flowdesigner, ele.NowFunid);
      //     ele.PreFun = this.getflowfunByfunid(ele.flowdesigner, ele.PreFunid);
      // })
      console.log(this.page)
    },

    searchdata: function(currentPage) {
      if (this.searchloading) {
        this.$message.warning('请勿重复提交表单')
        return
      }
      this.searchloading = true
      this.page.result = []
      this.searchFun({
        nowpage: currentPage,
        search: this.search
      }).then(({
        data: req
      }) => {
        console.log(req)
        this.AfterSearch(req)
        this.searchloading = false
      }).catch(e=>{
        this.searchloading = false
      })
    },
    AfterSearch(req) {
      this.page = req.data
      this.initresultdata()
    },
    toggleSearchbarShow() {
      this.searchbarShow = !this.searchbarShow

      if (this.searchbarShow) {
        window.localStorage.setItem('searchbarShow', 1)
      } else {
        window.localStorage.removeItem('searchbarShow')
      }
    }
  },
  activated() {
  },
  mounted() {
    this.initsearch()
    this.searchdata(1)
    // searchbarShow
    this.searchbarShow = !!window.localStorage.getItem('searchbarShow')
  }
}
