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
							<text class="settings-title">通知声音</text>
						</view>
					</view>
				</view>
				
				<!-- 声音选项 -->
				<view class="settings-section">
					<view class="settings-item" @click="selectSound('default')">
						<view class="settings-item-left">
							<view class="settings-icon sound-icon">🔊</view>
							<text class="settings-item-label">默认声音</text>
						</view>
						<view class="settings-radio">
							<radio :checked="selectedSound === 'default'" color="#a6c0fe" class="settings-radio-button"></radio>
						</view>
					</view>
					
					<view class="settings-item" @click="selectSound('gentle')">
						<view class="settings-item-left">
							<view class="settings-icon sound-icon">🔊</view>
							<text class="settings-item-label">轻柔提示</text>
						</view>
						<view class="settings-radio">
							<radio :checked="selectedSound === 'gentle'" color="#a6c0fe" class="settings-radio-button"></radio>
						</view>
					</view>
					
					<view class="settings-item" @click="selectSound('alert')">
						<view class="settings-item-left">
							<view class="settings-icon sound-icon">🔊</view>
							<text class="settings-item-label">提醒铃声</text>
						</view>
						<view class="settings-radio">
							<radio :checked="selectedSound === 'alert'" color="#a6c0fe" class="settings-radio-button"></radio>
						</view>
					</view>
					
					<view class="settings-item" @click="selectSound('none')">
						<view class="settings-item-left">
							<view class="settings-icon sound-icon">🔇</view>
							<text class="settings-item-label">无声音</text>
						</view>
						<view class="settings-radio">
							<radio :checked="selectedSound === 'none'" color="#a6c0fe" class="settings-radio-button"></radio>
						</view>
					</view>
				</view>
				
				<!-- 声音预览 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">预览所选声音</text>
					</view>
					
					<view class="settings-item" @click="playSound">
						<view class="settings-item-left">
							<view class="settings-icon play-icon">▶️</view>
							<text class="settings-item-label">播放声音</text>
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
			selectedSound: 'default' // 默认选中"默认声音"
		};
	},
	onLoad() {
		this.loadSoundSettings();
	},
	methods: {
		// 加载声音设置
		loadSoundSettings() {
			try {
				const soundSetting = uni.getStorageSync('soundSetting');
				if (soundSetting) {
					const setting = JSON.parse(soundSetting);
					this.selectedSound = setting.selected || 'default';
				}
			} catch (e) {
				console.error('加载声音设置失败:', e);
			}
		},
		
		// 选择声音
		selectSound(sound) {
			this.selectedSound = sound;
			this.saveSoundSetting();
		},
		
		// 保存声音设置
		saveSoundSetting() {
			try {
				uni.setStorageSync('soundSetting', JSON.stringify({
					selected: this.selectedSound
				}));
			} catch (e) {
				console.error('保存声音设置失败:', e);
			}
		},
		
		// 播放声音
		playSound() {
			// 这里可以添加实际播放声音的逻辑
			uni.showToast({
				title: '播放声音：' + this.selectedSound,
				icon: 'none'
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


/* 声音设置页额外样式 */
.settings-radio-button {
	transform: scale(0.8);
}

.play-icon {
	background-color: #a6c0fe;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
}
</style>