import { loginByUsername, loginGetPublicKey,logout, getUserInfo,ChangeUser, getReplaceUserInfo } from '@/api/login'
import { getToken, setToken, removeToken , encryptionPassword} from '@/utils/auth'
import { FlowNumber } from '@/api/oa'

const user = {
  state: {
    __realobj:null,
    id:'',
    user: '',
    status: '',
    code: '',
    jobid:'',
    token: getToken(),
      
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    depts:[],
    setting: {
      articlePlatform: []
    },
    flowBadge: { cc: 0,
      message: 0, waiting: 0 ,
      needcreat:0,
      waitingListRefresh:false,
    }
  },

  mutations: {
    setUserDepts(state, depts) {
      console.log('setUserDepts')
      state.depts = depts
    },
    setFlowBadge(state, flowBadge) {
      // console.log('flowBadge')
      // console.log(flowBadge)
      state.flowBadge = Object.assign(state.flowBadge,flowBadge);
    },
    setFlowBadgeCc(state, cc) {
      state.flowBadge.cc = cc
    },
    setFlowBadgeMessage(state, message) {
      state.flowBadge.message = message
    },
    setFlowBadgeWaiting(state, waiting) {
      state.flowBadge.waiting = waiting
    },
    

    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_JOBID:(state, jobid) => {
      state.jobid=jobid
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_DEPTS: (state, depts) => {
      state.depts = depts
    },
    SET_REAL: (state, __realobj) => {
      //console.log('__realobj', JSON.parse(JSON.stringify(__realobj)))
      let realobj= JSON.parse(JSON.stringify(__realobj));
      delete realobj.__realobj;
      state.__realobj =realobj;
    }

  },

  actions: {
    ChangeUser({ commit }, info) {   
      return new Promise((resolve, reject) => {
        ChangeUser(info).then(response => {
          const req = response.data
          console.log(req)
          if (req.success) {
            commit('SET_TOKEN', req.data.token)
            setToken(req.data.token)
            resolve()
          } else {
            alert(req.msg)
            reject(req.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },



    
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {


        loginGetPublicKey(username).then(response => {
                const req = response.data
                console.log(req)
                if (req.success) {
                  

                  loginByUsername(username, encryptionPassword(req.data,userInfo.password)).then(response => {
                    const req = response.data
                    console.log(req)
                    if (req.success) {
                      commit('SET_TOKEN', req.data.token)
                      setToken(req.data.token)
                      resolve()
                    } else {
                      reject(req.msg)
                    }
                  }).catch(error => {
                    reject(error)
                  })
                  
                  
                } else {
                  //alert(req.msg)
                  reject(req.msg)
                }
              }).catch(error => {
                reject(error)
              })


      })
    },
    
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          
          const req = response.data
          if (!req.success) {
            reject(req.msg)
            //reject('Verification failed, please login again.')
          }
          const data = req.data

          // console.log('data',data.roles);
          // console.log('data',data.roles.split('-'));
          data.roles=data.roles.split('-');
            for (let i = data.roles.length-1; i >=0; i--) {
              if(!data.roles[i]){
                  data.roles.splice(i,1);
              }
            }
            //&& data.roles.length > 0
          if (data.roles ) { 
            //data.roles.split('-')
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array!'+JSON.stringify(data))
          }
          commit('SET_ID', data._uuid)
          commit('SET_JOBID', data.jobid)
          
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          commit('SET_DEPTS',data.depts)

          commit('SET_REAL',state)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    GetReplaceUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getReplaceUserInfo().then(response => {
          
          const req = response.data
          if (!req.success) {
            reject(req.msg)
            // reject('Verification failed, please login again.')
          }
          const data = req.data

          // console.log('data',data.roles);
          // console.log('data',data.roles.split('-'));
          data.roles=data.roles.split('-');
            for (let i = data.roles.length-1; i >=0; i--) {
              if(!data.roles[i]){
                  data.roles.splice(i,1);
              }
            }
            //&& data.roles.length > 0
          if (data.roles ) { 
            //data.roles.split('-')
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array!'+JSON.stringify(data))
          }
          commit('SET_ID', data._uuid)
          commit('SET_JOBID', data.jobid)
          
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          commit('SET_DEPTS',data.depts)


          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    

    
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) 
          resolve()
        })
      })
    },
    getFlowBadgeNumber({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          FlowNumber({}).then(({ data: res }) => {
            if (!res.success) {
              alert(res.msg)
              return
            }
            const data = res.data
            commit('setFlowBadge', data)
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

export default user
