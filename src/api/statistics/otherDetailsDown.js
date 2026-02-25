import request from "@/utils/request";

// 查询其他费用明细-下钻列表
export function listOtherDetailsDown(query) {
  return request({
    url: "/statistics/designFee/other/details",
    method: "get",
    params: query,
  });
}
