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
							<text class="settings-title">检查更新</text>
						</view>
					</view>
				</view>
				
				<!-- 当前版本 -->
				<view class="settings-section">
					<view class="current-version-card">
						<view class="version-number">
							<text class="version-label">当前版本</text>
							<text class="version-value">{{ currentVersion }}</text>
						</view>
						<view class="version-status" :class="{ 'status-updated': isLatest }">
							{text: isLatest ? '' : '当前版本：'}
							{{ isLatest ? '已经是最新版本' : '不是最新版本' }}
						</view>
					</view>
				</view>
				
				<!-- 更新详情 -->
				<view class="settings-section">
					<view class="update-details-card">
						<view class="update-header">
							<view class="update-version">
								<text class="version-tag">最新版本</text>
								<text class="new-version">{{ latestVersion }}</text>
							</view>
							<view class="update-time">
								<text class="time-text">更新于 {{ updateDate }}</text>
							</view>
						</view>
						
						<view class="update-content">
							<view class="update-item" v-for="(item, index) in updateFeatures" :key="index">
								<view class="feature-icon">✨</view>
								<text class="feature-text">{{ item }}</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 更新按钮 -->
				<view class="settings-section" style="margin-top: 30px; margin-bottom: 30px;">
					<view class="update-button" v-if="!isLatest" @click="updateApp">
						<text class="update-text">立即更新</text>
					</view>
				</view>
				
				<!-- 更新日志 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">更新日志</text>
					</view>
					
					<view class="settings-item">
						<view class="settings-item-left">
							<view class="settings-icon log-icon">📋</view>
							<text class="settings-item-label">完整更新日志</text>
						</view>
						<view class="settings-arrow">→</view>
					</view>
				</view>
				
				<!-- 底部填充，确保能滚动到底部 -->
				<view style="height: 60px;"></view>
			</scroll-view>
			
			<!-- 底部导航栏 -->
			<view class="tab-bar-wrapper">
				<tab-bar :current="3" @tabChange="handleTabChange"></tab-bar>
			</view>
			
			<!-- 更新进度弹窗 -->
			<view class="update-progress-modal" v-if="showUpdateProgress">
				<view class="progress-container">
					<view class="progress-title">正在更新</view>
					<progress :percent="updateProgress" stroke-width="5" activeColor="#a6c0fe" />
					<text class="progress-text">{{ updateProgress }}%</text>
				</view>
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
			currentVersion: '0.1.0',
			latestVersion: '0.1.1',
			updateDate: '2023-10-15',
			updateFeatures: [
				'新增自习计划提醒功能',
				'优化界面设计，提升用户体验',
				'修复已知问题，提高应用稳定性',
				'新增学习统计分析功能'
			],
			isLatest: false,
			showUpdateProgress: false,
			updateProgress: 0
		};
	},
	onLoad() {
		this.checkForUpdates();
	},
	methods: {
		// 检查更新
		checkForUpdates() {
			// 这里模拟检查更新逻辑
			setTimeout(() => {
				this.isLatest = false;
				this.updateProgress = 0;
			}, 500);
		},
		
		// 更新应用
		updateApp() {
			this.showUpdateProgress = true;
			this.startUpdateProcess();
		},
		
		// 开始更新过程
		startUpdateProcess() {
			const intervalId = setInterval(() => {
				this.updateProgress += 1;
				if (this.updateProgress >= 100) {
					clearInterval(intervalId);
					this.showUpdateProgress = false;
					this.completeUpdate();
				}
			}, 100);
		},
		
		// 完成更新
		completeUpdate() {
			uni.showModal({
				title: '更新完成',
				content: '应用已更新到最新版本，是否立即重启应用？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '应用将重启',
							icon: 'none',
							duration: 1500
						});
						// 模拟应用重启
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							});
						}, 1500);
					} else {
						this.isLatest = true;
					}
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

/* 当前版本卡片样式 */
.current-version-card {
	background-color: #fff;
	border-radius: 15px;
	padding: 20px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.version-number {
	display: flex;
	align-items: center;
}

.version-label {
	font-size: 16px;
	color: #666;
	margin-right: 5px;
}

.version-value {
	font-size: 18px;
	font-weight: bold;
	color: #333;
}

.version-status {
	margin-top: 10px;
	font-size: 14px;
	padding: 5px 10px;
	border-radius: 20px;
	background-color: #f0f7ff;
	color: #3a7bd5;
}

.status-updated {
	background-color: #e6ffe0;
	color: #2e8b57;
}

/* 更新详情卡片样式 */
.update-details-card {
	background-color: #fff;
	border-radius: 15px;
	padding: 15px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.update-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
}

.update-version {
	display: flex;
	flex-direction: column;
}

.version-tag {
	font-size: 12px;
	color: #999;
}

.new-version {
	font-size: 18px;
	font-weight: bold;
	color: #333;
}

.update-time {
	color: #999;
	font-size: 12px;
}

.update-content {
	font-size: 14px;
	color: #666;
	line-height: 1.6;
}

.update-item {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.feature-icon {
	margin-right: 8px;
	color: #a6c0fe;
}

/* 更新按钮样式 */
.update-button {
	background: linear-gradient(to right, #3a7bd5, #00d2ff);
	color: white;
	height: 50px;
	line-height: 50px;
	border-radius: 25px;
	text-align: center;
	margin: 0 15px;
	box-shadow: 0 4px 12px rgba(58, 123, 213, 0.3);
	position: relative;
	overflow: hidden;
	z-index: 10;
}

.update-button:active {
	transform: scale(0.98);
	box-shadow: 0 2px 8px rgba(58, 123, 213, 0.3);
}

.update-text {
	font-size: 16px;
	font-weight: bold;
	color: white;
}

/* 更新进度弹窗样式 */
.update-progress-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.progress-container {
	background-color: #fff;
	border-radius: 10px;
	padding: 20px;
	width: 80%;
	max-width: 300px;
	text-align: center;
}

.progress-title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 15px;
	color: #333;
}

.progress-text {
	margin-top: 10px;
	font-size: 14px;
	color: #666;
}
</style>