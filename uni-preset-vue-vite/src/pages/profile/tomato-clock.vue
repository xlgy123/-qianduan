<template>
  <swipe-detector class="full-container" :tab-index="3">
    <view class="pomodoro-container">
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
            <view class="pomo-stat-item">
              <text class="pomo-stat-value">{{todayPomos}}</text>
              <text class="pomo-stat-label">今日番茄数</text>
            </view>
            <view class="pomo-stat-item">
              <text class="pomo-stat-value">{{totalPomos}}</text>
              <text class="pomo-stat-label">总番茄数</text>
            </view>
            <view class="pomo-stat-item">
              <text class="pomo-stat-value">{{focusTimeToday}}分钟</text>
              <text class="pomo-stat-label">今日专注时长</text>
            </view>
            <view class="pomo-stat-item">
              <text class="pomo-stat-value">{{focusTimeTotal}}分钟</text>
              <text class="pomo-stat-label">总专注时长</text>
            </view>
          </view>
        </view>
        
        <!-- 番茄钟计时器 -->
        <view class="pomodoro-timer-section">
          <view class="timer-container">
            <view class="timer-display">
              <text class="timer-text">{{ formattedTime }}</text>
            </view>
            <view class="timer-status">
              <text :class="['timer-mode', currentMode]">{{ currentModeText }}</text>
            </view>
          </view>
          
          <view class="timer-controls">
            <button class="timer-button" @click="toggleTimer">
              <text class="timer-icon">{{ isRunning ? '⏸️' : '▶️' }}</text>
            </button>
            <button class="timer-button" @click="resetTimer">
              <text class="timer-icon">⏹️</text>
            </button>
            <button class="timer-button" @click="changeMode">
              <text class="timer-icon">🔄</text>
            </button>
          </view>
          
          <view class="timer-settings">
            <view class="setting-item">
              <text class="setting-label">工作时长 (分钟)</text>
              <input 
                type="number" 
                v-model.number="workMinutes" 
                @change="updateSettings"
                :disabled="isRunning"
              />
            </view>
            <view class="setting-item">
              <text class="setting-label">休息时长 (分钟)</text>
              <input 
                type="number" 
                v-model.number="breakMinutes" 
                @change="updateSettings"
                :disabled="isRunning"
              />
            </view>
          </view>
        </view>
        
        <!-- 今日统计 -->
        <view class="stats-section">
          <view class="section-header">
            <text class="section-title">今日统计</text>
          </view>
          
          <view class="daily-stats">
            <view class="stat-card">
              <view class="stat-icon work">
                <text class="work-icon">📚</text>
              </view>
              <view class="stat-info">
                <text class="stat-name">工作时长</text>
                <text class="stat-value">{{ workTimeToday }}分钟</text>
              </view>
            </view>
            <view class="stat-card">
              <view class="stat-icon break">
                <text class="break-icon">☕</text>
              </view>
              <view class="stat-info">
                <text class="stat-name">休息时长</text>
                <text class="stat-value">{{ breakTimeToday }}分钟</text>
              </view>
            </view>
            <view class="stat-card">
              <view class="stat-icon cycle">
                <text class="cycle-icon">🔁</text>
              </view>
              <view class="stat-info">
                <text class="stat-name">完成周期</text>
                <text class="stat-value">{{ completedCycles }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 番茄历史 -->
        <view class="history-section">
          <view class="section-header">
            <text class="section-title">番茄历史</text>
          </view>
          
          <view class="history-list">
            <view 
              class="history-item" 
              v-for="(record, index) in recentRecords" 
              :key="index"
            >
              <view class="history-date">
                <text class="date">{{ formatDate(record.date) }}</text>
              </view>
              <view class="history-stats">
                <text class="pomos">{{ record.pomos }} 番茄</text>
                <text class="time">{{ record.minutes }} 分钟</text>
              </view>
            </view>
          </view>
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
      isRunning: false,
      currentTime: 0,
      timerInterval: null,
      totalPomos: 0,
      todayPomos: 0,
      focusTimeTotal: 0,
      focusTimeToday: 0,
      workTimeToday: 0,
      breakTimeToday: 0,
      completedCycles: 0,
      workMinutes: 25,
      breakMinutes: 5,
      currentMode: 'work',
      pomodoroHistory: []
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.currentTime / 60);
      const seconds = this.currentTime % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    currentModeText() {
      return this.currentMode === 'work' ? '工作时间' : '休息时间';
    },
    recentRecords() {
      return this.pomodoroHistory.slice(0, 5);
    }
  },
  onLoad() {
    this.checkUserLogin();
    this.loadPomodoroData();
  },
  methods: {
    checkUserLogin() {
      Navigation.checkLoginStatus();
    },
    loadPomodoroData() {
      try {
        const pomoData = uni.getStorageSync('pomodoroData');
        if (pomoData) {
          const data = JSON.parse(pomoData);
          
          this.totalPomos = data.totalPomos || 0;
          this.todayPomos = data.todayPomos || 0;
          this.focusTimeTotal = data.focusTimeTotal || 0;
          this.focusTimeToday = data.focusTimeToday || 0;
          this.workTimeToday = data.workTimeToday || 0;
          this.breakTimeToday = data.breakTimeToday || 0;
          this.completedCycles = data.completedCycles || 0;
          this.workMinutes = data.workMinutes || 25;
          this.breakMinutes = data.breakMinutes || 5;
          this.pomodoroHistory = data.pomodoroHistory || [];
        }
      } catch (e) {
        console.error('加载番茄钟数据失败:', e);
      }
      
      this.resetTimer();
    },
    savePomodoroData() {
      try {
        uni.setStorageSync('pomodoroData', JSON.stringify({
          totalPomos: this.totalPomos,
          todayPomos: this.todayPomos,
          focusTimeTotal: this.focusTimeTotal,
          focusTimeToday: this.focusTimeToday,
          workTimeToday: this.workTimeToday,
          breakTimeToday: this.breakTimeToday,
          completedCycles: this.completedCycles,
          workMinutes: this.workMinutes,
          breakMinutes: this.breakMinutes,
          pomodoroHistory: this.pomodoroHistory
        }));
      } catch (e) {
        console.error('保存番茄钟数据失败:', e);
      }
    },
    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
      } else {
        this.isRunning = true;
        this.timerInterval = setInterval(() => {
          if (this.currentTime > 0) {
            this.currentTime--;
          } else {
            this.completeInterval();
          }
        }, 1000);
      }
    },
    resetTimer() {
      clearInterval(this.timerInterval);
      this.isRunning = false;
      this.currentTime = this.currentMode === 'work' 
        ? this.workMinutes * 60 
        : this.breakMinutes * 60;
    },
    changeMode() {
      if (this.isRunning) return;
      
      this.currentMode = this.currentMode === 'work' ? 'break' : 'work';
      this.resetTimer();
    },
    completeInterval() {
      if (this.currentMode === 'work') {
        this.completeWorkSession();
      } else {
        this.completeBreakSession();
      }
      
      this.changeMode();
      this.isRunning = true;
    },
    completeWorkSession() {
      this.totalPomos++;
      this.todayPomos++;
      this.focusTimeTotal += this.workMinutes;
      this.focusTimeToday += this.workMinutes;
      this.workTimeToday += this.workMinutes;
      
      // 如果是新的日期，创建新的历史记录
      if (this.isNewDay()) {
        this.pomodoroHistory.unshift({
          date: new Date().toISOString().split('T')[0],
          pomos: 1,
          minutes: this.workMinutes
        });
      } else {
        // 否则更新当天的记录
        this.pomodoroHistory[0].pomos++;
        this.pomodoroHistory[0].minutes += this.workMinutes;
      }
      
      this.savePomodoroData();
    },
    completeBreakSession() {
      this.breakTimeToday += this.breakMinutes;
      this.completedCycles++;
      this.savePomodoroData();
    },
    isNewDay() {
      if (!this.pomodoroHistory.length) return true;
      
      const lastDate = this.pomodoroHistory[0].date;
      const today = new Date().toISOString().split('T')[0];
      return lastDate !== today;
    },
    updateSettings() {
      if (this.workMinutes < 1) this.workMinutes = 1;
      if (this.breakMinutes < 1) this.breakMinutes = 1;
      
      this.resetTimer();
      this.savePomodoroData();
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
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

.pomodoro-container {
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

/* 番茄统计栏 */
.pomo-stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pomo-stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
}

.pomo-stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* 番茄钟计时器 */
.pomodoro-timer-section {
  padding: 20px 15px;
  background-color: #fff;
  border-radius: 15px;
  margin: 0 15px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  text-align: center;
}

.timer-container {
  margin-bottom: 20px;
}

.timer-display {
  font-size: 60px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.timer-text {
  font-family: monospace;
}

.timer-status {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.timer-mode.work {
  color: #ff5252;
}

.timer-mode.break {
  color: #4caf50;
}

.timer-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.timer-button {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  color: white;
  border: none;
  margin: 0 10px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(166, 192, 254, 0.3);
}

.timer-settings {
  display: flex;
  justify-content: center;
}

.setting-item {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.setting-label {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}

.setting-item input {
  width: 60px;
  height: 36px;
  border: 1px solid #eee;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
}

/* 今日统计 */
.stats-section {
  padding: 0 15px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.daily-stats {
  display: flex;
  justify-content: space-between;
}

.stat-card {
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  margin: 0 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.stat-icon.work {
  background: linear-gradient(135deg, #ff9e80, #ff6e40);
}

.stat-icon.break {
  background: linear-gradient(135deg, #a5d6a7, #66bb6a);
}

.stat-icon.cycle {
  background: linear-gradient(135deg, #81c784, #4caf50);
}

.stat-icon .work-icon,
.stat-icon .break-icon,
.stat-icon .cycle-icon {
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* 番茄历史 */
.history-section {
  padding: 0 15px;
  margin-bottom: 20px;
}

.history-list {
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.history-item:last-child {
  border-bottom: none;
}

.history-date {
  color: #666;
}

.date {
  font-weight: 500;
}

.history-stats {
  text-align: right;
}

.pomos {
  font-size: 16px;
  color: #333;
  margin-bottom: 2px;
}

.time {
  font-size: 12px;
  color: #999;
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