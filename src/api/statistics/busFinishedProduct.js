import request from '@/utils/request'

// 查询成品通用信息（前挡/后挡/边窗/天幕）列表
export function listBusFinishedProduct(query) {
  return request({
    url: '/wms/busFinishedProduct/list',
    method: 'get',
    params: query
  })
}

// 查询成品通用信息（前挡/后挡/边窗/天幕）详细
export function getBusFinishedProduct(id) {
  return request({
    url: '/wms/busFinishedProduct/' + id,
    method: 'get'
  })
}

// 新增成品通用信息（前挡/后挡/边窗/天幕）
export function addBusFinishedProduct(data) {
  return request({
    url: '/wms/busFinishedProduct',
    method: 'post',
    data: data
  })
}

// 修改成品通用信息（前挡/后挡/边窗/天幕）
export function updateBusFinishedProduct(data) {
  return request({
    url: '/wms/busFinishedProduct',
    method: 'put',
    data: data
  })
}

// 删除成品通用信息（前挡/后挡/边窗/天幕）
export function delBusFinishedProduct(id) {
  return request({
    url: '/wms/busFinishedProduct/' + id,
    method: 'delete'
  })
}


// 根据分类查询对应产品列表
export function listSelectByCategory(query) {
  return request({
    url: '/wms/busFinishedProduct/selectByCategory',
    method: 'get',
    params: query
  })
}