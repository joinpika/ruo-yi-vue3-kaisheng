import request from '@/utils/request'

// 查询库存调拨明细列表
export function listDetailList(query) {
  return request({
    url: '/bus/transferDetail/list',
    method: 'get',
    params: query
  })
}

// 查询库存调拨明细详细
export function getDetail(id) {
  return request({
    url: '/bus/transferDetail/' + id,
    method: 'get'
  })
}

// 新增库存调拨明细
export function addDetail(data) {
  return request({
    url: '/bus/transferDetail',
    method: 'post',
    data: data
  })
}

// 修改库存调拨明细
export function updateDetail(data) {
  return request({
    url: '/bus/transferDetail',
    method: 'put',
    data: data
  })
}

// 删除库存调拨明细
export function delDetail(id) {
  return request({
    url: '/bus/transferDetail/' + id,
    method: 'delete'
  })
}
