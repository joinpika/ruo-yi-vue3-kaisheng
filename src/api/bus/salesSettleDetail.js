import request from '@/utils/request'

// 查询结算明细列表
export function listSalesSettleDetail(query) {
  return request({
    url: '/bus/salesSettleDetail/list',
    method: 'get',
    params: query
  })
}

// 根据结算单id 查询结算明细列表
export function listDetailBySettleId(query) {
  return request({
    url: '/bus/salesSettleDetail/listBySettle',
    method: 'get',
    params: query
  })
}

// 查询结算明细详细
export function getSalesSettleDetail(id) {
  return request({
    url: '/bus/salesSettleDetail/' + id,
    method: 'get'
  })
}

// 新增结算明细
export function addSalesSettleDetail(data) {
  return request({
    url: '/bus/salesSettleDetail',
    method: 'post',
    data: data
  })
}

// 修改结算明细
export function updateSalesSettleDetail(data) {
  return request({
    url: '/bus/salesSettleDetail',
    method: 'put',
    data: data
  })
}

// 删除结算明细
export function delSalesSettleDetail(id) {
  return request({
    url: '/bus/salesSettleDetail/' + id,
    method: 'delete'
  })
}
