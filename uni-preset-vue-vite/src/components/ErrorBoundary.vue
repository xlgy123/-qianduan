<template>
  <view class="error-boundary" v-if="hasError">
    <view class="error-container">
      <view class="error-icon">⚠️</view>
      <view class="error-title">出错了</view>
      <view class="error-message">{{ errorMessage }}</view>
      <button class="retry-button" @click="handleRetry">重试</button>
    </view>
  </view>
  <slot v-else></slot>
</template>

<script>
export default {
  name: 'ErrorBoundary',
  props: {
    fallback: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      hasError: false,
      error: null,
      errorMessage: '应用加载出错，请重试'
    }
  },
  errorCaptured(err, instance, info) {
    this.error = err;
    this.hasError = true;
    
    // 提取更友好的错误信息
    if (err && err.message) {
      if (err.message.includes('Failed to fetch dynamically imported module')) {
        this.errorMessage = '网络连接问题，请检查网络后重试';
      } else if (err.message.includes('TypeError')) {
        this.errorMessage = '应用资源加载失败，请重试';
      } else {
        this.errorMessage = err.message;
      }
    }
    
    console.error('错误已捕获:', err, info);

    // 阻止错误继续向上传播
    return false;
  },
  methods: {
    handleRetry() {
      this.hasError = false;
      this.error = null;
      
      // 刷新页面
      const pages = getCurrentPages();
      if (pages && pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const route = '/' + currentPage.route;
        
        uni.redirectTo({
          url: route
        });
      } else {
        // 如果获取不到当前页面，则回到首页
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }
    }
  }
}
</script>

<style>
.error-boundary {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f3ff;
  z-index: 9999;
}

.error-container {
  width: 80%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 16px;
  padding: 30px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.error-message {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;
}

.retry-button {
  background: linear-gradient(90deg, #a6c0fe, #c2a8fd);
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 16px;
  margin-top: 16px;
  width: 60%;
}
</style> 