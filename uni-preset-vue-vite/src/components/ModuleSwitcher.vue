<template>
  <view class="module-switcher">
    <!-- 顶部标签 -->
    <view class="module-tabs">
      <view 
        v-for="(module, index) in modules" 
        :key="index"
        class="module-tab" 
        :class="{ active: currentIndex === index }"
        @click="switchModule(index)"
      >
        <text>{{ module.title }}</text>
        <view class="tab-indicator" v-if="currentIndex === index"></view>
      </view>
      
      <!-- 滑块指示器 -->
      <view class="tab-slider" :style="sliderStyle"></view>
    </view>
    
    <!-- 模块内容区域 -->
    <view class="module-content">
      <slot 
        v-for="(module, index) in modules" 
        :name="'module-' + index" 
        :active="currentIndex === index"
        :index="index"
        :lastActiveIndex="lastActiveIndex"
      ></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ModuleSwitcher',
  props: {
    // 模块配置信息
    modules: {
      type: Array,
      required: true,
      validator: (value) => value.every(module => module.hasOwnProperty('title'))
    },
    // 初始激活的模块索引
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: this.initialIndex,
      lastActiveIndex: -1,
      isAnimating: false,
      sliderStyle: {
        left: '0%',
        width: '25%', // 默认值，会在mounted中更新
        transform: 'translateZ(0)' // 启用GPU加速
      }
    };
  },
  watch: {
    initialIndex(newVal) {
      if (newVal !== this.currentIndex) {
        this.switchModule(newVal);
      }
    }
  },
  mounted() {
    // 初始化滑块位置和宽度
    this.$nextTick(() => {
      this.updateSlider(this.currentIndex);
    });
    
    // 监听窗口大小变化，更新滑块位置
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // 移除事件监听
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // 切换模块
    switchModule(index) {
      if (this.isAnimating || index === this.currentIndex) return;
      
      this.isAnimating = true;
      this.lastActiveIndex = this.currentIndex;
      this.currentIndex = index;
      
      // 更新滑块位置
      this.updateSlider(index);
      
      // 发送切换事件
      this.$emit('module-change', {
        currentIndex: this.currentIndex,
        lastActiveIndex: this.lastActiveIndex,
        moduleData: this.modules[this.currentIndex]
      });
      
      // 动画完成后重置标志
      setTimeout(() => {
        this.isAnimating = false;
      }, 400);
    },
    
    // 处理窗口大小变化
    handleResize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      
      // 防抖，避免频繁触发
      this.resizeTimer = setTimeout(() => {
        this.updateSlider(this.currentIndex);
      }, 200);
    },
    
    // 更新滑块位置
    updateSlider(index = this.currentIndex) {
      // 强制重排
      void this.$el.offsetWidth;
      
      const tabWidth = 100 / this.modules.length;
      this.sliderStyle = {
        left: `${index * tabWidth}%`,
        width: `${tabWidth}%`,
        transform: 'translateZ(0)' // 启用GPU加速
      };
    }
  }
}
</script>

<style>
.module-switcher {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
}

.module-tabs {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: #ffffff;
  border-radius: 16px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 2px;
  position: relative;
  overflow: hidden;
  will-change: transform;
}

.module-tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 12px 0;
  border-radius: 14px;
  transition: all 0.3s ease;
  z-index: 1;
}

.module-tab.active {
  color: #8a9eef;
  font-weight: 500;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: linear-gradient(90deg, #a6c0fe, #c2a8fd);
  border-radius: 3px;
}

/* 滑块 */
.tab-slider {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 25%;
  background: linear-gradient(90deg, rgba(166, 192, 254, 0.15), rgba(194, 168, 253, 0.15));
  border-radius: 14px;
  transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 0;
  will-change: transform, left;
}

.module-content {
  position: relative;
  width: 100%;
  min-height: 150px; /* 确保内容区域有最小高度 */
  overflow: hidden;
}

/* 平板适配 */
@media screen and (min-width: 768px) {
  .module-tabs {
    border-radius: 20px;
  }
  
  .module-tab {
    border-radius: 18px;
    padding: 14px 0;
  }
  
  .tab-indicator {
    width: 30px;
    height: 4px;
  }
  
  .tab-slider {
    border-radius: 18px;
  }
}
</style> 