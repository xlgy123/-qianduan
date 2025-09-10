<template>
	<view class="chat-container">
		<!-- 顶部消息标题栏 -->
		<view class="chat-header">
			<view class="back-button" @click="goBack">
				<text class="back-icon">←</text>
			</view>
			<view class="chat-title">
				<text class="title-text">{{ selectedFriend.name }}</text>
			</view>
			<view class="more-options">
				<text class="options-icon">⋮</text>
			</view>
		</view>
		
		<!-- 消息列表 -->
		<scroll-view scroll-y class="messages-list" @scrolltolower="loadMoreMessages">
			<view class="message" v-for="(message, index) in messages" :key="index">
				<view class="message-time" v-if="showTimestamp(message, index)">
					{{ formatTime(message.time) }}
				</view>
				<view class="message-bubble" :class="{ 'message-sent': message.sent, 'message-received': !message.sent }">
					<text class="message-content">{{ message.content }}</text>
				</view>
			</view>
		</scroll-view>
		
		<!-- 输入区域 -->
		<view class="input-area">
			<view class="input-container">
				<input class="input-box" v-model="newMessage" placeholder="输入消息" @confirm="sendMessage" confirm-type="send" />
				<view class="send-button" @click="sendMessage">
					<text class="send-text">发送</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectedFriend: {
				name: '学霸王',
				avatar: '/static/avatar1.png'
			},
			messages: [
				{
					sent: false,
					content: '你好，今天学习怎么样？',
					time: '2025-05-25 09:30:00'
				},
				{
					sent: true,
					content: '挺好的，谢谢！你呢？',
					time: '2025-05-25 09:35:00'
				},
				{
					sent: false,
					content: '我刚做完一套模拟题，感觉还不错。',
					time: '2025-05-25 09:40:00'
				},
				{
					sent: true,
					content: '太棒了！我们互相加油呀。',
					time: '2025-05-25 09:45:00'
				}
			],
			newMessage: ''
		}
	},
	methods: {
		goBack() {
			// 返回上一页的逻辑
			uni.navigateBack();
		},
		showTimestamp(message, index) {
			// 简单逻辑：只在第一条消息和时间间隔大于一定值时显示时间戳
			if (index === 0) return true;
			
			const prevMessage = this.messages[index - 1];
			const prevTime = new Date(prevMessage.time);
			const currentTime = new Date(message.time);
			
			// 计算时间差（分钟）
			const timeDiff = (currentTime.getTime() - prevTime.getTime()) / 60000;
			return timeDiff > 30; // 如果时间差大于30分钟，显示时间戳
		},
		formatTime(timeString) {
			const time = new Date(timeString);
			return `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
		},
		loadMoreMessages() {
			// 加载更多历史消息的逻辑
			console.log('加载更多消息');
			// 这里可以实现加载更多历史消息的功能
		},
		sendMessage() {
			if (!this.newMessage.trim()) return;
			
			const currentTime = new Date();
			const formattedTime = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1).toString().padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')} ${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`;
			
			this.messages.push({
				sent: true,
				content: this.newMessage,
				time: formattedTime
			});
			
			this.newMessage = '';
			
			// 滚动到底部显示最新消息
			this.$nextTick(() => {
				const messageList = this.$el.querySelector('.messages-list');
				messageList.scrollTop = messageList.scrollHeight;
			});
		}
	}
}
</script>

<style>
page {
	background-color: #f8f3ff;
	height: 100%;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.chat-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f8f3ff;
}

/* 顶部消息标题栏 */
.chat-header {
	height: 50px;
	background-color: #fff;
	display: flex;
	align-items: center;
	padding: 0 15px;
	border-bottom: 1px solid #f0f0f0;
}

.back-button {
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	font-size: 20px;
	color: #666;
}

.chat-title {
	flex: 1;
	text-align: center;
}

.title-text {
	font-size: 16px;
	font-weight: bold;
	color: #333;
}

.more-options {
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.options-icon {
	font-size: 20px;
	color: #666;
}

/* 消息列表 */
.messages-list {
	flex: 1;
	padding: 10px 15px;
	background-color: #f8f3ff;
	overflow-y: auto;
}

.message {
	margin-bottom: 15px;
}

.message-time {
	font-size: 12px;
	color: #999;
	text-align: center;
	margin: 15px 0;
	padding: 4px 0;
	background-color: transparent;
	border: none;
	position: relative;
}

.message-bubble {
	max-width: 70%;
	padding: 12px 16px;
	border-radius: 18px;
	word-wrap: break-word;
	position: relative;
	margin-bottom: 8px;
	box-sizing: border-box;
}

.message-sent {
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	color: #fff;
	margin-left: auto;
	border-bottom-left-radius: 5px;
	box-shadow: 0 2px 8px rgba(138, 125, 255, 0.2);
}

.message-received {
	background: linear-gradient(to right, #f0f5ff, #e8f0fe);
	color: #333;
	border-bottom-right-radius: 15px;
	border-radius: 18px;
	box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.message-content {
	font-size: 14px;
}

/* 输入区域 */
.input-area {
	height: 60px;
	background-color: #fff;
	padding: 10px 15px;
	border-top: 1px solid #f0f0f0;
}

.input-container {
	display: flex;
	align-items: center;
}

.input-box {
	flex: 1;
	height: 40px;
	border: 1px solid #e0e0e0;
	border-radius: 20px;
	padding: 0 15px;
	font-size: 14px;
}

.send-button {
	width: 60px;
	height: 40px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 10px;
}

.send-text {
	color: #fff;
	font-size: 14px;
}
</style>