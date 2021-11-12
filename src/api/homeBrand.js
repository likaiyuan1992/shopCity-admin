import request from '@/utils/request'
export function bannerList(params) {
  return request({
    url: '/admin/bannerList',
    method: 'get',
    params: params
  })
}

export function setBanner(data) {
  return request({
    url: '/admin/setBanner',
    method: 'post',
    data: data
  })
}

