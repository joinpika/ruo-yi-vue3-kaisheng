import request from '@/utils/request'

// 查询采购加价列表
export function listSteelMillMarkup(query) {
  return request({
    url: '/bus/steelMillMarkup/list',
    method: 'get',
    params: query
  })
}

// 查询采购加价详细
export function getSteelMillMarkup(id) {
  return request({
    url: '/bus/steelMillMarkup/' + id,
    method: 'get'
  })
}

// 新增采购加价
export function addSteelMillMarkup(data) {
  return request({
    url: '/bus/steelMillMarkup',
    method: 'post',
    data: data
  })
}

// 修改采购加价
export function updateSteelMillMarkup(data) {
  return request({
    url: '/bus/steelMillMarkup',
    method: 'put',
    data: data
  })
}

// 删除采购加价
export function delSteelMillMarkup(id) {
  return request({
    url: '/bus/steelMillMarkup/' + id,
    method: 'delete'
  })
}

// 根据三要素查询加价表
export function getMarkup(query) {
  return request({
    url: '/bus/steelMillMarkup/getMarkup',
    method: 'get',
    params: query
  })
}

// 导入
export function importSteelMillMarkup(data) {
  return request({
    url: '/bus/steelMillMarkup/import',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
  })
}
