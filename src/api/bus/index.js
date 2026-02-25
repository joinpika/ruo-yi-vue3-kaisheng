import request from '@/utils/request'
// 单文件上传
export function uploadSingle(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data: data
  })
}

// 多文件上传
export function uploadMultiple(data) {
  return request({
    url: '/file/uploads',
    method: 'post',
    data: data
  })
}

// 查询所有钢厂
export function listSteelMillAll() {
  return request({
    url: '/bus/steelMill/all',
    method: 'get'
  })
}

// 查询所有本方公司
export function listOurCompanyAll() {
  return request({
    url: '/system/dept/company',
    method: 'get'
  })
}

// 查询所有员工
export function listAllEmployees() {
  return request({
    url: '/system/user/all',
    method: 'get'
  })
}

// 查询所有项目
export function listProjectAll(query) {
  return request({
    url: '/bus/projectLibrary/all',
    method: 'get',
    params: query
  })
}

// 查询所有客户
export function listCustomerAll() {
  return request({
    url: '/bus/customer/all',
    method: 'get'
  })
}

// 根据客户id，查询通用合同 和 专属合同
export function listContractAll(customerId) {
  return request({
    url: '/bus/contractTemplate/query/' + customerId,
    method: 'get'
  })
}

// 根据客户、本方公司、 查询未绑定销售订单的 框架合同
export function listFrameContract(query) {
  return request({
    url: '/bus/busSalesOrderContract/unboundList',
    method: 'get',
    params: query
  })
}

// 查询所有部门
export function listDeptAll() {
  return request({
    url: '/system/user/all',
    method: 'get'
  })
}

// 根据用户id 查询id 名称
export function listUserNameByIds(data) {
  return request({
    url: '/system/user/listByIds',
    method: 'post',
    data: data
  })
}

// 根据dduserId 查询用户名称
export function listUserNameByDduserId(dduserId) {
  return request({
    url: '/system/user/ddUser/' + dduserId,
    method: 'get'
  })
}
// 根据本方公司id 查询下属部门
export function listDeptByCompanyId(companyId) {
  return request({
    url: '/system/dept/company/child/' + companyId,
    method: 'get'
  })
}

// 获取产品销售价格，根据客户id、材质、收获区域
export function getProductSalesPrice(data) {
  return request({
    url: '/bus/salesMarkup/price',
    method: 'post',
    data: data
  })
}

// 获取所有产品
export function getProductAll(query) {
  return request({
    url: '/product/list',
    method: 'get',
    params: query
  })
}

// 查询所有订单号
export function listOrderNoAll(query) {
  return request({
    url: '/bus/salesOrder/no/all',
    method: 'get',
    params: query
  })
}

// 订单列表页的财务统计
export function listOrderFinance(query) {
  return request({
    url: '/bus/salesOrder/finance',
    method: 'get',
    params: query
  })
}

// 销售订单详情 --财务统计
export function getSalesOrderFinance(orderId) {
  return request({
    url: '/bus/salesOrder/finance/' + orderId,
    method: 'get'
  })
}

// 根据名称查询业务员
export function listSalesmanByName(query) {
  return request({
    url: '/system/user/all',
    method: 'get',
    params: query
  })
}

// 查询待办任务
export function listTodoTask(query) {
  return request({
    url: '/flowable/task/todoList',
    method: 'get',
    params: query
  })
}

// 审批通过
export function passTask(data) {
  return request({
    url: '/flowable/task/complete',
    method: 'post',
    data: data
  })
}

// 审批驳回
export function rejectTask(data) {
  return request({
    url: '/flowable/task/reject',
    method: 'post',
    data: data
  })
}

// 查询流程变量
export function processVariables(taskId) {
  return request({
    url: '/flowable/task/processVariables/' + taskId,
    method: 'get'
  })
}

// 查询销售订单明细历史记录列表
export function listSalesOrderItemHistory(query) {
  return request({
    url: '/bus/busSalesOrderItemHistory/list',
    method: 'get',
    params: query
  })
}

// 获取产品销售价格，根据客户id、材质、收获区域
export function getProcesser(orderId) {
  return request({
    url: '/processer/order/' + orderId,
    method: 'post'
    // data: orderId
  })
}

// 物流公司添加
export function getbus(orderId) {
  return request({
    url: '/bus/busLogisticsCompany',
    method: 'post',
    data: orderId
  })
}
