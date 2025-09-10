<template>
    <view class="messages-container">
      <!-- 顶部状态栏 -->
      <view class="status-bar">
        <view class="left-content">
          <text class="status-title">消息</text>
        </view>
        <view class="right-content">
          <view class="notification-toggle">
            <text class="notification-icon">🔔</text>
          </view>
          <view class="profile-button">
            <text class="profile-icon">👤</text>
          </view>
          <view class="add-button">
            <text class="add-icon" @click="showNewMessageModal">+</text>
          </view>
          <view class="status-indicators">
            <text class="status-text">在线</text>
          </view>
        </view>
      </view>
  
      <!-- 消息列表 -->
      <view class="message-list-container">
        <view class="message-item new-friend">
          <view class="message-avatar-container">
            <text class="new-tag">NEW</text>
            <text class="new-friend-text">新朋友</text>
          </view>
        </view>
  
        <view class="message-item" v-for="(message, index) in messages" :key="index" @click="openChat(message)">
          <view class="message-avatar">
            <image :src="message.avatar" mode="aspectFill"></image>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="message-sender">{{ message.sender }}</text>
              <text class="message-time">{{ message.time }}</text>
            </view>
            <text class="message-preview">{{ message.preview }}</text>
          </view>
          <view class="message-badge" v-if="message.unread > 0">
            {{ message.unread }}
          </view>
        </view>
      </view>
  
      <!-- 新消息弹窗 -->
      <view class="new-message-modal" v-if="showNewMessage">
        <view class="new-message-mask" @click="closeNewMessageModal"></view>
        <view class="new-message-content">
          <view class="modal-header">
            <text class="modal-title">新建消息</text>
            <text class="modal-close" @click="closeNewMessageModal">×</text>
          </view>
          <view class="modal-body">
            <input class="new-message-input" v-model="newMessageRecipient" placeholder="请输入联系人" />
            <button class="new-message-button" @click="createNewMessage">发送</button>
          </view>
        </view>
      </view>
  
      <!-- 底部导航栏 -->
      <tab-bar :current="2" @tabChange="handleTabChange"></tab-bar>
    </view>
</template>

<script>
import TabBar from '@/components/TabBar.vue';

export default {
    components: {
        TabBar
    },
    data() {
        return {
            messages: [
                {
                    sender: '十七',
                    avatar: '/static/avatar/avatar1.png',
                    preview: '额',
                    time: '上午 11:30',
                    unread: 0
                },
                {
                    sender: 'Li',
                    avatar: '/static/avatar/avatar2.png',
                    preview: '今日遇见',
                    time: '上午 11:29',
                    unread: 0
                },
                {
                    sender: '爱微光98863277',
                    avatar: '/static/avatar/avatar3.png',
                    preview: '[表情]',
                    time: '昨天',
                    unread: 0
                },
                {
                    sender: '云朵跑丢啦',
                    avatar: '/static/avatar/avatar4.png',
                    preview: '今日遇见',
                    time: '昨天',
                    unread: 0
                },
                {
                    sender: '小光',
                    avatar: '/static/avatar/avatar5.png',
                    preview: '游园嘉年华活动通知',
                    time: '昨天',
                    unread: 0
                },
                {
                    sender: '小微',
                    avatar: '/static/avatar/avatar5.png',
                    preview: '欢迎你来微光！请不要使用含有违规信息的用...',
                    time: '昨天',
                }
            ],
            showNewMessage: false,
            newMessageRecipient: ''
        };
    },
    methods: {
        openChat(message) {
            // 跳转到聊天页面
            uni.navigateTo({
                url: `/pages/message/chat?sender=${message.sender}`
            });
        },
        showNewMessageModal() {
            this.showNewMessage = true;
        },
        closeNewMessageModal() {
            this.showNewMessage = false;
            this.newMessageRecipient = '';
        },
        createNewMessage() {
            if (!this.newMessageRecipient) {
                uni.showToast({
                    title: '请输入联系人',
                    icon: 'none'
                });
                return;
            }
            
            uni.showToast({
                title: '新消息已创建',
                icon: 'success'
            });
            
            this.closeNewMessageModal();
        },
        handleTabChange(data) {
            const index = data.index;
            const path = this.tabList[index].pagePath;
            uni.switchTab({
                url: path
            });
        }
    },
    created() {
        this.tabList = [
            {
                text: '主页',
                pagePath: '/pages/home/home',
                iconText: '🏠',
                badge: ''
            },
            {
                text: '社区',
                pagePath: '/pages/community/community',
                iconText: '💬',
                badge: ''
            },
            {
                text: '好友',
                pagePath: '/pages/friends/friends',
                iconText: '👥',
                badge: ''
            },
            {
                text: '消息',
                pagePath: '/pages/message/message',
                iconText: '💌',
                badge: ''
            },
            {
                text: '我的',
                pagePath: '/pages/profile/profile',
                iconText: '👤',
                badge: ''
            }
        ];
    }
};
</script>

<style>
.messages-container {
    height: 100vh;
    background-color: #f8f3ff; /* 保持页面其他部分的背景色不变 */
    color: #333;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    padding: 0;
    margin: 0;
}

/* 顶部状态栏 */
.status-bar {
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #a6c0fe 0%, #c2a8fd 100%); /* 仅将状态栏背景设置为渐变色 */
    border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* 添加边框线 */
}

.left-content {
    display: flex;
    align-items: center;
}

.status-title {
    font-size: 24px;
    font-weight: bold;
}

.right-content {
    display: flex;
    align-items: center;
}

.notification-toggle, .profile-button, .add-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5); /* 半透明白色背景 */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
    margin-right: 10px;
}

.notification-icon, .profile-icon, .add-icon {
    font-size: 20px;
    color: #333; /* 图标颜色为深色 */
}

.status-indicators {
    display: flex;
    align-items: center;
}

.status-text {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    padding: 5px 10px;
    font-size: 14px;
    color: #333;
}

.message-list-container {
    padding: 10px 20px;
    margin-bottom: 100px;
}

.message-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border-radius: 12px;
    margin-bottom: 10px;
    position: relative;
    background-color: #fff; /* 保持消息项的背景色为白色 */
    border: 1px solid #e0e0e0; /* 保持边框颜色为浅灰色 */
}

.message-item:hover {
    background-color: #f0f0f0; /* 保持悬停时的背景色为浅灰色 */
}

.message-item.new-friend {
    background-color: #fff9e6; /* 保持新朋友项的背景色为浅黄色 */
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-radius: 20px;
}

.message-avatar {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    overflow: hidden;
}

.message-avatar image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.message-content {
    flex: 1;
    margin-left: 15px;
}

.message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.message-sender {
    font-size: 16px;
    font-weight: 500;
}

.message-time {
    font-size: 12px;
    color: #999; /* 保持时间文字颜色为浅灰色 */
}

.message-preview {
    font-size: 14px;
    color: #666; /* 保持预览文字颜色为中灰色 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.message-badge {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    min-width: 18px;
    height: 18px;
    background-color: #ff5a5f; /* 保持未读消息徽章的背景色为红色 */
    color: white;
    font-size: 12px;
    border-radius: 9px;
    padding: 0 4px;
    text-align: center;
    line-height: 18px;
}

.message-avatar-container {
    display: flex;
    align-items: center;
}

.new-tag {
    background-color: #ff5a5f; /* 保持NEW标签的背景色为红色 */
    color: white;
    border-radius: 10px;
    padding: 2px 8px;
    font-size: 10px;
    margin-right: 8px;
}

.new-friend-text {
    font-size: 16px;
    font-weight: 500;
}

.new-message-modal {
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

.new-message-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
}

.new-message-content {
    width: 80%;
    background-color: #fff; /* 保持弹窗的背景色为白色 */
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
    padding: 15px;
    border-bottom: 1px solid #f0f0f0; /* 保持弹窗头部的边框颜色为浅灰色 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f9f9f9; /* 保持弹窗头部的背景色为浅灰色 */
}

.modal-title {
    font-size: 18px;
    font-weight: bold;
    color: #333; /* 保持弹窗标题的颜色为深色 */
}

.modal-close {
    font-size: 24px;
    color: #999; /* 保持关闭按钮的颜色为浅灰色 */
}

.modal-body {
    padding: 15px;
}

.new-message-input {
    width: 100%;
    height: 40px;
    border: 1px solid #e0e0e0; /* 保持输入框的边框颜色为浅灰色 */
    border-radius: 20px;
    padding: 0 15px;
    font-size: 14px;
    margin-bottom: 15px;
}

.new-message-button {
    width: 100%;
    height: 40px;
    background: linear-gradient(to right, #a6c0fe, #c2a8fd); /* 保持发送按钮的渐变色 */
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 16px;
}
</style>