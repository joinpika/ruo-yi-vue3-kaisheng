import request from '@/utils/request'

// 查询销售加价列表
export function listSalesMarkup(query) {
  return request({
    url: '/bus/salesMarkup/list',
    method: 'get',
    params: query
  })
}

// 查询销售加价详细
export function getSalesMarkup(id) {
  return request({
    url: '/bus/salesMarkup/' + id,
    method: 'get'
  })
}

// 新增销售加价
export function addSalesMarkup(data) {
  return request({
    url: '/bus/salesMarkup',
    method: 'post',
    data: data
  })
}

// 修改销售加价
export function updateSalesMarkup(data) {
  return request({
    url: '/bus/salesMarkup',
    method: 'put',
    data: data
  })
}

// 删除销售加价
export function delSalesMarkup(id) {
  return request({
    url: '/bus/salesMarkup/' + id,
    method: 'delete'
  })
}

// 导入
export function importSalesMarkup(data) {
  return request({
    url: '/bus/salesMarkup/import',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
  })
}
