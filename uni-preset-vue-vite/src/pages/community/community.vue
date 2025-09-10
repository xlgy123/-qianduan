<template>
	<swipe-detector class="full-container">
		<view class="community-safe-area">
			<view class="community-container">
				<!-- 顶部背景延伸，防止上拉露白 -->
				<view class="header-extension"></view>
				
				<!-- 顶部圆角遮蔽阴影 -->
				<view class="header-shadow"></view>
				
				<!-- 顶部搜索栏 -->
				<view class="search-header">
					<view class="search-bar">
						<text class="search-icon">🔍</text>
						<input type="text" class="search-input" placeholder="搜索自习室、话题或用户" />
					</view>
					<view class="filter-button">
						<text class="filter-icon">⚙️</text>
					</view>
				</view>
				
				<!-- 滚动内容区 -->
				<scroll-view 
					scroll-y 
					class="content-scroll"
					:bounce="true"
					:show-scrollbar="false"
					:refresher-enabled="false"
				>
					<!-- 热门话题卡片 -->
					<scroll-view scroll-x class="topics-scroll">
						<view class="topic-item" v-for="(item, index) in topicList" :key="index">
							<text class="topic-tag">#{{item.name}}</text>
						</view>
					</scroll-view>
					
					<!-- 社区动态 -->
					<view class="section-header">
						<text class="section-title">学习社区</text>
						<view class="tab-header">
							<view class="tab" :class="{ active: activeTab === 'recommend' }" @click="switchTab('recommend')">推荐</view>
							<view class="tab" :class="{ active: activeTab === 'latest' }" @click="switchTab('latest')">最新</view>
							<view class="tab" :class="{ active: activeTab === 'following' }" @click="switchTab('following')">关注</view>
							<view class="tab-slider" :style="tabSliderStyle"></view>
						</view>
					</view>
					
					<!-- 社区帖子列表 -->
					<view class="post-list">
						<!-- 帖子内容 -->
						<view class="post-card" v-for="(post, index) in posts" :key="index">
							<view class="post-header">
								<image class="user-avatar" :src="post.avatar" mode="aspectFill"></image>
								<view class="post-user-info">
									<text class="user-name">{{post.username}}</text>
									<text class="post-time">{{post.time}}</text>
								</view>
								<view class="follow-btn" v-if="!post.isFollowing">关注</view>
								<view class="following-btn" v-else>已关注</view>
							</view>
							
							<view class="post-content">
								<text class="post-text">{{post.content}}</text>
								<view class="post-images" v-if="post.images && post.images.length">
									<image v-for="(img, imgIndex) in post.images" :key="imgIndex" class="post-image" :src="img" mode="aspectFill"></image>
								</view>
								<view class="post-tags" v-if="post.tags && post.tags.length">
									<text class="post-tag" v-for="(tag, tagIndex) in post.tags" :key="tagIndex">#{{tag}}</text>
								</view>
							</view>
							
							<view class="post-stats">
								<view class="stat-item">
									<text class="stat-icon">👍</text>
									<text class="stat-count">{{post.likes}}</text>
								</view>
								<view class="stat-item">
									<text class="stat-icon">💬</text>
									<text class="stat-count">{{post.comments}}</text>
								</view>
								<view class="stat-item">
									<text class="stat-icon">🔄</text>
									<text class="stat-count">{{post.shares}}</text>
								</view>
							</view>
						</view>

						<!-- 空状态提示 -->
						<view class="empty-state" v-if="posts.length === 0">
							<view class="empty-emoji">📝</view>
							<text class="empty-text">还没有帖子内容</text>
							<text class="empty-subtext">点击右下角"+"按钮发布你的第一条内容吧!</text>
						</view>
					</view>
				</scroll-view>
				
				<!-- 发布按钮 -->
				<view class="floating-button" @click="navigateToCreatePost">
					<text class="plus-icon">+</text>
				</view>
				
				<!-- 底部导航栏 -->
				<view class="tab-bar-wrapper">
					<tab-bar :current="1" @tabChange="handleTabChange"></tab-bar>
				</view>
			</view>
		</view>
	</swipe-detector>
</template>

<script>
import TabBar from '@/components/TabBar.vue';
import SwipeDetector from '@/components/SwipeDetector.vue';
import { Navigation } from '@/utils/navigation';
import { communityService } from '@/modules/community/services/community.service';

export default {
	components: {
		TabBar,
		SwipeDetector
	},
	data() {
		return {
			activeTab: 'recommend',
			tabSliderStyle: {
				left: '0%',
				width: '33.33%'
			},
			topicList: [
				{ name: '备考心得' },
				{ name: '考研交流' },
				{ name: '高效学习' },
				{ name: '读书分享' },
				{ name: '科目互助' },
				{ name: '自习心得' }
			],
			posts: [],
			isLoading: false
		}
	},
	onLoad() {
		// 页面加载时检查登录状态
		this.checkUserLogin();
		// 加载帖子数据
		this.loadPosts();
	},
	onShow() {
		// 确保正确设置TabBar选中状态
		this.$nextTick(() => {
			const currentRoute = this.$route ? this.$route.path : '/pages/community/community';
			// 触发一个全局事件，确保TabBar状态同步
			uni.$emit('tabIndexUpdate', {
				index: 1,
				path: currentRoute
			});
		});
		
		// 每次页面显示时重新加载帖子数据
		this.loadPosts();
	},
	methods: {
		checkUserLogin() {
			Navigation.checkLoginStatus();
		},
		
		// 加载帖子数据
		async loadPosts() {
			if (this.isLoading) return;
			
			try {
				this.isLoading = true;
				
				uni.showLoading({
					title: '加载中...'
				});
				
				console.log(`开始加载${this.activeTab}标签的帖子数据`);
				
				// 根据当前选项卡获取相应的帖子
				const posts = await communityService.getPosts(this.activeTab);
				
				console.log(`成功获取${posts.length}条帖子数据`);
				
				// 更新帖子列表
				this.posts = posts;
				
				uni.hideLoading();
				this.isLoading = false;
			} catch (error) {
				uni.hideLoading();
				this.isLoading = false;
				
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'none'
				});
				console.error('加载帖子失败:', error);
			}
		},
		
		// 切换标签页
		async switchTab(tab) {
			if (this.activeTab === tab || this.isLoading) {
				return;
			}
			
			this.activeTab = tab;
			
			// 更新标签滑块位置
			switch(tab) {
				case 'recommend':
					this.tabSliderStyle.left = '0%';
					break;
				case 'latest':
					this.tabSliderStyle.left = '33.33%';
					break;
				case 'following':
					this.tabSliderStyle.left = '66.66%';
					break;
			}
			
			// 重新加载对应标签的帖子
			await this.loadPosts();
		},
		
		// 导航到发布帖子页面
		navigateToCreatePost() {
			uni.navigateTo({
				url: '/pages/community/create-post'
			});
		},
		
		// 处理底部Tab切换
		handleTabChange(data) {
			console.log('Tab changed:', data);
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

.community-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	position: relative;
	/* 移除固定的padding-bottom，让内容区域填充到TabBar */
	box-sizing: border-box;
	background-color: #f8f3ff;
	/* 确保没有多余的内边距 */
	padding: 0;
	margin: 0;
	overflow: hidden; /* 防止容器本身滚动 */
	/* 添加微小的顶部内边距，防止内容顶部被裁剪 */
	padding-top: 1px;
}

/* 顶部背景延伸，防止上拉露白 */
.header-extension {
	height: 200px; /* 增加高度确保足够覆盖 */
	background-color: #fff;
	position: absolute;
	top: -200px;
	left: 0;
	right: 0;
	z-index: 1;
}

/* 顶部圆角遮蔽阴影 */
.header-shadow {
	position: absolute;
	top: -2px;
	left: 0;
	right: 0;
	height: 30px;
	background-color: #fff;
	z-index: 2;
}

/* 顶部搜索栏 */
.search-header {
	padding: 15px;
	display: flex;
	background-color: #fff;
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 20px;
	box-shadow: 0 4px 12px rgba(166, 192, 254, 0.1);
	position: relative;
	z-index: 3; /* 提高z-index确保在shadow之上 */
	margin-top: -2px; /* 微调负边距 */
	padding-top: 17px; /* 相应调整内边距 */
	/* 增加内部阴影效果强化圆角 */
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
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

.filter-button {
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	display: flex;
	align-items: center;
	justify-content: center;
}

.filter-icon {
	font-size: 16px;
	color: #fff;
}

/* 内容区域 */
.content-scroll {	flex: 1;	height: 100%;	box-sizing: border-box;	padding: 0 15px;	-webkit-overflow-scrolling: touch; /* 增强iOS滑动流畅度 */	padding-bottom: 0; /* 移除底部内边距 */	background-color: #f8f3ff;	position: relative;	z-index: 1; /* 确保内容区在正确的层级 */}

.post-list {	margin-bottom: 0; /* 移除底部空间 */}

/* 热门话题 */
.topics-scroll {
	white-space: nowrap;
	margin: 10px 0 20px;
	padding-bottom: 10px;
}

.topic-item {
	display: inline-block;
	padding: 6px 12px;
	background: linear-gradient(to right, rgba(166, 192, 254, 0.2), rgba(194, 168, 253, 0.2));
	border-radius: 15px;
	margin-right: 10px;
}

.topic-tag {
	font-size: 14px;
	color: #8a9eef;
	font-weight: 500;
}

/* 标签页头部 */
.section-header {
	margin-bottom: 15px;
}

.section-title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 12px;
	background-image: linear-gradient(90deg, #a6c0fe, #c2a8fd);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.tab-header {
	display: flex;
	background-color: #f5f7fa;
	border-radius: 10px;
	height: 40px;
	position: relative;
	margin-bottom: 15px;
}

.tab {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	color: #666;
	z-index: 2;
}

.tab.active {
	color: #fff;
	font-weight: 500;
}

.tab-slider {
	position: absolute;
	top: 4px;
	bottom: 4px;
	width: 33.33%;
	border-radius: 8px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	z-index: 1;
}

/* 帖子卡片 */
.post-card {
	background-color: #fff;
	border-radius: 12px;
	padding: 15px;
	margin-bottom: 15px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

/* 所有帖子卡片都保持圆角 */.post-card:last-child {	margin-bottom: 0; /* 移除底部空间 */}

.post-header {
	display: flex;
	align-items: center;
	margin-bottom: 12px;
}

.user-avatar {
	width: 40px;
	height: 40px;
	border-radius: 20px;
	margin-right: 10px;
}

.post-user-info {
	flex: 1;
}

.user-name {
	font-size: 15px;
	font-weight: 500;
	color: #333;
	margin-bottom: 2px;
	display: block;
}

.post-time {
	font-size: 12px;
	color: #999;
	display: block;
}

.follow-btn, .following-btn {
	padding: 5px 10px;
	border-radius: 15px;
	font-size: 12px;
}

.follow-btn {
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	color: #fff;
}

.following-btn {
	background-color: #f0f0f0;
	color: #666;
}

.post-content {
	margin-bottom: 15px;
}

.post-text {
	font-size: 14px;
	color: #333;
	line-height: 1.5;
	margin-bottom: 10px;
	display: block;
}

.post-images {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 10px;
}

.post-image {
	width: 32%;
	height: 100px;
	border-radius: 8px;
	margin-right: 2%;
	margin-bottom: 2%;
}

.post-image:nth-child(3n) {
	margin-right: 0;
}

.post-tags {
	display: flex;
	flex-wrap: wrap;
	margin-top: 10px;
}

.post-tag {
	font-size: 12px;
	color: #8a9eef;
	margin-right: 10px;
}

.post-stats {
	display: flex;
	border-top: 1px solid #f0f0f0;
	padding-top: 12px;
}

.stat-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.stat-icon {
	font-size: 16px;
	margin-right: 5px;
}

.stat-count {
	font-size: 14px;
	color: #666;
}

/* 悬浮发布按钮 */
.floating-button {
	position: fixed;
	right: 20px;
	bottom: 80px; /* 确保按钮位于TabBar上方 */
	width: 50px;
	height: 50px;
	border-radius: 25px;
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 15px rgba(166, 192, 254, 0.4);
	z-index: 10;
}

.plus-icon {
	font-size: 30px;
	color: #fff;
	font-weight: bold;
}

.full-container {
	width: 100%;
	height: 100%;
	position: relative;
}

/* 安全区域容器，防止滚动时图形变形 */
.community-safe-area {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
}

/* 底部导航栏包装器 */
.tab-bar-wrapper {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
	background-color: #fff;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
	overflow: hidden;
}

/* 空状态样式 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
	background-color: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
	margin-bottom: 20px;
}

.empty-emoji {
	font-size: 48px;
	margin-bottom: 20px;
}

.empty-text {
	font-size: 18px;
	font-weight: 500;
	color: #333;
	margin-bottom: 10px;
}

.empty-subtext {
	font-size: 14px;
	color: #999;
	text-align: center;
}
</style> 