import request from '@/utils/request'

// 查询项目费用清单主列表
export function listProjectFeeStatement(query) {
  return request({
    url: '/bus/projectFeeStatement/list',
    method: 'get',
    params: query
  })
}

// 查询项目费用清单主详细
export function getProjectFeeStatement(id) {
  return request({
    url: '/bus/projectFeeStatement/' + id,
    method: 'get'
  })
}

// 新增项目费用清单主
export function addProjectFeeStatement(data) {
  return request({
    url: '/bus/projectFeeStatement',
    method: 'post',
    data: data
  })
}

// 修改项目费用清单主
export function updateProjectFeeStatement(data) {
  return request({
    url: '/bus/projectFeeStatement',
    method: 'put',
    data: data
  })
}

// 删除项目费用清单主
export function delProjectFeeStatement(id) {
  return request({
    url: '/bus/projectFeeStatement/' + id,
    method: 'delete'
  })
}
