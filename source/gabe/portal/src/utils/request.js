import Vue from "vue";
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken, getTokenExpire } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer '+getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.status === 200) {
      let is_json = true;
      try {
        const code =  response.data.code;
        if (code === undefined) {
          is_json = false;
        }
      } catch (error) {
        is_json = false;
      }
      if (is_json && response.data.code !== 200 && response.data.code !== 70200 && response.data.code !== 0) {
        if (response.data.detail) {
          response.data.msg = response.data.detail;
        }
        Message({
          message: response.data.msg || "Error",
          type: "error",
          duration: 5 * 1000,
        });
        return Promise.reject(new Error(response.data.msg || "Error"));
      }
      const res = response.data;
      if (response.config.url !== '/tech/user/login') {
        var curTime = new Date()
        var tokenExpire = new Date(getTokenExpire())
        var allowTime = new Date(curTime.setMinutes(curTime.getMinutes()))
        // if token expire time small than current time add 30 minute, allow to refresh the token
        if (tokenExpire < allowTime) {
          store.dispatch('user/resetToken').then(() => {
            // Vue.prototype.$toast.error('登录过期，请重新登录')
            router.push({ path: '/login' })
          })
          return
        }
        const delayTime = (tokenExpire - allowTime)/60000
        console.log('delayTime', delayTime)
        if (delayTime<3) {
          store.dispatch('user/refreshToken')
        }
      }
      if (res === undefined) {
        return response;
      }
      return response.data;
    }
    if (response.status === 401) {
      if (error.response.config.url === '/tech/user/login') {
        Vue.prototype.$toast.error('管理名称或密码错误')
        return
      }
      
      // if (error.response.config.url === '/user/refresh_token') {
        // refreshToken可能会401。修改为refreshToken后直接刷新页面，如果401跳转登陆页面
      console.log('refreshToken')
      store.dispatch('user/resetToken').then(() => {
        // Vue.prototype.$toast.error('登录过期，请重新登录')
        router.push({ path: '/login' })
      })
      // Vue.prototype.$toast.warning('登录凭证失效，刷新中...')
      return
    }
    // const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000 && res.code !== 200 && res.code !== 0) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    // if code is 401, refresh the token
    if (error.response && error.response.status === 401) {
      if (error.response.config.url === '/tech/user/login') {
        Vue.prototype.$toast.error('管理名称或密码错误')
        return
      }
      
      // if (error.response.config.url === '/user/refresh_token') {
        // refreshToken可能会401。修改为refreshToken后直接刷新页面，如果401跳转登陆页面
      console.log('resetToken')
      store.dispatch('user/resetToken').then(() => {
        // Vue.prototype.$toast.error('登录过期，请重新登录')
        router.push({ path: '/login' })
      })
      // Vue.prototype.$toast.warning('登录凭证失效，刷新中...')
      return
      // }
      // var curTime = new Date()
      // var tokenExpire = new Date(getTokenExpire())
      // var allowTime = new Date(curTime.setMinutes(curTime.getMinutes() + 2))
      // // if token expire time small than current time add 30 minute, allow to refresh the token
      // if (tokenExpire < allowTime) {
      //   store.dispatch('user/refreshToken').then(() => {
      //     router.go(0)
      //     // eslint-disable-next-line handle-callback-err
      //   }).catch(error => {})
      // } else {
      //   store.dispatch('user/resetToken').then(() => {
      //     router.forward()
      //   })
      // }

      // return Promise.reject(error)
    } else if (error.response && error.response.status === 403) {
      router.push({ path: '/403' })
    } else {
      console.log(error.response) // for debug
      Vue.prototype.$toast.error(error.response.data.msg || error.response.data.message || 'Error')
      return Promise.reject(error)
    }
  }
)

export default service
