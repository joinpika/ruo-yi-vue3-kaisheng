import request from '@/utils/request'

// 查询销售订单主列表
export function listSalesOrder(query) {
  return request({
    url: '/bus/salesOrder/list',
    method: 'get',
    params: query
  })
}

// 查询销售订单主详细
export function getSalesOrder(id) {
  return request({
    url: '/bus/salesOrder/' + id,
    method: 'get'
  })
}

// 新增销售订单主
export function addSalesOrder(data) {
  return request({
    url: '/bus/salesOrder',
    method: 'post',
    data: data
  })
}

// 修改销售订单主
export function updateSalesOrder(data) {
  return request({
    url: '/bus/salesOrder',
    method: 'put',
    data: data
  })
}

// 删除销售订单主
export function delSalesOrder(id) {
  return request({
    url: '/bus/salesOrder/' + id,
    method: 'delete'
  })
}

// 查询销售订单财务统计
export function finance(query) {
  return request({
    url: '/bus/salesOrder/finance',
    method: 'get',
    params: query
  })
}
