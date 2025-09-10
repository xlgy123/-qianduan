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
							<text class="settings-title">主题模式</text>
						</view>
					</view>
				</view>
				
				<!-- 主题选项 -->
				<view class="settings-section">
					<view class="theme-preview-container">
						<view class="theme-option" @click="selectTheme('light')" :class="{ 'selected-theme': currentTheme === 'light' }">
							<view class="theme-preview light-theme"></view>
							<view class="theme-option-name">明亮主题</view>
							<view class="theme-option-description">经典明亮的界面，适合白天使用</view>
						</view>
						
						<view class="theme-option" @click="selectTheme('dark')" :class="{ 'selected-theme': currentTheme === 'dark' }">
							<view class="theme-preview dark-theme"></view>
							<view class="theme-option-name">暗黑主题</view>
							<view class="theme-option-description">低亮度界面，减少眼睛疲劳</view>
						</view>
						
						<view class="theme-option" @click="selectTheme('system')" :class="{ 'selected-theme': currentTheme === 'system' }">
							<view class="theme-preview system-theme"></view>
							<view class="theme-option-name">跟随系统</view>
							<view class="theme-option-description">根据系统设置自动切换主题</view>
						</view>
					</view>
				</view>
				
				<!-- 主题强度设置 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">亮度调节</text>
					</view>
					
					<view class="settings-item">
						<view class="settings-item-left">
							<view class="settings-icon brightness-icon">☀️</view>
							<text class="settings-item-label">界面亮度</text>
						</view>
						<slider 
							value="50" 
							min="0" 
							max="100" 
							show-value 
							class="brightness-slider"
							@change="brightnessChanged"
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
			currentTheme: 'light',
			brightness: 50 // 亮度值 0-100
		};
	},
	onLoad() {
		this.loadThemeSettings();
	},
	methods: {
		// 加载主题设置
		loadThemeSettings() {
			try {
				const themeSetting = uni.getStorageSync('themeSetting');
				if (themeSetting) {
					const setting = JSON.parse(themeSetting);
					this.currentTheme = setting.theme || 'light';
					this.brightness = setting.brightness || 50;
				}
			} catch (e) {
				console.error('加载主题设置失败:', e);
			}
		},
		
		// 选择主题
		selectTheme(theme) {
			this.currentTheme = theme;
			this.saveThemeSetting();
			this.applyTheme();
		},
		
		// 亮度改变
		brightnessChanged(e) {
			this.brightness = e.detail.value;
			this.saveThemeSetting();
			this.applyBrightness();
		},
		
		// 保存主题设置
		saveThemeSetting() {
			try {
				uni.setStorageSync('themeSetting', JSON.stringify({
					theme: this.currentTheme,
					brightness: this.brightness
				}));
			} catch (e) {
				console.error('保存主题设置失败:', e);
			}
		},
		
		// 应用主题样式
		applyTheme() {
			// 这里可以根据选择的主体更换样式
			console.log('应用主题:', this.currentTheme);
		},
		
		// 应用亮度设置
		applyBrightness() {
			// 这里可以设置界面亮度
			console.log('设置亮度:', this.brightness);
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


/* 主题预览样式 */
.theme-preview-container {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.theme-option {
	background-color: #fff;
	border-radius: 15px;
	padding: 15px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
	position: relative;
}

.theme-option.selected-theme {
	border: 2px solid #a6c0fe;
}

.theme-preview {
	width: 100%;
	height: 120px;
	border-radius: 10px;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.light-theme {
	background-color: #f8f3ff;
	color: #333;
}

.dark-theme {
	background-color: #1a1a1a;
	color: #fff;
}

.system-theme {
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	color: #fff;
}

.theme-option-name {
	font-weight: bold;
	margin-bottom: 5px;
}

.theme-option-description {
	font-size: 12px;
	color: #999;
}

/* 亮度滑块样式 */
.brightness-slider {
	flex-grow: 1;
}
</style>