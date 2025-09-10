<template>
  <view 
    class="transition-view" 
    :class="{
      active: isActive,
      'fadeInRight': isActive && direction === 'right',
      'fadeInLeft': isActive && direction === 'left'
    }"
  >
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'TransitionView',
  props: {
    // 是否激活显示
    isActive: {
      type: Boolean,
      default: false
    },
    // 动画方向: 'left' 或 'right'
    direction: {
      type: String,
      default: 'right',
      validator: function(value) {
        return ['left', 'right'].indexOf(value) !== -1
      }
    }
  }
}
</script>

<style>
.transition-view {
  display: none;
  position: relative;
  width: 100%;
  flex-direction: column;
}

.transition-view.active {
  display: flex;
}

/* 动画类 */
.fadeInRight {
  animation: fadeInRight 0.3s ease forwards;
}

.fadeInLeft {
  animation: fadeInLeft 0.3s ease forwards;
}

/* 动画关键帧 */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style> 