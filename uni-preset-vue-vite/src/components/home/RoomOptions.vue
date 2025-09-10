<template>
  <view class="room-options" :class="{'tablet-mode': isTablet}">
    <view class="room-card" @click="createRoom">
      <view class="room-icon-bg create-bg">
        <text class="room-icon">➕</text>
      </view>
      <view class="room-info">
        <text class="room-title">创建自习室</text>
        <text class="room-desc">创建属于你的学习空间</text>
      </view>
    </view>
    
    <view class="room-card" @click="joinRoom">
      <view class="room-icon-bg join-bg">
        <text class="room-icon">🔍</text>
      </view>
      <view class="room-info">
        <text class="room-title">加入自习室</text>
        <text class="room-desc">加入好友的学习小组</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RoomOptions',
  props: {
    isTablet: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    createRoom() {
      this.$emit('create-room');
    },
    joinRoom() {
      this.$emit('join-room');
    }
  }
}
</script>

<style>
.room-options {
  display: flex;
  flex-direction: column; /* 手机端默认为垂直排列 */
  gap: 12px; /* 调整间距 */
  margin-top: 10px; /* 调整顶部边距 */
  will-change: transform;
  transition: all 0.3s ease;
}

.room-card {
  width: 100%; /* 手机端默认宽度100% */
  display: flex;
  flex-direction: row; /* 改为横向排列 */
  align-items: center;
  padding: 15px;
  border-radius: 16px;
  margin-bottom: 0; /* 移除底部边距，使用gap控制 */
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.room-card:hover,
.room-card:active {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

.room-icon-bg {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0; /* 移除底部边距 */
  margin-right: 15px; /* 添加右侧边距 */
  transition: transform 0.2s ease;
  will-change: transform;
}

.room-card:hover .room-icon-bg,
.room-card:active .room-icon-bg {
  transform: scale(1.05);
}

.create-bg {
  background: linear-gradient(135deg, #a6c0fe, #8a9eef);
}

.join-bg {
  background: linear-gradient(135deg, #c2a8fd, #a58cf0);
}

.room-icon {
  font-size: 24px;
  color: white;
}

.room-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.room-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  text-align: left; /* 左对齐 */
}

.room-desc {
  font-size: 13px;
  color: #666;
  text-align: left; /* 左对齐 */
}

/* 平板模式布局 */
.tablet-mode {
  flex-direction: row; /* 平板恢复水平排列 */
  justify-content: space-between;
  margin-top: 15px;
  gap: 20px;
}

.tablet-mode .room-card {
  width: 48%; /* 平板设备恢复为48%宽度 */
  flex-direction: column; /* 恢复垂直排列 */
  padding: 15px;
  align-items: center;
}

.tablet-mode .room-icon-bg {
  margin-right: 0; /* 移除右侧边距 */
  margin-bottom: 10px; /* 恢复底部边距 */
  width: 60px; /* 增大图标尺寸 */
  height: 60px;
  border-radius: 30px;
}

.tablet-mode .room-info {
  text-align: center; /* 内容居中 */
  align-items: center; /* 子元素居中 */
}

.tablet-mode .room-title, 
.tablet-mode .room-desc {
  text-align: center; /* 恢复居中对齐 */
}
</style> 