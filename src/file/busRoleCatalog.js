import request from '@/utils/request'

// 查询角色-目录关联列表
export function listBusRoleCatalog(query) {
  return request({
    url: '/bus/busRoleCatalog/list',
    method: 'get',
    params: query
  })
}

// 查询角色-目录关联详细
export function getBusRoleCatalog(id) {
  return request({
    url: '/bus/busRoleCatalog/' + id,
    method: 'get'
  })
}

// 新增角色-目录关联
export function addBusRoleCatalog(data) {
  return request({
    url: '/bus/busRoleCatalog',
    method: 'post',
    data: data
  })
}

// 修改角色-目录关联
export function updateBusRoleCatalog(data) {
  return request({
    url: '/bus/busRoleCatalog',
    method: 'put',
    data: data
  })
}

// 删除角色-目录关联
export function delBusRoleCatalog(id) {
  return request({
    url: '/bus/busRoleCatalog/' + id,
    method: 'delete'
  })
}
