import request from '@/utils/request'

// 查询客户滞纳金主列表
export function listCustomerLateFee(query) {
  return request({
    url: '/bus/customerLateFee/list',
    method: 'get',
    params: query
  })
}

// 根据客户公司与本方公司查询  审核通过未开票的客户滞纳金列表
export function listUninvoiced(query) {
  return request({
    url: '/bus/customerLateFee/uninvoiced',
    method: 'get',
    params: query
  })
}
// 根据订单id查询客户未结算滞纳金
export function getCustomerLateFeeUnSettled(orderId) {
  return request({
    url: 'bus/customerLateFee/unSettled/' + orderId,
    method: 'get'
  })
}

// 查询客户滞纳金主详细
export function getCustomerLateFee(id) {
  return request({
    url: '/bus/customerLateFee/' + id,
    method: 'get'
  })
}

// 新增客户滞纳金主
export function addCustomerLateFee(data) {
  return request({
    url: '/bus/customerLateFee',
    method: 'post',
    data: data
  })
}

// 修改客户滞纳金主
export function updateCustomerLateFee(data) {
  return request({
    url: '/bus/customerLateFee',
    method: 'put',
    data: data
  })
}

// 删除客户滞纳金主
export function delCustomerLateFee(id) {
  return request({
    url: '/bus/customerLateFee/' + id,
    method: 'delete'
  })
}

// 客户滞纳金明细
export function listCustomerFeeDetail(query) {
  return request({
    url: '/bus/customerLateFeeDetail/unregistered',
    method: 'get',
    params: query
  })
}

// 查询合同模版列表
export function listContractTemplate(query) {
  return request({
    url: '/bus/contractTemplate/list',
    method: 'get',
    params: query
  })
}

// 发起客户滞纳金审批
export function approvalLateFee(data, lateFeeId) {
  return request({
    url: '/processer/customerLateFee/' + lateFeeId,
    method: 'post',
    data: data
  })
}
