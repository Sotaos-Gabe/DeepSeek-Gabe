import axios from 'axios';

//https://blog.51cto.com/u_15697128/5421217

axios.defaults.baseURL = '';

// 设置超时时间
axios.defaults.timeout = 15000;


// 请求拦截
axios.interceptors.request.use(config => {
    // console.log(config, 'axios interceptors config')
    return config
})


// 响应拦截
axios.interceptors.response.use(response => {
    return response.data
}, error => {
    if (error.response) {
        if (error.response.status === 401) {
            console.log(401)
        } else if (error.response.status === 402 || error.response.status === 403) {
            console.log(402, 403)
        } else if (error.response.status === 404) {
            console.log(404)
        }
    } else {
        if (!window.navigator.onLine) {
            // 断网处理
            // 跳转到断网页面
        }
        return Promise.reject(error)
    }
})

export default axios;