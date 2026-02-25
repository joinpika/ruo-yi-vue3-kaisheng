import request from '@/utils/request'

// 查询退货明细列表
export function listSalesReturnDetail(query) {
  return request({
    url: '/bus/salesReturnDetail/list',
    method: 'get',
    params: query
  })
}

// 查询退货明细详细
export function getSalesReturnDetail(id) {
  return request({
    url: '/bus/salesReturnDetail/' + id,
    method: 'get'
  })
}

// 新增退货明细
export function addSalesReturnDetail(data) {
  return request({
    url: '/bus/salesReturnDetail',
    method: 'post',
    data: data
  })
}

// 修改退货明细
export function updateSalesReturnDetail(data) {
  return request({
    url: '/bus/salesReturnDetail',
    method: 'put',
    data: data
  })
}

// 删除退货明细
export function delSalesReturnDetail(id) {
  return request({
    url: '/bus/salesReturnDetail/' + id,
    method: 'delete'
  })
}
