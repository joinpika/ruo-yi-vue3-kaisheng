import request from '@/utils/request'

// 查询业务员提成规则列表
export function listSalesmanCommissionRule(query) {
  return request({
    url: '/bus/salesmanCommissionRule/list',
    method: 'get',
    params: query
  })
}

// 查询业务员提成规则详细
export function getSalesmanCommissionRule(id) {
  return request({
    url: '/bus/salesmanCommissionRule/' + id,
    method: 'get'
  })
}

// 新增业务员提成规则
export function addSalesmanCommissionRule(data) {
  return request({
    url: '/bus/salesmanCommissionRule',
    method: 'post',
    data: data
  })
}

// 修改业务员提成规则
export function updateSalesmanCommissionRule(data) {
  return request({
    url: '/bus/salesmanCommissionRule',
    method: 'put',
    data: data
  })
}

// 删除业务员提成规则
export function delSalesmanCommissionRule(id) {
  return request({
    url: '/bus/salesmanCommissionRule/' + id,
    method: 'delete'
  })
}
