<template>
  <view class="leaderboard-section">
    <view class="section-header">
      <text class="section-title">学习排行</text>
    </view>
    
    <view class="leaderboard-list">
      <view class="leaderboard-item" v-for="(item, index) in leaderboard" :key="index">
        <view class="rank" :class="{'top-rank': index < 3}">{{index + 1}}</view>
        <image class="user-avatar" :src="item.avatar" mode="aspectFill" :lazy-load="true"></image>
        <text class="user-name">{{item.name}}</text>
        <view class="study-time">
          <text class="time-value">{{item.hours}}</text>
          <text class="time-unit">小时</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Leaderboard',
  props: {
    leaderboard: {
      type: Array,
      default: () => []
    }
  }
  // No methods needed
}
</script>

<style>
/* 排行榜样式 */
.leaderboard-section {
  margin-bottom: 15px;
  background: linear-gradient(135deg, #ffffff, #f9f6ff);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 15px rgba(166, 192, 254, 0.12);
  will-change: transform;
  transition: transform 0.3s ease;
  border: 1px solid rgba(166, 192, 254, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(166, 192, 254, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  background-image: linear-gradient(90deg, #a6c0fe, #c2a8fd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  padding-left: 5px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: linear-gradient(to bottom, #a6c0fe, #c2a8fd);
  border-radius: 2px;
}

.leaderboard-list {
  padding: 5px 0;
  max-height: 280px; /* 限制排行榜高度 */
  overflow-y: auto; /* 内容过多时可滚动 */
  -webkit-overflow-scrolling: touch; /* 提升iOS滑动体验 */
  border-radius: 12px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  border-bottom: 1px solid rgba(166, 192, 254, 0.08);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.leaderboard-item::before {
  content: '';
  position: absolute;
  left: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(166, 192, 254, 0.05), transparent);
  transition: transform 0.5s ease;
  transform: translateX(0);
  z-index: 0;
}

.leaderboard-item:hover::before,
.leaderboard-item:active::before {
  transform: translateX(100%);
}

.leaderboard-item:hover,
.leaderboard-item:active {
  background-color: rgba(166, 192, 254, 0.05);
  transform: translateX(5px);
}

.leaderboard-item:last-child {
  border-bottom: none;
}

.rank {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
  color: #666;
  margin-right: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

.top-rank {
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  color: white;
  box-shadow: 0 3px 8px rgba(166, 192, 254, 0.3);
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 21px;
  margin-right: 15px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  will-change: opacity;
  position: relative;
  z-index: 1;
}

.user-name {
  flex: 1;
  font-size: 16px;
  color: #333;
  margin-left: 3px;
  position: relative;
  z-index: 1;
}

.study-time {
  display: flex;
  align-items: baseline;
  margin-left: 10px;
  position: relative;
  z-index: 1;
}

.time-value {
  font-size: 18px;
  font-weight: bold;
  background-image: linear-gradient(90deg, #a6c0fe, #c2a8fd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-right: 3px;
}

.time-unit {
  font-size: 13px;
  color: #999;
}

/* 平板适配 */
@media screen and (min-width: 768px) {
  .leaderboard-section {
    border-radius: 24px;
    padding: 20px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .rank {
    width: 36px;
    height: 36px;
    border-radius: 18px;
    font-size: 16px;
  }
  
  .user-avatar {
    width: 46px;
    height: 46px;
    border-radius: 23px;
  }
  
  .user-name {
    font-size: 17px;
  }
  
  .time-value {
    font-size: 20px;
  }
  
  .time-unit {
    font-size: 14px;
  }
}
</style>