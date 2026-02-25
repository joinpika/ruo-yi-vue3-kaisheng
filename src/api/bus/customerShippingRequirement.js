import request from '@/utils/request'

// 查询客户发货要求列表
export function listCustomerShippingRequirement(query) {
  return request({
    url: '/bus/customerShippingRequirement/list',
    method: 'get',
    params: query
  })
}

// 查询客户发货要求详细
export function getCustomerShippingRequirement(id) {
  return request({
    url: '/bus/customerShippingRequirement/' + id,
    method: 'get',
  })
}

// 新增客户发货要求
export function addCustomerShippingRequirement(data) {
  return request({
    url: '/bus/customerShippingRequirement',
    method: 'post',
    data: data
  })
}

// 修改客户发货要求
export function updateCustomerShippingRequirement(data) {
  return request({
    url: '/bus/customerShippingRequirement',
    method: 'put',
    data: data
  })
}

// 删除客户发货要求
export function delCustomerShippingRequirement(id) {
  return request({
    url: '/bus/customerShippingRequirement/' + id,
    method: 'delete'
  })
}
