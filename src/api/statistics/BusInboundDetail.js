import request from '@/utils/request'

// 查询入库单明细（数字编码分类）列表
export function listBusInboundDetail(query) {
  return request({
    url: '/wms/BusInboundDetail/list',
    method: 'get',
    params: query
  })
}

// 查询入库单明细（数字编码分类）详细
export function getBusInboundDetail(id) {
  return request({
    url: '/wms/BusInboundDetail/' + id,
    method: 'get'
  })
}

// 新增入库单明细（数字编码分类）
export function addBusInboundDetail(data) {
  return request({
    url: '/wms/BusInboundDetail',
    method: 'post',
    data: data
  })
}

// 修改入库单明细（数字编码分类）
export function updateBusInboundDetail(data) {
  return request({
    url: '/wms/BusInboundDetail',
    method: 'put',
    data: data
  })
}

// 删除入库单明细（数字编码分类）
export function delBusInboundDetail(id) {
  return request({
    url: '/wms/BusInboundDetail/' + id,
    method: 'delete'
  })
}
