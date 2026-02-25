import request from '@/utils/request'

// 查询客户基本信息列表
export function listCustomer(query) {
  return request({
    url: '/bus/customer/list',
    method: 'get',
    params: query
  })
}

// 查询客户基本信息详细
export function getCustomer(id) {
  return request({
    url: '/bus/customer/' + id,
    method: 'get'
  })
}

// 新增客户基本信息
export function addCustomer(data) {
  return request({
    url: '/bus/customer',
    method: 'post',
    data: data
  })
}

// 修改客户基本信息
export function updateCustomer(data) {
  return request({
    url: '/bus/customer',
    method: 'put',
    data: data
  })
}

// 删除客户基本信息
export function delCustomer(id) {
  return request({
    url: '/bus/customer/' + id,
    method: 'delete'
  })
}

// 客户财务信息
// 查询客户财务信息详细
export function getCustomerFinance(id) {
  return request({
    url: '/bus/customer/finance/' + id,
    method: 'get'
  })
}

// 查询销售订单页面客户的财务统计
export function getCustomerFinanceStatus(customerId) {
  return request({
    url: '/bus/salesOrder/customer/finance/' + customerId,
    method: 'get'
  })
}

// 客户列表查询应收款
export function getCustomerReceivable(query) {
  return request({
    url: '/bus/customer/receive/unpaid',
    method: 'get',
    params: query
  })
}

// 导入
export function importCustomer(data) {
  return request({
    url: '/bus/customer/import',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
  })
}
