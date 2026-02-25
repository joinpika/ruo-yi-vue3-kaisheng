import request from '@/utils/request'

// 查询产品开票明细列表
export function listSalesInvoiceProduct(query) {
  return request({
    url: '/bus/salesInvoiceProduct/list',
    method: 'get',
    params: query
  })
}

// 查询产品开票明细列表2
export function listSalesInvoiceProductTwo(query) {
  return request({
    url: '/bus/salesInvoiceProduct/listByParam',
    method: 'get',
    params: query
  })
}

// 查询产品开票明细详细
export function getInvoiceProduct(query) {
  return request({
    url: '/bus/salesInvoiceProduct/listByParam',
    method: 'get',
    params: query
  })
}

// 查询产品开票明细详细
export function getSalesInvoiceProduct(id) {
  return request({
    url: '/bus/salesInvoiceProduct/' + id,
    method: 'get'
  })
}

// 新增产品开票明细
export function addSalesInvoiceProduct(data) {
  return request({
    url: '/bus/salesInvoiceProduct',
    method: 'post',
    data: data
  })
}

// 修改产品开票明细
export function updateSalesInvoiceProduct(data) {
  return request({
    url: '/bus/salesInvoiceProduct',
    method: 'put',
    data: data
  })
}

// 删除产品开票明细
export function delSalesInvoiceProduct(id) {
  return request({
    url: '/bus/salesInvoiceProduct/' + id,
    method: 'delete'
  })
}
