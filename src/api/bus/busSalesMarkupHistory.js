import request from '@/utils/request'

// 查询销售加价历史记录列表
export function listBusSalesMarkupHistory(query) {
  return request({
    url: '/bus/busSalesMarkupHistory/list',
    method: 'get',
    params: query
  })
}

// 查询销售加价历史记录详细
export function getBusSalesMarkupHistory(id) {
  return request({
    url: '/bus/busSalesMarkupHistory/' + id,
    method: 'get'
  })
}

// 新增销售加价历史记录
export function addBusSalesMarkupHistory(data) {
  return request({
    url: '/bus/busSalesMarkupHistory',
    method: 'post',
    data: data
  })
}

// 修改销售加价历史记录
export function updateBusSalesMarkupHistory(data) {
  return request({
    url: '/bus/busSalesMarkupHistory',
    method: 'put',
    data: data
  })
}

// 删除销售加价历史记录
export function delBusSalesMarkupHistory(id) {
  return request({
    url: '/bus/busSalesMarkupHistory/' + id,
    method: 'delete'
  })
}
