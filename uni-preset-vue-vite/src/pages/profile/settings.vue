<template>
	<swipe-detector class="full-container" :tab-index="3">
		<view class="settings-container">
			<!-- 顶部背景延伸，防止上拉露白 -->
			<view class="header-extension"></view>
			
			<!-- 可滚动内容区域 -->
			<scroll-view 
				scroll-y="true" 
				class="scrollable-content full-scroll" 
				:bounce="true"
				:show-scrollbar="false"
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
							<text class="settings-title">设置</text>
						</view>
					</view>
				</view>
				
				<!-- 通知设置 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">通知设置</text>
					</view>
					
					<view class="settings-item" @click="toggleNotification">
						<view class="settings-item-left">
							<view class="settings-icon bell-icon">🔔</view>
							<text class="settings-item-label">消息通知</text>
						</view>
						<switch color="#a6c0fe" :checked="notificationEnabled" class="settings-switch"></switch>
					</view>
					
					<view class="settings-item"@click="goToNotificationSound">
						<view class="settings-item-left">
							<view class="settings-icon sound-icon">🔊</view>
							<text class="settings-item-label">通知声音</text>
						</view>
						<view class="settings-arrow">→</view>
					</view>
					
					<view class="settings-item">
						<view class="settings-item-left">
							<view class="settings-icon vibration-icon">📳</view>
							<text class="settings-item-label">通知振动</text>
						</view>
						<view class="settings-arrow">→</view>
					</view>
				</view>
				
				<!-- 个人设置 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">个人设置</text>
					</view>
					
					<view class="settings-item"@click="goToLanguage">
						<view class="settings-item-left">
							<view class="settings-icon language-icon">🌐</view>
							<text class="settings-item-label">语言设置</text>
						</view>
						<view class="settings-arrow">→</view>
					</view>
					
					<view class="settings-item"@click="goToThemePattern">
						<view class="settings-item-left">
							<view class="settings-icon theme-icon">🎨</view>
							<text class="settings-item-label">主题模式</text>
						</view>
						<view class="settings-arrow">→</view>
					</view>
				</view>
				
				<!-- 关于应用 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">关于应用</text>
					</view>
					
					<view class="settings-item" @click="goToApplicationMessage">
						<view class="settings-item-left">
							<view class="settings-icon info-icon">ℹ️</view>
							<text class="settings-item-label">应用信息</text>
						</view>
						<view class="settings-arrow">→</view>
					</view>
					
					<view class="settings-item"@click="goToCheckUpdates">
						<view class="settings-item-left">
							<view class="settings-icon update-icon">🔄</view>
							<text class="settings-item-label">检查更新</text>
						</view>
						<view class="settings-arrow">→</view>
					</view>
					
					<view class="settings-item"@click="goToHelpFeedback">
						<view class="settings-item-left">
							<view class="settings-icon help-icon">❓</view>
							<text class="settings-item-label">帮助与反馈</text>
						</view>
						<view class="settings-arrow">→</view>
					</view>
				</view>
				
				<!-- 退出登录 -->
				<view class="settings-section" style="margin-top: 30px; margin-bottom: 30px;">
					<view class="big-logout-button" @click="handleLogout">
						<text class="logout-text">退出登录</text>
					</view>
				</view>
				
				<!-- 版本信息 -->
				<view class="app-version">
					<text class="version-text">线上自习室 v0.1.0</text>
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
import { userStore } from '@/store/userStore';

export default {
	components: {
		TabBar,
		SwipeDetector
	},
	data() {
		return {
			notificationEnabled: true,
			notificationSwitchDisabled: false
		};
	},
	onLoad() {
		// 加载通知设置
		this.loadNotificationSettings();
	},
	methods: {
		// 加载通知设置
		loadNotificationSettings() {
			try {
				const notificationSetting = uni.getStorageSync('notificationSetting');
				if (notificationSetting) {
					const setting = JSON.parse(notificationSetting);
					this.notificationEnabled = setting.enabled || true;
				}
			} catch (e) {
				console.error('加载通知设置失败:', e);
			}
		},
		
		// 切换通知开关
		toggleNotification(e) {
			this.notificationEnabled = e.detail.value;
			this.saveNotificationSetting();
		},
		goToNotificationSound() {
		       
		        uni.navigateTo({
		            url: '/pages/profile/notification-sound' 
		        });
		    },
			goToLanguage() {
			   uni.navigateTo({
				   url: '/pages/profile/language'
			   });
		   },
		   goToThemePattern() {
			   uni.navigateTo({
				   url: '/pages/profile/theme-pattern'
			   });
		   },
		   goToApplicationMessage() {
			   uni.navigateTo({
				   url: '/pages/profile/application-message'
			   });
		   },
		   goToCheckUpdates() {
			   uni.navigateTo({
				   url: '/pages/profile/check-updates'
			   });
		   },
		   goToHelpFeedback() {
			   uni.navigateTo({
				   url: '/pages/profile/help-feedback'
			   });
		   },
		// 保存通知设置
		saveNotificationSetting() {
			try {
				uni.setStorageSync('notificationSetting', JSON.stringify({
					enabled: this.notificationEnabled
				}));
			} catch (e) {
				console.error('保存通知设置失败:', e);
			}
		},
		// 返回上一页
		goBack() {
			uni.navigateBack({
				success: () => {
					// 在返回成功后，可以在这里添加额外的逻辑，比如重置页面状态
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
		},
		
		// 退出登录
		handleLogout() {
			uni.showModal({
				title: '退出登录',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 执行退出登录操作
						try {
							// 使用userStore的logout方法
							userStore.logout();
							
							// 显示提示
							uni.showToast({
								title: '已退出登录',
								icon: 'success',
								duration: 1000
							});
							
							// 延迟跳转到登录页
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/login/login',
									success: () => {
										console.log('成功跳转到登录页');
									},
									fail: (err) => {
										console.error('跳转到登录页失败:', err);
										// 如果reLaunch失败，尝试redirectTo
										uni.redirectTo({
											url: '/pages/login/login'
										});
									}
								});
							}, 1000);
						} catch (e) {
							console.error('退出登录失败:', e);
							uni.showToast({
								title: '操作失败，请重试',
								icon: 'none'
							});
						}
					}
				}
			});
		}
	}
};
</script>

<style>
.full-container {
	width: 100%;
	height: 100%;
	position: relative;
}

.settings-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	position: relative;
	background-color: #f8f3ff;
	padding: 0;
	margin: 0;
	overflow: hidden;
	padding-bottom: 50px;
}

/* 顶部背景延伸，防止上拉露白 */
.header-extension {
	height: 100px;
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	position: absolute;
	top: -100px;
	left: 0;
	right: 0;
	z-index: 1;
}

/* 设置页面标题 */
.settings-header {
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	border-bottom-left-radius: 30px;
	border-bottom-right-radius: 30px;
	padding: 30px 20px 20px;
	position: relative;
	margin-bottom: 20px;
	margin-top: -1px;
	padding-top: 31px;
	z-index: 2;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.settings-title-wrapper {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.back-button {
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-arrow {
	font-size: 18px;
	color: #fff;
	margin-right: 2px;
}

.back-text {
	font-size: 14px;
	color: #fff;
	position: absolute;
	left: 45px;
	top: 50%;
	transform: translateY(-50%);
}

.title-container {
	flex-grow: 1;
	text-align: center;
}

.settings-title {
	font-size: 22px;
	font-weight: bold;
	color: #fff;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 设置区块 */
.settings-section {
	padding: 0 15px 0 15px;
	margin-bottom: 20px;
}

.settings-group-header {
	margin-bottom: 10px;
	padding: 0 5px;
}

.settings-group-title {
	font-size: 16px;
	color: #666;
	font-weight: 500;
}

/* 设置项 */
.settings-item {
	padding: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #fff;
	border-radius: 15px;
	margin-bottom: 10px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.settings-item-left {
	display: flex;
	align-items: center;
}

.settings-icon {
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	margin-right: 15px;
}

.settings-item-label {
	flex: 1;
	font-size: 15px;
	color: #333;
}

.settings-arrow {
	color: #999;
	font-size: 16px;
}

.settings-switch {
	transform: scale(0.8);
}

/* 版本信息 */
.app-version {
	text-align: center;
	padding: 20px 0 10px;
	margin-top: auto;
}

.version-text {
	font-size: 12px;
	color: #999;
}

/* 独立的退出登录区域样式 */
.big-logout-button {
	background: linear-gradient(to right, #ff4d4d, #ff7070);
	color: white;
	height: 50px;
	line-height: 50px;
	border-radius: 25px;
	text-align: center;
	margin: 0 15px;
	box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
	position: relative;
	overflow: hidden;
	z-index: 10;
}

.big-logout-button:active {
	transform: scale(0.98);
	box-shadow: 0 2px 8px rgba(255, 77, 77, 0.3);
}

.logout-text {
	font-size: 16px;
	font-weight: bold;
	color: white;
}

/* 底部导航栏容器样式 */
.tab-bar-wrapper {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	background-color: #fff;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
	overflow: hidden;
}

/* 可滚动内容区域 */
.scrollable-content {
	flex: 1;
	padding-bottom: 5px;
	-webkit-overflow-scrolling: touch;
}

/* 全屏滚动区域 */
.full-scroll {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 50px;
	z-index: 5;
}
</style>