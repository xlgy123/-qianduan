<template>
  <view class="tab-bar-container" :class="{ 'tablet-mode': isTablet, 'safe-area-padding': hasSafeArea, 'compact-mode': isCompact }">
    <view 
      v-for="(item, index) in tabList" 
      :key="index" 
      class="tab-item" 
      :class="{ active: currentTab === index }"
      @click="switchTab(index, item.pagePath)"
    >
      <view class="tab-icon-wrapper">
        <text class="tab-icon-text">{{item.iconText}}</text>
        <view v-if="item.badge" class="badge">{{item.badge}}</view>
      </view>
      <text class="tab-text">{{item.text}}</text>
      <view v-if="currentTab === index" class="tab-indicator"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    current: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isTablet: false,
      isCompact: false,
      hasSafeArea: false,
      currentTab: this.current,
      safeAreaBottom: 0,
      screenWidth: 0,
      tabList: [
        {
          text: '主页',
          pagePath: '/pages/home/home',
          iconText: '🏠',
          badge: ''
        },
        {
          text: '社区',
          pagePath: '/pages/community/community',
          iconText: '💬',
          badge: ''
        },
        {
          text: '好友',
          pagePath: '/pages/friends/friends',
          iconText: '👥',
          badge: ''
        },
        {
          text: '消息',
          pagePath: '/pages/message/message',
          iconText: '💌',
          badge: ''
        },

        {
          text: '我的',
          pagePath: '/pages/profile/profile',
          iconText: '👤',
          badge: ''
        }
      ]
    }
  },
  created() {
    this.getSystemInfo();
    
    uni.$on('tabIndexUpdate', (data) => {
      if (data && typeof data.index !== 'undefined') {
        this.currentTab = data.index;
      }
    });

    // 监听窗口大小变化
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
    }
  },
  beforeDestroy() {
    uni.$off('tabIndexUpdate');
    
    // 移除窗口大小变化监听
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
    }
  },
  watch: {
    current: {
      handler(newVal) {
        this.currentTab = newVal;
      },
      immediate: true
    }
  },
  methods: {
    handleResize() {
      // 防抖处理
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      
      this.resizeTimer = setTimeout(() => {
        this.getSystemInfo();
      }, 300);
    },
    
    getSystemInfo() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        // 获取屏幕宽度
        this.screenWidth = systemInfo.windowWidth;
        // 判断是否为平板
        this.isTablet = this.screenWidth >= 768;
        // 判断是否为小屏
        this.isCompact = this.screenWidth <= 360;
        
        // 检查是否有安全区域（如iPhone X及以上的刘海屏）
        const safeArea = systemInfo.safeArea;
        if (safeArea && systemInfo.screenHeight) {
          this.safeAreaBottom = systemInfo.screenHeight - safeArea.bottom;
          this.hasSafeArea = this.safeAreaBottom > 0;
        }
        
        // 存储到全局数据中
        const app = getApp();
        if (app?.$options?.globalData) {
          app.$options.globalData.isTablet = this.isTablet;
          app.$options.globalData.isCompact = this.isCompact;
          app.$options.globalData.safeAreaInsets = {
            bottom: this.safeAreaBottom
          };
        }
      } catch (e) {
        console.error('获取设备信息失败:', e);
      }
    },
    
    switchTab(index, path) {
      if (this.currentTab === index) return;
      
      const previousTab = this.currentTab;
      const direction = index > previousTab ? 'left' : 'right';
      
      this.$emit('tabChange', {index, path});
      uni.$emit('swipeDirection', { direction });
      
      // 先尝试普通导航
      uni.navigateTo({
        url: path,
        success: () => {
          this.currentTab = index;
          uni.$emit('tabIndexUpdate', {
            index: index,
            path: path
          });
        },
        fail: (err) => {
          // 导航失败则尝试重定向
          uni.redirectTo({
            url: path,
            success: () => {
              this.currentTab = index;
              uni.$emit('tabIndexUpdate', {
                index: index,
                path: path
              });
            },
            fail: (redirectErr) => {
              console.error('所有导航方式都失败:', redirectErr);
              this.$emit('tabChange', {index: previousTab, error: redirectErr});
            }
          });
        }
      });
    }
  }
}
</script>

<style>
.tab-bar-container {
  width: 100%;
  height: 56px;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  will-change: transform;
  transition: transform 0.3s ease;
  box-sizing: border-box;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  padding-bottom: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* 安全区域适配 */
.safe-area-padding {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  height: calc(56px + constant(safe-area-inset-bottom));
  height: calc(56px + env(safe-area-inset-bottom));
}

/* 平板和宽屏设备适配 */
@media screen and (min-width: 768px) {
  .tab-bar-container {
    max-width: 768px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 16px 16px 0 0;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-bottom: none;
  }
  
  .safe-area-padding {
    border-bottom: none;
  }
}

/* 中等尺寸屏幕 */
@media screen and (max-width: 480px) {
  .tab-bar-container {
    height: 52px;
  }
  
  .tab-icon-text {
    font-size: 22px;
  }
  
  .tab-text {
    font-size: 11px;
  }
  
  .safe-area-padding {
    height: calc(52px + constant(safe-area-inset-bottom));
    height: calc(52px + env(safe-area-inset-bottom));
  }
}

/* 小屏设备适配 */
@media screen and (max-width: 360px) {
  .tab-bar-container {
    height: 48px;
  }
  
  .tab-icon-text {
    font-size: 20px;
  }
  
  .tab-text {
    font-size: 10px;
  }
  
  .safe-area-padding {
    height: calc(48px + constant(safe-area-inset-bottom));
    height: calc(48px + env(safe-area-inset-bottom));
  }
}

/* 平板模式样式 */
.tablet-mode {
  max-width: 768px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
}

/* 小屏模式 */
.compact-mode .tab-item {
  padding: 2px 0;
}

.compact-mode .tab-icon-text {
  font-size: 18px;
}

.compact-mode .tab-text {
  font-size: 9px;
  margin-top: 0;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  padding: 5px 0;
  transition: all 0.2s ease;
}

.tab-icon-wrapper {
  position: relative;
  margin-bottom: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab-icon-text {
  font-size: 24px;
  line-height: 1;
  transition: transform 0.2s ease;
}

.tab-text {
  font-size: 12px;
  color: #7A7E83;
  line-height: 1.4;
}

.tab-item.active .tab-text {
  color: var(--primary-color, #a6c0fe);
  font-weight: 500;
}

.tab-item.active .tab-icon-text {
  transform: scale(1.1);
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  width: 24px;
  height: 3px;
  background: var(--primary-gradient, linear-gradient(90deg, #a6c0fe, #c2a8fd));
  border-radius: 3px 3px 0 0;
  transition: width 0.2s ease;
}

.badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: #ff5252;
  color: white;
  font-size: 10px;
  border-radius: 10px;
  padding: 0 5px;
  min-width: 16px;
  height: 16px;
  text-align: center;
  line-height: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 平板模式下的调整 */
.tablet-mode .tab-item {
  padding: 8px 0;
}

.tablet-mode .tab-icon-text {
  font-size: 28px;
}

.tablet-mode .tab-text {
  font-size: 14px;
}

.tablet-mode .tab-indicator {
  width: 30px;
  height: 4px;
}

.tablet-mode .badge {
  min-width: 18px;
  height: 18px;
  font-size: 11px;
  line-height: 18px;
}

/* 激活项的悬停效果 */
@media (hover: hover) {
  .tab-item:hover:not(.active) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  .tab-item.active:hover .tab-indicator {
    width: 28px;
  }
  
  .tablet-mode .tab-item.active:hover .tab-indicator {
    width: 36px;
  }
}
</style> 