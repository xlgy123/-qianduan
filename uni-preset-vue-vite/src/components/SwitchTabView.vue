<template>
  <view class="switch-tab-view">
    <!-- 选择器头部 -->
    <view class="switch-selector">
      <view 
        v-for="(option, index) in options" 
        :key="index"
        class="switch-option" 
        :class="{ active: currentIndex === index }" 
        @click="switchOption(index)"
      >
        {{ option.label }}
      </view>
      <!-- 滑块元素 -->
      <view class="switch-slider" :style="sliderStyle"></view>
    </view>
    
    <!-- 内容区域 -->
    <view class="switch-content">
      <view 
        v-for="(option, index) in options" 
        :key="index"
        class="switch-pane" 
        :class="{ 
          active: currentIndex === index,
          'fadeInRight': currentIndex === index && animationDirection === 'right',
          'fadeInLeft': currentIndex === index && animationDirection === 'left'
        }"
      >
        <slot :name="'option-' + index"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SwitchTabView',
  props: {
    // 选项配置
    options: {
      type: Array,
      required: true,
      // 每个选项应该有一个label属性
      validator: function(value) {
        return value.every(option => option.hasOwnProperty('label'))
      }
    },
    // 初始选项索引
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: this.initialIndex,
      animationDirection: 'right',
      sliderStyle: {
        left: '0%',
        width: (100 / this.options.length) + '%'
      }
    }
  },
  mounted() {
    // 初始化滑块位置
    this.updateSlider(this.currentIndex);
  },
  methods: {
    switchOption(index) {
      if (this.currentIndex === index) return;
      
      // 判断动画方向
      this.animationDirection = index > this.currentIndex ? 'right' : 'left';
      
      // 更新滑块位置
      this.updateSlider(index);
      
      // 更新当前选项
      this.currentIndex = index;
      
      // 触发事件
      this.$emit('change', index);
    },
    updateSlider(index) {
      const optionWidth = 100 / this.options.length;
      this.sliderStyle.left = (index * optionWidth) + '%';
    }
  }
}
</script>

<style>
/* 切换视图容器 */
.switch-tab-view {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 选择器样式 */
.switch-selector {
  display: flex;
  position: relative;
  background-color: rgba(241, 241, 241, 0.7);
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  padding: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.switch-option {
  flex: 1;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  color: #666;
  border-radius: 10px;
  transition: color 0.3s ease;
  cursor: pointer;
  z-index: 2;
  position: relative;
  background-color: transparent;
}

.switch-option.active {
  color: white;
  font-weight: 500;
}

/* 滑块样式 */
.switch-slider {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  width: 50%;
  background: linear-gradient(90deg, #a6c0fe, #c2a8fd);
  border-radius: 10px;
  transition: left 0.3s ease;
  z-index: 1;
  box-shadow: 0 4px 10px rgba(166, 192, 254, 0.3);
}

/* 内容区域 */
.switch-content {
  position: relative;
  flex: 1;
}

/* 选项内容面板 */
.switch-pane {
  display: none;
  position: relative;
  width: 100%;
  flex-direction: column;
}

.switch-pane.active {
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