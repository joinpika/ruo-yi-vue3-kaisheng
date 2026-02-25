import request from '@/utils/request'

// 查询销售发货运费规则列表
export function listBusSalesShippingFeeRule(query) {
  return request({
    url: '/bus/busSalesShippingFeeRule/list',
    method: 'get',
    params: query
  })
}

// 查询销售发货运费规则详细
export function getBusSalesShippingFeeRule(id) {
  return request({
    url: '/bus/busSalesShippingFeeRule/' + id,
    method: 'get'
  })
}

// 新增销售发货运费规则
export function addBusSalesShippingFeeRule(data) {
  return request({
    url: '/bus/busSalesShippingFeeRule',
    method: 'post',
    data: data
  })
}

// 修改销售发货运费规则
export function updateBusSalesShippingFeeRule(data) {
  return request({
    url: '/bus/busSalesShippingFeeRule',
    method: 'put',
    data: data
  })
}

// 删除销售发货运费规则
export function delBusSalesShippingFeeRule(id) {
  return request({
    url: '/bus/busSalesShippingFeeRule/' + id,
    method: 'delete'
  })
}

// 获取收获区域查询条件
export function listReceiveRegionList(query) {
  return request({
    url: '/bus/busSalesShippingFeeRule/receiveRegionList',
    method: 'get',
    params: query
  })
}

// 导入
export function importBusSalesShippingFeeRule(data) {
  return request({
    url: '/bus/busSalesShippingFeeRule/import',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
  })
}
