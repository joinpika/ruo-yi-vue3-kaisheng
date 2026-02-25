import request from '@/utils/request'

// 查询角色-文件等级关联列表
export function listBusRoleFileLevel(query) {
  return request({
    url: '/bus/busRoleFileLevel/list',
    method: 'get',
    params: query
  })
}

// 查询角色-文件等级关联详细
export function getBusRoleFileLevel(id) {
  return request({
    url: '/bus/busRoleFileLevel/' + id,
    method: 'get'
  })
}

// 新增角色-文件等级关联
export function addBusRoleFileLevel(data) {
  return request({
    url: '/bus/busRoleFileLevel',
    method: 'post',
    data: data
  })
}

// 修改角色-文件等级关联
export function updateBusRoleFileLevel(data) {
  return request({
    url: '/bus/busRoleFileLevel',
    method: 'put',
    data: data
  })
}

// 删除角色-文件等级关联
export function delBusRoleFileLevel(id) {
  return request({
    url: '/bus/busRoleFileLevel/' + id,
    method: 'delete'
  })
}
