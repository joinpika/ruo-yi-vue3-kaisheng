import request from '@/utils/request'

// 查询钢厂（供应商）基本信息列表
export function listSteelMill(query) {
  return request({
    url: '/bus/steelMill/list',
    method: 'get',
    params: query
  })
}

// 查询钢厂（供应商）基本信息详细
export function getSteelMill(id) {
  return request({
    url: '/bus/steelMill/' + id,
    method: 'get'
  })
}

// 新增钢厂（供应商）基本信息
export function addSteelMill(data) {
  return request({
    url: '/bus/steelMill',
    method: 'post',
    data: data
  })
}

// 修改钢厂（供应商）基本信息
export function updateSteelMill(data) {
  return request({
    url: '/bus/steelMill',
    method: 'put',
    data: data
  })
}

// 删除钢厂（供应商）基本信息
export function delSteelMill(id) {
  return request({
    url: '/bus/steelMill/' + id,
    method: 'delete'
  })
}

// 查询钢厂（供应商）财务信息详细
export function getSteelMillFinance(id) {
  return request({
    url: '/bus/steelMill/finance/' + id,
    method: 'get'
  })
}

// 入库记录
export function getInboundRecord(query) {
  return request({
    url: '/bus/steelMill/inbound',
    method: 'get',
    params: query
  })
}

// 入库明细
export function getInboundDetail(query) {
  return request({
    url: '/bus/warehouseTransaction/inboundDetail',
    method: 'get',
    params: query
  })
}

// 付款记录
export function getPaymentRecord() {
  return request({
    url: '/bus/purchasePaymentRecord/list',
    method: 'get'
  })
}
