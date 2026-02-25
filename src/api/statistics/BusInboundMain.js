import request from '@/utils/request'

// 查询入库单主（数字编码分类）列表
export function listBusInboundMain(query) {
  return request({
    url: '/wms/BusInboundMain/list',
    method: 'get',
    params: query
  })
}

// 查询入库单主（数字编码分类）详细
export function getBusInboundMain(id) {
  return request({
    url: '/wms/BusInboundMain/' + id,
    method: 'get'
  })
}

// 新增入库单主（数字编码分类）
export function addBusInboundMain(data) {
  return request({
    url: '/wms/BusInboundMain',
    method: 'post',
    data: data
  })
}

// 新增入库单主（数字编码分类）
export function addBusInboundMainadd(data) {
  return request({
    url: '/wms/BusInboundMain/add',
    method: 'post',
    data: data
  })
}

// 修改入库单主（数字编码分类）
export function updateBusInboundMain(data) {
  return request({
    url: '/wms/BusInboundMain',
    method: 'put',
    data: data
  })
}

// 删除入库单主（数字编码分类）
export function delBusInboundMain(id) {
  return request({
    url: '/wms/BusInboundMain/' + id,
    method: 'delete'
  })
}

// 产品明细导出
export function getBusInboundMainExport(query) {
  return request({
    url: '/wms/BusInboundMain/export',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}