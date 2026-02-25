import request from '@/utils/request'

// 查询销售结算单主列表
export function listSalesSettle(query) {
  return request({
    url: '/bus/salesSettle/list',
    method: 'get',
    params: query
  })
}

// 查询结算明细列表
export function settleList(query) {
  return request({
    url: '/bus/salesSettleDetail/listBySettle',
    method: 'get',
    params: query
  })
}

// 查询销售结算单主详细
export function getSalesSettle(id) {
  return request({
    url: '/bus/salesSettle/' + id,
    method: 'get'
  })
}

// 新增销售结算单主
export function addSalesSettle(data) {
  return request({
    url: '/bus/salesSettle',
    method: 'post',
    data: data
  })
}

// 修改销售结算单主
export function updateSalesSettle(data) {
  return request({
    url: '/bus/salesSettle',
    method: 'put',
    data: data
  })
}

// 删除销售结算单主
export function delSalesSettle(id) {
  return request({
    url: '/bus/salesSettle/' + id,
    method: 'delete'
  })
}

// 新增结算-未发货待结算单
export function unSettleList(query) {
  return request({
    url: '/bus/salesDeliveryDetail/unSettleList',
    method: 'get',
    params: query
  })
}