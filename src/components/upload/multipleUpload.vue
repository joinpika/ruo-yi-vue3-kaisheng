<template>
  <div class="upload-container">
    <!-- 多文件上传区域 -->
    <div class="upload-button-wrapper">
      <div style="text-align: left; margin-bottom: 10px;">
        <el-upload
          ref="uploadImage"
          action="#"
          :http-request="httpRequest"
          :before-upload="beforeAvatarUpload"
          :before-remove="confirmRemoveFile"
          :on-remove="onRemove"
          :auto-upload="false"
          multiple
          :file-list="fileList"
          accept="*"
          :on-change="handleFileChange"
          :disabled="disabled"
        >
          <div style="text-align: left;">
            <el-button size="small" icon="el-icon-upload" type="primary" :disabled="disabled">选择文件</el-button>
          </div>
        </el-upload>
        <div class="el-upload__tip">
          单个文件大小不超过550M，最多可上传{{ limit }}个文件
        </div>
          <!-- 自定义文件列表 -->
  <!-- <div class="files-display">
    <div
      v-for="file in fileList"
      :key="file.uid"
      class="file-item"
    >
      <div class="file-info">
        <span class="file-name" :title="file.name">{{ file.name }}</span>
        <div>
          <el-button
            type="text"
            icon="el-icon-view"
            @click="handlePreview(file)"
          />
        </div>
      </div>
    </div>
      </div> -->
    </div>
  </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploads } from '@/api/tool/upload'
import { previewFileWithKKFileView } from '@/utils/filePreview.js'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  limit: {
    type: Number,
    default: 10
  },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['input', 'change'])

const fileList = ref([])
const dialogVisible = ref(false)
const previewImageUrl = ref('')
const previewFileUrl = ref('')
const uploading = ref(false)
// 标记是否正在上传过程中
const isUploading = ref(false)
// 存储待上传的文件队列
const pendingFiles = ref([])

const hasPendingFiles = computed(() => {
  return fileList.value.some(file => file.status === 'ready' && file.raw)
});
watch(() => props.value, (newVal) => {
  if (newVal && Array.isArray(newVal)) {
    fileList.value = newVal.map(item => {
      const url = typeof item === 'string' ? item : (item?.name || '')
      return {
        name: getFileName(url),
        url
      }
    })
  }
}, { immediate: true });
const handleRemove = (file) => {
  onRemove(file, fileList.value)
};
const getFileName = (url) => {
  if (!url) return ''
  const parts = url.split('/')
  return parts[parts.length - 1]
};

const getFileType = (url) => {
  if (!url) return ''
  const parts = url.split('.')
  if (parts.length > 1) {
    return parts[parts.length - 1].toUpperCase()
  }
  return '未知类型'
};

const isImageFile = (fileName) => {
  if (!fileName) return false
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
  const extension = fileName.split('.').pop().toLowerCase()
  return imageExtensions.includes(extension)
};

const handlePreview = (file) => {
  previewFileWithKKFileView(file.url)
  // const fileUrl = file.url
  // if (isImageFile(file.name)) {
  //   previewImageUrl.value = fileUrl
  //   previewFileUrl.value = ''
  // } else {
  //   previewImageUrl.value = ''
  //   previewFileUrl.value = fileUrl
  // }
  // dialogVisible.value = true
};

const downloadFile = (url) => {
  const link = document.createElement('a')
  link.href = url
  link.download = getFileName(url)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
};

    // 处理文件选择，收集所有文件后自动批量上传
    // handleFileChange(file, fileList) {
    //   this.fileList = fileList

    //   // 收集所有新选择的待上传文件
    //   if (file.status === 'ready' && file.raw) {
    //     // 检查是否有正在进行的上传，如果没有，则触发上传
    //     if (!this.isUploading) {
    //       // 收集所有状态为ready的文件
    //       const readyFiles = this.fileList.filter(f => f.status === 'ready' && f.raw)
    //       if (readyFiles.length > 0) {
    //         // 延迟一小段时间确保所有文件都被添加到列表中
    //         setTimeout(() => {
    //           this.performBatchUpload()
    //         }, 100)
    //       }
    //     }
    //   }
    // },
const handleFileChange = (file, fileListParam) => {
  // 校验文件名不能包含空格和点号
  if (file.status === 'ready' && file.raw) {
    const fileName = file.name
    if (fileName.includes(' ')) {
      ElMessage.error('文件名不能包含空格')
      // 从列表中移除该文件
      const index = fileListParam.findIndex(f => f.uid === file.uid)
      if (index !== -1) {
        fileListParam.splice(index, 1)
      }
      fileList.value = fileListParam
      return
    }
  }

  fileList.value = fileListParam

  // 收集所有新选择的待上传文件
  if (file.status === 'ready' && file.raw) {
    // 检查是否有正在进行的上传，如果没有，则触发上传
    if (!isUploading.value) {
      // 收集所有状态为ready的文件
      const readyFiles = fileList.value.filter(f => f.status === 'ready' && f.raw)
      if (readyFiles.length > 0) {
        // 延迟一小段时间确保所有文件都被添加到列表中
        setTimeout(() => {
          performBatchUpload()
        }, 100)
      }
    }
  }
};

    // 执行批量上传
    const performBatchUpload = async () => {
      // 收集所有待上传的文件
      const filesToUpload = fileList.value.filter(file => file.status === 'ready' && file.raw)

      if (filesToUpload.length === 0) return

      isUploading.value = true
      uploading.value = true

      // 更新所有待上传文件的状态为上传中
      filesToUpload.forEach(file => {
        const index = fileList.value.findIndex(f => f.uid === file.uid)
        if (index !== -1) {
          fileList.value[index] = { ...fileList.value[index], status: 'uploading' }
        }
      })

      // 创建FormData并添加所有文件
      const formData = new FormData()
      filesToUpload.forEach(file => {
        formData.append('files', file.raw)
      })

      try {
        // 调用上传接口
        const result = await uploads(formData)

        if (result.code === 200 && Array.isArray(result.data)) {
          // 更新已上传文件的状态和URL
          filesToUpload.forEach((file, idx) => {
            if (result.data[idx]) {
              const index = fileList.value.findIndex(f => f.uid === file.uid)
              if (index !== -1) {
                fileList.value[index] = {
                  ...fileList.value[index],
                  url: result.data[idx],
                  status: 'success'
                }
              }
            }
          })

          updateParentValue()
          ElMessage.success(`成功上传 ${result.data.length} 个文件！`)
        } else {
          // 重置上传失败的文件状态
          filesToUpload.forEach(file => {
            const index = fileList.value.findIndex(f => f.uid === file.uid)
            if (index !== -1) {
              fileList.value[index] = { ...fileList.value[index], status: 'ready' }
            }
          })
          ElMessage.error('上传失败: ' + (result.msg || '未知错误'))
        }
      } catch (error) {
        // 重置上传失败的文件状态
        filesToUpload.forEach(file => {
          const index = fileList.value.findIndex(f => f.uid === file.uid)
          if (index !== -1) {
            fileList.value[index] = { ...fileList.value[index], status: 'ready' }
          }
        })
        ElMessage.error('上传异常: ' + (error.message || '网络错误'))
      } finally {
        isUploading.value = false
        uploading.value = false

        // 检查是否还有其他待上传文件
        const remainingFiles = fileList.value.filter(f => f.status === 'ready' && f.raw)
        if (remainingFiles.length > 0) {
          // 如果还有待上传文件，继续上传
          performBatchUpload()
        }
      }
    };

    // 兼容原有的httpRequest
    const httpRequest = ({ file }) => {
      // 这个方法会在el-upload组件内部调用，但我们主要通过handleFileChange控制上传
      // 这里可以保留作为兼容，但不做实际处理
    };

const beforeAvatarUpload = (file) => {
  // 检查文件名是否包含空格或点号
  const fileName = file.name
  console.log("1111",fileName)
  if (fileName.includes(' ')) {
    ElMessage.warning('文件名不能包含空格')
    return false
  }
  
  if (file.size >= 576716800) {
    ElMessage.warning('文件大小不超过550M')
    return false
  }
  return true
};

const confirmRemoveFile = (file, fileList) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm('此操作将移除文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      resolve(true)
    }).catch(() => {
      reject(false)
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
  })
};

const onRemove = (file, fileListParam) => {
  fileList.value = fileListParam
  updateParentValue()
};

const updateParentValue = () => {
  const urls = fileList.value.filter(file => file.url).map(file => file.url)
  emit('input', urls)
  emit('change', urls)
};
</script>
<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upload-button-wrapper {
  display: inline-block;
}

.files-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-name {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #606266;
}

.non-image-file {
  text-align: center;
  padding: 20px;
}

.non-image-file p {
  margin: 10px 0;
  color: #606266;
}

.mr-2 {
  margin-right: 8px;
}

.el-upload {
  display: inline-block;
}

.el-upload-list--text .el-upload-list__item {
  margin-top: 10px;
}
</style>
