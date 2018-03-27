import Vue from 'vue'
import Vuex from 'vuex'
import example from './module-example'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    login:{
      username:'',
      access_token:''
    }
  },
  mutations:{
    SET_USERNAME(state,username){
      state.login.username = username
    },
    SET_ACCESSTOKEN(state,accessToken){
      state.login.access_token = accessToken
    },
    SET_LOGINNULL(state){
      state.login.username= ''
      state.login.access_token= ''
    }
  }
})

export default store
