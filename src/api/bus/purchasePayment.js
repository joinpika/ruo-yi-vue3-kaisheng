import request from '@/utils/request'

// 查询采购付款列表
export function listPurchasePayment(query) {
  return request({
    url: '/bus/purchasePayment/list',
    method: 'get',
    params: query
  })
}

// 查询采购付款详细
export function getPurchasePayment(id) {
  return request({
    url: '/bus/purchasePayment/' + id,
    method: 'get'
  })
}

// 新增采购付款
export function addPurchasePayment(data) {
  return request({
    url: '/bus/purchasePayment',
    method: 'post',
    data: data
  })
}

// 修改采购付款
export function updatePurchasePayment(data) {
  return request({
    url: '/bus/purchasePayment',
    method: 'put',
    data: data
  })
}

// 删除采购付款
export function delPurchasePayment(id) {
  return request({
    url: '/bus/purchasePayment/' + id,
    method: 'delete'
  })
}

// 下推付款申请
export function addPushPayment(data) {
  return request({
    url: '/bus/purchasePayment/pushPayment',
    method: 'put',
    data: data
  })
}

// 新增采购付款申请
export function addPurchasePaymentAdd(data) {
  return request({
    url: '/bus/purchasePayment/add',
    method: 'post',
    data: data
  })
}

// 采购付款
export function addPaymentAdd(data) {
  return request({
    url: '/bus/purchasePayment/confirm',
    method: 'post',
    data: data
  })
}
