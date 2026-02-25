import request from '@/utils/request'

// 查询仓库信息主表列表
export function listBusWarehouse(query) {
  return request({
    url: '/wms/BusWarehouse/list',
    method: 'get',
    params: query
  })
}

// 查询仓库信息主表详细
export function getBusWarehouse(id) {
  return request({
    url: '/wms/BusWarehouse/' + id,
    method: 'get'
  })
}

// 新增仓库信息主表
export function addBusWarehouse(data) {
  return request({
    url: '/wms/BusWarehouse',
    method: 'post',
    data: data
  })
}

// 修改仓库信息主表
export function updateBusWarehouse(data) {
  return request({
    url: '/wms/BusWarehouse',
    method: 'put',
    data: data
  })
}

// 删除仓库信息主表
export function delBusWarehouse(id) {
  return request({
    url: '/wms/BusWarehouse/' + id,
    method: 'delete'
  })
}

// 父级目录树状下拉
export function listBusFileTreeFas(query) {
  return request({
    url: '/wms/BusWarehouse/getParentList',
    method: 'get',
    params: query
  })
}

// 父级仓库树状下拉
export function listBusWarehouseTreeFa(query) {
  return request({
    url: '/wms/BusWarehouse/tree',
    method: 'get',
    params: query
  })
}

// 父级仓库树状下拉
export function listBusLocationTreeFa(query) {
  return request({
    url: '/wms/BusWarehouse/locationTree',
    method: 'get',
    params: query
  })
}

// 查询仓库信息主表详细
export function getBusWarehouseLocation(id) {
  return request({
    url: '/wms/BusWarehouseLocation/' + id,
    method: 'get'
  })
}

// 查询仓库下拉信息主表列表
export function listWarehouseList(query) {
  return request({
    url: '/wms/BusWarehouse/getWarehouseList',
    method: 'get',
    params: query
  })
}