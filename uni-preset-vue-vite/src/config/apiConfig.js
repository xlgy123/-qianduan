// 模拟API基础URL，实际不会发送请求
export const API_BASE_URL = 'mock://api'  // 使用模拟API

// 完整导出配置对象
export default {
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true
}