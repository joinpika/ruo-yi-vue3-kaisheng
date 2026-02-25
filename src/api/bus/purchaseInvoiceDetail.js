import request from '@/utils/request'

// 查询采购收票明细列表
export function listPurchaseInvoiceDetail(query) {
  return request({
    url: '/bus/purchaseInvoiceDetail/list',
    method: 'get',
    params: query
  })
}

// 查询采购收票明细详细
export function getPurchaseInvoiceDetail(id) {
  return request({
    url: '/bus/purchaseInvoiceDetail/' + id,
    method: 'get'
  })
}

// 新增采购收票明细
export function addPurchaseInvoiceDetail(data) {
  return request({
    url: '/bus/purchaseInvoiceDetail',
    method: 'post',
    data: data
  })
}

// 修改采购收票明细
export function updatePurchaseInvoiceDetail(data) {
  return request({
    url: '/bus/purchaseInvoiceDetail',
    method: 'put',
    data: data
  })
}

// 删除采购收票明细
export function delPurchaseInvoiceDetail(id) {
  return request({
    url: '/bus/purchaseInvoiceDetail/' + id,
    method: 'delete'
  })
}

// 产品明细导出
export function getPurchaseInvoiceDetailExport(query) {
  return request({
    url: '/bus/purchaseInvoiceDetail/export',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}
