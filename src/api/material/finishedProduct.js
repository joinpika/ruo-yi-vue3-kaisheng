import request from '@/utils/request'

// 查询成品列表
export function finishedProductList(query) {
  return request({
    url: '/wms/busFinishedProduct/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addPost(data) {
  return request({
    url: '/wms/busFinishedProduct',
    method: 'post',
    data: data
  })
}

// 修改
export function updatePost(data) {
  return request({
    url: '/wms/busFinishedProduct',
    method: 'put',
    data: data
  })
}

// 删除
export function delPost(ids) {
  return request({
    url: '/wms/busFinishedProduct/' + ids,
    method: 'delete'
  })
}

// 获取详细信息
export function detailList(id) {
  return request({
    url: '/wms/busFinishedProduct/' + id,
    method: 'get'
  })
}


