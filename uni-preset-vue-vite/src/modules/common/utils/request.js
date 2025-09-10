/**
 * 通用请求工具模块
 */
import { handleError, ErrorType } from './error-handler'
import { setupMockApi } from '@/utils/mockApi'

// 启用模拟API服务
setupMockApi();

// 基础请求配置
const BASE_URL = '';
const DEFAULT_TIMEOUT = 10000;

// 请求拦截器
const requestInterceptor = (config) => {
  const token = uni.getStorageSync('token');
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`
    };
  }
  return config;
};

// 响应拦截器
const responseInterceptor = (response) => {
  if (response.statusCode === 401) {
    handleError(new Error('未授权'), ErrorType.AUTH);
    return Promise.reject(new Error('未授权'));
  }
  return response.data;
};

// 统一请求方法
const request = (options) => {
  const { url, method = 'GET', data, timeout = DEFAULT_TIMEOUT } = options;
  
  // 应用请求拦截器
  const config = requestInterceptor({
    url: `${BASE_URL}${url}`,
    method,
    data,
    timeout
  });

  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: (res) => {
        try {
          const result = responseInterceptor(res);
          resolve(result);
        } catch (error) {
          handleError(error, ErrorType.NETWORK);
          reject(error);
        }
      },
      fail: (error) => {
        handleError(error, ErrorType.NETWORK);
        reject(error);
      }
    });
  });
};

// 导出请求方法
export const http = {
  get: (url, params = {}) => request({ url, method: 'GET', data: params }),
  post: (url, data = {}) => request({ url, method: 'POST', data }),
  put: (url, data = {}) => request({ url, method: 'PUT', data }),
  delete: (url, data = {}) => request({ url, method: 'DELETE', data })
};