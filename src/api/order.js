import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/admin/orderList',
    method: 'get',
    params: params
  })
}
export function updateOrder(params) {
  return request({
    url: '/admin/updateOrder',
    method: 'put',
    data: params
  })
}


export function deleteOrder(params) {
  return request({
    url: '/admin/deleteOrder',
    method: 'post',
    data: params
  })
}
export function closeOrder(params) {
  return request({
    url: '/admin/deleteOrder',
    method: 'post',
    data: params
  })
}

export function deliveryOrder(data) {
  return request({
    url: '/order/update/delivery',
    method: 'post',
    data: data
  });
}

export function getOrderDetail(id) {
  return request({
    url: '/order/' + id,
    method: 'get'
  });
}

export function updateReceiverInfo(data) {
  return request({
    url: '/order/update/receiverInfo',
    method: 'post',
    data: data
  });
}

export function updateMoneyInfo(data) {
  return request({
    url: '/order/update/moneyInfo',
    method: 'post',
    data: data
  });
}

export function updateOrderNote(params) {
  return request({
    url: '/order/update/note',
    method: 'post',
    params: params
  })
}
