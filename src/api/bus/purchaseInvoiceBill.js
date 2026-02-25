import request from '@/utils/request'

// 查询发票票据明细列表
export function listPurchaseInvoiceBill(query) {
  return request({
    url: '/bus/purchaseInvoiceBill/list',
    method: 'get',
    params: query
  })
}

// 查询发票票据明细详细
export function getPurchaseInvoiceBill(id) {
  return request({
    url: '/bus/purchaseInvoiceBill/' + id,
    method: 'get'
  })
}

// 新增发票票据明细
export function addPurchaseInvoiceBill(data) {
  return request({
    url: '/bus/purchaseInvoiceBill',
    method: 'post',
    data: data
  })
}

// 修改发票票据明细
export function updatePurchaseInvoiceBill(data) {
  return request({
    url: '/bus/purchaseInvoiceBill',
    method: 'put',
    data: data
  })
}

// 删除发票票据明细
export function delPurchaseInvoiceBill(id) {
  return request({
    url: '/bus/purchaseInvoiceBill/' + id,
    method: 'delete'
  })
}
