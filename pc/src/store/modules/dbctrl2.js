import {
    GetDbSet
  } from '@/api/dbctrl2'
  
  export default {
    state: {
      dbIdObj: {},
    },
    mutations: {
      setdbIdObj(state, {key,set}) {
        console.log(key,set);
        state.dbIdObj[key] = set;
        console.log( state.dbIdObj);
      }
    },
    getters: {
     // deptTree: state => state.deptTree
    },
    actions: {
        
      
      GetDbSet({ state, commit },postdata) {
        return new Promise((resolve, reject) => {
          try {
            GetDbSet(postdata).then(({ data: res }) => {
              if (!res.success) {
                alert(res.msg)
                return
              }
              const data = res.data
              
              if( typeof data.set =='string' ){
                  data.set=JSON.parse(data.set);
              }
              
              for(let key in data.set){
                 if( typeof data.set[key]=='string'){
                    try{
                      data.set[key]=JSON.parse(data.set[key]);
                    }
                    catch(e){

                      //console.log(e);

                    }
                 }
              }

              

              commit('setdbIdObj',{key:data.dbid,set:data.set});
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          } catch (error) {
            reject(error)
          }
        })
      }
    }
  }
  