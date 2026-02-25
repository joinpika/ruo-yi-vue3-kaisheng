import request from '@/utils/request'

// 查询业务费统计主列表
export function listBusinessExpen(query) {
  return request({
    url: '/statistics/businessExpenseStats/list',
    method: 'get',
    params: query
  })
}
