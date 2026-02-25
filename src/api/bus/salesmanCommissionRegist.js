import request from '@/utils/request'

// 查询业务员提成登记单主列表
export function listSalesmanCommissionRegist(query) {
  return request({
    url: '/bus/salesmanCommissionRegist/list',
    method: 'get',
    params: query
  })
}

// 查询业务员提成登记单主详细
export function getSalesmanCommissionRegist(id) {
  return request({
    url: '/bus/salesmanCommissionRegist/' + id,
    method: 'get'
  })
}

// 新增业务员提成登记单主
export function addSalesmanCommissionRegist(data) {
  return request({
    url: '/bus/salesmanCommissionRegist',
    method: 'post',
    data: data
  })
}

// 修改业务员提成登记单主
export function updateSalesmanCommissionRegist(data) {
  return request({
    url: '/bus/salesmanCommissionRegist',
    method: 'put',
    data: data
  })
}

// 删除业务员提成登记单主
export function delSalesmanCommissionRegist(id) {
  return request({
    url: '/bus/salesmanCommissionRegist/' + id,
    method: 'delete'
  })
}
