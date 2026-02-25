import request from '@/utils/request'

// 查询采购申请主列表
export function listPurchase(query) {
  return request({
    url: '/bus/purchase/list',
    method: 'get',
    params: query
  })
}

// 查询采购申请主详细
export function getPurchase(id) {
  return request({
    url: '/bus/purchase/' + id,
    method: 'get'
  })
}

// 新增采购申请主
export function addPurchase(data) {
  return request({
    url: '/bus/purchase',
    method: 'post',
    data: data
  })
}

// 修改采购申请主
export function updatePurchase(data) {
  return request({
    url: '/bus/purchase',
    method: 'put',
    data: data
  })
}

// 删除采购申请主
export function delPurchase(id) {
  return request({
    url: '/bus/purchase/' + id,
    method: 'delete'
  })
}

// 销售转采购
export function saleChangePurchase(data) {
  return request({
    url: '/bus/purchase/add',
    method: 'post',
    data: data
  })
}
