import request from '@/utils/request'
//查询库存管理（支持多维度筛选）列表
export function getBusInventoryList(query) {
  return request({
    url: '/wms/BusInventory/list',
    method: 'get',
    params: query
  })
}

//导出库存管理
export function exportBusInventory(data) {
  return request({
    url: '/wms/BusInventory/export',
    method: 'post',
    data
  })
}
//库存管理详情
export function getBusInventoryDetail(id) {
  return request({
    url: '/wms/BusInventory/' + id,
    method: 'get'
  })
}
//库存管理新增
export function addBusInventory(data) {
  return request({
    url: '/wms/BusInventory',
    method: 'post',
    data: data
  })
}
//库存管理修改
export function updateBusInventory(data) {
  return request({
    url: '/wms/BusInventory',
    method: 'put',
    data: data
  })
}
//查询库位下拉
export function getBusLocationList(query) {
  return request({
    url: '/wms/BusWarehouseLocation/getLocationList',
    method: 'get',
    params: query
  })
}
//删除仓库库位信息
export function delBusInventory(id) {
  return request({
    url: '/wms/BusWarehouseLocation/' + id,
    method: 'delete'
  })
}


// =====出库单==========

//查询出库单主列表
export function getBusOutboundList(query) {
  return request({
    url: '/wms/BusOutboundMain/list',
    method: 'get',
    params: query
  })
}
//查询出库单主列表明细
export function getBusOutboundDetail(id) {
  return request({
    url: '/wms/BusOutboundMain/' + id,
    method: 'get'
  })
}
//导出出库单主列表
export function exportBusOutbound(data) {
  return request({
    url: '/wms/BusOutboundMain/export',
    method: 'post',
    data
  })
}
//新增出库单主列表
export function addBusOutbound(data) {
  return request({
    url: '/wms/BusOutboundMain/add',
    method: 'post',
    data: data
  })
}
//修改出库单主
export function updateBusOutbound(data) {
  return request({
    url: '/wms/BusOutboundMain',
    method: 'put',
    data: data
  })
}
//删除出库单主
export function delBusOutbound(id) {
  return request({
    url: '/wms/BusOutboundMain/' + id,
    method: 'delete'
  })
}

//查询全部库存数据（不分页）
export function getBusInventoryAllList(query) {
  return request({
    url: '/wms/BusInventory/listAll',
    method: 'get',
    params: query
  })
}
//查询出库单明细
export function getBusOutboundDetailList(query) {
  return request({
    url: '/wms/BusInboundDetail/list',
    method: 'get',
    params: query
  })
}
