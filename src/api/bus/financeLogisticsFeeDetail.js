import request from '@/utils/request'

// 查询物流待结算明细列表
export function listFinanceLogisticsFeeDetail(query) {
  return request({
    url: '/bus/financeLogisticsFeeDetail/list',
    method: 'get',
    params: query
  })
}

// 查询物流待结算明细详细
export function getFinanceLogisticsFeeDetail(id) {
  return request({
    url: '/bus/financeLogisticsFeeDetail/' + id,
    method: 'get'
  })
}

// 新增物流待结算明细
export function addFinanceLogisticsFeeDetail(data) {
  return request({
    url: '/bus/financeLogisticsFeeDetail',
    method: 'post',
    data: data
  })
}

// 修改物流待结算明细
export function updateFinanceLogisticsFeeDetail(data) {
  return request({
    url: '/bus/financeLogisticsFeeDetail',
    method: 'put',
    data: data
  })
}

// 删除物流待结算明细
export function delFinanceLogisticsFeeDetail(id) {
  return request({
    url: '/bus/financeLogisticsFeeDetail/' + id,
    method: 'delete'
  })
}
