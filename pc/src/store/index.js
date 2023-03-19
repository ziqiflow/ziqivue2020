import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import getters from './getters'
import flowdesign from './modules/flowdesign'
import dbctrl2 from './modules/dbctrl2'
import contact from './modules/contact'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    contact,
    flowdesign,
    dbctrl2
  },
  getters
})

export default store
