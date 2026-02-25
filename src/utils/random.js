/**
 * 生成指定长度的随机字符串（包含大小写字母和数字）
 * @param {number} length - 随机字符串的长度，默认为5
 * @returns {string} 生成的随机字符串
 */
export function generateRandomString(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charsLength = chars.length

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength))
  }

  return result
}

/**
 * 生成5位随机字符串（包含大小写字母和数字）
 * @returns {string} 生成的5位随机字符串
 */
export function generateRandomString5() {
  return generateRandomString(5)
}

// 生成3位随机字符串
export function generateRandomString3() {
  return generateRandomString(3)
}

// 默认导出主要方法
export default generateRandomString
