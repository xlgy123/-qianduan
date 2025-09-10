<template>
  <view 
    class="swipe-detector" 
    @touchstart="handleTouchStart" 
    @touchmove="handleTouchMove" 
    @touchend="handleTouchEnd"
  >
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'SwipeDetector',
  props: {
    // 最小滑动距离（px）才触发滑动事件
    threshold: {
      type: Number,
      default: 70
    },
    // 滑动的最大持续时间（ms），超过此时间不算滑动
    maxTime: {
      type: Number,
      default: 700
    },
    // 禁用滑动检测
    disabled: {
      type: Boolean,
      default: false
    },
    // 当前页面在Tab中的索引，用于处理滑动切换
    tabIndex: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      touchStartX: 0,
      touchStartY: 0,
      touchStartTime: 0,
      isScrolling: false,
      tabPages: []
    }
  },
  created() {
    this.getTabPagesConfig();
  },
  methods: {
    getTabPagesConfig() {
      const app = getApp();
      if (app?.$options?.globalData?.tabPages) {
        this.tabPages = app.$options.globalData.tabPages;
      }
    },
    handleTouchStart(e) {
      if (this.disabled) return;
      
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchStartTime = Date.now();
      this.isScrolling = false; // 重置滚动标志
    },
    
    handleTouchMove(e) {
      if (this.disabled) return;
      
      // 计算垂直方向移动距离
      const deltaY = Math.abs(e.touches[0].clientY - this.touchStartY);
      
      // 如果垂直滚动超过一定距离，标记为垂直滚动，不处理水平滑动
      if (deltaY > 30 && !this.isScrolling) {
        this.isScrolling = true;
      }
    },
    
    handleTouchEnd(e) {
      if (this.disabled || this.isScrolling) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      // 计算水平滑动距离和时间
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = Math.abs(touchEndY - this.touchStartY);
      const deltaTime = touchEndTime - this.touchStartTime;
      
      // 如果滑动时间太长，不处理
      if (deltaTime > this.maxTime) return;
      
      // 如果垂直移动距离过大，认为是垂直滚动，不处理
      if (deltaY > 80) return;
      
      // 如果水平滑动距离超过阈值，触发滑动事件
      if (Math.abs(deltaX) > this.threshold) {
        const direction = deltaX > 0 ? 'right' : 'left';
        
        // 触发本地事件
        this.$emit('swipe', { direction });
        
        // 如果设置了tabIndex属性，则处理页面切换逻辑
        if (this.tabIndex !== -1 && this.tabPages.length > 0) {
          let targetIndex = this.tabIndex;
          
          if (direction === 'left') {
            // 向左滑动，切换到右侧页面
            targetIndex = Math.min(this.tabIndex + 1, this.tabPages.length - 1);
          } else if (direction === 'right') {
            // 向右滑动，切换到左侧页面
            targetIndex = Math.max(this.tabIndex - 1, 0);
          }
          
          // 如果目标页面与当前页面不同，执行切换
          if (targetIndex !== this.tabIndex) {
            // 触发全局滑动方向事件
            uni.$emit('swipeDirection', { 
              direction,
              fromIndex: this.tabIndex,
              toIndex: targetIndex
            });
          }
        } else {
          // 没有指定tabIndex，使用旧的全局事件模式
          uni.$emit('swipeDirection', { direction });
        }
      }
    }
  }
}
</script>

<style>
.swipe-detector {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  touch-action: pan-y; /* 允许垂直滚动，但水平滑动会被捕获 */
}
</style> 