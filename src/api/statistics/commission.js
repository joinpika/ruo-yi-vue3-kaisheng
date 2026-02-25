import request from "@/utils/request";

// 查询佣金列表
export function listCommission(query) {
  return request({
    url: "/statistics/designFee/project/options",
    method: "get",
    params: query,
  });
}
