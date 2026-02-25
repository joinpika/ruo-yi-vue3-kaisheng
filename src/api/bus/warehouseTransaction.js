import request from '@/utils/request'

// 查询库存流水列表
export function listWarehouseTransaction(query) {
  return request({
    url: '/bus/warehouseTransaction/list',
    method: 'get',
    params: query
  })
}

// 查询库存流水详细
export function getWarehouseTransaction(id) {
  return request({
    url: '/bus/warehouseTransaction/' + id,
    method: 'get'
  })
}

// 新增库存流水
export function addWarehouseTransaction(data) {
  return request({
    url: '/bus/warehouseTransaction',
    method: 'post',
    data: data
  })
}

// 修改库存流水
export function updateWarehouseTransaction(data) {
  return request({
    url: '/bus/warehouseTransaction',
    method: 'put',
    data: data
  })
}

// 删除库存流水
export function delWarehouseTransaction(id) {
  return request({
    url: '/bus/warehouseTransaction/' + id,
    method: 'delete'
  })
}

// 采购入库列表详情
export function listInboundList(query) {
  return request({
    url: '/bus/warehouseTransaction/inboundList',
    method: 'get',
    params: query
  })
}

// 采购入库主列表
export function listMainInboundList(query) {
  return request({
    url: '/system/inbound/list',
    method: 'get',
    params: query
  })
}

// 新增采购入库
export function addInbound(data) {
  return request({
    url: '/system/inbound',
    method: 'post',
    data: data
  })
}

// 查询采购收票登记待收票列表
export function listInvoiceList(query) {
  return request({
    url: '/bus/warehouseTransaction/invoiceList',
    method: 'get',
    params: query
  })
}

// 待收票列表导出
export function getWarehouseTransactionExport(query) {
  return request({
    url: '/bus/warehouseTransaction/export',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}

// 出库明细导出
export function getInboundDetailOutExport(query) {
  return request({
    url: '/bus/warehouseTransaction/inboundDetailOutExport',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}

// 入库明细导出
export function getinboundDetailExport(query) {
  return request({
    url: '/bus/warehouseTransaction/inboundDetailExport',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}

// 导入
export function importBusWarehouseTransaction(data) {
  return request({
    url: '/bus/warehouseTransaction/importData',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
  })
}

// 入库明细列表
export function listInboundDetailIn(query) {
  return request({
    url: '/bus/warehouseTransaction/inboundDetailIn',
    method: 'get',
    params: query
  })
}

// 出库明细列表
export function listOutboundDetailIn(query) {
  return request({
    url: '/bus/warehouseTransaction/list',
    method: 'get',
    params: query
  })
}
