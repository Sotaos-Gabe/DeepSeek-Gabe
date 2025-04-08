import request from '@/utils/request'

export function getAllProductQuota() {
  return request({
    url: '/v1/resource/getAllProductQuota',
    method: 'get'
  })
}

export function addProductQuota(data) {
  return request({
    url: '/v1/resource/addProductQuota',
    method: 'post',
    data
  })
}

export function updateProductQuota(data) {
  return request({
    url: '/v1/resource/updateProductQuota',
    method: 'post',
    data
  })
}

export function deleteProductQuota(data) {
  return request({
    url: '/v1/resource/deleteProductQuota',
    method: 'post',
    data
  })
}
