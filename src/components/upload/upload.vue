<template>
  <div class="custom-upload">
    <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :headers="uploadHeaders"
      :data="uploadData"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :before-upload="beforeUpload"
      :http-request="customUpload"
      :file-list="fileList"
      :auto-upload="autoUpload"
      :accept="accept"
      :multiple="multiple"
      :limit="limit"
      :on-exceed="handleExceed"
      :disabled="disabled"
      :show-file-list="showFileList"
    >
      <el-button 
        type="primary" 
        size="small" 
        :disabled="disabled"
        class="upload-button"
        :loading="uploading"
      >
        {{ uploading ? '上传中...' : '上传' }}
      </el-button>
      <div slot="tip" class="el-upload__tip">
        {{ tipText }}
      </div>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadFile, deleteFile, batchUploadFiles, downloadFile } from '@/api/upload'
import { getToken } from '@/utils/auth'

const props = defineProps({
  // 上传地址
  uploadUrl: {
    type: String,
    default: process.env.VUE_APP_BASE_API + '/common/upload'
  },
  // 文件列表
  value: {
    type: Array,
    default: () => []
  },
  // 是否自动上传
  autoUpload: {
    type: Boolean,
    default: true
  },
  // 接受的文件类型
  accept: {
    type: String,
    default: '.jpg,.jpeg,.png,.pdf'
  },
  // 是否支持多选
  multiple: {
    type: Boolean,
    default: true
  },
  // 最大上传数量
  limit: {
    type: Number,
    default: 10
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 提示文字
  tipText: {
    type: String,
    default: '支持上传jpg,jpeg,png,pdf'
  },
  // 文件大小限制（MB）
  maxSize: {
    type: Number,
    default: 10
  },
  // 是否显示文件列表
  showFileList: {
    type: Boolean,
    default: true
  },
  // 上传时附加的额外参数
  uploadData: {
    type: Object,
    default: () => ({})
  },
  // 业务类型（用于区分不同业务的文件上传）
  businessType: {
    type: String,
    default: 'common'
  }
});
const fileList = ref([]);
const uploading = ref(false);
// 上传请求头
const uploadHeaders = computed(() => {
  return {
    'Authorization': 'Bearer ' + getToken(),
    'Content-Type': 'multipart/form-data'
  }
});
watch(() => props.value, (val) => {
  fileList.value = val || [];
}, { immediate: true, deep: true });

watch(fileList, (val) => {
  emit('input', val);
  emit('change', val);
}, { deep: true });

const emit = defineEmits(['input', 'change', 'success', 'error', 'progress', 'before-upload', 'exceed', 'preview', 'remove', 'batch-success', 'batch-error']);

// 自定义上传方法
const customUpload = async (options) => {
      const { file, onProgress, onSuccess, onError } = options;
      
      try {
        uploading.value = true;
        
        // 创建FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('businessType', props.businessType);
        
        // 添加额外参数
        Object.keys(props.uploadData).forEach(key => {
          formData.append(key, props.uploadData[key]);
        });
        
        // 调用上传接口
        const response = await uploadFile(formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({ percent: percentCompleted });
          }
        });
        console.log('response',response);
        
        // 处理响应
        if (response.code === 200) {
          const fileInfo = {
            name: file.name,
            url: response.url,
            uid: file.uid,
            status: 'success',
            response: response
          };
          
          // 更新文件列表
          const newFileList = [...fileList.value, fileInfo];
          fileList.value = newFileList;
          
          onSuccess(response.data, file);
          ElMessage.success('文件上传成功');
          emit('success', response, file, newFileList);
        } else {
          throw new Error(response.msg || '上传失败');
        }
      } catch (error) {
        console.error('上传失败:', error);
        onError(error);
        ElMessage.error(error.message || '文件上传失败');
        emit('error', error, file);
      } finally {
        uploading.value = false;
      }
    };
    
    // 文件预览
    const handlePreview = (file) => {
      console.log('预览文件:', file);
      emit('preview', file);
      
      // 如果是图片，可以直接预览
      if (isImage(file)) {
        previewImage(file);
      } else {
        // 其他文件类型可以下载或打开
        downloadFile(file);
      }
    };
    
    // 文件删除
    const handleRemove = (file, fileListParam) => {
      console.log('删除文件:', file);
      fileList.value = fileListParam;
      emit('remove', file, fileListParam);
      
    //   // 如果需要调用删除接口
    //   if (file.response && file.response.fileId) {
    //     deleteServerFile(file.response.fileId);
    //   }
    };
    
    // 删除服务器文件
    const deleteServerFile = async (fileId) => {
      try {
        const response = await deleteFile(fileId);
        if (response.code === 200) {
          console.log('删除服务器文件成功:', fileId);
        }
      } catch (error) {
        console.error('删除文件失败:', error);
        ElMessage.error('删除文件失败');
      }
    };
    
    // 上传成功（兼容默认上传）
    const handleSuccess = (response, file, fileListParam) => {
      console.log('上传成功:', response, file);
      fileList.value = fileListParam;
      emit('success', response, file, fileListParam);
    //   if (!uploading.value) {
    //     ElMessage.success('文件上传成功');
    //   }
    };
    
    // 上传失败（兼容默认上传）
    const handleError = (err, file, fileListParam) => {
      console.error('上传失败:', err);
      emit('error', err, file, fileListParam);
      if (!uploading.value) {
        ElMessage.error('文件上传失败');
      }
    };
    
    // 上传进度
    const handleProgress = (event, file, fileListParam) => {
      emit('progress', event, file, fileListParam);
    };
    
    // 上传前校验
    const beforeUpload = (file) => {
      console.log('上传前校验:', file);
      
      // 检查文件类型
      if (!checkFileType(file)) {
        ElMessage.error(`不支持的文件类型，请上传 ${props.accept} 格式的文件`);
        return false;
      }
      
      // 检查文件大小
      if (!checkFileSize(file)) {
        ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`);
        return false;
      }
      
      emit('before-upload', file);
      return true;
    };
    
    // 文件数量超出限制
    const handleExceed = (files, fileListParam) => {
      ElMessage.warning(`最多只能上传 ${props.limit} 个文件`);
      emit('exceed', files, fileListParam);
    };
    
    // 检查文件类型
    const checkFileType = (file) => {
      if (!props.accept) return true;
      
      const acceptTypes = props.accept.split(',').map(type => type.trim().toLowerCase());
      const fileName = file.name.toLowerCase();
      
      return acceptTypes.some(type => {
        if (type.startsWith('.')) {
          return fileName.endsWith(type);
        }
        return fileName.includes(type);
      });
    };
    
    // 检查文件大小
    const checkFileSize = (file) => {
      const size = file.size / 1024 / 1024; // 转换为MB
      return size <= props.maxSize;
    };
    
    // 判断是否为图片
    const isImage = (file) => {
      const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const fileName = file.name.toLowerCase();
      return imageTypes.some(type => fileName.endsWith(`.${type}`));
    };
    
    // 预览图片
    const previewImage = (file) => {
      const url = file.url || file.response?.url || URL.createObjectURL(file.raw);
      
      // 创建图片预览对话框
      ElMessageBox.alert(`<img src="${url}" style="width: 100%; max-width: 500px;">`, '图片预览', {
        dangerouslyUseHTMLString: true,
        showConfirmButton: false,
        showClose: true
      });
    };
    
    // 下载文件
    const downloadFile = (file) => {
      const url = file.url || file.response?.url;
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    
    // 清空文件列表
    const clearFiles = () => {
      fileList.value = [];
      // 注意：由于没有ref，这里需要根据实际情况调整
    };
    
    // 手动上传
    const submit = () => {
      // 注意：由于没有ref，这里需要根据实际情况调整
    };
    
    // 获取文件列表
    const getFileList = () => {
      return fileList.value;
    };
    
    // 设置文件列表
    const setFileList = (fileListParam) => {
      fileList.value = fileListParam;
    };
    
    // 批量上传
    const batchUpload = async (files) => {
      try {
        uploading.value = true;
        const response = await batchUploadFiles(files, props.businessType);
        
        if (response.code === 200) {
          const newFileList = response.data.map(item => ({
            name: item.originalName,
            url: item.url,
            uid: Date.now() + Math.random(),
            status: 'success',
            response: item
          }));
          
          fileList.value = [...fileList.value, ...newFileList];
          ElMessage.success('批量上传成功');
          emit('batch-success', response.data, newFileList);
        }
      } catch (error) {
        console.error('批量上传失败:', error);
        ElMessage.error('批量上传失败');
        emit('batch-error', error);
      } finally {
        uploading.value = false;
      }
    };
    
    // 下载文件
    const downloadFileById = async (fileId, fileName) => {
      try {
        const response = await downloadFile(fileId, fileName);
        const blob = new Blob([response]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('下载文件失败:', error);
        ElMessage.error('下载文件失败');
      }
    };
</script>

<style scoped>
.custom-upload {
  display: inline-block;
}

.upload-demo {
  display: inline-block;
  /* position: relative; */
}

.upload-button {
  background-color: #409EFF;
  border-color: #409EFF;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-button:hover:not(:disabled) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.upload-button:disabled {
  background-color: #c0c4cc;
  border-color: #c0c4cc;
  cursor: not-allowed;
}

.el-upload__tip {
  color: #999;
  font-size: 12px;
  /* margin-top: 5px;
  margin-left: 0; */
  /* line-height: 1.4; */
  position: absolute;
  left: 100px;
  top: 0px;
}

/* 隐藏默认的上传区域样式 */
.upload-demo .el-upload {
  display: inline-block;
}

.upload-demo .el-upload-dragger {
  display: none;
}

/* 文件列表样式 */
.upload-demo .el-upload-list {
  margin-top: 10px;
}

.upload-demo .el-upload-list__item {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin-top: 5px;
  position: relative;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;
}

.upload-demo .el-upload-list__item:hover {
  background-color: #f5f7fa;
}

.upload-demo .el-upload-list__item.is-success .el-upload-list__item-status-label {
  color: #67c23a;
}

.upload-demo .el-upload-list__item.is-success:focus:not(:hover) .el-icon-close-tip {
  opacity: 0;
}

.upload-demo .el-upload-list__item.is-success:not(.focusing):focus .el-icon-close-tip {
  opacity: 0;
}

.upload-demo .el-upload-list__item:hover .el-upload-list__item-delete {
  opacity: 1;
}

</style>
