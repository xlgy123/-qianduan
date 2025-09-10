<template>
  <view class="study-room">
    <!-- 房间名称和目标显示区域 -->
    <view class="room-info-banner">
      <text class="room-name">{{roomInfo.name || '自习室'}}</text>
      <view class="room-targets" v-if="roomInfo.goals || roomInfo.content">
        <text class="room-goal-text">{{roomInfo.goals ? '目标: ' + roomInfo.goals : ''}}</text>
        <text class="room-content-text">{{roomInfo.content ? '内容: ' + roomInfo.content : ''}}</text>
      </view>
    </view>
    
    <!-- 自习室标题区域 -->
    <view class="study-header">
      <view class="header-left">
        <text class="room-number">{{roomId ? (roomId.toString().length > 2 ? roomId.toString().slice(-2) : roomId) : '11'}}</text>
        <text class="room-status-text">{{onlineCount}}人在线</text>
      </view>
      <view class="header-right">
        <text class="room-timer">{{roomTimer}}</text>
        <view class="exit-button" @tap="exitRoom">
          <text class="exit-icon">×</text>
        </view>
      </view>
    </view>
    
    <!-- 模块切换器 -->
    <module-switcher 
      :modules="modules" 
      :initial-index="currentModuleIndex"
      @module-change="onModuleChange"
    >
      <!-- 学习状态模块 -->
      <module-panel 
        slot="module-0" 
        :active="currentModuleIndex === 0" 
        :index="0" 
        :lastActiveIndex="lastModuleIndex"
      >
        <view class="study-status-module">
          <view class="status-header">
            <text class="status-title">今日学习进度</text>
          </view>
          
          <view class="timer-display">
            <text class="timer-value">{{formatStudyTime(studyTime)}}</text>
            <text class="timer-label">已学习时间</text>
          </view>
          
          <view class="status-actions">
            <button class="action-btn primary" @click="toggleStudyStatus">
              {{isStudying ? '暂停学习' : '开始学习'}}
            </button>
            <button class="action-btn secondary" @click="finishStudy" v-if="studyTime > 0">
              结束学习
            </button>
          </view>
          
          <view class="study-goal">
            <text class="goal-label">今日目标: </text>
            <text class="goal-value">{{roomInfo.duration}}</text>
          </view>
        </view>
      </module-panel>
      
      <!-- 学习者列表模块 -->
      <module-panel 
        slot="module-1" 
        :active="currentModuleIndex === 1" 
        :index="1" 
        :lastActiveIndex="lastModuleIndex"
      >
        <view class="members-module">
          <members-list 
            :members="formattedRoomMembers" 
            :online-count="onlineCount"
          />
        </view>
      </module-panel>
      
      <!-- 学习规则模块 -->
      <module-panel 
        slot="module-2" 
        :active="currentModuleIndex === 2" 
        :index="2" 
        :lastActiveIndex="lastModuleIndex"
      >
        <view class="rules-module">
          <view class="module-header">
            <text class="module-title">自习规则</text>
          </view>
          
          <view class="rule-list">
            <view class="rule-item" v-for="(rule, index) in roomInfo.rules" :key="index">
              <text class="rule-number">{{index + 1}}.</text>
              <text class="rule-text">{{rule}}</text>
            </view>
          </view>
        </view>
      </module-panel>
      
      <!-- 聊天交流模块 -->
      <module-panel 
        slot="module-3" 
        :active="currentModuleIndex === 3" 
        :index="3" 
        :lastActiveIndex="lastModuleIndex"
      >
        <view class="chat-module">
          <view class="module-header">
            <text class="module-title">学习交流</text>
          </view>
          
          <chat-box 
            :messages="chatMessages" 
            :user-avatar="userAvatar"
            :user-name="userName"
            @send-message="handleSendMessage"
            @load-more="loadMoreMessages"
          />
        </view>
      </module-panel>
    </module-switcher>
  </view>
  
  <!-- 将退出自习室统计弹窗放在页面最外层，确保它不会被其他元素遮挡 -->
  <study-exit-modal
    :visible="showExitModal"
    @update:visible="showExitModal = $event"
    @close="handleExitModalClose"
    :user-avatar="userAvatar"
    :study-duration="studyTime"
    :member-count="roomMembers.length"
  />
</template>

<script>
import ModuleSwitcher from '@/components/ModuleSwitcher.vue';
import ModulePanel from '@/components/ModulePanel.vue';
import { Navigation } from '@/utils/navigation';
import StudyExitModal from '@/components/modals/StudyExitModal.vue';
import ChatBox from '@/components/ChatBox.vue';
import MembersList from '@/components/MembersList.vue';

export default {
  components: {
    ModuleSwitcher,
    ModulePanel,
    StudyExitModal,
    ChatBox,
    MembersList
  },
  computed: {
    // 格式化成员列表，添加isSelf属性
    formattedRoomMembers() {
      return this.roomMembers.map(member => {
        return {
          ...member,
          isSelf: member.name === this.userName || member.name === "我"
        };
      });
    }
  },
  data() {
    return {
      roomId: null,
      roomInfo: {},
      // 模块配置
      modules: [
        { title: "学习" },
        { title: "成员" },
        { title: "规则" },
        { title: "交流" }
      ],
      currentModuleIndex: 0,
      lastModuleIndex: -1,
      // 学习状态
      isStudying: false,
      studyTime: 0,
      studyInterval: null,
      studyStartTime: 0,
      // 成员列表
      roomMembers: [],
      // 在线人数
      onlineCount: 0,
      // 聊天消息
      chatMessages: [],
      newMessage: "",
      // 房间计时
      roomTimer: "00:00:00",
      // 用户信息
      userAvatar: "/static/avatar/default-avatar.png",
      userName: "我",
      // 退出模态框
      showExitModal: false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.roomId = options.id;
      console.log('自习室页面加载，房间ID:', this.roomId);
      this.loadRoomDataFromBackend(); // 从后端加载数据
      this.loadRoomDetails(); 
      this.loadStudyState();
      this.startRoomTimer();
    } else {
      console.error('加载自习室页面失败：未提供房间ID');
      uni.showToast({
        title: '房间信息不存在',
        icon: 'none'
      });
      uni.navigateBack();
    }
  },
  onUnload() {
    this.clearTimers();
  },
  methods: {
    // 从后端加载房间数据
    async loadRoomDataFromBackend() {
      try {
        const res = await uni.request({
          url: `http://localhost:3000/api/rooms/${this.roomId}`,
          method: 'GET',
          header: {
            'Authorization': `Bearer ${store.token}`
          }
        });

        if (res[1].data.code === 200) {
          const roomData = res[1].data.data;

          this.roomInfo = {
            id: roomData.id,
            name: roomData.name,
            isActive: true,
            duration: "2小时/天",
            goals: roomData.goals,
            content: roomData.content,
            rules: roomData.rules
          };

          this.roomMembers = [
            { id: 1, name: "我", avatar: "/static/avatar/default-avatar.png", isHost: true, isStudying: false, studyTime: 0 }
          ];
          this.updateOnlineCount();
        }
      } catch (error) {
        console.error('加载房间数据失败:', error);
        uni.showToast({
          title: '加载房间数据失败',
          icon: 'none'
        });
      }
    },
    async loadRoomDetails() {
      try {
        const res = await uni.request({
          url: `/api/rooms/${this.roomId}`, // 使用模拟API
          method: 'GET',
          header: {
            'Authorization': `Bearer ${store.token}` // 确保token有效
          }
        });
        if (res.data.code === 200) {
          this.roomInfo = res.data.data; // 赋值房间数据
          this.onlineCount = res.data.data.memberCount; // 示例：更新在线人数
        }
      } catch (error) {
        console.error('加载房间详情失败:', error);
        uni.showToast({ title: '房间数据加载失败', icon: 'none' });
      }
    },
    // 加载和恢复计时器状态
    loadStudyState() {
      try {
        const stateKey = `study_state_${this.roomId}`;
        const savedState = uni.getStorageSync(stateKey);

        if (savedState) {
          this.studyTime = savedState.studyTime || 0;
          this.isStudying = savedState.isStudying || false;

          if (this.isStudying) {
            const lastTimestamp = savedState.timestamp || 0;
            const now = Date.now();
            const timeDiff = Math.floor((now - lastTimestamp) / 1000);

            if (timeDiff <= 1800) { // 30分钟 = 1800秒
              this.studyTime += timeDiff;
              this.startStudyTimer();
            } else {
              this.isStudying = false;
            }
          }

          const userIndex = this.roomMembers.findIndex(member => member.name === "我");
          if (userIndex !== -1) {
            this.roomMembers[userIndex].isStudying = this.isStudying;
            this.roomMembers[userIndex].studyTime = this.studyTime;
            this.updateOnlineCount();
          }
        }
      } catch (e) {
        console.error('加载学习状态失败:', e);
      }
    },
    // 保存计时器状态
    saveStudyState() {
      try {
        const stateKey = `study_state_${this.roomId}`;
        const stateToSave = {
          studyTime: this.studyTime,
          isStudying: this.isStudying,
          timestamp: Date.now()
        };
        uni.setStorageSync(stateKey, stateToSave);
        console.log('保存学习状态:', stateToSave);
      } catch (e) {
        console.error('保存学习状态失败:', e);
      }
    },
    // 模块切换事件
    onModuleChange(event) {
      this.lastModuleIndex = event.lastActiveIndex;
      this.currentModuleIndex = event.currentIndex;
    },
    // 新增方法：更新在线人数
    updateOnlineCount() {
      const studyingMembers = this.roomMembers.filter(member => member.isStudying);
      this.onlineCount = studyingMembers.length;
    },
    // 开始/暂停学习
    toggleStudyStatus() {
      this.isStudying = !this.isStudying;
      
      if (this.isStudying) {
        this.startStudyTimer();
        uni.showToast({
          title: '开始学习',
          icon: 'success'
        });
      } else {
        this.pauseStudyTimer();
        uni.showToast({
          title: '已暂停',
          icon: 'none'
        });
      }
      
      const userIndex = this.roomMembers.findIndex(member => member.name === "我");
      if (userIndex !== -1) {
        this.roomMembers[userIndex].isStudying = this.isStudying;
        this.updateOnlineCount();
      }
    },
    // 开始学习计时
    startStudyTimer() {
      this.studyStartTime = Date.now();
      this.studyInterval = setInterval(() => {
        const now = Date.now();
        this.studyTime += (now - this.studyStartTime) / 1000;
        this.studyStartTime = now;
        
        if (Math.floor(this.studyTime) % 10 === 0) {
          this.saveStudyState();
        }
      }, 1000);
    },
    // 暂停学习计时
    pauseStudyTimer() {
      if (this.studyInterval) {
        clearInterval(this.studyInterval);
        this.studyInterval = null;
        this.saveStudyState();
      }
    },
    // 结束学习
    finishStudy() {
      this.pauseStudyTimer();
      this.isStudying = false;
      
      uni.showModal({
        title: '结束学习',
        content: `本次学习时长: ${this.formatStudyTime(this.studyTime)}`,
        showCancel: false,
        success: () => {
          this.studyTime = 0;
        }
      });
    },
    // 开始房间计时
    startRoomTimer() {
      let roomStartTime;
      const roomTimerKey = `room_timer_${this.roomId}`;
      
      try {
        const savedRoomTimer = uni.getStorageSync(roomTimerKey);
        if (savedRoomTimer) {
          roomStartTime = new Date(savedRoomTimer);
        } else {
          roomStartTime = new Date();
          uni.setStorageSync(roomTimerKey, roomStartTime.toISOString());
        }
      } catch (e) {
        console.error('房间计时器状态操作失败:', e);
        roomStartTime = new Date();
      }
      
      setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - roomStartTime) / 1000);
        
        const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(diff % 60).toString().padStart(2, '0');
        
        this.roomTimer = `${hours}:${minutes}:${seconds}`;
      }, 1000);
    },
    // 格式化学习时间
    formatStudyTime(seconds) {
      const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      
      return `${hours}:${minutes}:${secs}`;
    },
    // 清除所有计时器
    clearTimers() {
      if (this.studyInterval) {
        clearInterval(this.studyInterval);
      }
    },
    exitRoom() {
      if (this.isStudying) {
        uni.showModal({
          title: '确认退出',
          content: '你正在学习中，退出将会暂停学习记录。确定要退出吗？',
          confirmColor: '#8a9eef',
          confirmText: '确定退出',
          cancelText: '继续学习',
          success: (res) => {
            if (res.confirm) {
              this.doExitRoom();
            }
          }
        });
      } else {
        uni.showModal({
          title: '确认退出',
          content: '确定要退出自习室吗？',
          confirmColor: '#8a9eef',
          confirmText: '确定退出',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              this.doExitRoom();
            }
          }
        });
      }
    },
    // 退出弹窗关闭后的处理
    handleExitModalClose() {
      try {
        const stateKey = `study_state_${this.roomId}`;
        uni.removeStorageSync(stateKey);
        
        const roomTimerKey = `room_timer_${this.roomId}`;
        uni.removeStorageSync(roomTimerKey);
        
        console.log('已清除所有状态缓存');
      } catch (e) {
        console.error('清除状态缓存失败:', e);
      }
      
      try {
        Navigation.toHome();
      } catch (e) {
        console.error('导航回首页失败:', e);
        uni.reLaunch({
          url: '/pages/home/home'
        });
      }
    },
    doExitRoom() {
      if (this.isStudying) {
        this.pauseStudyTimer();
      }
      
      this.clearTimers();
      
      const earnedPoints = Math.floor(Math.floor(this.studyTime / 60) / 10);
      
      const studyRecord = {
        roomId: this.roomId,
        roomName: this.roomInfo.name,
        duration: this.studyTime,
        earnedPoints: earnedPoints,
        date: new Date().toISOString()
      };
      console.log('保存学习记录:', studyRecord);
      
      this.saveUserPoints(earnedPoints);
      
      this.userAvatar = this.roomMembers.find(member => member.name === '我')?.avatar || '/static/avatar/default-avatar.png';
      
      console.log('退出自习室，准备显示弹窗：', {
        showExitModal: this.showExitModal,
        studyTime: this.studyTime,
        earnedPoints: earnedPoints,
        memberCount: this.roomMembers.length
      });
      
      this.showExitModal = true;
      
      setTimeout(() => {
        if (!this.showExitModal) {
          this.showExitModal = true;
        }
      }, 500);
    },
    // 保存用户积分
    saveUserPoints(earnedPoints) {
      if (earnedPoints <= 0) return;
      
      try {
        let userPoints = uni.getStorageSync('userPoints') || 0;
        userPoints += earnedPoints;
        uni.setStorageSync('userPoints', userPoints);
        
        console.log(`积分保存成功，当前总积分: ${userPoints}`);
      } catch (e) {
        console.error('保存积分失败:', e);
      }
    },
    // 处理ChatBox组件发送的消息
    handleSendMessage(message) {
      this.chatMessages.push(message);
      
      setTimeout(() => {
        const responses = [
          "加油！",
          "今天的学习目标完成了吗？",
          "我们一起坚持！",
          "有问题可以随时讨论",
          "记得休息一下眼睛哦"
        ];
        
        const randomIndex = Math.floor(Math.random() * this.roomMembers.length);
        const randomMember = this.roomMembers[randomIndex];
        
        if (randomMember.name === this.userName || randomMember.name === "我") {
          return;
        }
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        this.chatMessages.push({
          name: randomMember.name,
          avatar: randomMember.avatar,
          content: randomResponse,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        });
      }, 1500);
    },
    // 加载更多历史消息
    loadMoreMessages() {
      console.log('加载更多历史消息');
      
      setTimeout(() => {
        const historyMessages = [
          {
            name: "知识追求者",
            avatar: "/static/avatar/avatar3.png",
            content: "今天的进度如何了？",
            time: "昨天 19:30"
          },
          {
            name: this.userName,
            avatar: this.userAvatar,
            content: "我完成了英语阅读训练",
            time: "昨天 19:32",
            isSelf: true
          },
          {
            name: "奋斗者",
            avatar: "/static/avatar/avatar2.png",
            content: "不错！明天继续加油",
            time: "昨天 19:35"
          }
        ];
        
        this.chatMessages = [...historyMessages, ...this.chatMessages];
      }, 1000);
    }
  }
}
</script>

<style>
page {
  background-color: #f8f3ff;
  min-height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.study-room {
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
}

/* 房间名称和目标显示区域 */
.room-info-banner {
  background: linear-gradient(135deg, #8a9eef, #c2a8fd);
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  box-shadow: 0 4px 15px rgba(138, 158, 239, 0.2);
}

.room-name {
  font-size: 24px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 8px;
}

.room-targets {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.room-goal-text {
  font-size: 14px;
  color: #fff;
  background-color: rgba(79, 209, 138, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
}

.room-content-text {
  font-size: 14px;
  color: #fff;
  background-color: rgba(79, 209, 138, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
}

/* 自习室标题区域 */
.study-header {
  background: linear-gradient(135deg, #8a9eef, #c2a8fd);
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  box-shadow: 0 4px 15px rgba(138, 158, 239, 0.2);
}

.header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.room-number {
  font-size: 24px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 8px;
}

.room-status-text {
  font-size: 14px;
  color: #fff;
  background-color: rgba(79, 209, 138, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
}

.header-right {
  display: flex;
  align-items: center;
}

.room-timer {
  font-size: 24px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.exit-button {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  cursor: pointer;
}

.exit-button:active {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(0.95);
}

.exit-icon {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 20px;
}

/* 模块通用样式 */
.module-header {
  margin-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.module-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 学习状态模块 */
.study-status-module {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
}

.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.timer-value {
  font-size: 36px;
  font-weight: 700;
  color: #8a9eef;
  font-variant-numeric: tabular-nums;
}

.timer-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.status-actions {
  display: flex;
  gap: 15px;
  margin: 20px 0;
}

.action-btn {
  border-radius: 24px;
  padding: 8px 24px;
  font-size: 15px;
  font-weight: 500;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(to right, #8a9eef, #c2a8fd);
  color: white;
  box-shadow: 0 4px 10px rgba(138, 158, 239, 0.3);
}

.action-btn.secondary {
  background: #f0f0f0;
  color: #666;
}

.study-goal {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.goal-value {
  color: #8a9eef;
  font-weight: 500;
}

/* 成员列表模块 */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.member-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f6f6f6;
  position: relative;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
  border: 2px solid #f0f0f0;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.member-name {
  font-size: 15px;
  font-weight: 500;
}

.member-status {
  font-size: 12px;
  color: #666;
}

.member-study-time {
  font-size: 14px;
  color: #8a9eef;
  font-variant-numeric: tabular-nums;
}

.member-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(to right, #8a9eef, #c2a8fd);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* 规则模块 */
.rule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  display: flex;
  align-items: flex-start;
}

.rule-number {
  font-weight: 600;
  color: #8a9eef;
  margin-right: 8px;
  font-size: 15px;
}

.rule-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

/* 聊天模块 */
.chat-module {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 成员模块 */
.members-module {
  height: 100%;
}

/* 平板适配 */
@media screen and (min-width: 768px) {
  .study-room {
    padding: 30px 20px;
  }
  
  .study-header {
    border-radius: 20px;
    padding: 20px;
  }
  
  .room-timer {
    font-size: 28px;
  }
  
  .timer-value {
    font-size: 48px;
  }
  
  .status-actions {
    margin: 30px 0;
  }
  
  .action-btn {
    padding: 10px 30px;
    font-size: 16px;
  }
}
</style>