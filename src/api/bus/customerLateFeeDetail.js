import request from '@/utils/request'

// 查询客户滞纳金明细列表
export function listCustomerLateFeeDetail(query) {
  return request({
    url: '/bus/customerLateFeeDetail/list',
    method: 'get',
    params: query
  })
}

// 根据客户公司与本方公司查询  审核通过未开票的客户滞纳金明细列表
export function listCustomerLateFeeDetails(query) {
  return request({
    url: '/bus/customerLateFeeDetail/unregistered',
    method: 'get',
    params: query
  })
}

// 查询客户滞纳金明细详细
export function getCustomerLateFeeDetail(id) {
  return request({
    url: '/bus/customerLateFeeDetail/' + id,
    method: 'get'
  })
}

// 新增客户滞纳金明细
export function addCustomerLateFeeDetail(data) {
  return request({
    url: '/bus/customerLateFeeDetail',
    method: 'post',
    data: data
  })
}

// 修改客户滞纳金明细
export function updateCustomerLateFeeDetail(data) {
  return request({
    url: '/bus/customerLateFeeDetail',
    method: 'put',
    data: data
  })
}

// 删除客户滞纳金明细
export function delCustomerLateFeeDetail(id) {
  return request({
    url: '/bus/customerLateFeeDetail/' + id,
    method: 'delete'
  })
}
