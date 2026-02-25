<template>
  <div class="upload-container">
    <div style="text-align: left;">
      <!-- 点击按钮上传样式 -->
      <div class="upload-button-wrapper">
        <el-upload ref="uploadImage" action="#" :http-request="httpRequest" :before-upload="beforeAvatarUpload"
          :show-file-list="false" :accept="formattedAccept">
          <el-button size="small" icon="el-icon-upload" type="primary">点击上传</el-button>
        </el-upload>
      </div>

      <!-- 已上传文件的显示区域 -->
      <div v-if="getFileUrl(imageUrl)" class="file-display">
        <div class="file-info">
          <span class="file-name">{{ fileName || (typeof imageUrl === 'object' && imageUrl.fileName ? imageUrl.fileName
            : getFileName(imageUrl)) }}</span>
          <el-button-group>
            <el-button size="mini" type="text" @click="beforeRemove">
              <i class="el-icon-delete" />
            </el-button>
          </el-button-group>
        </div>
      </div>
    </div>

    <!-- 预览对话框 -->
    <!-- <el-dialog :visible.sync="dialogVisible" title="文件预览" :modal="false" :close-on-click-modal="true"
            :close-on-press-escape="true" custom-class="preview-dialog">
            <img v-if="isImageFile(imageUrl)" width="100%" :src="getFileUrl(dialogImageUrl)" alt="">
            <div v-else class="non-image-file">
                <p>文件名：{{ fileName || getFileName(imageUrl) }}</p>
                <p>类型：{{ getFileType(imageUrl) }}</p>
                <el-button type="primary" @click="downloadFile">下载文件</el-button>
            </div>
        </el-dialog> -->
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { upload } from '@/api/tool/upload'

const props = defineProps({
  value: {
    type: [String, Object]
  },
  accept: {
    type: [String, Array],
    // default: () => ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx']
    default: () => []
  }
});

const emit = defineEmits(['input', 'success'])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const fileName = ref('') // 保存原始文件名
const localImageUrl = ref(null)

// 添加监听器，当value变化时重置fileName
watch(() => props.value, (newVal) => {
  // 简化逻辑：只要value变化，就重置内部状态
  fileName.value = ''
  // 如果value为空，同时重置localImageUrl
  if (!newVal) {
    localImageUrl.value = null
  }
}, { immediate: true });
// imageUrl计算属性
const imageUrl = computed({
  get() {
    return localImageUrl.value || props.value
  },
  set(val) {
    localImageUrl.value = val
    emit('input', val)
  }
});

const formattedAccept = computed(() => {
  if (typeof props.accept === 'string') {
    return props.accept
  }
  if (Array.isArray(props.accept)) {
    return props.accept.join(',')
  }
  return ''
});
console.log(props.value, '==========va8888lue')
// 获取文件URL
const getFileUrl = (data) => {
  console.log('data111', data)
  if (!data) return ''
  // 如果是对象，返回fileUrl属性；如果是字符串，直接返回
  return typeof data === 'object' && data.fileUrl ? data.fileUrl : data
};

// 获取文件名
const getFileName = (url) => {
  const fileUrl = getFileUrl(url)
  if (!fileUrl) return ''
  const parts = fileUrl.split('/')
  return parts[parts.length - 1]
};

// 获取文件类型
const getFileType = (url) => {
  const fileUrl = getFileUrl(url)
  if (!fileUrl) return ''
  const parts = fileUrl.split('.')
  if (parts.length > 1) {
    return parts[parts.length - 1].toUpperCase()
  }
  return '未知类型'
};

// 判断是否为图片文件
const isImageFile = (url) => {
  const fileUrl = getFileUrl(url)
  if (!fileUrl) return false
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
  const extension = fileUrl.split('.').pop().toLowerCase()
  return imageExtensions.includes(extension)
};

    // 预览文件
    // handlePreview() {
    //     this.dialogImageUrl = this.getFileUrl(this.imageUrl);
    //     this.dialogVisible = true;
    // },

    // 下载文件
    // downloadFile() {
    //     // 创建一个临时链接来下载文件
    //     const link = document.createElement('a');
    //     link.href = this.getFileUrl(this.imageUrl);
    //     link.download = this.getFileName(this.imageUrl);
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // },
const httpRequest = async ({ file }) => {
  try {
    const result = await upload(file)
    if (result.code === 200 && result.url) {
      console.log(result.data, '==========r9999',file)
      ElMessage.success('上传成功！')
      // 保存原始文件名
      fileName.value = file.name
      // 将完整的result.data对象赋值给imageUrl
      imageUrl.value = result.url
      console.log(imageUrl.value, '==========lplplp',result.url)
      /* === 关键：通知父组件 === */
      emit('success', result.url)
    } else {
      ElMessage.error('上传失败: ' + (result.msg || '未知错误'))
      fileName.value = ''
    }
  } catch (error) {
    ElMessage.error('上传失败: ' + error.message)
    fileName.value = ''
  }
};
const beforeAvatarUpload = (file) => {
  if (file.size >= 21943040) {
    ElMessage.warning('文件大小不超过20M')
    return false
  }
  // 文件类型验证
  const allowedExtensions = getAllowedExtensions()
  const fileExtension = file.name.split('.').pop().toLowerCase()

  // 检查文件扩展名是否在允许的列表中
  if (allowedExtensions.length > 0) {
    const isValid = allowedExtensions.some(ext =>
      ext.startsWith('.') ? ext.toLowerCase() === `.${fileExtension}` : ext.toLowerCase() === fileExtension
    )

    if (!isValid) {
      const allowedExtText = allowedExtensions.join('、')
      ElMessage.warning(`只允许上传以下格式的文件：${allowedExtText}`)
      return false
    }
  }
  return true
};
// 获取允许的文件扩展名列表
const getAllowedExtensions = () => {
  if (typeof props.accept === 'string') {
    return props.accept.split(',').map(ext => ext.trim())
  }
  if (Array.isArray(props.accept)) {
    return props.accept
  }
  return []
};
const onRemove = () => {
  imageUrl.value = undefined
};
const beforeRemove = () => {
  ElMessageBox.confirm('此操作将移除文件, 是否继续?', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    imageUrl.value = undefined
    localImageUrl.value = null // 确保重置localImageUrl
    fileName.value = '' // 清除文件名
    ElMessage({
      type: 'success',
      message: '删除成功!'
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    })
  })
};
</script>
<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.upload-button-wrapper {
  display: inline-block;
}

.file-display {
  /* padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background-color: #f8f9fa;*/
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-name {
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #606266;
  margin-right: 10px;
}

.non-image-file {
  text-align: center;
  padding: 20px;
}

.non-image-file p {
  margin: 10px 0;
  color: #606266;
}

/* 确保按钮样式一致 */
.el-upload {
  display: inline-block;
}

/* 预览对话框样式优化 */
.preview-dialog .el-dialog__body {
  padding: 0;
  overflow: hidden;
}

/* 优化图片预览体验 */
.preview-dialog img {
  display: block;
  max-height: 80vh;
  margin: 0 auto;
  object-fit: contain;
}
</style>