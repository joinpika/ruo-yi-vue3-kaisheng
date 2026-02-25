import request from '@/utils/request'

// 查询仓库库位信息列表
export function listBusWarehouseLocation(query) {
  return request({
    url: '/wms/BusWarehouseLocation/list',
    method: 'get',
    params: query
  })
}

// 查询仓库库位信息详细
export function getBusWarehouseLocation(id) {
  return request({
    url: '/wms/BusWarehouseLocation/' + id,
    method: 'get'
  })
}

// 新增仓库库位信息
export function addBusWarehouseLocation(data) {
  return request({
    url: '/wms/BusWarehouseLocation',
    method: 'post',
    data: data
  })
}

// 修改仓库库位信息
export function updateBusWarehouseLocation(data) {
  return request({
    url: '/wms/BusWarehouseLocation',
    method: 'put',
    data: data
  })
}

// 删除仓库库位信息
export function delBusWarehouseLocation(id) {
  return request({
    url: '/wms/BusWarehouseLocation/' + id,
    method: 'delete'
  })
}


// 查询仓库下拉库位信息列表
export function listGetLocationList(query) {
  return request({
    url: '/wms/BusWarehouseLocation/getLocationList',
    method: 'get',
    params: query
  })
}