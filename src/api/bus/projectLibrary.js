import request from '@/utils/request'

// 查询项目库列表
export function listProjectLibrary(query) {
  return request({
    url: '/bus/projectLibrary/list',
    method: 'get',
    params: query
  })
}

// 查询项目库详细
export function getProjectLibrary(id) {
  return request({
    url: '/bus/projectLibrary/' + id,
    method: 'get'
  })
}

// 新增项目库
export function addProjectLibrary(data) {
  return request({
    url: '/bus/projectLibrary',
    method: 'post',
    data: data
  })
}

// 修改项目库
export function updateProjectLibrary(data) {
  return request({
    url: '/bus/projectLibrary',
    method: 'put',
    data: data
  })
}

// 删除项目库
export function delProjectLibrary(id) {
  return request({
    url: '/bus/projectLibrary/' + id,
    method: 'delete'
  })
}

// 销售退款审批
export function approvalDiscount(data, refundId) {
  return request({
    url: '/processer/refund/' + refundId,
    method: 'post',
    data: data
  })
}