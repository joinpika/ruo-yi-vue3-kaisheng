import request from "@/utils/request";

// 查询供应商付款收票统计明细表
export function listSupperlier(query) {
  return request({
    url: "/statistics/supplierFinance/list",
    method: "get",
    params: query,
  });
}
