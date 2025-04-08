import { login, logout, getInfo, refreshToken } from '@/api/user'
import { getToken, setToken, removeToken, getTokenExpire, setTokenExpire, removeTokenExpire,getRefreshToken, setRefreshToken,removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    refreshToken: getRefreshToken(),
    name: '',
    userId: '',
    avatar: '',
    roles: [],
    tokenExpire: getTokenExpire()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_TOKENEXPIRE: (state, token) => {
    state.tokenExpire = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log("login success")
        const { token,expire,refresh_token } = response
        commit('SET_TOKEN', token)
        commit('SET_TOKENEXPIRE', expire)
        commit('SET_REFRESH_TOKEN', refresh_token)
        setToken(token)
        setRefreshToken(refresh_token)
        setTokenExpire(expire)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  refreshToken({ commit }) {
    return new Promise((resolve, reject) => {
      const refresh_token = getRefreshToken();
      // console.log(refresh_token)
      refreshToken(refresh_token).then(response => {
        const data = response
        commit('SET_TOKEN', data.token)
        commit('SET_TOKENEXPIRE', data.expire)
        setToken(data.token)
        setTokenExpire(data.expire)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { role, userName,userID, avatar } = data
        const roles = [role]
        commit('SET_ROLES', roles)
        commit('SET_NAME', userName)
        commit('SET_USERID', userID)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
        commit('SET_ROLES', '')
        commit('SET_NAME', '')
        commit('SET_USERID', '')
        commit('SET_TOKEN', '')
        commit('SET_TOKENEXPIRE', '')
        commit('SET_AVATAR', [])
        removeToken() // must remove  token  first
        removeTokenExpire()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_TOKENEXPIRE', '')
      removeToken()
      removeTokenExpire()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

