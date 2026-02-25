import request from '@/utils/request'

// 查询物流运费规则列表
export function listLogisticsFreightRule(query) {
  return request({
    url: '/bus/logisticsFreightRule/list',
    method: 'get',
    params: query
  })
}

// 查询物流运费规则详细
export function getLogisticsFreightRule(id) {
  return request({
    url: '/bus/logisticsFreightRule/' + id,
    method: 'get'
  })
}

// 新增物流运费规则
export function addLogisticsFreightRule(data) {
  return request({
    url: '/bus/logisticsFreightRule',
    method: 'post',
    data: data
  })
}

// 修改物流运费规则
export function updateLogisticsFreightRule(data) {
  return request({
    url: '/bus/logisticsFreightRule',
    method: 'put',
    data: data
  })
}

// 删除物流运费规则
export function delLogisticsFreightRule(id) {
  return request({
    url: '/bus/logisticsFreightRule/' + id,
    method: 'delete'
  })
}

// 导入
export function importLogisticsFreightRule(data) {
  return request({
    url: '/bus/logisticsFreightRule/import',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
  })
}

// 根据完整目的地地址求平均运费单价
export function listLogistics(query) {
  return request({
    url: '/bus/logisticsFreightRule/getLogisticsFreightRule',
    method: 'get',
    params: query
  })
}
