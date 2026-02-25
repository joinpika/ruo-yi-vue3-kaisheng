import request from '@/utils/request'

// 查询其他单据开票明细列表
export function listSalesInvoiceOther(query) {
  return request({
    url: '/bus/salesInvoiceOther/list',
    method: 'get',
    params: query
  })
}

// 查询其他单据开票明细详细
export function getSalesInvoiceOther(id) {
  return request({
    url: '/bus/salesInvoiceOther/' + id,
    method: 'get'
  })
}

// 新增其他单据开票明细
export function addSalesInvoiceOther(data) {
  return request({
    url: '/bus/salesInvoiceOther',
    method: 'post',
    data: data
  })
}

// 修改其他单据开票明细
export function updateSalesInvoiceOther(data) {
  return request({
    url: '/bus/salesInvoiceOther',
    method: 'put',
    data: data
  })
}

// 删除其他单据开票明细
export function delSalesInvoiceOther(id) {
  return request({
    url: '/bus/salesInvoiceOther/' + id,
    method: 'delete'
  })
}
