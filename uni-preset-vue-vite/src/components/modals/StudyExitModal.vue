<template>
  <view class="modal-container" v-if="visible">
    <view class="modal-mask" @tap="handleMaskClick"></view>
    <view class="modal-content">
      <!-- 关闭按钮 -->
      <view class="close-btn" @tap="closeModal">
        <text class="close-icon">×</text>
      </view>
      
      <!-- 头部 -->
      <view class="modal-header">
        <view class="avatar-container">
          <image class="avatar" :src="userAvatar" mode="aspectFill"></image>
        </view>
        <text class="title">已退出自习室</text>
      </view>
      
      <!-- 积分显示 -->
      <view class="points-section">
        <view class="points-value">+{{calculatePoints(studyDuration)}}</view>
        <view class="points-label">获得积分</view>
      </view>
      
      <!-- 统计信息 -->
      <view class="stats-section">
        <!-- 学习时长 -->
        <view class="stat-item">
          <view class="stat-icon time">⏱</view>
          <view class="stat-value">{{formatDuration(studyDuration)}}</view>
          <view class="stat-label">学习时长</view>
        </view>
        
        <!-- 加入人数 -->
        <view class="stat-item">
          <view class="stat-icon people">👥</view>
          <view class="stat-value">{{memberCount || 0}}</view>
          <view class="stat-label">加入人数</view>
        </view>
      </view>
      
      <!-- 底部按钮 -->
      <view class="modal-footer">
        <button class="primary-btn" @tap="closeModal">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    roomName: {
      type: String,
      default: ''
    },
    userAvatar: {
      type: String,
      default: '/static/default-avatar.png'
    },
    studyDuration: {
      type: Number,
      default: 0
    },
    memberCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    handleMaskClick() {
      // 点击蒙层关闭
      this.closeModal();
    },
    formatDuration(seconds) {
      if (seconds === undefined || seconds < 0) return '0秒';
      
      // 处理小于1分钟的情况，显示秒数
      if (seconds < 60) {
        return `${Math.floor(seconds)}秒`;
      }
      
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) {
        return `${minutes}分钟`;
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes > 0) {
          return `${hours}小时${remainingMinutes}分钟`;
        } else {
          return `${hours}小时`;
        }
      }
    },
    calculatePoints(seconds) {
      // 计算积分：每10分钟获得1积分
      const minutes = Math.floor(seconds / 60);
      return Math.floor(minutes / 10);
    }
  }
}
</script>

<style>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.modal-content {
  width: 80%;
  max-width: 320px;
  background-color: #fff;
  border-radius: 20px;
  padding: 30px 20px;
  position: relative;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  animation: modalIn 0.3s ease;
  z-index: 2;
}

@keyframes modalIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 20px;
  background-color: #f5f5f5;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.avatar-container {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
  border-radius: 40px;
  overflow: hidden;
  border: 3px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100%;
  height: 100%;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-top: 5px;
}

/* 积分部分样式 */
.points-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px 0 25px;
  animation: bounceIn 0.5s ease;
}

@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.points-value {
  font-size: 36px;
  font-weight: bold;
  background: linear-gradient(90deg, #FF9A9E, #FAD0C4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(255, 154, 158, 0.3);
}

.points-label {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.stat-item {
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 5px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.time {
  background: linear-gradient(135deg, #8675FF, #6D5DFC);
}

.people {
  background: linear-gradient(135deg, #4DD0E1, #26C6DA);
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.modal-footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.primary-btn {
  background: linear-gradient(90deg, #8A9EEF, #C2A8FD);
  color: white;
  border: none;
  border-radius: 20px;
  width: 150px;
  height: 40px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 