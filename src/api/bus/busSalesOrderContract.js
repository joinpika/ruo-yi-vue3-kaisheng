import request from '@/utils/request'

// 查询销售合同列表
export function listBusSalesOrderContract(query) {
  return request({
    url: '/bus/busSalesOrderContract/list',
    method: 'get',
    params: query
  })
}

// 查询销售合同详细
export function getBusSalesOrderContract(id) {
  return request({
    url: '/bus/busSalesOrderContract/' + id,
    method: 'get'
  })
}

// 新增销售合同
export function addBusSalesOrderContract(data) {
  return request({
    url: '/bus/busSalesOrderContract',
    method: 'post',
    data: data
  })
}

// 修改销售合同
export function updateBusSalesOrderContract(data) {
  return request({
    url: '/bus/busSalesOrderContract',
    method: 'put',
    data: data
  })
}

// 删除销售合同
export function delBusSalesOrderContract(id) {
  return request({
    url: '/bus/busSalesOrderContract/' + id,
    method: 'delete'
  })
}
