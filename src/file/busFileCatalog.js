import request from '@/utils/request'

// 查询文件三级目录列表
export function listBusFileCatalog(query) {
  return request({
    url: '/bus/busFileCatalog/tree',
    method: 'get',
    params: query
  })
}

// 查询文件三级目录详细
export function getBusFileCatalog(id) {
  return request({
    url: '/bus/busFileCatalog/' + id,
    method: 'get'
  })
}

// 新增文件三级目录
export function addBusFileCatalog(data) {
  return request({
    url: '/bus/busFileCatalog',
    method: 'post',
    data: data
  })
}

// 修改文件三级目录
export function updateBusFileCatalog(data) {
  return request({
    url: '/bus/busFileCatalog',
    method: 'put',
    data: data
  })
}

// 删除文件三级目录
export function delBusFileCatalog(id) {
  return request({
    url: '/bus/busFileCatalog/' + id,
    method: 'delete'
  })
}

// 父级目录树状下拉
export function listBusFileTreeFa(query) {
  return request({
    url: '/bus/busFileCatalog/treeFa',
    method: 'get',
    params: query
  })
}