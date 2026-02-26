import request from '@/utils/request'

// 查询用户列表
export function listFile(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 查询所有角色（下拉文件级别新增时使用）
export function listRole(query) {
  return request({
    url: '/system/role/optionselect',
    method: 'get',
    params: query
  })
}

// 下架审核
export function getProcesser(fileId) {
  return request({
    url: '/processer/file/' + fileId,
    method: 'post'
    // data: orderId
  })
}