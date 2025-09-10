<template>
  <view class="tab-transition">
    <!-- 标签头部 -->
    <view class="tabs-container" v-if="showTabs">
      <view class="tabs-inner">
        <view 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="tab" 
          :class="{ active: currentTab === index }" 
          @click="switchTab(index)"
        >
          {{ tab.label }}
          <!-- 每个标签下方有自己的下划线，只在激活时显示 -->
          <view v-if="currentTab === index" class="tab-underline"></view>
        </view>
      </view>
    </view>
    
    <!-- 标签内容区域 -->
    <view class="tab-content">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="tab-pane" 
        :class="{ 
          active: currentTab === index,
          'fadeInRight': currentTab === index && animationDirection === 'right',
          'fadeInLeft': currentTab === index && animationDirection === 'left'
        }"
      >
        <slot :name="'tab-' + index"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TabTransition',
  props: {
    // 标签配置
    tabs: {
      type: Array,
      required: true,
      // 每个标签应该有一个label属性
      validator: function(value) {
        return value.every(tab => tab.hasOwnProperty('label'))
      }
    },
    // 是否显示标签头
    showTabs: {
      type: Boolean,
      default: true
    },
    // 初始标签索引
    initialTab: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentTab: this.initialTab,
      animationDirection: 'right'
    }
  },
  methods: {
    switchTab(index) {
      if (this.currentTab === index) return;
      
      // 判断动画方向
      this.animationDirection = index > this.currentTab ? 'right' : 'left';
      
      // 更新当前标签
      this.currentTab = index;
      
      // 触发事件
      this.$emit('change', index);
    }
  }
}
</script>

<style>
/* 标签切换容器 */
.tab-transition {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 标签头容器 */
.tabs-container {
  margin-bottom: 20px;
  width: 100%;
}

.tabs-inner {
  display: flex;
  position: relative;
  border-bottom: 1px solid #eee;
}

/* 标签样式 */
.tab {
  flex: 1;
  text-align: center;
  padding: 12px 8px;
  font-weight: 500;
  color: #777;
  position: relative;
  font-size: 16px;
  transition: color 0.3s ease;
}

.tab.active {
  color: #4f70fe;
  font-weight: 600;
}

/* 标签激活下划线 */
.tab-underline {
  position: absolute;
  bottom: -1px;
  left: 25%;
  width: 50%;
  height: 3px;
  background: linear-gradient(90deg, #6084fe, #9665ff);
  border-radius: 1px;
}

/* 标签内容区域 */
.tab-content {
  position: relative;
  flex: 1;
  min-height: 200px;
}

/* 标签内容面板 */
.tab-pane {
  display: none;
  position: relative;
  width: 100%;
  flex-direction: column;
}

.tab-pane.active {
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