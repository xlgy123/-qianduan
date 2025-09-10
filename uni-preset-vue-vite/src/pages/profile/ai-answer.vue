<template>
	<view class="ai-answer-container">
		<!-- 顶部导航栏 -->
		<view class="header">
			<view class="back-button" @click="goBack">
				<text class="back-arrow">←</text>
				<text class="back-text">返回</text>
			</view>
			<view class="title-container">
				<text class="title">AI问答</text>
			</view>
		</view>
		
		<!-- 对话容器 -->
		<view class="chat-container">
			<view class="chat-messages" id="chatMessages">
				<view v-for="(message, index) in messages" :key="index" class="message-wrapper">
					<view :class="['message', message.isUser ? 'user-message' : 'ai-message']">
						<view v-if="!message.isUser" class="ai-avatar">
							<text class="ai-icon">🤖</text>
						</view>
						<view class="message-content">
							<text>{{ message.content }}</text>
						</view>
						<view v-if="message.isUser" class="user-avatar">
							<text class="user-icon">👤</text>
						</view>
					</view>
					
					<!-- AI思考动画 -->
					<view v-if="message.isThinking" class="thinking-animation">
						<view class="spinner">
							<view class="spinner-dot"></view>
							<view class="spinner-dot"></view>
							<view class="spinner-dot"></view>
							<view class="spinner-dot"></view>
						</view>
						<text class="thinking-text">思考中...</text>
					</view>
				</view>
			</view>
			
			<!-- 输入区域 -->
			<view class="input-area">
				<input 
					class="input" 
					type="text" 
					v-model="newMessage" 
					placeholder="请输入问题..."
					@confirm="sendMessage"
				/>
				<button class="send-button" @click="sendMessage">
					<text class="send-icon">➤</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			messages: [
				{
					isUser: false,
					content: "你好！我是自习室小助手，有什么可以帮助你的吗？"
				}
			],
			newMessage: "",
			isSending: false,
			apiKey: "sk-4277626d5dc349909114692fc802ba61",
			appId : "b0604ad264914192a60a9145ac90e9fd",
			apiUrl: "https://dashscope.aliyuncs.com/api/v1/apps/b0604ad264914192a60a9145ac90e9fd/completion",
			retryCount: 0,
			maxRetries: 3
		};
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		sendMessage() {
			if (this.newMessage.trim() === "") {
				uni.showToast({
					title: "请输入内容",
					icon: "none"
				});
				return;
			}
			
			if (this.isSending) {
				uni.showToast({
					title: "正在发送消息，请稍候",
					icon: "none"
				});
				return;
			}
			
			this.isSending = true;
			this.retryCount = 0;
			
			this.messages.push({
				isUser: true,
				content: this.newMessage
			});
			
			this.newMessage = "";
			
			this.messages.push({
				isUser: false,
				content: "",
				isThinking: true
			});
			
			this.getAIReply(this.messages[this.messages.length - 2].content);
			
			this.scrollToBottom();
		},
		async getAIReply(userMsg) {
			try {
				const headers = {
					"Authorization": `Bearer ${this.apiKey}`,
					"Content-Type": "application/json"
				};
				
				const systemMessage = "你是一个有双重人格的自习室小助手。你的两个人格分别是学霸栀栀和治愈布栀。你会根据用户的问题选择合适的人格来回答。如果用户的问题涉及到学习、考试、科研等，你会选择学霸栀栀来回答。如果用户的问题涉及到情感、生活、工作等，你会选择治愈布栀来回答。你会根据用户的问题来选择合适的人格来回答，并且在回答时会使用对应的人格来表达。";
				const payload = {
					model: "deepSeek-r1",
					messages: [
						{ role: "system", content: systemMessage },
						{ role: "user", content: userMsg }
					],
					stream: false,
					max_tokens: 1024,
					temperature: 0.7
				};
				
				const response = await this.fetchWithRetry(this.apiUrl, {
					method: "POST",
					headers,
					body: JSON.stringify(payload)
				});
				
				if (!response.ok) {
					throw new Error(`HTTP错误! 状态码: ${response.status}`);
				}
				
				const data = await response.json();
				const aiReply = data.choices[0].message.content;
				
				this.messages.pop();
				
				this.messages.push({
					isUser: false,
					content: aiReply
				});
				
			} catch (error) {
				console.error("获取AI回复失败:", error);
				this.handleRequestError();
			} finally {
				this.isSending = false;
				this.scrollToBottom();
			}
		},
		async fetchWithRetry(url, options) {
			while (this.retryCount < this.maxRetries) {
				try {
					const response = await fetch(url, options);
					return response;
				} catch (error) {
					this.retryCount++;
					if (this.retryCount >= this.maxRetries) {
						throw error;
					}
					console.warn(`请求失败，正在重试 ${this.retryCount}/${this.maxRetries}...`);
					await new Promise(resolve => setTimeout(resolve, 1000));
				}
			}
			return null;
		},
		handleRequestError() {
			this.messages.pop();
			
			this.messages.push({
				isUser: false,
				content: "抱歉，获取回答时出错了，请稍后再试。"
			});
			console.error("请求失败");
		},
		scrollToBottom() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('#chatMessages').boundingClientRect();
				query.exec((res) => {
					const chatMessages = res[0];
					if (chatMessages) {
						uni.pageScrollTo({
							scrollTop: chatMessages.bottom,
							duration: 0
						});
					}
				});
			});
		}
	}
};
</script>

<style>
.ai-answer-container {
	width: 100%;
	height: 100vh;
	background-color: #f0f2ff;
	display: flex;
	flex-direction: column;
}

/* 顶部导航栏 */
.header {
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	padding: 15px 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: white;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-button {
	display: flex;
	align-items: center;
}

.back-arrow {
	font-size: 18px;
	margin-right: 5px;
}

.back-text {
	font-size: 16px;
}

.title-container {
	position: absolute;
	left: 0;
	right: 0;
	text-align: center;
}

.title {
	font-size: 18px;
	font-weight: bold;
}

/* 对话容器 */
.chat-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	background-color: #f0f2ff;
}

/* 对话消息区域 */
.chat-messages {
	flex: 1;
	overflow-y: auto;
	padding: 10px 15px;
	background-color: #f0f2ff;
}

.message-wrapper {
	margin-bottom: 20px;
}

.message {
	display: flex;
	align-items: center;
}

.user-message {
	margin-left: auto;
	flex-direction: row-reverse;
}

.ai-message {
	margin-right: auto;
}

.ai-avatar, .user-avatar {
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	margin: 0 10px;
}

.ai-avatar {
	background-color: #d8e3fe;
}

.user-avatar {
	background-color: #f0f0f0;
}

.ai-icon, .user-icon {
	font-size: 20px;
}

.message-content {
	background-color: white;
	padding: 12px 15px;
	border-radius: 18px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	max-width: 80%;
	word-break: break-word;
	position: relative;
}

.user-message .message-content {
	background-color: #d8e3fe;
}

.message-content::after {
	content: '';
	position: absolute;
	bottom: -8px;
	left: 10px;
	width: 0;
	height: 0;
	border-width: 8px 8px 0;
	border-style: solid;
	border-color: white transparent transparent;
}

.user-message .message-content::after {
	left: auto;
	right: 10px;
	border-color: #d8e3fe transparent transparent;
}

/* 输入区域 */
.input-area {
	display: flex;
	align-items: center;
	padding: 10px 15px;
	background-color: white;
	border-top: 1px solid #f0f0f0;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.05);
}

.input {
	flex: 1;
	height: 40px;
	border: 1px solid #e0e0e0;
	border-radius: 20px;
	padding: 0 15px;
	font-size: 14px;
	outline: none;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.send-button {
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #a6c0fe;
	color: white;
	border-radius: 50%;
	margin-left: 10px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.send-button:active {
	background-color: #90a7d9;
}

.send-icon {
	font-size: 18px;
}

/* AI思考动画 */
.thinking-animation {
	display: flex;
	align-items: center;
	margin-left: 10px;
}

.spinner {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 10px;
}

.spinner-dot {
	width: 10px;
	height: 10px;
	background-color: #a6c0fe;
	border-radius: 50%;
	margin: 0 3px;
	animation: pulse 1.5s infinite ease-in-out;
}

.spinner-dot:nth-child(1) {
	animation-delay: 0s;
}

.spinner-dot:nth-child(2) {
	animation-delay: 0.3s;
}

.spinner-dot:nth-child(3) {
	animation-delay: 0.6s;
}

.spinner-dot:nth-child(4) {
	animation-delay: 0.9s;
}

.thinking-text {
	font-size: 14px;
	color: #666;
}

@keyframes pulse {
	0%, 100% {
		opacity: 0.3;
		transform: scale(0.8);
	}
	50% {
		opacity: 1;
		transform: scale(1.2);
	}
}
</style>