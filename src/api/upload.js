import request from "@/utils/request";

// 文件上传
export function uploadFile(data, config = {}) {
  return request({
    url: "/common/upload",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...config,
  });
}

// 删除文件
export function deleteFile(fileId) {
  return request({
    url: `/common/file/${fileId}`,
    method: "delete",
  });
}

// 获取文件信息
export function getFileInfo(fileId) {
  return request({
    url: `/common/file/${fileId}`,
    method: "get",
  });
}

// 批量上传文件
export function batchUploadFiles(files, businessType = "common") {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });
  formData.append("businessType", businessType);

  return request({
    url: "/common/upload/batch",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 下载文件
export function downloadFile(fileId, fileName) {
  return request({
    url: `/common/file/download/${fileId}`,
    method: "get",
    responseType: "blob",
    params: {
      fileName: fileName,
    },
  });
}
