import request from '@/utils/request'

// 查询物流运费待结算主列表
export function listFinanceLogisticsFee(query) {
  return request({
    url: '/bus/financeLogisticsFee/list',
    method: 'get',
    params: query
  })
}

// 查询物流运费待结算主详细
export function getFinanceLogisticsFee(id) {
  return request({
    url: '/bus/financeLogisticsFee/' + id,
    method: 'get'
  })
}

// 新增物流运费待结算主
export function addFinanceLogisticsFee(data) {
  return request({
    url: '/bus/financeLogisticsFee',
    method: 'post',
    data: data
  })
}

// 修改物流运费待结算主
export function updateFinanceLogisticsFee(data) {
  return request({
    url: '/bus/financeLogisticsFee',
    method: 'put',
    data: data
  })
}

// 删除物流运费待结算主
export function delFinanceLogisticsFee(id) {
  return request({
    url: '/bus/financeLogisticsFee/' + id,
    method: 'delete'
  })
}

// 统计接口
export function getFinanceLogistics(query) {
  return request({
    url: '/bus/financeLogisticsFee/stats',
    method: 'get',
    params: query
  })
}
