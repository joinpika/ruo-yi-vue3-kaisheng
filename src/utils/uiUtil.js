/**
 * UI工具类 - 封装UI相关的工具函数
 */
export const uiUtil = {
  /**
   * 根据布尔值设置颜色
   * @param {boolean} val - 布尔值，true表示成功/有效状态，false表示普通/无效状态
   * @returns {string} - 返回对应的颜色值
   */
  setColor: function(val) {
    if (val) {
      return "#2bc418"; // 绿色，表示成功/有效状态
    } else {
      return "#b3bdbb"; // 灰色，表示普通/无效状态
    }
  },
  
  /**
   * 根据布尔值设置图标
   * @param {boolean} val - 布尔值，true表示成功/完成状态，false表示等待/进行中状态
   * @returns {string} - 返回对应的图标类名
   */
  setIcon: function(val) {
    if (val) {
      return "el-icon-check"; // 勾选图标
    } else {
      return "el-icon-time"; // 时钟图标
    }
  }
};