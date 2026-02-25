import request from '@/utils/request'

// 查询库存快照--记录每次出入库后，当前库存列表
export function listWarehouseSnapshot(query) {
  return request({
    url: '/bus/BusWarehouseSnapshot/list',
    method: 'get',
    params: query
  })
}

// 查询库存快照--记录每次出入库后，当前库存详细
export function getWarehouseSnapshot(id) {
  return request({
    url: '/bus/warehouseSnapshot/' + id,
    method: 'get'
  })
}

// 新增库存快照--记录每次出入库后，当前库存
export function addWarehouseSnapshot(data) {
  return request({
    url: '/bus/warehouseSnapshot',
    method: 'post',
    data: data
  })
}

// 修改库存快照--记录每次出入库后，当前库存
export function updateWarehouseSnapshot(data) {
  return request({
    url: '/bus/warehouseSnapshot',
    method: 'put',
    data: data
  })
}

// 删除库存快照--记录每次出入库后，当前库存
export function delWarehouseSnapshot(id) {
  return request({
    url: '/bus/warehouseSnapshot/' + id,
    method: 'delete'
  })
}

// 自有库存导出
export function getBusWarehouseSnapshotExport(query) {
  return request({
    url: '/bus/BusWarehouseSnapshot/export',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}

// 自有库存统计接口
export function listWarehouseStatistics(query) {
  return request({
    url: '/bus/BusWarehouseSnapshot/statistics',
    method: 'get',
    params: query
  })
}

// 导入
export function importBusWarehouseSnapshot(data) {
  return request({
    url: '/bus/BusWarehouseSnapshot/import',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
  })
}
