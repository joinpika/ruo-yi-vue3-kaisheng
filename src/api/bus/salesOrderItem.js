import request from '@/utils/request'

// 查询销售订单明细列表（）
export function listSalesOrderItem(query) {
  return request({
    url: '/bus/salesOrderItem/list',
    method: 'get',
    params: query
  })
}

// 查询销售订单明细详细
export function getSalesOrderItem(id) {
  return request({
    url: '/bus/salesOrderItem/' + id,
    method: 'get'
  })
}

// 新增销售订单明细
export function addSalesOrderItem(data) {
  return request({
    url: '/bus/salesOrderItem',
    method: 'post',
    data: data
  })
}

// 修改销售订单明细
export function updateSalesOrderItem(data) {
  return request({
    url: '/bus/salesOrderItem',
    method: 'put',
    data: data
  })
}

// 删除销售订单明细
export function delSalesOrderItem(id) {
  return request({
    url: '/bus/salesOrderItem/' + id,
    method: 'delete'
  })
}

// 审核页面查询订单明细  加价信息
export function listSalesOrderPrice(query) {
  return request({
    url: '/bus/salesOrderItem/list/price',
    method: 'get',
    params: query
  })
}
