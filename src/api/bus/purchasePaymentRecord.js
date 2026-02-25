import request from '@/utils/request'

// 查询采购付款记录 列表
export function listPurchasePaymentRecord(query) {
  return request({
    url: '/bus/purchasePaymentRecord/list',
    method: 'get',
    params: query
  })
}

// 查询采购付款记录 详细
export function getPurchasePaymentRecord(id) {
  return request({
    url: '/bus/purchasePaymentRecord/' + id,
    method: 'get'
  })
}

// 新增采购付款记录
export function addPurchasePaymentRecord(data) {
  return request({
    url: '/bus/purchasePaymentRecord',
    method: 'post',
    data: data
  })
}

// 修改采购付款记录
export function updatePurchasePaymentRecord(data) {
  return request({
    url: '/bus/purchasePaymentRecord',
    method: 'put',
    data: data
  })
}

// 删除采购付款记录
export function delPurchasePaymentRecord(id) {
  return request({
    url: '/bus/purchasePaymentRecord/' + id,
    method: 'delete'
  })
}

// 新增采购付款申请接口记录
export function addPurchaseConfirm(data) {
  return request({
    url: '/bus/purchasePayment/confirm',
    method: 'post',
    data: data
  })
}
