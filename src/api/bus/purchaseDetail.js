import request from '@/utils/request'

// 查询采购申请明细列表
export function listPurchaseDetail(query) {
  return request({
    url: '/bus/purchaseDetail/list',
    method: 'get',
    params: query
  })
}

// 查询采购申请明细详细
export function getPurchaseDetail(id) {
  return request({
    url: '/bus/purchaseDetail/' + id,
    method: 'get'
  })
}

// 新增采购申请明细
export function addPurchaseDetail(data) {
  return request({
    url: '/bus/purchaseDetail',
    method: 'post',
    data: data
  })
}

// 修改采购申请明细
export function updatePurchaseDetail(data) {
  return request({
    url: '/bus/purchaseDetail',
    method: 'put',
    data: data
  })
}

// 删除采购申请明细
export function delPurchaseDetail(id) {
  return request({
    url: '/bus/purchaseDetail/' + id,
    method: 'delete'
  })
}

// 查询采购申请单明细列表
export function getPurchaseDetailEcho(id) {
  return request({
    url: '/bus/purchaseDetail/echo/' + id,
    method: 'get'
  })
}

// 待采明细导出
export function getPurchaseDetailExport(id) {
  return request({
    url: '/bus/purchaseDetail/export/detail/' + id,
    method: 'post',
    responseType: 'blob'
  })
}
