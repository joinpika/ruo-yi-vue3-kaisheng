/**
 * 文件预览工具函数
 */

// KKFileView服务地址（根据实际部署情况修改）
const KK_FILE_VIEW_URL = 'http://118.195.141.67:80'
// const 
// const KK_FILE_VIEW_URL = 'http://172.168.61.10:8012'//客户
// const KK_FILE_VIEW_URL = 'http://172.168.61.10:9017'//客户
// 自动获取环境变量中的地址，如果没有定义则使用一个默认值
// const KK_FILE_VIEW_URL = process.env.VUE_APP_KK_FILE_VIEW_URL || 'http://118.195.141.67:80';
/**
 * 使用KKFileView预览文件
 * @param {string} fileUrl - 文件URL
 * @param {string} customKKFileViewUrl - 自定义KKFileView服务地址（可选）
 */
export function previewFileWithKKFileView(fileUrl, customKKFileViewUrl = KK_FILE_VIEW_URL) {
  if (!fileUrl) {
    console.error('文件URL不能为空')
    return
  }

  // 对文件URL进行Base64编码，使用UTF-8编码方式
  // const originUrl = encodeURIComponent(fileUrl)
  const base64Url = Buffer.from(fileUrl, 'utf-8').toString('base64')
  // 再次编码，防止base64中的特殊字符（如+、/、=）在URL传输中出现问题
  const encodedUrl = encodeURIComponent(base64Url)

  // 构建完整的预览URL
  const previewUrl = `${customKKFileViewUrl}/onlinePreview?url=${encodedUrl}`
  // 打开新窗口预览
  window.open(previewUrl, '_blank')
}


/**
 * 检查文件类型
 * @param {string} fileUrl - 文件URL
 * @returns {string} 文件类型
 */
export function getFileType(fileUrl) {
  if (!fileUrl) return 'unknown'

  const fileExtension = fileUrl.split('.').pop().toLowerCase()

  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
    return 'image'
  }

  if (fileExtension === 'pdf') {
    return 'pdf'
  }

  return 'other'
}

/**
 * 获取文件图标
 * @param {string} fileUrl - 文件URL
 * @returns {string} 图标类名
 */
export function getFileIcon(fileUrl) {
  if (!fileUrl) return 'el-icon-document'

  const fileExtension = fileUrl.split('.').pop().toLowerCase()

  const iconMap = {
    'jpg': 'el-icon-picture',
    'jpeg': 'el-icon-picture',
    'png': 'el-icon-picture',
    'gif': 'el-icon-picture',
    'bmp': 'el-icon-picture',
    'webp': 'el-icon-picture',
    'pdf': 'el-icon-document',
    'doc': 'el-icon-document',
    'docx': 'el-icon-document',
    'xls': 'el-icon-document',
    'xlsx': 'el-icon-document',
    'ppt': 'el-icon-document',
    'pptx': 'el-icon-document',
    'txt': 'el-icon-document',
    'zip': 'el-icon-folder',
    'rar': 'el-icon-folder',
    '7z': 'el-icon-folder'
  }

  return iconMap[fileExtension] || 'el-icon-document'
}