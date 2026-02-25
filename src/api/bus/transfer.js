import request from '@/utils/request'

// 查询库存调拨主表列表
export function listTransfer(query) {
  return request({
    url: '/bus/transfer/list',
    method: 'get',
    params: query
  })
}

// 查询库存调拨主表详细
export function getTransfer(id) {
  return request({
    url: '/bus/transfer/' + id,
    method: 'get'
  })
}

// 新增库存调拨主表
export function addTransfer(data) {
  return request({
    url: '/bus/transfer',
    method: 'post',
    data: data
  })
}

// 修改库存调拨主表
export function updateTransfer(data) {
  return request({
    url: '/bus/transfer',
    method: 'put',
    data: data
  })
}

// 删除库存调拨主表
export function delTransfer(id) {
  return request({
    url: '/bus/transfer/' + id,
    method: 'delete'
  })
}
