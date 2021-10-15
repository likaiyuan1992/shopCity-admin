import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/admin/productList',
    method: 'get',
    params: params
  })
}

export function fetchSimpleList(params) {
  return request({
    url: '/product/simpleList',
    method: 'get',
    params: params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/product/update/deleteStatus',
    method: 'post',
    params: params
  })
}

export function updateNewStatus(params) {
  return request({
    url: '/product/update/newStatus',
    method: 'post',
    params: params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url: '/product/update/recommendStatus',
    method: 'post',
    params: params
  })
}

export function updatePublishStatus(params) {
  return request({
    url: '/product/update/publishStatus',
    method: 'post',
    params: params
  })
}

export function createProduct(data) {
  return request({
    url: '/admin/addProduct',
    method: 'post',
    data: data
  })
}

export function updateProduct(id, data) {
  return request({
    url: '/product/update/' + id,
    method: 'post',
    data: data
  })
}

export function getProduct(id) {
  return request({
    url: '/admin/productDetail?_id=' + id,
    method: 'get'
  })
}

export function upDateProduct(data) {
  return request({
    url: '/admin/updateProduct',
    method: 'put',
    data: data
  })
}

export function deleteProduct(data) {
  return request({
    url: '/admin/deleteProduct',
    method: 'post',
    data: data
  })
}


