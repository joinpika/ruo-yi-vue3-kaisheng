import request from '@/utils/request'

// 查询产线信息列表
export function productionList(query) {
  return request({
    url: '/wms/BusProduction/list',
    method: 'get',
    params: query
  })
}

