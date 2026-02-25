import request from '@/utils/request'

// 查询发货提货模板列表
export function listShippingTemplate(query) {
  return request({
    url: '/bus/shippingTemplate/list',
    method: 'get',
    params: query
  })
}

// 查询发货提货模板详细
export function getShippingTemplate(id) {
  return request({
    url: '/bus/shippingTemplate/' + id,
    method: 'get'
  })
}

// 新增发货提货模板
export function addShippingTemplate(data) {
  return request({
    url: '/bus/shippingTemplate',
    method: 'post',
    data: data
  })
}

// 修改发货提货模板
export function updateShippingTemplate(data) {
  return request({
    url: '/bus/shippingTemplate',
    method: 'put',
    data: data
  })
}

// 删除发货提货模板
export function delShippingTemplate(id) {
  return request({
    url: '/bus/shippingTemplate/' + id,
    method: 'delete'
  })
}
