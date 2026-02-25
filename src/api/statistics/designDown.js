import request from "@/utils/request";

// 查询设计费-下钻列表
export function listDesignDown(query) {
  return request({
    url: "/statistics/designFee/project/details",
    method: "get",
    params: query,
  });
}
