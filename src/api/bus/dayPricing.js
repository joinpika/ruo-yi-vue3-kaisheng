import request from '@/utils/request'

// 查询每日销售定价列表
export function listDayPricing(query) {
  return request({
    url: '/bus/dayPricing/list',
    method: 'get',
    params: query
  })
}

// 查询每日销售定价详细
export function getDayPricing(id) {
  return request({
    url: '/bus/dayPricing/' + id,
    method: 'get'
  })
}

// 新增每日销售定价
export function addDayPricing(data) {
  return request({
    url: '/bus/dayPricing',
    method: 'post',
    data: data
  })
}

// 修改每日销售定价
export function updateDayPricing(data) {
  return request({
    url: '/bus/dayPricing',
    method: 'put',
    data: data
  })
}

// 删除每日销售定价
export function delDayPricing(id) {
  return request({
    url: '/bus/dayPricing/' + id,
    method: 'delete'
  })
}

// 获取采购收货查询条件
export function listReceiveRegion() {
  return request({
    url: '/bus/dayPricing/receiveRegionList',
    method: 'get'
  })
}
