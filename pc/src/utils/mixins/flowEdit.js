
import {
  mapState
} from 'vuex'

import moment from 'moment'

export default {
    name: 'flowEdit',
    methods: {

      initFormDefaulValue(item,hasdelete){

        if(!!item.options.defaultValue
          &&hasdelete==false
          &&/^\${.*}$/g.test(item.options.defaultValue)
        ){
          //return;
          if(item.options.disabled){
            
            item.options.defaultValue=null;
          }else{

              let res= /^\${(.*)}$/g.exec(item.options.defaultValue);
              let str=res[1];
              res=str.split(':');
              let funname= res[0]
              let param=res[1];
              
              switch (funname) {
                case 'timeformat':
                    item.options.defaultValue=(new moment()).format(param);
                  break;
                case 'chose-user-str':
                    console.log('this.username',this.username)
                    item.options.defaultValue=this.username + (!!this.userjobid ? '(' + this.userjobid + ')' : '');
                  break;
                case 'chose-dept-str':
                    if(this.mydepts.length==1){
                      item.options.defaultValue=this.mydepts[0].n;
                    }else{
                      item.options.defaultValue=null;
                    }
                  break;

                case 'chose-dept-tree-str-exclude-jtgs':
                      
                      if(this.mydepts.length==1){
                        // console.log('mydepts',this.mydepts)
                        item.options.defaultValue=this.mydepts[0].depttree.filter(e=>{return e.name!='集团公司'}).map(e=>{return e.name}).join('-');
                      }else{
                        item.options.defaultValue=null;
                      }


                  break;

                default:
                  break;
              }
          }
        }

      }
      
    },
    computed: {
      ...mapState({
        // userinfo:state=>state.user,
        mydepts: state => state.user.depts,
        userid: state => state.user.id,
        userjobid:state=>state.user.jobid,
        username:state=>state.user.name
        //  messageReadedList: state => state.employee.messageReadedList,
      })
    },
}