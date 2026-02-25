import request from '@/utils/request'

// 查询业务员提成登记明细列表
export function listSalesmanCommissionRegistDetail(query) {
  return request({
    url: '/bus/salesmanCommissionRegistDetail/list',
    method: 'get',
    params: query
  })
}

// 查询业务员提成登记明细详细
export function getSalesmanCommissionRegistDetail(id) {
  return request({
    url: '/bus/salesmanCommissionRegistDetail/' + id,
    method: 'get'
  })
}

// 新增业务员提成登记明细
export function addSalesmanCommissionRegistDetail(data) {
  return request({
    url: '/bus/salesmanCommissionRegistDetail',
    method: 'post',
    data: data
  })
}

// 修改业务员提成登记明细
export function updateSalesmanCommissionRegistDetail(data) {
  return request({
    url: '/bus/salesmanCommissionRegistDetail',
    method: 'put',
    data: data
  })
}

// 删除业务员提成登记明细
export function delSalesmanCommissionRegistDetail(id) {
  return request({
    url: '/bus/salesmanCommissionRegistDetail/' + id,
    method: 'delete'
  })
}


// 业务员提成登记明细
export function salesmanRegistDetail(query) {
  return request({
    url: '/bus/salesmanCommissionRegistDetail/list',
    method: 'get',
    params: query
  })
}