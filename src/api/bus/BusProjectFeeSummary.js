import request from '@/utils/request'

// 查询项目费用月度汇总列表
export function listBusProjectFeeSummary(query) {
  return request({
    url: '/bus/BusProjectFeeSummary/list',
    method: 'get',
    params: query
  })
}

// 查询项目费用月度汇总详细
export function getBusProjectFeeSummary(id) {
  return request({
    url: '/bus/BusProjectFeeSummary/' + id,
    method: 'get'
  })
}

// 新增项目费用月度汇总
export function addBusProjectFeeSummary(data) {
  return request({
    url: '/bus/BusProjectFeeSummary',
    method: 'post',
    data: data
  })
}

// 修改项目费用月度汇总
export function updateBusProjectFeeSummary(data) {
  return request({
    url: '/bus/BusProjectFeeSummary',
    method: 'put',
    data: data
  })
}

// 删除项目费用月度汇总
export function delBusProjectFeeSummary(id) {
  return request({
    url: '/bus/BusProjectFeeSummary/' + id,
    method: 'delete'
  })
}

// 重新生成
export function resetBusProjectFeeSummary(id) {
  return request({
    url: '/bus/BusProjectFeeSummary/reset/' + id,
    method: 'put',
  })
}
