import request from "@/utils/request";

// 查询设计费-下钻列表
export function listDesign(query) {
  return request({
    url: "/statistics/designFee/list",
    method: "get",
    params: query,
  });
}
