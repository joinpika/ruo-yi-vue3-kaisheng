import request from '@/utils/request'

// 查询产品信息列表
export function listProduct(query) {
  return request({
    url: '/bus/product/list',
    method: 'get',
    params: query
  })
}

// 查询产品信息详细
export function getProduct(id) {
  return request({
    url: '/bus/product/' + id,
    method: 'get'
  })
}

// 新增产品信息
export function addProduct(data) {
  return request({
    url: '/bus/product',
    method: 'post',
    data: data
  })
}

// 修改产品信息
export function updateProduct(data) {
  return request({
    url: '/bus/product',
    method: 'put',
    data: data
  })
}

// 删除产品信息
export function delProduct(id) {
  return request({
    url: '/bus/product/' + id,
    method: 'delete'
  })
}

// 查询产品品种
export function listProductType() {
  return request({
    url: '/bus/product/productType/all',
    method: 'get'
  })
}

// 查询产品规格
export function listProductSpec() {
  return request({
    url: '/bus/product/specification/all',
    method: 'get'
  })
}

// 查询产品材质
export function listProductMaterial() {
  return request({
    url: '/bus/product/material/all',
    method: 'get'
  })
}

// 查询产品米数
export function listProductLength() {
  return request({
    url: '/bus/product/length/all',
    method: 'get'
  })
}

// 根据品种获取对应的材质列表
export function listProductMaterList(query) {
  return request({
    url: '/bus/product/materials',
    method: 'get',
    params: query
  })
}

// 根据品种材质获取规格列表
export function listProductSpecificationList(query) {
  return request({
    url: '/bus/product/specification',
    method: 'post',
    data: query
  })
}

// 根据品种材质规格获取米数列表

export function listLengthList(query) {
  return request({
    url: '/bus/product/length',
    method: 'post',
    data: query
  })
}

// 根据品种材质规格米数获取供应商列表
export function listSupplierList(query) {
  return request({
    url: '/bus/product/supplier',
    method: 'post',
    data: query
  })
}

// 导入
export function importProduct(data) {
  return request({
    url: '/bus/product/import',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' }
  })
}
