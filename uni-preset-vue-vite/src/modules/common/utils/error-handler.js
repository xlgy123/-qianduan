/**
 * 通用错误处理工具
 */
import { ROUTES } from '@/utils/navigation'

// 错误类型枚举
export const ErrorType = {
  NETWORK: 'NETWORK',
  AUTH: 'AUTH',
  VALIDATION: 'VALIDATION',
  BUSINESS: 'BUSINESS',
  UNKNOWN: 'UNKNOWN'
};

// 错误处理函数
export const handleError = (error, type = ErrorType.UNKNOWN) => {
  console.error(`[${type}] 错误:`, error);

  switch (type) {
    case ErrorType.NETWORK:
      uni.showToast({
        title: '网络连接失败，请检查网络设置',
        icon: 'none'
      });
      break;
    
    case ErrorType.AUTH:
      uni.removeStorageSync('token');
      uni.redirectTo({ url: ROUTES.LOGIN });
      break;
    
    case ErrorType.VALIDATION:
      uni.showToast({
        title: error.message || '输入数据有误',
        icon: 'none'
      });
      break;
    
    case ErrorType.BUSINESS:
      uni.showToast({
        title: error.message || '操作失败',
        icon: 'none'
      });
      break;
    
    default:
      uni.showToast({
        title: '系统错误，请稍后重试',
        icon: 'none'
      });
  }
};

// 异步错误处理装饰器
export const withErrorHandler = (fn, errorType = ErrorType.UNKNOWN) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorType);
      return null;
    }
  };
}; 