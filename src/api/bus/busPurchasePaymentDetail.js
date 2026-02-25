import request from '@/utils/request'

// 查询采购申请单明细列表
export function getPurchasePaymentDetail(id) {
  return request({
    url: '/bus/busPurchasePaymentDetail/getDetail/' + id,
    method: 'get'
  })
}
