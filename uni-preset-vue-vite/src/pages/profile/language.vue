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
							<text class="settings-title">语言设置</text>
						</view>
					</view>
				</view>
				
				<!-- 语言选项 -->
				<view class="settings-section">
					<view class="language-item" @click="selectLanguage('zh-CN')">
						<view class="language-content">
							<view class="language-flag">
								<text class="flag-icon">🇨🇳</text>
							</view>
							<view class="language-info">
								<text class="language-name">简体中文</text>
								<text class="language-desc">简体中文（中国大陆）</text>
							</view>
						</view>
						<view class="language-check" v-if="currentLanguage === 'zh-CN'">
							<text class="check-icon">✓</text>
						</view>
					</view>
					
					<view class="language-item" @click="selectLanguage('zh-TW')">
						<view class="language-content">
							<view class="language-flag">
								<text class="flag-icon">🇹🇼</text>
							</view>
							<view class="language-info">
								<text class="language-name">繁体中文</text>
								<text class="language-desc">繁体中文（中国台湾）</text>
							</view>
						</view>
						<view class="language-check" v-if="currentLanguage === 'zh-TW'">
							<text class="check-icon">✓</text>
						</view>
					</view>
					
					<view class="language-item" @click="selectLanguage('en-US')">
						<view class="language-content">
							<view class="language-flag">
								<text class="flag-icon">🇺🇸</text>
							</view>
							<view class="language-info">
								<text class="language-name">English</text>
								<text class="language-desc">English (United States)</text>
							</view>
						</view>
						<view class="language-check" v-if="currentLanguage === 'en-US'">
							<text class="check-icon">✓</text>
						</view>
					</view>
				</view>
				
				<!-- 系统语言跟随 -->
				<view class="settings-section">
					<view class="settings-item" @click="toggleSystemLanguage">
						<view class="settings-item-left">
							<view class="settings-icon system-icon">🌐</view>
							<text class="settings-item-label">跟随系统语言</text>
						</view>
						<switch 
							color="#a6c0fe" 
							:checked="followSystemLanguage" 
							class="settings-switch"
							@change="toggleSystemLanguage"
						/>
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
			currentLanguage: 'zh-CN',
			followSystemLanguage: false
		};
	},
	onLoad() {
		this.loadLanguageSettings();
	},
	methods: {
		// 加载语言设置
		loadLanguageSettings() {
			try {
				const languageSetting = uni.getStorageSync('languageSetting');
				if (languageSetting) {
					const setting = JSON.parse(languageSetting);
					this.currentLanguage = setting.language || 'zh-CN';
					this.followSystemLanguage = setting.followSystem || false;
				}
			} catch (e) {
				console.error('加载语言设置失败:', e);
			}
		},
		
		// 选择语言
		selectLanguage(lang) {
			this.currentLanguage = lang;
			this.followSystemLanguage = false;
			this.saveLanguageSetting();
		},
		
		// 切换系统语言跟随
		toggleSystemLanguage(e) {
			this.followSystemLanguage = e.detail.value;
			this.saveLanguageSetting();
		},
		
		// 保存语言设置
		saveLanguageSetting() {
			try {
				if (this.followSystemLanguage) {
					uni.setStorageSync('languageSetting', JSON.stringify({
						language: this.currentLanguage,
						followSystem: this.followSystemLanguage
					}));
				} else {
					uni.setStorageSync('languageSetting', JSON.stringify({
						language: this.currentLanguage,
						followSystem: this.followSystemLanguage
					}));
				}
			} catch (e) {
				console.error('保存语言设置失败:', e);
			}
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


/* 语言选项样式 */
.language-item {
	padding: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #fff;
	border-radius: 15px;
	margin-bottom: 10px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.language-content {
	display: flex;
	align-items: center;
}

.language-flag {
	margin-right: 15px;
}

.flag-icon {
	font-size: 24px;
}

.language-info {
	flex: 1;
}

.language-name {
	font-weight: bold;
	margin-bottom: 5px;
}

.language-desc {
	font-size: 12px;
	color: #999;
}

.language-check {
	color: #a6c0fe;
	font-size: 20px;
}

.system-icon {
	background-color: #f0f0f0;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #333;
}
</style>