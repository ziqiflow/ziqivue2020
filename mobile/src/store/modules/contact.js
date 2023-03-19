import {
  getDeptData,
  getUserByDeptData,
  GetRoleTree
  //,
  // GetDataFormDingtalk
  // } from '@/api/contacts'
  //   import {

} from '@/api/contacts'
import { creatDeptTree } from '@/utils/u_flowdesign'

export default {
  state: {
    deptTree: [],
    userByDepts: [],
    RoleTrees: []
  },
  mutations: {

    setdeptTree(state, deptTree) {
      state.deptTree = deptTree
    },
    setuserByDepts(state, userByDepts) {
      state.userByDepts = userByDepts
      console.log(state.userByDepts)
    },
    setRoleTrees(state, RoleTrees) {
      state.RoleTrees = RoleTrees
    }

  },
  getters: {
    //   messageUnreadCount: state => state.messageUnreadList.length,
    //   messageReadedCount: state => state.messageReadedList.length,
    deptTree: state => state.deptTree
  },
  actions: {

    
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
