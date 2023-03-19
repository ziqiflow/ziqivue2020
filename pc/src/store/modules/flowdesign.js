import {
  getUserByDeptData,
  GetRoleTree
} from '@/api/contacts'

import {
  FlowAllList,FlowDesignsCanSonList
} from '@/api/flowdesign'

import { getrequireDataList, finddatalist } from '@/utils/u_flowdesign'
export default {
  state: {
    set: {},
    layoutset:[],
    formSet: [], 
    funList: [], 
    RoleTrees: [],
    
    flowList: [],
    flowCanSonList:[],
    fileList:[],

  },
  mutations: {
    setfileList(state, fileList) {
      state.fileList = fileList
    },
    setflowSet(state, set) {
      state.set = set
    },
    setLayOutSet(state,layoutset){
      console.log('layoutset',layoutset)
      state.layoutset=layoutset
    },

    setformSet(state, formSet) {
      state.formSet = formSet
    },
    setfunList(state, funList) {
      state.funList = funList
    },
    setRoleTrees(state, RoleTrees) {
      state.RoleTrees = RoleTrees
    },
    setFlowList(state, flowList) {
      state.flowList = flowList
    },

    setFlowCanSonList(state, flowCanSonList) {
      state.flowCanSonList = flowCanSonList
    }

  },
  getters: {
    //   messageUnreadCount: state => state.messageUnreadList.length,
    //   messageReadedCount: state => state.messageReadedList.length,
    requireDataList: state => {
      return getrequireDataList(state.formSet)
    }
  },
  actions: {
    getFlowCanSonList({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          FlowDesignsCanSonList().then(({ data: res }) => {
            if (!res.success) {
              alert(res.msg)
              return
            }
            const data = res.data
            commit('setFlowCanSonList', data)
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    
    getFlowAllList({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          FlowAllList().then(({ data: res }) => {
            if (!res.success) {
              alert(res.msg)
              return
            }
            const data = res.data
            commit('setFlowList', data)
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    
    getUserByDeptData({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserByDeptData().then(({ data: res }) => {
            if (!res.success) {
              alert(res.msg)
              return
            }
            const data = res.data
            commit('setuserByDepts', data)
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },

    
    GetRoleTree({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          GetRoleTree().then(({ data: res }) => {
            if (!res.success) {
              alert(res.msg)
              return
            }
            const data = res.data
            commit('setRoleTrees', data)
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },

    
    getDeptData({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getDeptData().then(({ data: res }) => {
            if (!res.success) {
              alert(res.msg)
              return
            }
            const data = res.data
            commit('setdeptTree', creatDeptTree(data, '1'))
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
