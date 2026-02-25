import request from '@/utils/request'

// 查询提货明细列表
export function listSalesPickupDetail(query) {
  return request({
    url: '/bus/salesPickupDetail/list',
    method: 'get',
    params: query
  })
}

// 查询提货明细详细
export function getSalesPickupDetail(id) {
  return request({
    url: '/bus/salesPickupDetail/' + id,
    method: 'get'
  })
}

// 新增提货明细
export function addSalesPickupDetail(data) {
  return request({
    url: '/bus/salesPickupDetail',
    method: 'post',
    data: data
  })
}

// 修改提货明细
export function updateSalesPickupDetail(data) {
  return request({
    url: '/bus/salesPickupDetail',
    method: 'put',
    data: data
  })
}

// 删除提货明细
export function delSalesPickupDetail(id) {
  return request({
    url: '/bus/salesPickupDetail/' + id,
    method: 'delete'
  })
}
