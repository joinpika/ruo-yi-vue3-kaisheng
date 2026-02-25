import request from '@/utils/request'

// 查询销售收款主列表
export function listSalesCollection(query) {
  return request({
    url: '/bus/salesCollection/list',
    method: 'get',
    params: query
  })
}

// 查询销售收款主详细
export function getSalesCollection(id) {
  return request({
    url: '/bus/salesCollection/' + id,
    method: 'get'
  })
}

// 新增销售收款主
export function addSalesCollection(data) {
  return request({
    url: '/bus/salesCollection',
    method: 'post',
    data: data
  })
}

// 修改销售收款主
export function updateSalesCollection(data) {
  return request({
    url: '/bus/salesCollection',
    method: 'put',
    data: data
  })
}

// 删除销售收款主
export function delSalesCollection(id) {
  return request({
    url: '/bus/salesCollection/' + id,
    method: 'delete'
  })
}

// 销售收款汇总
export function getSalesCollectionAmount(query) {
  return request({
    url: '/bus/salesCollection/amount',
    method: 'get',
    params: query
  })
}
