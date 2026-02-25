import request from '@/utils/request'

// 查询销售发货主列表
export function listSalesDelivery(query) {
  return request({
    url: '/bus/salesDelivery/list',
    method: 'get',
    params: query
  })
}

export function listSalesDeliveryTwo(id) {
  return request({
    url: '/bus/salesDelivery/list/' + id,
    method: 'get'
  })
}

// 查询销售发货主详细     top
export function getSalesDelivery(id) {
  return request({
    url: '/bus/salesDelivery/' + id,
    method: 'get'
  })
}

// 新增销售发货主
export function addSalesDelivery(data) {
  return request({
    url: '/bus/salesDelivery',
    method: 'post',
    data: data
  })
}

// 修改销售发货主
export function updateSalesDelivery(data) {
  return request({
    url: '/bus/salesDelivery',
    method: 'put',
    data: data
  })
}

// 删除销售发货主
export function delSalesDelivery(id) {
  return request({
    url: '/bus/salesDelivery/' + id,
    method: 'delete'
  })
}

//
export function listSalesDetails(query) {
  return request({
    url: '/bus/salesOrderItem/unDelivery',
    method: 'get',
    params: query
  })
}

// 未发货明细
export function listUnDeliveredSalesOrder(query) {
  return request({
    url: '/bus/salesOrderItem/unDeliveredList',
    method: 'get',
    params: query
  })
}

// 结算运费单价
export function settleUnitPrice(query) {
  return request({
    url: '/bus/logisticsFreightRule/settle/unitPrice',
    method: 'get',
    params: query
  })
}
