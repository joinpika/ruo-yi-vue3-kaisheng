import request from '@/utils/request'

// 查询客户结算开票明细表
export function listSettlement(query) {
  return request({
    url: '/statistics/settlementDetails/list',
    method: 'get',
    params: query
  })
}
