import request from '@/utils/request'

// 查询提货单主列表
export function listSalesPickup(query) {
  return request({
    url: '/bus/salesPickup/list',
    method: 'get',
    params: query
  })
}

// 查询提货单主详细
export function getSalesPickup(id) {
  return request({
    url: '/bus/salesPickup/' + id,
    method: 'get'
  })
}

// 新增提货单主
export function addSalesPickup(data) {
  return request({
    url: '/bus/salesPickup',
    method: 'post',
    data: data
  })
}

// 修改提货单主
export function updateSalesPickup(data) {
  return request({
    url: '/bus/salesPickup',
    method: 'put',
    data: data
  })
}

// 删除提货单主
export function delSalesPickup(id) {
  return request({
    url: '/bus/salesPickup/' + id,
    method: 'delete'
  })
}
