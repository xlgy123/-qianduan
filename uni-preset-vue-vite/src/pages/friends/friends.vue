<template>
	<swipe-detector class="full-container" :tab-index="2">
		<view class="messages-container">
			<!-- 顶部搜索栏 -->
			<view class="search-header">
				<view class="search-bar">
					<text class="search-icon">🔍</text>
					<input type="text" class="search-input" v-model="searchQuery" @input="searchMessages" placeholder="搜索消息" />
				</view>
				<view class="add-button" @click="showNewMessageModal">
					<text class="add-icon">+</text>
				</view>
			</view>
			
			<!-- 标签切换 -->
			<view class="tab-header">
				<view class="tab" :class="{ active: currentTab === 'messages' }" @click="switchTab('messages')">
					好友列表
				</view>
				<view class="tab" :class="{ active: currentTab === 'follows' }" @click="switchTab('follows')">
					关注
				</view>
				<view class="tab-slider" :style="tabSliderStyle"></view>
			</view>
			
			<scroll-view scroll-y class="content-scroll">
				<!-- 消息列表面板 -->
				<view class="panel" v-if="currentTab === 'messages'">
					<view class="message-list">
						<view class="message-item" v-for="(message, index) in allMessages" :key="index" @click="openChat(message)">
							<image class="message-avatar" :src="message.avatar" mode="aspectFill"></image>
							<view class="message-info">
								<text class="message-sender">{{ message.sender }}</text>
								<text class="message-preview">{{ message.preview }}</text>
							</view>
							<view class="message-time">{{ message.time }}</view>
							<view class="message-badge" v-if="message.unread > 0">{{ message.unread }}</view>
						</view>
					</view>
				</view>
				
				<!-- 关注面板 -->
				<view class="panel message-list-style" v-if="currentTab === 'follows'">
					<view v-if="followList.length > 0">
						<view class="follow-item" v-for="(follow, index) in followList" :key="index">
							<image class="follow-avatar" :src="follow.avatar" mode="aspectFill"></image>
							<view class="follow-info">
								<text class="follow-name">{{ follow.name }}</text>
								<text class="follow-latest">{{ follow.latest }}</text>
							</view>
							<view class="follow-action">
								<view class="follow-btn" :class="{ followed: follow.followed }" @click.stop="toggleFollow(follow)">
									{{ follow.followed ? '已关注' : '关注' }}
								</view>
							</view>
						</view>
					</view>
					
					<view class="empty-state" v-else>
						<image class="empty-icon" src="/static/empty-follows.png" mode="aspectFit"></image>
						<text class="empty-text">暂无关注</text>
					</view>
				</view>
			</scroll-view>
			
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
	</swipe-detector>
</template>

<script>
import TabBar from '@/components/TabBar.vue';
import SwipeDetector from '@/components/SwipeDetector.vue';
import { Navigation } from '@/utils/navigation';

export default {
	components: {
		TabBar,
		SwipeDetector
	},
	data() {
		return {
			currentTab: 'messages',
			tabSliderStyle: {
				left: '0%',
				width: '50%'
			},
			allMessages: [
				{
					sender: '学霸王',
					avatar: '/static/avatar/avatar1.png',
				},
				{
					sender: '考研人',
					avatar: '/static/avatar/avatar2.png',
				},
				{
					sender: '专注学习',
					avatar: '/static/avatar/avatar3.png',
				}
			],
			followList: [
				{
					name: '知识探索者',
					avatar: '/static/avatar/avatar4.png',
					latest: '30分钟前更新',
					followed: true
				},
				{
					name: '英语达人',
					avatar: '/static/avatar/avatar5.png',
					latest: '2小时前更新',
					followed: false
				}
			],
			searchQuery: '',
			showNewMessage: false,
			newMessageRecipient: ''
		}
	},
	methods: {
		updateTabBarIndex() {
			uni.$emit('tabIndexUpdate', {
				index: 2,
				path: '/pages/messages/messages'
			});
			
			setTimeout(() => {
				uni.$emit('tabIndexUpdate', {
					index: 2,
					path: '/pages/messages/messages'
				});
			}, 50);
		},
		checkUserLogin() {
			Navigation.checkLoginStatus();
		},
		switchTab(tab) {
			this.currentTab = tab;
			
			if (tab === 'messages') {
				this.tabSliderStyle.left = '0%';
			} else {
				this.tabSliderStyle.left = '50%';
			}
		},
		handleTabChange(data) {
			console.log('Tab changed:', data);
		},
		searchMessages() {
			if (!this.searchQuery) {
				this.resetMessageLists();
				return;
			}
			
			const query = this.searchQuery.toLowerCase();
			this.allMessages = this.allMessages.filter(message => message.sender.toLowerCase().includes(query));
		},
		resetMessageLists() {
			this.allMessages = [
				{
					sender: '学霸王',
					avatar: '/static/avatar1.png',
					preview: '你好，今天学习怎么样？',
					time: '10:30',
					unread: 0
				},
				{
					sender: '考研人',
					avatar: '/static/avatar2.png',
					preview: '我刚做完一套模拟题',
					time: '昨天',
					unread: 2
				},
				{
					sender: '专注学习',
					avatar: '/static/avatar3.png',
					preview: '分享一个学习资源给你',
					time: '3天前',
					unread: 1
				}
			];
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
		openChat(message) {
			
			uni.navigateTo({ url: '/pages/friends/chat?sender=' + message.sender });
		},
		toggleFollow(follow) {
			follow.followed = !follow.followed;
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

.messages-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	position: relative;
	box-sizing: border-box;
	background-color: #f8f3ff;
	padding: 0;
	margin: 0;
	overflow: hidden;
}

/* 顶部搜索栏 */
.search-header {
	padding: 15px;
	display: flex;
	align-items: center;
	background-color: #fff;
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 20px;
	box-shadow: 0 4px 12px rgba(166, 192, 254, 0.1);
}

.search-bar {
	flex: 1;
	height: 40px;
	background-color: #f5f7fa;
	border-radius: 20px;
	display: flex;
	align-items: center;
	padding: 0 15px;
	margin-right: 10px;
}

.search-icon {
	margin-right: 8px;
	font-size: 16px;
	color: #999;
}

.search-input {
	flex: 1;
	height: 100%;
	font-size: 14px;
	color: #333;
}

.add-button {
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	display: flex;
	align-items: center;
	justify-content: center;
}

.add-icon {
	font-size: 20px;
	color: #fff;
	font-weight: bold;
}

/* 标签切换 */
.tab-header {
	display: flex;
	background-color: #fff;
	margin: 15px;
	border-radius: 10px;
	height: 45px;
	position: relative;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	color: #666;
	position: relative;
	z-index: 2;
}

.tab.active {
	color: #fff;
	font-weight: 500;
}

.tab-slider {
	position: absolute;
	top: 5px;
	bottom: 5px;
	width: 50%;
	border-radius: 8px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	z-index: 1;
}

/* 内容区域 */
.content-scroll {
	flex: 1;
	padding: 0 15px 0 15px;
	height: 100%;
	box-sizing: border-box;
	padding-bottom: 56px; /* 为TabBar留出空间 */
	background-color: #f8f3ff;
}

.panel {
	margin-bottom: 56px;
}

/* 消息列表样式 */
.message-list {
	border-radius: 12px;
	background-color: #fff;
	overflow: hidden;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}
.message-list-style {
    border-radius: 12px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}
.message-item {
	display: flex;
	align-items: center;
	padding: 15px;
	border-bottom: 1px solid #f5f5f5;
	position: relative;
}

.message-item:last-child {
	border-bottom: none;
}

.message-avatar {
	width: 50px;
	height: 50px;
	border-radius: 25px;
	margin-right: 15px;
}

.message-info {
	flex: 1;
}

.message-sender {
	font-size: 16px;
	font-weight: 500;
	color: #333;
	margin-bottom: 4px;
	display: block;
}

.message-preview {
	font-size: 14px;
	color: #999;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: block;
}

.message-time {
	font-size: 12px;
	color: #999;
	margin-left: 10px;
}

.message-badge {
	position: absolute;
	right: 15px;
	top: 50%;
	transform: translateY(-50%);
	min-width: 18px;
	height: 18px;
	background-color: #ff5252;
	color: white;
	font-size: 12px;
	border-radius: 9px;
	padding: 0 4px;
	text-align: center;
	line-height: 18px;
}

/* 关注列表样式 */
.follow-item {
	display: flex;
	align-items: center;
	padding: 15px;
	border-bottom: 1px solid #f5f5f5;
}

.follow-item:last-child {
	border-bottom: none;
}

.follow-avatar {
	width: 50px;
	height: 50px;
	border-radius: 25px;
	margin-right: 15px;
}

.follow-info {
	flex: 1;
}

.follow-name {
	font-size: 16px;
	font-weight: 500;
	color: #333;
	margin-bottom: 4px;
	display: block;
}

.follow-latest {
	font-size: 14px;
	color: #999;
	display: block;
}

.follow-action {
	margin-left: 10px;
}

.follow-btn {
	padding: 6px 12px;
	border-radius: 15px;
	font-size: 13px;
	text-align: center;
	background-color: #f0f0f0;
	color: #666;
}

.follow-btn.followed {
	background-color: #e6e6e6;
	color: #999;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 0;
}

.empty-icon {
	width: 120px;
	height: 120px;
	margin-bottom: 20px;
}

.empty-text {
	font-size: 16px;
	color: #999;
}

.full-container {
	width: 100%;
	height: 100%;
	position: relative;
}

/* 新消息弹窗 */
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
	background-color: #fff;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
	padding: 15px;
	border-bottom: 1px solid #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.modal-title {
	font-size: 18px;
	font-weight: bold;
	color: #333;
}

.modal-close {
	font-size: 24px;
	color: #999;
}

.modal-body {
	padding: 15px;
}

.new-message-input {
	width: 100%;
	height: 40px;
	border: 1px solid #e0e0e0;
	border-radius: 20px;
	padding: 0 15px;
	font-size: 14px;
	margin-bottom: 15px;
}

.new-message-button {
	width: 100%;
	height: 40px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	color: white;
	border: none;
	border-radius: 20px;
	font-size: 16px;
}
</style>