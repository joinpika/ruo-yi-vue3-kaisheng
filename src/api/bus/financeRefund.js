import request from '@/utils/request'

// 查询销售退款列表
export function listBusFinanceRefund(query) {
  return request({
    url: '/bus/BusFinanceRefund/list',
    method: 'get',
    params: query
  })
}

// 查询销售退款详细
export function getBusFinanceRefund(id) {
  return request({
    url: '/bus/BusFinanceRefund/' + id,
    method: 'get'
  })
}

// 新增销售退款
export function addBusFinanceRefund(data) {
  return request({
    url: '/bus/BusFinanceRefund',
    method: 'post',
    data: data
  })
}

// 修改销售退款
export function updateBusFinanceRefund(data) {
  return request({
    url: '/bus/BusFinanceRefund',
    method: 'put',
    data: data
  })
}

// 删除销售退款
export function delBusFinanceRefund(id) {
  return request({
    url: '/bus/BusFinanceRefund/' + id,
    method: 'delete'
  })
}
