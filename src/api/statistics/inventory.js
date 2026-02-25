import request from '@/utils/request'

// 查询收发存统列表
export function listInventory(query) {
  return request({
    url: '/statistics/inventoryStats/list',
    method: 'get',
    params: query
  })
}
