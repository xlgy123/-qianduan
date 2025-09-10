<template>
  <swipe-detector class="full-container" :tab-index="3">
    <view class="notification-container">
      <!-- 顶部背景延伸，防止上拉露白 -->
      <view class="header-extension"></view>
      
      <!-- 可滚动内容区域，包含所有内容 -->
      <scroll-view 
        scroll-y="true" 
        class="scrollable-content full-scroll" 
        :bounce="true"
        :show-scrollbar="false"
        :refresher-enabled="false"
      >
        <!-- 顶部用户信息卡片 -->
        <view class="user-header">
          <view class="blur-bg"></view>
          <view class="user-card">
            <image class="avatar" :src="userInfo.avatar || '/src/static/avatar/default-avatar.png'" mode="aspectFill"></image>
            <view class="user-info">
              <text class="username">{{userInfo.username || '学习达人'}}</text>
            </view>
            <view class="settings-button" @click="goToSettings">
              <text class="settings-icon">⚙️</text>
            </view>
          </view>
          <view class="stats-row">
            <view class="notification-stat-item">
              <text class="notification-stat-value">{{unreadCount}}</text>
              <text class="notification-stat-label">未读消息</text>
            </view>
            <view class="notification-stat-item">
              <text class="notification-stat-value">{{totalNotifications}}</text>
              <text class="notification-stat-label">总消息</text>
            </view>
            <view class="notification-stat-item">
              <text class="notification-stat-value">{{todayNotifications}}</text>
              <text class="notification-stat-label">今日消息</text>
            </view>
            <view class="notification-stat-item">
              <text class="notification-stat-value">{{notificationsBadge}}</text>
              <text class="notification-stat-label">提醒</text>
            </view>
          </view>
        </view>
        
        <!-- 消息筛选 -->
        <view class="filter-section">
          <view 
            class="filter-option" 
            :class="{ active: currentFilter === filter.value }" 
            v-for="filter in filters" 
            :key="filter.value"
            @click="currentFilter = filter.value"
          >
            {{ filter.label }}
          </view>
        </view>
        
        <!-- 消息列表 -->
        <view class="notification-list">
          <view 
            class="notification-item" 
            v-for="(notification, index) in filteredNotifications" 
            :key="index"
            :class="{ unread: !notification.read }"
          >
            <view class="notification-icon">
              <text :class="getNotificationIcon(notification.type)"></text>
            </view>
            <view class="notification-content">
              <view class="notification-header">
                <text class="notification-title">{{ notification.title }}</text>
                <text class="notification-time">{{ formatDate(notification.time) }}</text>
              </view>
              <text class="notification-message">{{ notification.message }}</text>
            </view>
            <view class="notification-badge" v-if="notification.badge">
              {{ notification.badge }}
            </view>
          </view>
          
          <view v-if="filteredNotifications.length === 0" class="empty-notification-list">
            <text class="empty-icon">🔔</text>
            <text class="empty-text">暂无消息</text>
          </view>
        </view>
        
        <!-- 标记全部已读按钮 -->
        <view class="mark-all-read">
          <button class="mark-all-btn" @click="markAllAsRead">标记全部已读</button>
        </view>
        
        <!-- 底部填充，确保能滚动到底部 -->
        <view style="height: 60px;"></view>
      </scroll-view>
      
      <!-- 底部导航栏 -->
      <view class="tab-bar-wrapper">
        <tab-bar :current="3" @tabChange="handleTabChange"></tab-bar>
      </view>
    </view>
  </swipe-detector>
</template>

<script>
import TabBar from '@/components/TabBar.vue';
import SwipeDetector from '@/components/SwipeDetector.vue';
import { Navigation } from '@/utils/navigation';
import { userStore } from '@/store/userStore';

export default {
  components: {
    TabBar,
    SwipeDetector
  },
  data() {
    return {
      userInfo: userStore.getState(),
      notifications: [],
      currentFilter: 'all',
      filters: [
        { value: 'all', label: '全部' },
        { value: 'unread', label: '未读' },
        { value: 'system', label: '系统消息' },
        { value: 'achievement', label: '成就' },
        { value: 'reminder', label: '提醒' }
      ]
    };
  },
  computed: {
    unreadCount() {
      return this.notifications.filter(n => !n.read).length;
    },
    totalNotifications() {
      return this.notifications.length;
    },
    todayNotifications() {
      const today = new Date().toISOString().split('T')[0];
      return this.notifications.filter(n => n.date === today).length;
    },
    notificationsBadge() {
      return this.notifications.filter(n => n.badge && n.type === 'reminder').length;
    },
    filteredNotifications() {
      if (this.currentFilter === 'unread') {
        return this.notifications.filter(n => !n.read);
      } else if (this.currentFilter === 'system') {
        return this.notifications.filter(n => n.type === 'system');
      } else if (this.currentFilter === 'achievement') {
        return this.notifications.filter(n => n.type === 'achievement');
      } else if (this.currentFilter === 'reminder') {
        return this.notifications.filter(n => n.type === 'reminder');
      }
      return this.notifications;
    }
  },
  onLoad() {
    this.checkUserLogin();
    this.loadNotifications();
  },
  methods: {
    checkUserLogin() {
      Navigation.checkLoginStatus();
    },
    loadNotifications() {
      try {
        const notificationsData = uni.getStorageSync('notifications');
        if (notificationsData) {
          this.notifications = JSON.parse(notificationsData);
        } else {
          // 如果没有存储的消息，初始化一些示例数据
          this.notifications = [
            {
              id: 1,
              title: '欢迎使用线上自习室',
              message: '感谢您加入我们的学习社区！祝您学习愉快。',
              type: 'system',
              time: new Date().toISOString(),
              date: new Date().toISOString().split('T')[0],
              read: true,
              badge: null
            },
            {
              id: 2,
              title: '学习目标提醒',
              message: '您今天的学习目标还有30分钟未完成！',
              type: 'reminder',
              time: new Date(Date.now() - 3600000).toISOString(), // 1小时前
              date: new Date().toISOString().split('T')[0],
              read: false,
              badge: 1
            },
            {
              id: 3,
              title: '新成就解锁',
              message: '恭喜您解锁了"学习达人"成就！',
              type: 'achievement',
              time: new Date(Date.now() - 86400000).toISOString(), // 1天前
              date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
              read: true,
              badge: null
            }
          ];
          this.saveNotifications();
        }
      } catch (e) {
        console.error('加载通知失败:', e);
        // 初始化示例数据
        this.notifications = [
          {
            id: 1,
            title: '欢迎使用线上自习室',
            message: '感谢您加入我们的学习社区！祝您学习愉快。',
            type: 'system',
            time: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
            read: true,
            badge: null
          },
          {
            id: 2,
            title: '学习目标提醒',
            message: '您今天的学习目标还有30分钟未完成！',
            type: 'reminder',
            time: new Date(Date.now() - 3600000).toISOString(), // 1小时前
            date: new Date().toISOString().split('T')[0],
            read: false,
            badge: 1
          },
          {
            id: 3,
            title: '新成就解锁',
            message: '恭喜您解锁了"学习达人"成就！',
            type: 'achievement',
            time: new Date(Date.now() - 86400000).toISOString(), // 1天前
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            read: true,
            badge: null
          }
        ];
        this.saveNotifications();
      }
    },
    saveNotifications() {
      try {
        uni.setStorageSync('notifications', JSON.stringify(this.notifications));
      } catch (e) {
        console.error('保存通知失败:', e);
      }
    },
    markAllAsRead() {
      this.notifications.forEach(notification => {
        if (!notification.read) {
          notification.read = true;
        }
      });
      this.saveNotifications();
      uni.showToast({
        title: '已标记全部为已读',
        icon: 'success'
      });
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / 60000);
      
      if (diffMinutes < 60) {
        return diffMinutes + '分钟前';
      } else if (diffMinutes < 1440) {
        return Math.floor(diffMinutes / 60) + '小时前';
      } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
      }
    },
    getNotificationIcon(type) {
      switch (type) {
        case 'system':
          return '🔵';
        case 'achievement':
          return '🏆';
        case 'reminder':
          return '⏰';
        default:
          return '⚪';
      }
    },
    goToSettings() {
      uni.showToast({
        title: '设置功能开发中',
        icon: 'none'
      });
    },
    handleTabChange(data) {
      if (data && data.route) {
        Navigation.switchTab(data.route);
      }
    }
  }
}
</script>

<style>
.full-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.notification-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  background-color: #f8f3ff;
  padding: 0;
  margin: 0;
  overflow: hidden; /* 防止容器本身滚动 */
  padding-bottom: 50px; /* 为底部导航栏腾出空间 */
}

/* 顶部背景延伸，防止上拉露白 */
.header-extension {
  height: 100px;
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  position: absolute;
  top: -100px;
  left: 0;
  right: 0;
  z-index: 1;
}

/* 顶部用户卡片 */
.user-header {
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  padding: 30px 20px 20px;
  position: relative;
  margin-bottom: 20px;
  /* 防止滑动时看到上方白色 */
  margin-top: -1px;
  padding-top: 31px;
  /* 增加阴影效果，突出层次感 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  /* 确保在延伸背景之上 */
  z-index: 2;
}

.blur-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(166, 192, 254, 0.8), rgba(194, 168, 253, 0.9));
  filter: blur(5px);
  opacity: 0.5;
  z-index: 0;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}

.user-card {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 35px;
  border: 3px solid rgba(255, 255, 255, 0.7);
}

.user-info {
  flex: 1;
  padding-left: 15px;
}

.username {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.settings-button {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.settings-icon {
  font-size: 20px;
}

/* 通知统计栏 */
.notification-stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.notification-stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
}

.notification-stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* 消息筛选 */
.filter-section {
  display: flex;
  margin: 0 15px 15px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.filter-option {
  flex: 1;
  padding: 12px 0;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.filter-option.active {
  color: #a6c0fe;
  font-weight: 500;
  background-color: rgba(166, 192, 254, 0.1);
}

/* 消息列表 */
.notification-list {
  padding: 0 15px;
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  position: relative;
}

.notification-item.unread {
  background-color: rgba(166, 192, 254, 0.1);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 18px;
}

.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.notification-title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.notification-time {
  font-size: 12px;
  color: #999;
}

.notification-message {
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notification-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff5252;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 15px;
  right: 15px;
}

/* 空消息列表 */
.empty-notification-list {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.empty-text {
  font-size: 16px;
}

/* 标记全部已读按钮 */
.mark-all-read {
  padding: 15px;
  margin-top: 10px;
}

.mark-all-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(to right, #a6c0fe, #c2a8fd);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
}

/* 底部导航栏容器样式 */
.tab-bar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* 可滚动内容区域 */
.scrollable-content {
  flex: 1;
  padding-bottom: 5px;
  -webkit-overflow-scrolling: touch; /* 增加iOS滑动流畅度 */
}

/* 全屏滚动区域 */
.full-scroll {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px; /* 为底部导航栏留出空间 */
  z-index: 5;
}
</style>