<template>
  <view class="members-list-container">
    <view class="members-count">
      <text class="count-text">成员 ({{ members.length }})</text>
      <view class="online-indicator">
        <view class="indicator-dot"></view>
        <text class="online-count">{{ onlineCount }}人在线</text>
      </view>
    </view>
    
    <scroll-view class="members-scroll" scroll-y>
      <view class="members-list">
        <view 
          class="member-item" 
          v-for="(member, index) in members" 
          :key="index"
          :class="{'self-member': member.isSelf}"
        >
          <!-- 成员头像 -->
          <view class="avatar-container">
            <image 
              class="member-avatar" 
              :src="member.avatar" 
              mode="aspectFill"
            ></image>
            <view class="status-badge" :class="getStatusClass(member)"></view>
          </view>
          
          <!-- 成员信息 -->
          <view class="member-info">
            <view class="name-container">
              <text class="member-name">{{ member.name }}</text>
              <view class="member-badge" v-if="member.isHost">房主</view>
              <view class="member-badge self-badge" v-if="member.isSelf">我</view>
            </view>
            <text class="member-status">{{ getMemberStatus(member) }}</text>
          </view>
          
          <!-- 学习时间 -->
          <view class="study-info">
            <text class="study-time">{{ formatStudyTime(member.studyTime) }}</text>
            <text class="study-label">学习时间</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'MembersList',
  props: {
    // 成员列表
    members: {
      type: Array,
      default: () => []
    },
    // 在线人数
    onlineCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 获取成员状态文本
    getMemberStatus(member) {
      if (member.isStudying) {
        return '学习中';
      } else if (member.studyTime > 0) {
        return '已暂停';
      } else {
        return '未开始';
      }
    },
    
    // 获取状态对应的样式类
    getStatusClass(member) {
      if (member.isStudying) {
        return 'status-online';
      } else if (member.studyTime > 0) {
        return 'status-paused';
      } else {
        return 'status-offline';
      }
    },
    
    // 格式化学习时间
    formatStudyTime(seconds) {
      const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      
      return `${hours}:${minutes}:${secs}`;
    }
  }
}
</script>

<style>
.members-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fb;
  border-radius: 12px;
}

.members-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.count-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.online-indicator {
  display: flex;
  align-items: center;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4caf50;
  margin-right: 6px;
}

.online-count {
  font-size: 14px;
  color: #666;
}

.members-scroll {
  flex: 1;
  height: calc(100% - 53px);
}

.members-list {
  padding: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.self-member {
  background-color: rgba(138, 158, 239, 0.1);
  border: 1px solid rgba(138, 158, 239, 0.2);
}

.avatar-container {
  position: relative;
  margin-right: 12px;
}

.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.status-online {
  background-color: #4caf50;
}

.status-offline {
  background-color: #9e9e9e;
}

.status-paused {
  background-color: #ff9800;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name-container {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.member-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-right: 8px;
}

.member-badge {
  padding: 2px 6px;
  background-color: #ff9800;
  border-radius: 10px;
  font-size: 10px;
  color: #fff;
}

.self-badge {
  background-color: #8a9eef;
}

.member-status {
  font-size: 13px;
  color: #666;
}

.study-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.study-time {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.study-label {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
</style> 