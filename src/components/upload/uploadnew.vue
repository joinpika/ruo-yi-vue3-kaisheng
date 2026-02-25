<template>
  <div class="image-uploader">
    <!-- 多图上传模式 -->
    <el-upload
      v-if="multiple"
      ref="uploadMultiple"
      action="#"
      :file-list="fileList"
      :limit="limit"
      :multiple="multiple"
      :http-request="httpRequest"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :class="{ 'hide-upload': shouldHideUpload }"
      :accept="accept"
      :disabled="disabled"
    >
      <!-- list-type="picture-card" -->

      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <el-button slot="trigger" size="small" type="text" class="choose-font">
        选取文件
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </el-upload>

    <!-- 单图上传模式 -->
    <el-upload
      v-else
      ref="uploadSingle"
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :limit="1"
      :http-request="httpRequest"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :class="{ 'hide-upload': shouldHideUpload }"
      :accept="accept"
      :disabled="disabled"
    >
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <el-button slot="trigger" size="small" type="text" class="choose-font">
        选取文件
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </el-upload>

    <!-- 图片预览 -->
    <el-image v-show="false" style="width: 60%" :src="previewUrl" :preview-src-list="previewList" ref="preview"></el-image>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploads, uploadToXinYong } from '@/api/tool/upload';

const props = defineProps({
  // v-model 绑定的值
  value: {
    type: [String, Array],
    default: () => null,
  },
  // 是否多图上传
  multiple: {
    type: Boolean,
    default: false,
  },
  // 最大上传数量（多图时有效）
  limit: {
    type: Number,
    default: 9,
  },
  // 接受的文件类型
  accept: {
    type: String,
    default: 'image/jpg,image/jpeg,image/png',
  },
  // 最大文件大小（MB）
  maxSize: {
    type: Number,
    default: 10,
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 上传接口标识，用于区分不同的上传接口
  uploadType: {
    type: String,
    default: 'default', // 'default' 表示使用默认上传接口，'xinyong' 表示使用 uploadToXinYong 接口
  },
});

const emit = defineEmits(['input'])

const previewUrl = ref('')
const previewList = ref([])
const uploadMultiple = ref(null)
const uploadSingle = ref(null)
const preview = ref(null)

// 文件列表，用于el-upload组件
const fileList = computed(() => {
  if (!props.value) return [];

  if (props.multiple) {
    // 多图模式 - value应该是数组
    return Array.isArray(props.value) ? props.value.map(url => ({ name: getFileName(url), url })) : [];
  } else {
    // 单图模式 - value应该是字符串
    return typeof props.value === 'string' && props.value ? [{ name: getFileName(props.value), url: props.value }] : [];
  }
});

// 是否隐藏上传按钮（达到上限时隐藏）
const shouldHideUpload = computed(() => {
  if (props.multiple) {
    return fileList.value.length >= props.limit;
  } else {
    return fileList.value.length >= 1;
  }
});
// 从URL中提取文件名
const getFileName = (url) => {
  return url ? url.split('/').pop() : 'image';
};

// 图片预览
const handlePreview = (file) => {
  previewUrl.value = file.url;
  previewList.value = [file.url];
  nextTick(() => {
    preview.value?.clickHandler();
  });
};

// 文件改变时的回调
const handleChange = (file, fileList) => {
  // 多图模式下，自动上传所有新选择的文件
  if (props.multiple && fileList && fileList.length) {
    // 找出所有未上传的文件（无url且status为ready）
    const newFiles = fileList.filter(f => !f.url && f.status === 'ready');
    if (newFiles.length) {
      newFiles.forEach(f => {
        httpRequest({ file: f.raw });
      });
    }
  }
};

// 自定义上传方法
const httpRequest = async ({ file }) => {
  try {
    let result;
    if (props.uploadType === 'xinyong') {
      result = await uploadToXinYong(file);
    } else {
      result = await uploads(file);
    }
    if (result.code === 200) {
      ElMessage.success('上传成功！');
      // 更新v-model的值
      if (props.multiple) {
        const newValue = Array.isArray(props.value) ? [...props.value] : [];
        newValue.push(result.data || result.url);
        emit('input', newValue);
      } else {
        emit('input', result.data || result.url);
      }
    } else {
      ElMessage.error(result.message || '上传失败!');
    }
  } catch (error) {
    console.error('上传出错:', error);
    ElMessage.error('上传出错，请重试!');
  }
};

// 上传前的校验
const beforeUpload = (file) => {
  const isAcceptType = props.accept.split(',').some(type => file.type === type.trim());
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize;

  if (!isAcceptType) {
    ElMessage.error(`只能上传 ${props.accept} 格式的图片!`);
    return false;
  }

  if (!isLtMaxSize) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB!`);
    return false;
  }

  return true;
};

// 删除文件
const handleRemove = (file) => {
  ElMessageBox.confirm('确定要删除这张图片吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      if (props.multiple) {
        // 多图模式 - 从数组中移除对应的URL
        const newValue = props.value.filter(url => url !== file.url);
        emit('input', newValue);
      } else {
        // 单图模式 - 设置为null
        emit('input', null);
      }

      ElMessage.success('删除成功!');
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
};

// 清空所有已上传文件
const clearFiles = () => {
  if (props.multiple) {
    uploadMultiple.value?.clearFiles();
  } else {
    uploadSingle.value?.clearFiles();
  }
  emit('input', props.multiple ? [] : null);
};

// 手动触发上传（如果需要）
const submitUpload = () => {
  if (props.multiple) {
    uploadMultiple.value?.submit();
  } else {
    uploadSingle.value?.submit();
  }
};

// 暴露方法给父组件
defineExpose({
  clearFiles,
  submitUpload
});
</script>

<style scoped>
.image-uploader {
  display: inline-block;
}

/* 隐藏上传按钮（当达到上限时） */
.hide-upload ::v-deep .el-upload--picture-card {
  display: none;
}

/* 图片卡片样式 */
/* ::v-deep .el-upload--picture-card {
    width: 100px !important;
    height: 100px !important;
    line-height: 100px !important;
  } */

/* 操作按钮样式 */

.choose-font {
  color: #409eff;
}
</style>
