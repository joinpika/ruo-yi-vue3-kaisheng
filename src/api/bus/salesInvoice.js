import request from '@/utils/request'

// 查询销售开票主列表
export function listSalesInvoice(query) {
  return request({
    url: '/bus/salesInvoice/list',
    method: 'get',
    params: query
  })
}

// 查询销售开票主详细
export function getSalesInvoice(id) {
  return request({
    url: '/bus/salesInvoice/' + id,
    method: 'get'
  })
}

// 新增销售开票主
export function addSalesInvoice(data) {
  return request({
    url: '/bus/salesInvoice',
    method: 'post',
    data: data
  })
}

// 修改销售开票主
export function updateSalesInvoice(data) {
  return request({
    url: '/bus/salesInvoice',
    method: 'put',
    data: data
  })
}

// 删除销售开票主
export function delSalesInvoice(id) {
  return request({
    url: '/bus/salesInvoice/' + id,
    method: 'delete'
  })
}

// 开票产品明细
export function listSalesInvoiceDetail(query) {
  return request({
    url: '/bus/salesInvoiceProduct/listByParam',
    method: 'get',
    params: query
  })
}
