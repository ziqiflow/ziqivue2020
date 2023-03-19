import { Search,SwipeCell,List,PullRefresh,Checkbox,CheckboxGroup } from 'vant';

import {
  mapState
} from 'vuex';

import {FriendlyTime} from "../friendlytimejs";

export default {
  name: 'flowlist',
  computed: {
    ...mapState({
      flowBadge: state => state.user.flowBadge
      //  messageReadedList: state => state.employee.messageReadedList,
    })
  },
  components: {
    vanSearch:Search,
    vanSwipeCell:SwipeCell,
    vanList:List,
    vanPullRefresh:PullRefresh,
    vanCheckbox:Checkbox,
    vanCheckboxGroup:CheckboxGroup
  },
  data() {
    return {
      searchStr:'',
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

      pullloading:false,
      listloading:false,
      searchloading: false,

      search_list: null,
      orderby_list: null,
      display_list: null,
      search: {
        s_isorder: null,
        s_orderby: null
      }, 
      msgList:[],
      page: {
        result: [],
        totalItems: 0,
        pageSize: 20,
        currentPage: 0
      }
    }
  },
  methods: {
    tableRowClassName(row) {
      if (!row.level) {
          return '';
      }
      if (row.level == 100) {
          return 'emergency_row';
      }
      return '';
  },

    initsearch(){},
    concatdata(first, second) {
      // if (!!second) {
      //   return first.concat(second);
      // } else {
      //   return first;
      // }
      if (!!second) {
          for (var i = 0; i < second.length; i++) {
              first.push(second[i])
          }
      }

  },
    friendlytimejs(timestr){
        return FriendlyTime(timestr,new Date());
    },
    seedetail(mesObj) {
      this.$refs.flowdetail.loadmodal(mesObj.flowlistid, `查看 ${mesObj.flowname} 明细`,mesObj.NowFunid)
    },
    dealflow(mesObj) {
      console.log('mesObj', mesObj)
      this.$refs.flowdealer.loadmodal(mesObj._id, mesObj.flowlistid, `审批${mesObj.flowname}<${mesObj.NowFunName}>`,mesObj.NowFunid)
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
      console.log(this.page)
    },

    searchdata: function(currentPage) {
      if (this.searchloading) {
        this.$message.warning('请勿重复提交表单')
        return
      }
      this.searchloading = true
      //this.page.result = []
      this.loadingpage=currentPage;
      this.searchFun({
        nowpage: currentPage,
        search:this.search
      }).then(({
        data: req
      }) => {
        console.log(req)
        this.AfterSearch(req)
        this.searchloading = false;
        //setTimeout(() => {
          this.pullloading=false;  
          this.listloading=false;        
        //}, 3000);

      })
    },
    AfterSearch(req) {
      this.page = req.data
      this.page.finished= Math.ceil(this.page.totalItems/this.page.pageSize)<(this.page.currentPage+1);
      if(this.page.currentPage==1){
        this.msgList=this.copyObject(this.page.result);
      }else{
        this.concatdata(this.msgList, this.page.result);
      }
      this.initresultdata()
    },
    copyObject(json){
        return JSON.parse(JSON.stringify(json));
    },
    listload(){
      // if( this.page.maxPage< this.page.currentPage+1){
      //   return;
      // }
      if(!!this.page.finished){
        return;
      }
      this.searchdata(this.page.currentPage+1);
    }
  },
  activated() {
  },
  mounted() {
    this.initsearch();
     //this.searchdata(1)
  }
}
