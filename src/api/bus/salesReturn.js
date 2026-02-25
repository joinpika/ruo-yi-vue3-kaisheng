import request from '@/utils/request'

// 查询退货单主列表
export function listSalesReturn(query) {
  return request({
    url: '/bus/salesReturn/list',
    method: 'get',
    params: query
  })
}

// 查询退货单主详细
export function getSalesReturn(id) {
  return request({
    url: '/bus/salesReturn/' + id,
    method: 'get'
  })
}

// 新增退货单主
export function addSalesReturn(data) {
  return request({
    url: '/bus/salesReturn',
    method: 'post',
    data: data
  })
}

// 修改退货单主
export function updateSalesReturn(data) {
  return request({
    url: '/bus/salesReturn',
    method: 'put',
    data: data
  })
}

// 删除退货单主
export function delSalesReturn(id) {
  return request({
    url: '/bus/salesReturn/' + id,
    method: 'delete'
  })
}

// 退货统计
export function getSalesReturnSum(query) {
  return request({
    url: '/bus/salesReturn/sum',
    method: 'get',
    params: query
  })
}


// 发起审批
export function approvalSalesReturn(returnId) {
  return request({
    url: '/processer/salesReturn/' + returnId,
    method: 'get',
  })
}

