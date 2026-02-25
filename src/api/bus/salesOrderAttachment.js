import request from '@/utils/request'

// 查询销售订单附件列表
export function listSalesOrderAttachment(query) {
  return request({
    url: '/bus/salesOrderAttachment/list',
    method: 'get',
    params: query
  })
}

// 查询销售订单附件详细
export function getSalesOrderAttachment(id) {
  return request({
    url: '/bus/salesOrderAttachment/' + id,
    method: 'get'
  })
}

// 新增销售订单附件
export function addSalesOrderAttachment(data) {
  return request({
    url: '/bus/salesOrderAttachment',
    method: 'post',
    data: data
  })
}

// 修改销售订单附件
export function updateSalesOrderAttachment(data) {
  return request({
    url: '/bus/salesOrderAttachment',
    method: 'put',
    data: data
  })
}

// 删除销售订单附件
export function delSalesOrderAttachment(id) {
  return request({
    url: '/bus/salesOrderAttachment/' + id,
    method: 'delete'
  })
}
