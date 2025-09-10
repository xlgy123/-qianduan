<template>
  <view class="loading-container">
    <view class="loading-spinner"></view>
    <view class="loading-text">{{ text }}</view>
  </view>
</template>

<script>
export default {
  name: 'CommonLoading',
  props: {
    text: {
      type: String,
      default: '正在加载...'
    }
  }
}
</script>

<style>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
  border: 3px solid rgba(166, 192, 254, 0.3);
  border-radius: 50%;
  border-top-color: #a6c0fe;
  animation: spinner-spin 1s ease-in-out infinite;
}

@keyframes spinner-spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: #666;
}
</style> 