import request from '@/utils/request'

// 查询客户收款开票列表
export function listReceipt(query) {
  return request({
    url: '/statistics/customerReceiptStats/list',
    method: 'get',
    params: query
  })
}
