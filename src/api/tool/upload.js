import request from "@/utils/request";

// 查询生成表数据
export function upload(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request.post("/common/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// export function uploads(file) {
//     // const formData = new FormData();
//     // formData.append('file', file);
//     return request.post('/common/uploads', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     });
// }

// export function uploads(data){
//     return request({
//         url:'/common/uploads',
//         method: 'post',
//         data,
//         contentType:'multipart/form-data'
//     })
// }

export function uploads(files) {
  // const formData = new FormData();
  // formData.append('file', file);
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });
  //   formData.append('businessType', businessType)
  return request({
    url: "/common/uploads",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 300000,
  });
}

// export function uploads(file) {
//     const formData = new FormData();
//     formData.append('file', file);
//     return request.post('/common/uploads', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     });

// }
