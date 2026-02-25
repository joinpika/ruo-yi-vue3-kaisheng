import request from '@/utils/request'

// 查询辅料列表
export function auxiliaryList(query) {
  return request({
    url: '/wms/busAuxiliaryMaterial/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addPost(data) {
  return request({
    url: '/wms/busAuxiliaryMaterial',
    method: 'post',
    data: data
  })
}

// 修改
export function updatePost(data) {
  return request({
    url: '/wms/busAuxiliaryMaterial',
    method: 'put',
    data: data
  })
}

// 删除
export function delPost(ids) {
  return request({
    url: 'wms/busAuxiliaryMaterial/' + ids,
    method: 'delete'
  })
}

// 获取辅料详细信息
export function detailList(id) {
  return request({
    url: '/wms/busAuxiliaryMaterial/' + id,
    method: 'get'
  })
}


