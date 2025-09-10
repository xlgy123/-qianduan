<template>
  <view class="join-room-container">
    <view class="form-header">
      <view class="header-top">
        <text class="form-title">加入自习室</text>
        <view class="back-button" @tap="backToHome">
          <text class="back-icon">×</text>
        </view>
      </view>
      <text class="form-subtitle">加入好友的学习小组</text>
    </view>
    
    <!-- 搜索按钮 -->
    <view class="search-section">
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          type="number" 
          v-model="searchKeyword" 
          placeholder="输入6位房间号搜索" 
          @confirm="searchRooms"
          maxlength="6"
        />
        <view class="search-btn" @click="searchRooms">加入</view>
      </view>
    </view>
    
    <!-- 搜索功能 -->
    <view class="results-section" v-if="hasSearched && rooms.length > 0">
      <view class="section-title">搜索结果</view>
      <view class="room-list">
        <view 
          class="room-item" 
          v-for="(room, index) in rooms" 
          :key="index" 
          @click="goToRoomDetail(room.id || room.room_id)"
        >
          <view class="room-info">
            <view class="room-name">{{room.name}}</view>
            <view class="room-meta">
              <text class="room-code-badge">{{room.room_code || room.roomCode}}</text>
              <text class="room-owner">{{room.ownerName || '用户'}}</text>
              <text class="room-members">{{room.currentMembers || room.memberCount || 0}}人</text>
              <text class="room-tag" v-for="(tag, tagIndex) in (room.tags || [])" :key="tagIndex">{{tag}}</text>
            </view>
          </view>
          <view class="room-status status-active">
            {{room.status || '进行中'}}
          </view>
        </view>
      </view>
    </view>
    
    <!-- 搜索框无结果提示 -->
    <view class="results-section" v-if="hasSearched && rooms.length === 0">
      <view class="empty-result">
        <image class="empty-icon" src="/static/icons/empty.png" mode="aspectFit"></image>
        <text class="empty-text">没有找到匹配的自习室</text>
        <text class="empty-tips">请确认房间号是否正确</text>
      </view>
    </view>
    
    <!-- 热门自习室 -->
    <view class="recommend-section" v-if="!hasSearched || rooms.length === 0">
      <view class="section-title">热门自习室</view>
      
      <view class="room-list">
        <view 
          class="room-item" 
          v-for="(room, index) in recommendRooms" 
          :key="index" 
          @click="goToRoomDetail(room.id || room.room_id)"
        >
          <view class="room-info">
            <view class="room-name">{{room.name}}</view>
            <view class="room-meta">
              <text class="room-code-badge">{{room.room_code || room.roomCode}}</text>
              <text class="room-owner">{{room.ownerName || '用户'}}</text>
              <text class="room-members">{{room.currentMembers || room.memberCount || 0}}人</text>
              <text class="room-tag" v-for="(tag, tagIndex) in (room.tags || [])" :key="tagIndex">{{tag}}</text>
            </view>
          </view>
          <view class="room-status status-active">
            {{room.status || '进行中'}}
          </view>
        </view>
      </view>
      
      <!-- 没有热门自习室时显示的内容 -->
      <view class="empty-result" v-if="recommendRooms.length === 0">
        <image class="empty-icon" src="/static/icons/empty.png" mode="aspectFit"></image>
        <text class="empty-text">暂时没有进行中的自习室</text>
        <text class="empty-tips">试试创建一个自习室邀请朋友一起学习吧</text>
      </view>
    </view>
  </view>
</template>

<script>
import { Navigation } from '@/utils/navigation';

export default {
  data() {
    return {
      searchKeyword: '',
      rooms: [],
      recommendRooms: [],
      hasSearched: false
    };
  },
  onLoad() {
    this.loadRecommendRooms();
  },
  methods: {
    // 返回首页
    backToHome() {
      uni.navigateBack();
    },
    // 搜索框
    async searchRooms() {
      if (!this.searchKeyword.trim()) {
        uni.showToast({ title: '请输入房间号', icon: 'none' });
        return;
      }
      
      uni.showLoading({ title: '搜索中...' });
      try {
        const res = await uni.request({
          url: `/api/rooms/code/${this.searchKeyword}`,
          method: 'GET'
        });
        console.log('搜索结果:', res);
        if (res.data && res.data.code === 200) {
          this.rooms = [res.data.data]; // 搜索结果
         } else {
           this.rooms = [];
         }
        this.hasSearched = true;
      } catch (error) {
        console.error('搜索失败:', error);
        this.rooms = [];
      } finally {
        uni.hideLoading();
      }
    },
    // 加载推荐自习室
    async loadRecommendRooms() {
      try {
        // 显示加载提示
        uni.showLoading({ title: '加载中...' });
        
        // 使用模拟API获取自习室数据
        const res = await uni.request({
          url: '/api/available', // 模拟API地址
          method: 'GET'
        });
        console.log('推荐自习室结果:', res);

        if (res.data && res.data.code === 200) {
          // 同步推荐自习室数据
          this.recommendRooms = res.data.data;
          console.log('已加载自习室数据:', this.recommendRooms.length, '个房间');
        } else {
          uni.showToast({ title: '加载失败', icon: 'none' });
        }
      } catch (error) {
        console.error('加载自习室数据失败:', error);
        uni.showToast({ title: '网络错误', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },
    // 跳转到自习室详情
    goToRoomDetail(roomId) {
      uni.navigateTo({
        url: `/pages/room/room-detail?id=${roomId}`
      });
    }
  }
};
</script>
<style>
page {
  background-color: #f8f3ff;
  min-height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.join-room-container {
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.form-header {
  margin-bottom: 15px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.back-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8a9eef, #c2a8fd);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(138, 158, 239, 0.3);
}

.back-button:active {
  transform: scale(0.95);
}

.back-icon {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.form-subtitle {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
  display: block;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.result-count {
  font-size: 14px;
  color: #999;
  font-weight: normal;
  margin-left: 5px;
}

/* 搜索框 */
.search-section {
  background-color: #fff;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 0 12px;
  border: 1px solid #eee;
  height: 50px;
  overflow: hidden;
}

.search-icon {
  font-size: 18px;
  margin-right: 10px;
  color: #8a9eef;
}

.search-input {
  flex: 1;
  height: 50px;
  font-size: 16px;
  padding-right: 10px;
  letter-spacing: 1px;
}

.search-btn {
  padding: 0 18px;
  font-size: 16px;
  background: linear-gradient(to right, #8a9eef, #c2a8fd);
  color: white;
  border-radius: 10px;
  height: 40px;
  line-height: 40px;
  font-weight: 500;
}

.search-btn:active {
  opacity: 0.9;
  transform: scale(0.98);
}

/* 结果区域 */
.results-section, .recommend-section {
  background-color: #fff;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-result {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 15px;
  color: #666;
  margin-bottom: 8px;
}

.empty-tips {
  font-size: 13px;
  color: #999;
}

/* 自习室列表 */
.room-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.room-item:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(120deg, rgba(166, 192, 254, 0.05), rgba(194, 168, 253, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.room-item:active:after {
  opacity: 1;
}

.room-item:active {
  transform: scale(0.98);
}

.room-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.room-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.room-code-badge {
  font-size: 12px;
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 8px;
  font-weight: 500;
}

.room-owner {
  font-size: 12px;
  color: #666;
}

.room-members {
  font-size: 12px;
  color: #666;
}

.room-tag {
  font-size: 12px;
  color: #8a9eef;
  background-color: rgba(138, 158, 239, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.room-status {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 10px;
  font-weight: 500;
}

.status-active {
  background-color: rgba(79, 209, 138, 0.2);
  color: #4fd18a;
}

/* 平板适配 */
@media screen and (min-width: 768px) {
  .join-room-container {
    padding: 20px;
    max-width: 650px;
    margin: 0 auto;
  }
  
  .form-title {
    font-size: 28px;
  }
  
  .form-subtitle {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .search-section, .results-section, .recommend-section {
    padding: 20px;
    border-radius: 20px;
  }
  
  .search-input {
    height: 50px;
    font-size: 16px;
  }
  
  .search-btn {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
  }
  
  .room-name {
    font-size: 18px;
  }
  
  .room-owner, .room-members, .room-tag, .room-status {
    font-size: 14px;
  }
}
</style>