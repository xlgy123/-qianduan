<template>
  <view class="chat-box">
    <!-- 聊天消息区域 -->
    <scroll-view 
      class="chat-messages" 
      scroll-y 
      :scroll-into-view="'msg-' + chatMessages.length" 
      :scroll-with-animation="true"
      @scrolltoupper="loadMoreMessages"
      :upper-threshold="100"
    >
      <view class="messages-container">
        <!-- 消息加载提示 -->
        <view class="loading-more" v-if="isLoadingMore">
          <text>加载更多消息...</text>
        </view>
        
        <!-- 消息列表 -->
        <view 
          class="message-item" 
          v-for="(msg, index) in chatMessages" 
          :key="index"
          :id="'msg-' + (index + 1)"
          :class="{
            'system-message': msg.isSystem,
            'self-message': msg.isSelf
          }"
        >
          <!-- 系统消息 -->
          <block v-if="msg.isSystem">
            <view class="system-message-content">
              <text>{{ msg.content }}</text>
            </view>
          </block>
          
          <!-- 普通消息 -->
          <block v-else>
            <!-- 个人的消息靠右，别人的消息靠左 -->
            <view class="message-wrapper" :class="{'self-wrapper': msg.isSelf}">
              <!-- 左侧显示头像 -->
              <image 
                class="sender-avatar" 
                :src="msg.avatar || '/static/avatar/default-avatar.png'" 
                mode="aspectFill"
                v-if="!msg.isSelf"
              ></image>
              
              <view class="message-content-wrapper">
                <!-- 显示用户名 -->
                <text class="sender-name" v-if="!msg.isSelf">{{ msg.name }}</text>
                
                <!-- 消息内容 -->
                <view class="message-content" :class="{'self-content': msg.isSelf}">
                  <text>{{ msg.content }}</text>
                </view>
                
                <!-- 消息发送时间 -->
                <text class="message-time" :class="{'self-time': msg.isSelf}">{{ msg.time }}</text>
              </view>
              
              <!-- 右侧显示头像 -->
              <image 
                class="sender-avatar self-avatar" 
                :src="msg.avatar || '/static/avatar/default-avatar.png'" 
                mode="aspectFill"
                v-if="msg.isSelf"
              ></image>
            </view>
          </block>
        </view>
      </view>
    </scroll-view>
    
    <!-- 输入区域 -->
    <view class="chat-input-area">
      <view class="input-wrapper">
        <input 
          class="chat-input" 
          type="text" 
          v-model="newMessage" 
          placeholder="发送消息..." 
          confirm-type="send"
          @confirm="sendMessage"
        />
        <button class="send-btn" @tap="sendMessage" :disabled="!newMessage.trim()">
          <text class="send-text">发送</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ChatBox',
  props: {
    // 接收聊天消息列表
    messages: {
      type: Array,
      default: () => []
    },
    // 用户头像
    userAvatar: {
      type: String,
      default: '/static/avatar/default-avatar.png'
    },
    // 用户名
    userName: {
      type: String,
      default: '我'
    }
  },
  data() {
    return {
      chatMessages: [],
      newMessage: '',
      isLoadingMore: false
    };
  },
  watch: {
    messages: {
      handler(val) {
        this.chatMessages = val;
        // 聊天消息更新后，滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // 初始化时滚动到底部
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  methods: {
    // 发送消息
    sendMessage() {
      if (!this.newMessage.trim()) return;
      
      // 创建消息对象
      const message = {
        name: this.userName,
        avatar: this.userAvatar,
        content: this.newMessage,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isSelf: true
      };
      
      // 通知父组件
      this.$emit('send-message', message);
      
      // 清空输入框
      this.newMessage = '';
    },
    
    // 滚动到底部
    scrollToBottom() {
      const lastMessageId = `msg-${this.chatMessages.length}`;
      const query = uni.createSelectorQuery().in(this);
      query.select(`#${lastMessageId}`).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((res) => {
        if (res && res[0]) {
          uni.pageScrollTo({
            selector: `#${lastMessageId}`,
            duration: 300
          });
        }
      });
    },
    
    // 加载更多消息
    loadMoreMessages() {
      // 通知父组件加载更多历史消息
      this.$emit('load-more');
      
      // 模拟加载状态
      this.isLoadingMore = true;
      setTimeout(() => {
        this.isLoadingMore = false;
      }, 1000);
    }
  }
}
</script>

<style>
.chat-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fb;
  border-radius: 12px;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  height: calc(100% - 60px);
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-more {
  text-align: center;
  padding: 10px;
  font-size: 12px;
  color: #999;
}

.message-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.message-wrapper {
  display: flex;
  align-items: flex-start;
  max-width: 80%;
}

.self-wrapper {
  align-self: flex-end;
  flex-direction: row-reverse;
  margin-left: auto;
}

.sender-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
  border: 1px solid #e0e0e0;
}

.self-avatar {
  margin-right: 0;
  margin-left: 8px;
}

.message-content-wrapper {
  display: flex;
  flex-direction: column;
}

.sender-name {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.message-content {
  background-color: #fff;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  max-width: 100%;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
}

.self-content {
  background-color: #8a9eef;
  color: #fff;
  border-top-right-radius: 2px;
}

.message-time {
  font-size: 10px;
  color: #999;
  margin-top: 4px;
  align-self: flex-start;
}

.self-time {
  align-self: flex-end;
}

.system-message {
  align-self: center;
  margin: 10px 0;
}

.system-message-content {
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

.chat-input-area {
  height: 60px;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
}

.input-wrapper {
  display: flex;
  align-items: center;
  height: 40px;
}

.chat-input {
  flex: 1;
  height: 40px;
  background-color: #f0f2f5;
  border-radius: 20px;
  padding: 0 16px;
  font-size: 14px;
}

.send-btn {
  width: 60px;
  height: 36px;
  margin-left: 8px;
  background-color: #8a9eef;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.send-btn:active {
  background-color: #7a8edf;
}

.send-text {
  color: #fff;
  font-size: 14px;
}

.send-btn[disabled] {
  background-color: #d0d0d0;
  color: #999;
}
</style> 