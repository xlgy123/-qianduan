<template>
  <swipe-detector class="full-container" :tab-index="3">
    <view class="medal-container">
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
            <view class="medal-stat-item">
              <text class="medal-stat-value">{{totalMedals}}</text>
              <text class="medal-stat-label">总勋章数</text>
            </view>
            <view class="medal-stat-item">
              <text class="medal-stat-value">{{goldMedals}}</text>
              <text class="medal-stat-label">金牌</text>
            </view>
            <view class="medal-stat-item">
              <text class="medal-stat-value">{{silverMedals}}</text>
              <text class="medal-stat-label">银牌</text>
            </view>
            <view class="medal-stat-item">
              <text class="medal-stat-value">{{bronzeMedals}}</text>
              <text class="medal-stat-label">铜牌</text>
            </view>
          </view>
        </view>
        
        <!-- 勋章展示区 -->
        <view class="medal-section">
          <view class="section-header">
            <text class="section-title">我的勋章</text>
          </view>
          
          <view class="medal-display">
            <view class="medal-grid">
              <view 
                v-for="(medal, index) in earnedMedals" 
                :key="index" 
                class="medal-item"
              >
                <view :class="['medal-badge', `medal-${medal.type}`]">
                  <text :class="['medal-icon', `medal-${medal.type}-icon`]">{{getMedalIcon(medal.type)}}</text>
                </view>
                <text class="medal-name">{{medal.name}}</text>
                <text class="medal-date">获得于: {{formatDate(medal.earnedDate)}}</text>
              </view>
              
              <view 
                v-for="(medal, index) in unearnedMedals" 
                :key="'unearned-' + index" 
                class="medal-item locked"
              >
                <view class="medal-badge locked">
                  <text class="medal-icon locked">🔒</text>
                </view>
                <text class="medal-name">{{medal.name}}</text>
                <text class="medal-condition">条件: {{medal.condition}}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 勋章进度 -->
        <view class="medal-section">
          <view class="section-header">
            <text class="section-title">勋章进度</text>
          </view>
          
          <view class="medal-progress">
            <view class="progress-item" v-for="(medal, index) in unearnedMedals" :key="'progress-' + index">
              <view class="progress-header">
                <text class="progress-name">{{medal.name}}</text>
                <text class="progress-condition">需要: {{medal.condition}}</text>
              </view>
              <view class="progress-bar-container">
                <view class="progress-bar">
                  <view 
                    class="progress-fill" 
                    :style="{ width: getProgressPercentage(medal) + '%' }"
                  ></view>
                </view>
                <text class="progress-text">{{getProgressText(medal)}}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 勋章等级 -->
        <view class="medal-section">
          <view class="section-header">
            <text class="section-title">勋章等级</text>
          </view>
          
          <view class="medal-rank">
            <view class="rank-info">
              <text class="rank-level">当前等级: {{userRank.level}}</text>
              <text class="rank-points">{{userRank.points}} / {{userRank.nextPoints}} 点</text>
            </view>
            <view class="rank-progress">
              <view class="progress-bar">
                <view 
                  class="progress-fill" 
                  :style="{ width: Math.min((userRank.points / userRank.nextPoints) * 100, 100) + '%' }"
                ></view>
              </view>
              <view class="rank-actions">
                <button class="rank-button" @click="showRankModal">查看等级详情</button>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 底部填充，确保能滚动到底部 -->
        <view style="height: 60px;"></view>
      </scroll-view>
      
      <!-- 等级详情弹窗 -->
      <view class="rank-modal" v-if="showRank">
        <view class="rank-modal-mask" @click="closeRankModal"></view>
        <view class="rank-modal-content">
          <view class="rank-modal-header">
            <text class="rank-modal-title">勋章等级详情</text>
            <view class="rank-modal-close" @click="closeRankModal">×</view>
          </view>
          
          <view class="rank-modal-body">
            <view class="rank-detail">
              <text class="rank-detail-label">当前等级:</text>
              <text class="rank-detail-value">{{userRank.level}}</text>
            </view>
            
            <view class="rank-detail">
              <text class="rank-detail-label">当前经验值:</text>
              <text class="rank-detail-value">{{userRank.points}} / {{userRank.nextPoints}} 点</text>
            </view>
            
            <view class="rank-detail">
              <text class="rank-detail-label">升级进度:</text>
              <view class="rank-progress-bar">
                <view 
                  class="rank-progress-fill" 
                  :style="{ width: Math.min((userRank.points / userRank.nextPoints) * 100, 100) + '%' }"
                ></view>
              </view>
            </view>
            
            <view class="rank-detail">
              <text class="rank-detail-label">等级特权:</text>
              <text class="rank-detail-value">{{getRankPrivileges(userRank.level)}}</text>
            </view>
          </view>
          
          <view class="rank-modal-footer">
            <button class="rank-cancel-btn" @click="closeRankModal">关闭</button>
          </view>
        </view>
      </view>
      
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
      showRank: false,
      userInfo: userStore.getState(),
      earnedMedals: [
        { id: 1, name: '学习新手', type: 'bronze', earnedDate: new Date().toISOString().split('T')[0], condition: '累计学习1小时' },
        { id: 2, name: '坚持学习', type: 'silver', earnedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], condition: '连续学习3天' },
        { id: 3, name: '学习达人', type: 'gold', earnedDate: new Date(Date.now() - 172800000).toISOString().split('T')[0], condition: '累计学习10小时' }
      ],
      unearnedMedals: [
        { id: 4, name: '学习专家', type: 'gold', condition: '累计学习50小时' },
        { id: 5, name: '学习狂人', type: 'gold', condition: '连续学习30天' },
        { id: 6, name: '学习大师', type: 'gold', condition: '累计学习100小时' }
      ],
      userRank: {
        level: 2,
        points: 75,
        nextPoints: 100
      }
    };
  },
  computed: {
    totalMedals() {
      return this.earnedMedals.length + this.unearnedMedals.length;
    },
    goldMedals() {
      return this.earnedMedals.filter(medal => medal.type === 'gold').length;
    },
    silverMedals() {
      return this.earnedMedals.filter(medal => medal.type === 'silver').length;
    },
    bronzeMedals() {
      return this.earnedMedals.filter(medal => medal.type === 'bronze').length;
    }
  },
  onLoad() {
    this.checkUserLogin();
    this.loadMedalData();
  },
  methods: {
    checkUserLogin() {
      Navigation.checkLoginStatus();
    },
    loadMedalData() {
      try {
        const medalData = uni.getStorageSync('medalData');
        if (medalData) {
          const data = JSON.parse(medalData);
          this.earnedMedals = data.earnedMedals || this.earnedMedals;
          this.unearnedMedals = data.unearnedMedals || this.unearnedMedals;
          this.userRank = data.userRank || this.userRank;
        }
      } catch (e) {
        console.error('加载勋章数据失败:', e);
      }
    },
    saveMedalData() {
      try {
        uni.setStorageSync('medalData', JSON.stringify({
          earnedMedals: this.earnedMedals,
          unearnedMedals: this.unearnedMedals,
          userRank: this.userRank
        }));
      } catch (e) {
        console.error('保存勋章数据失败:', e);
      }
    },
    getMedalIcon(type) {
      switch (type) {
        case 'gold': return '🏆';
        case 'silver': return '🥈';
        case 'bronze': return '🥉';
        default: return '🎖️';
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    },
    getProgressPercentage(medal) {
      // 这里可以根据实际条件计算进度
      return 40; // 示例进度
    },
    getProgressText(medal) {
      return '进行中...';
    },
    getRankPrivileges(level) {
      const privileges = {
        1: '基础功能解锁',
        2: '高级功能解锁',
        3: '专属学习计划',
        4: '个性化推荐',
        5: '专家指导'
      };
      return privileges[level] || '更多特权等待解锁';
    },
    showRankModal() {
      this.showRank = true;
    },
    closeRankModal() {
      this.showRank = false;
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

.medal-container {
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

/* 勋章统计栏 */
.medal-stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.medal-stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
}

.medal-stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* 勋章部分 */
.medal-section {
  padding: 0 15px;
  margin-bottom: 20px;
}

.section-header {
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

/* 勋章展示区 */
.medal-display {
  background-color: #fff;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.medal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.medal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.medal-badge {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.medal-gold {
  background: linear-gradient(135deg, #f5d76e, #ffc300);
}

.medal-silver {
  background: linear-gradient(135deg, #bdc3c7, #e0e0e0);
}

.medal-bronze {
  background: linear-gradient(135deg, #cd7f32, #e6c28d);
}

.medal-icon {
  font-size: 24px;
}

.medal-name {
  font-size: 12px;
  color: #333;
  text-align: center;
  margin-bottom: 4px;
}

.medal-date, .medal-condition {
  font-size: 10px;
  color: #999;
  text-align: center;
}

.locked .medal-badge {
  background-color: #f0f0f0;
  color: #ccc;
}

/* 勋章进度 */
.medal-progress {
  background-color: #fff;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.progress-item {
  margin-bottom: 15px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-name {
  font-size: 14px;
  color: #333;
}

.progress-condition {
  font-size: 12px;
  color: #666;
}

.progress-bar-container {
  display: flex;
  align-items: center;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #a6c0fe, #c2a8fd);
  border-radius: 4px;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

/* 勋章等级 */
.medal-rank {
  background-color: #fff;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.rank-info {
  margin-bottom: 15px;
}

.rank-level {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 5px;
}

.rank-points {
  font-size: 14px;
  color: #666;
}

.rank-progress {
  margin-top: 10px;
}

.rank-actions {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.rank-button {
  padding: 8px 20px;
  background: linear-gradient(to right, #a6c0fe, #c2a8fd);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
}

/* 等级详情弹窗 */
.rank-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.rank-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.rank-modal-content {
  width: 80%;
  max-width: 350px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.rank-modal-header {
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rank-modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.rank-modal-close {
  font-size: 24px;
  color: #999;
  padding: 0 5px;
}

.rank-modal-body {
  padding: 15px;
}

.rank-detail {
  margin-bottom: 15px;
}

.rank-detail-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.rank-detail-value {
  font-size: 14px;
  color: #333;
}

.rank-progress-bar {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;
}

.rank-progress-fill {
  height: 100%;
  background: linear-gradient(to right, #a6c0fe, #c2a8fd);
  border-radius: 4px;
}

.rank-modal-footer {
  display: flex;
  padding: 10px 15px 15px;
}

.rank-cancel-btn {
  flex: 1;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 10px;
  margin: 0 5px;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  font-size: 14px;
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