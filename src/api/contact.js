import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/admin/contactList',
    method: 'get',
    params: params
  })
}



// export function deleteOrder(params) {
//   return request({
//     url: '/admin/deleteOrder',
//     method: 'post',
//     data: params
//   })
// }
