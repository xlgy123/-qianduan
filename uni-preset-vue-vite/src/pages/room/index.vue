<template>
  <view class="room-container">
    <!-- 顶部学习数据卡片 -->
    <view class="study-stats-card">
      <view class="avatar-container">
        <image class="user-avatar" src="/static/default-avatar.png" mode="aspectFill"></image>
      </view>
      <view class="stats-content">
        <view class="stats-title">学习达人</view>
        <view class="stats-row">
          <text class="stats-label">今日学习: </text>
          <text class="stats-value">2小时</text>
          <text class="stats-label stats-left-margin">总学习: </text>
          <text class="stats-value">128小时</text>
        </view>
      </view>
    </view>
    
    <!-- 公告区域 -->
    <view class="notice-card">
      <view class="notice-header">
        <text class="notice-title">公告</text>
        <text class="notice-more">更多</text>
      </view>
      <view class="notice-content">
        <text class="notice-text">五月学习挑战开始了，连续打卡30天可获得学霸勋章！</text>
      </view>
    </view>
    
    <!-- 自习室区域 -->
    <view class="study-room-section">
      <view class="section-header">
        <text class="section-title">自习室</text>
        <text class="section-subtitle">选择一个自习室开始学习吧</text>
      </view>
      
      <!-- 标签区域 - 只保留自习室选项和学习排行 -->
      <view class="tabs-container">
        <view class="tab-item active">
          <text class="tab-text">自习室选项</text>
          <view class="tab-indicator"></view>
        </view>
        <view class="tab-item">
          <text class="tab-text">学习排行</text>
        </view>
      </view>
      
      <!-- 自习室选项内容 -->
      <view class="room-options">
        <!-- 创建自习室 -->
        <view class="room-option-item" @click="navigateToCreateRoom">
          <view class="option-icon create-icon">
            <text class="icon-plus">+</text>
          </view>
          <view class="option-info">
            <text class="option-title">创建自习室</text>
            <text class="option-desc">创建属于你的学习空间</text>
          </view>
        </view>
        
        <!-- 加入自习室 -->
        <view class="room-option-item" @click="navigateToJoinRoom">
          <view class="option-icon join-icon">
            <text class="icon-search">🔍</text>
          </view>
          <view class="option-info">
            <text class="option-title">加入自习室</text>
            <text class="option-desc">加入好友的学习小组</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0
    }
  },
  onLoad() {
    console.log('自习室页面加载完成');
  },
  methods: {
    // 切换标签
    switchTab(index) {
      this.activeTab = index;
    },
    
    // 导航到创建自习室页面
    navigateToCreateRoom() {
      uni.navigateTo({
        url: '/pages/room/create-room'
      });
    },
    
    // 导航到加入自习室页面
    navigateToJoinRoom() {
      uni.navigateTo({
        url: '/pages/room/join-room'
      });
    }
  }
}
</script>

<style>
page {
  background-color: #f8f3ff;
  min-height: 100%;
}

.room-container {
  padding: 15px;
  display: flex;
  flex-direction: column;
}

/* 学习数据卡片 */
.study-stats-card {
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  border-radius: 16px;
  padding: 15px;
  display: flex;
  align-items: center;
  color: #fff;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(138, 158, 239, 0.2);
}

.avatar-container {
  margin-right: 15px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.stats-content {
  flex: 1;
}

.stats-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
}

.stats-label {
  font-size: 12px;
  opacity: 0.9;
}

.stats-value {
  font-size: 12px;
  font-weight: 600;
}

.stats-left-margin {
  margin-left: 10px;
}

/* 公告区域 */
.notice-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.notice-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.notice-more {
  font-size: 12px;
  color: #8a9eef;
}

.notice-content {
  padding: 5px 0;
}

.notice-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 自习室区域 */
.study-room-section {
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 15px;
}

.section-header {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.section-subtitle {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  display: block;
}

/* 标签区域 */
.tabs-container {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  position: relative;
}

.tab-text {
  font-size: 14px;
  color: #666;
}

.tab-item.active .tab-text {
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

/* 自习室选项 */
.room-options {
  padding: 15px;
}

.room-option-item {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 12px;
  background-color: #f9f7ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.option-icon {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.create-icon {
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
}

.join-icon {
  background: linear-gradient(135deg, #c2a8fd, #a6c0fe);
}

.icon-plus {
  font-size: 24px;
  color: #fff;
}

.icon-search {
  font-size: 20px;
}

.option-info {
  flex: 1;
}

.option-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.option-desc {
  font-size: 12px;
  color: #999;
}

/* 平板适配 */
@media screen and (min-width: 768px) {
  .room-container {
    padding: 20px;
  }
  
  .study-stats-card {
    padding: 20px;
    border-radius: 20px;
  }
  
  .user-avatar {
    width: 70px;
    height: 70px;
    border-radius: 35px;
  }
  
  .stats-title {
    font-size: 20px;
  }
  
  .stats-label, .stats-value {
    font-size: 14px;
  }
  
  .notice-card {
    padding: 20px;
    border-radius: 20px;
  }
  
  .notice-title {
    font-size: 18px;
  }
  
  .notice-more {
    font-size: 14px;
  }
  
  .notice-text {
    font-size: 15px;
  }
  
  .study-room-section {
    border-radius: 20px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .section-subtitle {
    font-size: 14px;
  }
  
  .tab-text {
    font-size: 16px;
  }
  
  .tab-indicator {
    width: 30px;
    height: 4px;
  }
  
  .option-title {
    font-size: 18px;
  }
  
  .option-desc {
    font-size: 14px;
  }
}
</style> 