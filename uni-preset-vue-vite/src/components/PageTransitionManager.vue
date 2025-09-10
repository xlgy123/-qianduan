<template>
  <view class="page-transition-container">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'PageTransitionManager',
  data() {
    return {
      // 记录当前过渡动画方向
      transitionDirection: '',
      // 记录上一个路由路径
      lastPath: ''
    };
  },
  created() {
    // 初始化路径
    if (getCurrentPages().length > 0) {
      const currentRoute = getCurrentPages()[getCurrentPages().length - 1].route;
      this.lastPath = currentRoute;
    }
  },
  methods: {
    // 保留方法结构，但不实际执行动画，以防其他组件调用
    handleSwipeDirection() {
      // 不执行动画
    },
    
    applyTransitionAnimation() {
      // 不执行动画
    },
    
    addTransitionClass() {
      // 不执行动画
    }
  }
};
</script>

<style>
.page-transition-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 移除所有过渡动画，保留基本结构 */
.router-view-container {
  transition: none;
}
</style> 