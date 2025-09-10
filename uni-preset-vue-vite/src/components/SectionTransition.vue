<template>
  <view class="section-transition" v-show="isVisible">
    <view class="section-content" :class="animationClass" :style="contentStyle">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SectionTransition',
  props: {
    // 是否激活当前区块
    active: {
      type: Boolean,
      default: true
    },
    // 当前区块索引，用于计算动画方向
    index: {
      type: Number,
      default: 0
    },
    // 上一个活动的区块索引
    lastActiveIndex: {
      type: Number,
      default: -1
    },
    // 切换方向，可选值: auto(根据索引自动判断), left, right, fade
    direction: {
      type: String,
      default: 'auto',
      validator: (value) => ['auto', 'left', 'right', 'fade'].includes(value)
    }
  },
  data() {
    return {
      animationClass: '',
      isVisible: this.active,
      contentStyle: {
        transform: 'translateX(0)',
        opacity: 1
      }
    };
  },
  watch: {
    active: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.enter();
        } else {
          this.leave();
        }
      }
    }
  },
  methods: {
    // 进入动画
    enter() {
      this.isVisible = true;
      
      // 使用nextTick确保DOM已更新
      this.$nextTick(() => {
        // 清除旧的动画类和样式
        this.animationClass = '';
        this.contentStyle = {
          transform: 'translateX(0)',
          opacity: 1
        };
        
        // 强制重排
        void this.$el.offsetWidth;
        
        const direction = this.getDirection();
        
        switch(direction) {
          case 'left':
            this.animationClass = 'section-slide-in-left';
            break;
          case 'right':
            this.animationClass = 'section-slide-in-right';
            break;
          case 'fade':
          default:
            this.animationClass = 'section-fade-in';
            break;
        }
      });
    },
    
    // 离开动画
    leave() {
      // 清除旧的动画类
      this.animationClass = '';
      
      // 强制重排
      void this.$el.offsetWidth;
      
      const direction = this.getDirection();
      
      switch(direction) {
        case 'left':
          this.animationClass = 'section-slide-out-left';
          break;
        case 'right':
          this.animationClass = 'section-slide-out-right';
          break;
        case 'fade':
        default:
          this.animationClass = 'section-fade-out';
          break;
      }
      
      // 等待动画完成后设置不可见
      setTimeout(() => {
        this.isVisible = false;
        this.contentStyle = {
          transform: 'translateX(0)',
          opacity: 1
        };
      }, 300); // 与CSS动画持续时间一致
    },
    
    // 获取动画方向
    getDirection() {
      if (this.direction !== 'auto') {
        return this.direction;
      }
      
      // 自动判断方向
      if (this.lastActiveIndex === -1 || this.index === this.lastActiveIndex) {
        return 'fade';
      }
      
      return this.index > this.lastActiveIndex ? 'right' : 'left';
    }
  }
}
</script>

<style>
.section-transition {
  position: relative;
  width: 100%;
  margin-bottom: 15px;
  overflow: hidden;
}

.section-content {
  position: relative;
  width: 100%;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, opacity;
}

/* 淡入淡出动画 */
.section-fade-in {
  animation-name: section-fade-in;
}

.section-fade-out {
  animation-name: section-fade-out;
}

/* 左右滑动动画 */
.section-slide-in-right {
  animation-name: section-slide-in-right;
}

.section-slide-in-left {
  animation-name: section-slide-in-left;
}

.section-slide-out-right {
  animation-name: section-slide-out-right;
}

.section-slide-out-left {
  animation-name: section-slide-out-left;
}

/* 动画关键帧 */
@keyframes section-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes section-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes section-slide-in-right {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes section-slide-in-left {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes section-slide-out-right {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(50px);
    opacity: 0;
  }
}

@keyframes section-slide-out-left {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50px);
    opacity: 0;
  }
}
</style> 