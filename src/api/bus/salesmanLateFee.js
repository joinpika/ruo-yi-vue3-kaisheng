import request from '@/utils/request'

// 查询业务员滞纳金主列表
export function listSalesmanLateFee(query) {
  return request({
    url: '/bus/salesmanLateFee/list',
    method: 'get',
    params: query
  })
}

// 查询业务员滞纳金主详细
export function getSalesmanLateFee(id) {
  return request({
    url: '/bus/salesmanLateFee/' + id,
    method: 'get'
  })
}

// 新增业务员滞纳金主
export function addSalesmanLateFee(data) {
  return request({
    url: '/bus/salesmanLateFee',
    method: 'post',
    data: data
  })
}

// 修改业务员滞纳金主
export function updateSalesmanLateFee(data) {
  return request({
    url: '/bus/salesmanLateFee',
    method: 'put',
    data: data
  })
}

// 删除业务员滞纳金主
export function delSalesmanLateFee(id) {
  return request({
    url: '/bus/salesmanLateFee/' + id,
    method: 'delete'
  })
}

// 滞纳金明细
export function listLateFeeDetail(query) {
  return request({
    url: '/bus/salesmanLateFeeDetail/unregistered',
    method: 'get',
    params: query
  })
}

// 根据订单查询业务员未结算滞纳金金额
export function getSalesmanLateFeeNo(orderId) {
  return request({
    url: '/bus/salesmanLateFee/unSettled/' + orderId,
    method: 'get'
  })
}

// 业务员滞纳金审批
export function approveSalesmanLateFee(data, lateFeeId) {
  return request({
    url: '/processer/salesManLateFee/' + lateFeeId,
    method: 'post',
    data: data
  })
}