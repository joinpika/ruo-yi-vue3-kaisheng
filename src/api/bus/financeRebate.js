import request from '@/utils/request'

// 查询返利登记主列表
export function listFinanceRebate(query) {
  return request({
    url: '/bus/financeRebate/list',
    method: 'get',
    params: query
  })
}

// 查询返利登记主详细
export function getFinanceRebate(id) {
  return request({
    url: '/bus/financeRebate/' + id,
    method: 'get'
  })
}

// 新增返利登记主
export function addFinanceRebate(data) {
  return request({
    url: '/bus/financeRebate',
    method: 'post',
    data: data
  })
}

// 修改返利登记主
export function updateFinanceRebate(data) {
  return request({
    url: '/bus/financeRebate',
    method: 'put',
    data: data
  })
}

// 删除返利登记主
export function delFinanceRebate(id) {
  return request({
    url: '/bus/financeRebate/' + id,
    method: 'delete'
  })
}

// 发起返利登记审批
export function approvalRebate(data, rebateId) {
  return request({
    url: '/processer/rebate/' + rebateId,
    method: 'post',
    data: data
  })
}
