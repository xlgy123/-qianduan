<template>
  <view class="page-transition" :class="[animationClass, {'page-transition-active': isActive}]" v-show="isVisible">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'PageTransition',
  props: {
    isActive: {
      type: Boolean,
      default: true
    },
    // 页面切换方向: slide-left, slide-right, fade
    transitionType: {
      type: String,
      default: 'fade',
      validator: function(value) {
        return ['slide-left', 'slide-right', 'fade'].indexOf(value) !== -1
      }
    }
  },
  data() {
    return {
      animationClass: '',
      isVisible: this.isActive,
      animationDuration: 300
    }
  },
  watch: {
    isActive(newVal) {
      if (newVal) {
        this.isVisible = true;
        this.$nextTick(() => {
          void this.$el.offsetWidth;
          this.applyEnterAnimation();
        });
      } else {
        this.applyLeaveAnimation();
        setTimeout(() => {
          this.isVisible = false;
        }, this.animationDuration);
      }
    },
    transitionType() {
      if (this.isActive) {
        this.applyEnterAnimation();
      }
    }
  },
  mounted() {
    if (this.isActive) {
      this.isVisible = true;
      this.$nextTick(() => {
        this.applyEnterAnimation();
      });
    } else {
      this.isVisible = false;
    }
  },
  methods: {
    applyEnterAnimation() {
      this.animationClass = '';
      void this.$el.offsetWidth;
      
      switch(this.transitionType) {
        case 'slide-left':
          this.animationClass = 'slide-in-left';
          break;
        case 'slide-right':
          this.animationClass = 'slide-in-right';
          break;
        case 'fade':
        default:
          this.animationClass = 'fade-in';
          break;
      }
    },
    applyLeaveAnimation() {
      this.animationClass = '';
      void this.$el.offsetWidth;
      
      switch(this.transitionType) {
        case 'slide-left':
          this.animationClass = 'slide-out-right';
          break;
        case 'slide-right':
          this.animationClass = 'slide-out-left';
          break;
        case 'fade':
        default:
          this.animationClass = 'fade-out';
          break;
      }
    }
  }
}
</script>

<style>
.page-transition {
  width: 100%;
  height: auto;
  position: relative;
  animation-duration: var(--transition-duration, 0.3s);
  animation-fill-mode: both;
  animation-timing-function: var(--transition-timing, cubic-bezier(0.55, 0, 0.1, 1));
  will-change: transform, opacity;
}

.page-transition-active {
  display: block;
}

/* 动画类名 */
.slide-in-right { animation-name: slide-in-right; }
.slide-in-left { animation-name: slide-in-left; }
.slide-out-right { animation-name: slide-out-right; }
.slide-out-left { animation-name: slide-out-left; }
.fade-in { animation-name: fade-in; }
.fade-out { animation-name: fade-out; }

/* 关键帧动画 */
@keyframes slide-in-right {
  0% { transform: translateX(50px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes slide-in-left {
  0% { transform: translateX(-50px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes slide-out-right {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(50px); opacity: 0; }
}

@keyframes slide-out-left {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(-50px); opacity: 0; }
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fade-out {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
</style> 