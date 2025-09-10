<template>
  <section-transition 
    :active="active" 
    :index="index" 
    :lastActiveIndex="lastActiveIndex"
    :direction="direction"
  >
    <view class="module-panel" :style="panelStyle">
      <slot></slot>
      
      <!-- 底部填充区域，避免内容被TabBar遮挡 -->
      <view class="bottom-spacer"></view>
    </view>
  </section-transition>
</template>

<script>
import SectionTransition from './SectionTransition.vue';

export default {
  name: 'ModulePanel',
  components: {
    SectionTransition
  },
  props: {
    // 是否为活动模块
    active: {
      type: Boolean,
      default: false
    },
    // 模块索引
    index: {
      type: Number,
      default: 0
    },
    // 上一个激活的模块索引
    lastActiveIndex: {
      type: Number,
      default: -1
    },
    // 过渡方向
    direction: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {
      panelStyle: {
        willChange: 'transform, opacity',
      }
    };
  },
  watch: {
    active(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          // 强制重排
          void this.$el.offsetWidth;
        });
      }
    }
  }
}
</script>

<style>
.module-panel {
  width: 100%;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.bottom-spacer {
  height: 60px; /* 根据TabBar的高度调整 */
  width: 100%;
}

/* 平板适配 */
@media screen and (min-width: 768px) {
  .module-panel {
    border-radius: 20px;
    padding: 20px;
  }
  
  .bottom-spacer {
    height: 70px; /* 平板设备TabBar可能更高 */
  }
}
</style> 