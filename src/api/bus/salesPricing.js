import request from '@/utils/request'

// 查询材质
export function listSalesPricing(query) {
    return request({
        url: '/bus/dayPricing/materialList',
        method: 'get',
        params: query
    })
}

// 查询收货区域
export function listSalesPricingArea(query) {
    return request({
        url: '/bus/dayPricing/receiveRegionList',
        method: 'get',
        params: query
    })
}

// 导入
export function importBusDayPricing(data) {
    return request({
        url: '/bus/dayPricing/import',
        method: 'post',
        data: data,
        headers: { "Content-Type": "multipart/form-data;charset=utf-8" },
    })
}

// 查询每日销售定价历史记录列表
export function listBusDayPricingHistory(query) {
    return request({
        url: '/bus/BusDayPricingHistory/list',
        method: 'get',
        params: query
    })
}

// 查询每日销售定价历史记录详细
export function getBusDayPricingHistory(id) {
    return request({
        url: '/bus/BusDayPricingHistory/' + id,
        method: 'get'
    })
}

// 新增每日销售定价历史记录
export function addBusDayPricingHistory(data) {
    return request({
        url: '/bus/BusDayPricingHistory',
        method: 'post',
        data: data
    })
}

// 修改每日销售定价历史记录
export function updateBusDayPricingHistory(data) {
    return request({
        url: '/bus/BusDayPricingHistory',
        method: 'put',
        data: data
    })
}

// 删除每日销售定价历史记录
export function delBusDayPricingHistory(id) {
    return request({
        url: '/bus/BusDayPricingHistory/' + id,
        method: 'delete'
    })
}