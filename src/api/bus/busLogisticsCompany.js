import request from '@/utils/request'

// 查询物流公司基本信息列表
export function listBusLogisticsCompany(query) {
  return request({
    url: '/bus/busLogisticsCompany/list',
    method: 'get',
    params: query
  })
}

// 查询物流公司基本信息详细
export function getBusLogisticsCompany(id) {
  return request({
    url: '/bus/busLogisticsCompany/' + id,
    method: 'get'
  })
}

// 新增物流公司基本信息
export function addBusLogisticsCompany(data) {
  return request({
    url: '/bus/busLogisticsCompany',
    method: 'post',
    data: data
  })
}

// 修改物流公司基本信息
export function updateBusLogisticsCompany(data) {
  return request({
    url: '/bus/busLogisticsCompany',
    method: 'put',
    data: data
  })
}

// 删除物流公司基本信息
export function delBusLogisticsCompany(id) {
  return request({
    url: '/bus/busLogisticsCompany/' + id,
    method: 'delete'
  })
}

// 发起物流运费结算审批
export function approvalFeeSettle(data, logisticsFeeSettleId) {
  return request({
    url: '/processer/logisticsFeeSettle/' + logisticsFeeSettleId,
    method: 'post',
    data: data
  })
}
