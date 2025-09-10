<template>
  <view class="status-bar safe-area-top" :class="{'tablet-mode': isTablet}" :style="statusBarStyle">
    <view class="app-name">
      <text class="app-title">学习达人</text>
    </view>
    <view class="action-buttons">
      <view class="action-btn" @click="onNotification">
        <text class="iconfont icon-notification">📣</text>
      </view>
      <view class="action-btn" @click="onSettings">
        <text class="iconfont icon-settings">⚙️</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'StatusBar',
  props: {
    userInfo: {
      type: Object,
      default: () => ({
        username: '学习达人',
        avatar: '/static/default-avatar.png',
        todayHours: '2',
        totalHours: '128'
      })
    },
    isTablet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusBarStyle: {}
    }
  },
  created() {
    this.getStatusBarHeight();
  },
  methods: {
    getStatusBarHeight() {
      try {
        const app = getApp();
        if (app && app.$options.globalData) {
          const statusBarHeight = app.$options.globalData.statusBarHeight || 0;
          this.statusBarStyle = {
            paddingTop: statusBarHeight + 'px'
          };
        } else {
          // 从uni API获取
          uni.getSystemInfo({
            success: (res) => {
              this.statusBarStyle = {
                paddingTop: res.statusBarHeight + 'px'
              };
            }
          });
        }
      } catch (e) {
        console.error('获取状态栏高度失败', e);
      }
    },
    onNotification() {
      this.$emit('notification');
    },
    onSettings() {
      this.$emit('settings');
    }
  }
}
</script>

<style>
/* 顶部状态栏 */
.status-bar {
  padding: 15px 20px; /* 减少内边距 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, rgba(166, 192, 254, 0.8), rgba(194, 168, 253, 0.8));
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0 4px 12px rgba(166, 192, 254, 0.2);
  will-change: transform;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 100;
}

.app-name {
  display: flex;
  align-items: center;
}

.app-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
}

.action-btn {
  width: 38px; /* 减小按钮尺寸 */
  height: 38px;
  border-radius: 19px;
  background-color: rgba(255, 255, 255, 0.2);
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.action-btn:hover,
.action-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.iconfont {
  font-size: 20px; /* 减小图标尺寸 */
  color: #ffffff;
  line-height: 1;
}

/* 平板适配 */
@media screen and (min-width: 768px) {
  .status-bar.tablet-mode {
    border-radius: 20px;
    margin-top: 15px;
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style> 