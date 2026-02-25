import request from '@/utils/request'

// 查询业务员滞纳金明细列表
export function listSalesmanLateFeeDetail(query) {
  return request({
    url: '/bus/salesmanLateFeeDetail/list',
    method: 'get',
    params: query
  })
}

// 查询业务员滞纳金明细详细
export function getSalesmanLateFeeDetail(id) {
  return request({
    url: '/bus/salesmanLateFeeDetail/' + id,
    method: 'get'
  })
}

// 新增业务员滞纳金明细
export function addSalesmanLateFeeDetail(data) {
  return request({
    url: '/bus/salesmanLateFeeDetail',
    method: 'post',
    data: data
  })
}

// 修改业务员滞纳金明细
export function updateSalesmanLateFeeDetail(data) {
  return request({
    url: '/bus/salesmanLateFeeDetail',
    method: 'put',
    data: data
  })
}

// 删除业务员滞纳金明细
export function delSalesmanLateFeeDetail(id) {
  return request({
    url: '/bus/salesmanLateFeeDetail/' + id,
    method: 'delete'
  })
}
