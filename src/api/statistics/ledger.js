import request from '@/utils/request'

// 查询台账列表
export function listLedger(query) {
  return request({
    url: '/statistics/customerLedger/list',
    method: 'get',
    params: query
  })
}
