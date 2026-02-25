import request from "@/utils/request";

// 查询其他费用明细列表
export function listOtherDetails(query) {
  return request({
    url: "/statistics/designFee/other/list",
    method: "get",
    params: query,
  });
}
