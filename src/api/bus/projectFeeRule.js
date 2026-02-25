import request from '@/utils/request'

// 查询项目费用规则主列表
export function listProjectFeeRule(query) {
  return request({
    url: '/bus/projectFeeRule/list',
    method: 'get',
    params: query
  })
}

// 查询项目费用规则主详细
export function getProjectFeeRule(id) {
  return request({
    url: '/bus/projectFeeRule/' + id,
    method: 'get'
  })
}

// 新增项目费用规则主
export function addProjectFeeRule(data) {
  return request({
    url: '/bus/projectFeeRule',
    method: 'post',
    data: data
  })
}

// 修改项目费用规则主
export function updateProjectFeeRule(data) {
  return request({
    url: '/bus/projectFeeRule',
    method: 'put',
    data: data
  })
}

// 删除项目费用规则主
export function delProjectFeeRule(id) {
  return request({
    url: '/bus/projectFeeRule/' + id,
    method: 'delete'
  })
}
