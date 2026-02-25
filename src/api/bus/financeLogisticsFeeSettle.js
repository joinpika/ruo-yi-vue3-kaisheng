import request from '@/utils/request'

// 查询物流结算登记主列表
export function listFinanceLogisticsFeeSettle(query) {
  return request({
    url: '/bus/financeLogisticsFeeSettle/list',
    method: 'get',
    params: query
  })
}

// 查询物流结算登记主详细
export function getFinanceLogisticsFeeSettle(id) {
  return request({
    url: '/bus/financeLogisticsFeeSettle/' + id,
    method: 'get'
  })
}

// 新增物流结算登记主
export function addFinanceLogisticsFeeSettle(data) {
  return request({
    url: '/bus/financeLogisticsFeeSettle',
    method: 'post',
    data: data
  })
}

// 修改物流结算登记主
export function updateFinanceLogisticsFeeSettle(data) {
  return request({
    url: '/bus/financeLogisticsFeeSettle',
    method: 'put',
    data: data
  })
}

// 删除物流结算登记主
export function delFinanceLogisticsFeeSettle(id) {
  return request({
    url: '/bus/financeLogisticsFeeSettle/' + id,
    method: 'delete'
  })
}


// 查询未结算的物流明细
export function unregisteredList(query) {
  return request({
    url: '/bus/financeLogisticsFee/unregisteredList',
    method: 'get',
    params: query
  })
}
