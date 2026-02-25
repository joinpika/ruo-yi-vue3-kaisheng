import request from '@/utils/request'

// 查询原材料列表
export function rawList(query) {
  return request({
    url: '/wms/busRawMaterial/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addPost(data) {
  return request({
    url: '/wms/busRawMaterial',
    method: 'post',
    data: data
  })
}

// 修改
export function updatePost(data) {
  return request({
    url: '/wms/busRawMaterial',
    method: 'put',
    data: data
  })
}

// 删除
export function delPost(ids) {
  return request({
    url: '/wms/busRawMaterial/' + ids,
    method: 'delete'
  })
}

// 获取原材料（原片）详细信息
export function detailList(id) {
  return request({
    url: '/wms/busRawMaterial/' + id,
    method: 'get'
  })
}

// 查询厂商列表
export function listPost(query) {
  return request({
    url: '/wms/BusFactory/list',
    method: 'get',
    params: query
  })
}

//厂商新增
export function addFactoryPost(data) {
  return request({
    url: '/wms/BusFactory',
    method: 'post',
    data: data
  })
}

// 修改厂商
export function updateFactoryPost(data) {
  return request({
    url: '/wms/BusFactory',
    method: 'put',
    data: data
  })
}

// 获取厂商详细信息
export function detailFactoryList(id) {
  return request({
    url: '/wms/BusFactory/' + id,
    method: 'get'
  })
}

// 删除厂商
export function delFactoryPost(ids) {
  return request({
    url: '/wms/BusFactory/' + ids,
    method: 'delete'
  })
}
