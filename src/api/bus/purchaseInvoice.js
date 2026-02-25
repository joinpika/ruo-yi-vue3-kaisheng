import request from '@/utils/request'

// 查询采购收票列表
export function listPurchaseInvoice(query) {
  return request({
    url: '/bus/purchaseInvoice/list',
    method: 'get',
    params: query
  })
}

// 查询采购收票详细
export function getPurchaseInvoice(id) {
  return request({
    url: '/bus/purchaseInvoice/' + id,
    method: 'get'
  })
}

// 新增采购收票
export function addPurchaseInvoice(data) {
  return request({
    url: '/bus/purchaseInvoice',
    method: 'post',
    data: data
  })
}

// 修改采购收票
export function updatePurchaseInvoice(data) {
  return request({
    url: '/bus/purchaseInvoice',
    method: 'put',
    data: data
  })
}

// 删除采购收票
export function delPurchaseInvoice(id) {
  return request({
    url: '/bus/purchaseInvoice/' + id,
    method: 'delete'
  })
}

// 根据本方公司id和供应商ID为维度查询采购收票列表
export function listStatisticsInvoice(query) {
  return request({
    url: '/bus/purchaseInvoice/listStatistics',
    method: 'get',
    params: query
  })
}
