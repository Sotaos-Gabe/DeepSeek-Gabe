import request from '@/utils/request'

export function resourceEvaluation(data) {
  return request({
    url: '/v1/resource/resourceEvaluation',
    // url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getAllProducts() {
  return request({
    url: '/v1/resource/getAllProducts',
    method: 'get'
  })
}
