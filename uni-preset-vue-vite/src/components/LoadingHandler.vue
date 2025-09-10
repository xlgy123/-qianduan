<template>
  <!-- 移除加载动画，直接显示内容 -->
  <slot></slot>
</template>

<script>
export default {
  name: 'LoadingHandler',
  props: {
    timeout: {
      type: Number,
      default: 15000 // 默认15秒超时，保留但不使用
    },
    loadingText: {
      type: String,
      default: '加载中...' // 保留但不使用
    }
  }
  // 移除所有加载相关逻辑
}
</script>

<style>
/* 保留样式但不会被使用 */
.loading-container {
  display: none;
}
</style> 