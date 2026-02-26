import request from '@/utils/request'

// 查询文件等级列表
export function listBusFileLevel(query) {
  return request({
    url: '/bus/BusFileLevel/list',
    method: 'get',
    params: query
  })
}

// 查询文件等级详细
export function getBusFileLevel(levelId) {
  return request({
    url: '/bus/BusFileLevel/' + levelId,
    method: 'get'
  })
}

// 新增文件等级
export function addBusFileLevel(data) {
  return request({
    url: '/bus/BusFileLevel',
    method: 'post',
    data: data
  })
}

// 修改文件等级
export function updateBusFileLevel(data) {
  return request({
    url: '/bus/BusFileLevel',
    method: 'put',
    data: data
  })
}

// 删除文件等级
export function delBusFileLevel(levelId) {
  return request({
    url: '/bus/BusFileLevel/' + levelId,
    method: 'delete'
  })
}
