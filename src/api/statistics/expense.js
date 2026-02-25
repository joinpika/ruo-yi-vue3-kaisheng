import request from '@/utils/request'

// 查询项目费用统计列表
export function listExpense(query) {
  return request({
    url: '/statistics/projectExpenseStats/list',
    method: 'get',
    params: query
  })
}
