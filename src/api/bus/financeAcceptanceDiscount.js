import request from '@/utils/request'

// 查询承兑贴息主列表
export function listFinanceAcceptanceDiscount(query) {
  return request({
    url: '/bus/financeAcceptanceDiscount/list',
    method: 'get',
    params: query
  })
}

// 查询承兑贴息主详细
export function getFinanceAcceptanceDiscount(id) {
  return request({
    url: '/bus/financeAcceptanceDiscount/' + id,
    method: 'get'
  })
}

// 新增承兑贴息主
export function addFinanceAcceptanceDiscount(data) {
  return request({
    url: '/bus/financeAcceptanceDiscount',
    method: 'post',
    data: data
  })
}

// 修改承兑贴息主
export function updateFinanceAcceptanceDiscount(data) {
  return request({
    url: '/bus/financeAcceptanceDiscount',
    method: 'put',
    data: data
  })
}

// 删除承兑贴息主
export function delFinanceAcceptanceDiscount(id) {
  return request({
    url: '/bus/financeAcceptanceDiscount/' + id,
    method: 'delete'
  })
}


// 发起承兑贴息审批
export function approvalDiscount(data, discountId) {
  return request({
    url: '/processer/acceptanceDiscount/' + discountId,
    method: 'post',
    data: data
  })
}