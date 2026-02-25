import request from '@/utils/request'

// 查询项目毛利费列表
export function listGross(query) {
  return request({
    url: '/statistics/projectGrossProfit/list',
    method: 'get',
    params: query
  })
}
