import request from '@/utils/request'

// 查询业务员发货列表
export function listSalesmanDelivery(query) {
  return request({
    url: '/bus/salesmanDelivery/list',
    method: 'get',
    params: query
  })
}

// 查询业务员发货详细
export function getSalesmanDelivery(id) {
  return request({
    url: '/bus/salesmanDelivery/' + id,
    method: 'get'
  })
}

// 新增业务员发货
export function addSalesmanDelivery(data) {
  return request({
    url: '/bus/salesmanDelivery',
    method: 'post',
    data: data
  })
}

// 修改业务员发货
export function updateSalesmanDelivery(data) {
  return request({
    url: '/bus/salesmanDelivery',
    method: 'put',
    data: data
  })
}

// 删除业务员发货
export function delSalesmanDelivery(id) {
  return request({
    url: '/bus/salesmanDelivery/' + id,
    method: 'delete'
  })
}

// 业务员发货统计
export function getdeliveryStatistics(query) {
  return request({
    url: '/bus/salesmanDelivery/stats',
    method: 'get',
    params: query
  })
}
