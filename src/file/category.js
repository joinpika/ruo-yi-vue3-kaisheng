import request from '@/utils/request'

// 查询文件类别列表
export function listCategory(query) {
  return request({
    url: '/bus/category/list',
    method: 'get',
    params: query
  })
}

// 查询文件类别详细
export function getCategory(categoryId) {
  return request({
    url: '/bus/category/' + categoryId,
    method: 'get'
  })
}

// 新增文件类别
export function addCategory(data) {
  return request({
    url: '/bus/category',
    method: 'post',
    data: data
  })
}

// 修改文件类别
export function updateCategory(data) {
  return request({
    url: '/bus/category',
    method: 'put',
    data: data
  })
}

// 删除文件类别
export function delCategory(categoryId) {
  return request({
    url: '/bus/category/' + categoryId,
    method: 'delete'
  })
}
