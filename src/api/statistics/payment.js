import request from '@/utils/request'

// 查询业务员缴纳金列表
export function listPayment(query) {
  return request({
    url: '/statistics/paymentSalesman/list',
    method: 'get',
    params: query
  })
}
