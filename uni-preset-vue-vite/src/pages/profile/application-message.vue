<template>
	<swipe-detector class="full-container" :tab-index="3">
		<view class="settings-container">
			<!-- 顶部背景延伸，防止上拉露白 -->
			<view class="header-extension"></view>
			
			<!-- 可滚动内容区域 -->
			<scroll-view 
				scroll-y="true" 
				class="scrollable-content" 
				:refresher-enabled="false"
			>
				<!-- 页面标题和返回按钮 -->
				<view class="settings-header">
					<view class="settings-title-wrapper">
						<view class="back-button" @click="goBack">
							<text class="back-arrow">←</text>
							<text class="back-text">返回</text>
						</view>
						<view class="title-container">
							<text class="settings-title">应用信息</text>
						</view>
					</view>
				</view>
				
				<!-- 应用基本信息 -->
				<view class="settings-section">
					<view class="app-info-card">
						<view class="app-logo">
							<view class="logo-icon">📚</view>
						</view>
						<view class="app-info">
							<view class="app-name">线上自习室</view>
							<view class="app-version">版本 {{ appVersion }}</view>
							<view class="app-description">专注学习，提升效率的在线自习平台</view>
						</view>
					</view>
				</view>
				
				<!-- 开发团队 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">开发团队</text>
					</view>
					
					<view class="settings-item">
						<view class="settings-item-left">
							<view class="settings-icon team-icon">👥</view>
							<text class="settings-item-label">开发团队</text>
						</view>
						<text class="team-name">闲了个鱼</text>
					</view>
					
					<view class="settings-item">
						<view class="settings-item-left">
							<view class="settings-icon contact-icon">✉️</view>
							<text class="settings-item-label">联系我们</text>
						</view>
						<text class="contact-email">206865480@qq.com</text>
					</view>
				</view>
				
				<!-- 隐私政策 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">法律条款</text>
					</view>
					
					<view class="settings-item" @click="showPrivacyPolicy">
						<view class="settings-item-left">
							<view class="settings-icon privacy-icon">🔒</view>
							<text class="settings-item-label">隐私政策</text>
						</view>
						<view class="settings-arrow">→</view>
					</view>
					
					<view class="settings-item" @click="showTermsOfService">
						<view class="settings-item-left">
							<view class="settings-icon terms-icon">📄</view>
							<text class="settings-item-label">服务条款</text>
						</view>
						<view class="settings-arrow">→</view>
					</view>
				</view>
				
				<!-- 分享应用 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">分享应用</text>
					</view>
					
					<view class="share-buttons">
						<view class="share-button" @click="shareToFriend">
							<view class="share-icon">📱</view>
							<text class="share-text">分享给好友</text>
						</view>
						
						<view class="share-button" @click="shareToSocial">
							<view class="share-icon">🌐</view>
							<text class="share-text">分享到社交平台</text>
						</view>
					</view>
				</view>
				
				<!-- 底部填充，确保能滚动到底部 -->
				<view style="height: 60px;"></view>
			</scroll-view>
			
			<!-- 底部导航栏 -->
			<view class="tab-bar-wrapper">
				<tab-bar :current="3" @tabChange="handleTabChange"></tab-bar>
			</view>
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
			appVersion: '0.1.0', // 应用版本号
			appName: '线上自习室'
		};
	},
	methods: {
		// 显示隐私政策
		showPrivacyPolicy() {
			uni.navigateTo({
				url: '/pages/privacy/privacy'
			});
		},
		
		// 显示服务条款
		showTermsOfService() {
			uni.navigateTo({
				url: '/pages/terms/terms'
			});
		},
		
		// 分享给好友
		shareToFriend() {
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				href: 'https://example.com/app',
				title: `我正在使用${this.appName}，一款专注学习的在线自习应用`,
				summary: '一起加入线上自习室，提升学习效率！',
				imageUrl: 'https://example.com/app-icon.png',
				success: (res) => {
					console.log('分享成功:', res);
					uni.showToast({
						title: '分享成功',
						icon: 'success'
					});
				},
				fail: (err) => {
					console.error('分享失败:', err);
					uni.showToast({
						title: '分享失败',
						icon: 'none'
					});
				}
			});
		},
		
		// 分享到社交平台
		shareToSocial() {
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneTimeline',
				type: 0,
				href: 'https://example.com/app',
				title: `我正在使用${this.appName}，一款专注学习的在线自习应用`,
				summary: '一起加入线上自习室，提升学习效率！',
				imageUrl: 'https://example.com/app-icon.png',
				success: (res) => {
					console.log('分享成功:', res);
					uni.showToast({
						title: '分享成功',
						icon: 'success'
					});
				},
				fail: (err) => {
					console.error('分享失败:', err);
					uni.showToast({
						title: '分享失败',
						icon: 'none'
					});
				}
			});
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack({
				success: () => {
					console.log('返回上一页成功');
				},
				fail: (err) => {
					console.error('返回上一页失败:', err);
				}
			});
		},
		
		// 处理标签切换
		handleTabChange(data) {
			if (data && data.route) {
				Navigation.switchTab(data.route);
			}
		}
	}
};
</script>

<style>
/* 基础样式 */
.full-container {
  height: 100vh;
  background-color: #f8f3ff;
}

.settings-container {
  width: 100%;
  height: 100%;
  background-color: #f8f3ff;
}

.scrollable-content {
  height: calc(100% - 60px);
  background-color: #f8f3ff;
}

/* 页面标题和返回按钮 */
.settings-header {
  padding: 16px;
  background-color: #f8f3ff;
}

.settings-title-wrapper {
  display: flex;
  align-items: center;
}

.back-button {
  display: flex;
  align-items: center;
}

.back-arrow {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.back-text {
  font-size: 16px;
  color: #333;
  margin-left: 5px;
}

.settings-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-left: 15px;
}

/* 应用信息样式 */
.settings-section {
  margin: 16px;
  border-radius: 12px;
  background-color: white;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.app-info-card {
  padding: 20px;
  display: flex;
  align-items: center;
}

.app-logo {
  margin-right: 20px;
}

.logo-icon {
  font-size: 40px;
  color: #a6c0fe;
}

.app-info {
  flex: 1;
}

.app-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.app-version {
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
}

.app-description {
  font-size: 14px;
  color: #666;
}

/* 开发团队样式 */
.settings-group-header {
  padding: 12px 16px;
  background-color: #f8f3ff;
}

.settings-group-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.settings-item {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item-left {
  display: flex;
  align-items: center;
}

.settings-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.team-icon {
  color: #ff7675;
}

.contact-icon {
  color: #fdcb6e;
}

.privacy-icon {
  color: #55efc4;
}

.terms-icon {
  color: #74b9ff;
}

.settings-item-label {
  font-size: 16px;
  color: #333;
}

.team-name, .contact-email {
  color: #666;
  font-size: 14px;
}

.settings-arrow {
  color: #aaa;
  font-size: 18px;
}

/* 分享按钮样式 */
.share-buttons {
  display: flex;
  padding: 16px;
}

.share-button {
  background-color: #ffffff;
  padding: 12px 0;
  border-radius: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 6px;
}

.share-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.share-text {
  font-size: 14px;
  color: #333;
}

/* 底部导航栏 */
.tab-bar-wrapper {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #f8f3ff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}
</style>