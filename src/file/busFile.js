import request from '@/utils/request'

// 查询文件列表
export function listBusFile(query) {
  return request({
    url: '/bus/busFile/list',
    method: 'get',
    params: query
  })
}

// 查询文件详细
export function getBusFile(fileId) {
  return request({
    url: '/bus/busFile/' + fileId,
    method: 'get'
  })
}

// 新增文件
export function addBusFile(data) {
  return request({
    url: '/bus/busFile',
    method: 'post',
    data: data
  })
}

// 修改文件
export function updateBusFile(data) {
  return request({
    url: '/bus/busFile',
    method: 'put',
    data: data
  })
}

// 删除文件
export function delBusFile(fileId) {
  return request({
    url: '/bus/busFile/' + fileId,
    method: 'delete'
  })
}

// 恢复
export function recoverBusFile(fileId) {
  return request({
    url: '/bus/busFile/down/' + fileId,
    method: 'put'
  })
}

// 批量下载文件附件
export function getBusFileDownload(query) {
  return request({
    url: '/bus/busFile/download/batch',
    method: 'post',
    data: query,
    responseType: 'blob'
  })
}