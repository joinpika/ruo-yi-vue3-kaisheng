import request from '@/utils/request'

// 查询文件操作日志列表
export function listBusFileLog(query) {
  return request({
    url: '/bus/busFileLog/list',
    method: 'get',
    params: query
  })
}

// 查询文件操作日志详细
export function getBusFileLog(logId) {
  return request({
    url: '/bus/busFileLog/' + logId,
    method: 'get'
  })
}

// 新增文件操作日志
export function addBusFileLog(data) {
  return request({
    url: '/bus/busFileLog',
    method: 'post',
    data: data
  })
}

// 修改文件操作日志
export function updateBusFileLog(data) {
  return request({
    url: '/bus/busFileLog',
    method: 'put',
    data: data
  })
}

// 删除文件操作日志
export function delBusFileLog(logId) {
  return request({
    url: '/bus/busFileLog/' + logId,
    method: 'delete'
  })
}
