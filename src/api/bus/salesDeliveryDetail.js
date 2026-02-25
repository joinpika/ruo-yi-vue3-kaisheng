import request from '@/utils/request'

// 查询销售发货明细列表
export function listSalesDeliveryDetail(query) {
  return request({
    url: '/bus/salesDeliveryDetail/list',
    method: 'get',
    params: query
  })
}

// 查询销售发货明细详细
export function getSalesDeliveryDetail(id) {
  return request({
    url: '/bus/salesDeliveryDetail/' + id,
    method: 'get'
  })
}

// 新增销售发货明细
export function addSalesDeliveryDetail(data) {
  return request({
    url: '/bus/salesDeliveryDetail',
    method: 'post',
    data: data
  })
}

// 修改销售发货明细
export function updateSalesDeliveryDetail(data) {
  return request({
    url: '/bus/salesDeliveryDetail',
    method: 'put',
    data: data
  })
}

// 删除销售发货明细
export function delSalesDeliveryDetail(id) {
  return request({
    url: '/bus/salesDeliveryDetail/' + id,
    method: 'delete'
  })
}

// 发货库明细导出
export function getSalesDeliveryDetailExport(query) {
  return request({
    url: '/bus/salesDeliveryDetail/export',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}
