import request from '@/utils/request'

// 钢厂库存列表
export function listStock(query) {
  return request({
    url: '/bus/stock/list',
    method: 'get',
    params: query
  })
}

// 钢厂库存统计接口
export function listStockStatistics(query) {
  return request({
    url: '/bus/stock/statistics',
    method: 'get',
    params: query
  })
}

// 钢厂库存导出
export function getStockExport(query) {
  return request({
    url: '/bus/stock/export',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}

// 钢厂库存修改接口
export function updateStock(data) {
  return request({
    url: '/bus/stock',
    method: 'put',
    data: data
  })
}
