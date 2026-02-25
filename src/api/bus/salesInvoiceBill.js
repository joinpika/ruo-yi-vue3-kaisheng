import request from '@/utils/request'

// 查询发票票据明细列表
export function listSalesInvoiceBill(query) {
  return request({
    url: '/bus/salesInvoiceBill/list',
    method: 'get',
    params: query
  })
}

// 查询发票票据明细详细
export function getSalesInvoiceBill(id) {
  return request({
    url: '/bus/salesInvoiceBill/' + id,
    method: 'get'
  })
}

// 新增发票票据明细
export function addSalesInvoiceBill(data) {
  return request({
    url: '/bus/salesInvoiceBill',
    method: 'post',
    data: data
  })
}

// 修改发票票据明细
export function updateSalesInvoiceBill(data) {
  return request({
    url: '/bus/salesInvoiceBill',
    method: 'put',
    data: data
  })
}

// 删除发票票据明细
export function delSalesInvoiceBill(id) {
  return request({
    url: '/bus/salesInvoiceBill/' + id,
    method: 'delete'
  })
}

// 销售开票
export function salesBillList(query) {
  return request({
    url: '/bus/salesInvoice/order',
    method: 'get',
    params: query
  })
}

// 未开票列表
export function unInvoiceList(query) {
  return request({
    url: '/bus/salesSettleDetail/unInvoicedList',
    method: 'get',
    params: query
  })
}

// 新增开票
export function addSalesInvoice(data) {
  return request({
    url: '/bus/salesInvoice',
    method: 'post',
    data: data
  })
}


// 查询未开票返利单据
export function uninvoicedList(query) {
  return request({
    url: '/bus/financeRebate/uninvoicedList',
    method: 'get',
    params: query
  })
}

// 贴息未开票列表
export function discountUninvoicedList(query) {
  return request({
    url: '/bus/financeAcceptanceDiscount/uninvoicedList',
    method: 'get',
    params: query
  })
}

// 违约金未开票列表
export function penaltyUninvoicedList(query) {
  return request({
    url: '/bus/customerLateFee/uninvoiced',
    method: 'get',
    params: query
  })
}
