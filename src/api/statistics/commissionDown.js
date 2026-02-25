import request from "@/utils/request";

// 查询佣金下钻列表
export function listCommissionDown(query) {
  return request({
    url: "/statistics/designFee/details",
    method: "get",
    params: query,
  });
}
