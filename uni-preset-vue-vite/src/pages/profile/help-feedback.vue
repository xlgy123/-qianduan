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
							<text class="settings-title">帮助与反馈</text>
						</view>
					</view>
				</view>
				
				<!-- 常见问题 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">常见问题</text>
					</view>
					
					<view class="faq-item" @click="toggleFAQ(0)">
						<view class="faq-question">
							<view class="settings-item-left">
								<view class="settings-icon question-icon">❓</view>
								<text class="faq-question-text">如何使用在线自习功能？</text>
							</view>
							<text class="faq-arrow" :class="{ 'fa-rotate-180': faqOpen[0] }">↓</text>
						</view>
						<view class="faq-answer" v-if="faqOpen[0]">
							<view class="answer-content">
								打开应用后点击底部导航栏的"自习室"图标，进入自习室界面。在这里您可以创建新的自习任务或加入已有的自习房间，设置定时提醒，开始您的高效学习时间。
							</view>
						</view>
					</view>
					
					<view class="faq-item" @click="toggleFAQ(1)">
						<view class="faq-question">
							<view class="settings-item-left">
								<view class="settings-icon question-icon">❓</view>
								<text class="faq-question-text">如何找回忘记的密码？</text>
							</view>
							<text class="faq-arrow" :class="{ 'fa-rotate-180': faqOpen[1] }">↓</text>
						</view>
						<view class="faq-answer" v-if="faqOpen[1]">
							<view class="answer-content">
								在登录页面点击"忘记密码"链接，输入您注册时使用的手机号码，系统会发送一个验证码到您的手机。验证通过后，您可设置新的密码。
							</view>
						</view>
					</view>
					
					<view class="faq-item" @click="toggleFAQ(2)">
						<view class="faq-question">
							<view class="settings-item-left">
								<view class="settings-icon question-icon">❓</view>
								<text class="faq-question-text">如何联系客服？</text>
							</view>
							<text class="faq-arrow" :class="{ 'fa-rotate-180': faqOpen[2] }">↓</text>
						</view>
						<view class="faq-answer" v-if="faqOpen[2]">
							<view class="answer-content">
								您可以通过以下方式联系我们的客服团队：
								<view class="contact-method">
									- 邮箱：support@onlinestudy.com
								</view>
								<view class="contact-method">
									- 服务电话：400-123-4567（9:00-21:00）
								</view>
								<view class="contact-method">
									- 在线客服：工作日 9:00-18:00（此页面底部"反馈问题"按钮可提交问题）
								</view>
							</view>
                       </view>
					</view>
				</view>
				
				<!-- 反馈问题 -->
				<view class="settings-section">
					<view class="settings-group-header">
						<text class="settings-group-title">反馈问题</text>
					</view>
					
					<view class="feedback-form">
						<view class="feedback-type">
							<text>反馈类型：</text>
							<picker mode="selector" :range="feedbackTypes" @change="feedbackTypeChange">
								<view class="feedback-type-value">选择反馈类型</view>
							</picker>
						</view>
						
						<view class="feedback-content">
							<text>反馈内容：</text>
							<textarea 
								class="feedback-textarea"
								placeholder="请详细描述您遇到的问题或建议..."
								v-model="feedbackContent"
								:auto-height="true"
								maxlength="500"
							/>
						</view>
						
						<view class="feedback-submit">
							<button class="feedback-button" @click="submitFeedback">提交反馈</button>
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
			faqOpen: [false, false, false], // 是否展开每个FAQ
			feedbackTypes: ['功能问题', '内容建议', '性能问题', '其他问题'],
			selectedFeedbackType: '',
			feedbackContent: ''
		};
	},
	methods: {
		// 切换FAQ展开状态
		toggleFAQ(index) {
			this.faqOpen[index] = !this.faqOpen[index];
		},
		
		// 反馈类型选择
		feedbackTypeChange(e) {
			this.selectedFeedbackType = this.feedbackTypes[e.detail.value];
		},
		
		// 提交反馈
		submitFeedback() {
			if (!this.selectedFeedbackType) {
				uni.showToast({
					title: '请选择反馈类型',
					icon: 'none'
				});
				return;
			}
			
			if (!this.feedbackContent.trim()) {
				uni.showToast({
					title: '请填写反馈内容',
					icon: 'none'
				});
				return;
			}
			
			uni.showLoading({
				title: '提交中...'
			});
			
			// 模拟提交反馈
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '反馈提交成功',
					icon: 'success'
				});
				this.feedbackContent = '';
				this.selectedFeedbackType = '';
			}, 1500);
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

/* FAQ样式 */
.faq-item {
	background-color: #fff;
	border-radius: 15px;
	margin-bottom: 10px;
	overflow: hidden;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.faq-question {
	padding: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.faq-arrow {
	color: #999;
	transition: transform 0.3s;
}

.fa-rotate-180 {
	transform: rotate(180deg);
}

.faq-answer {
	background-color: #f9f9f9;
	padding: 15px;
}

.answer-content {
	font-size: 14px;
	color: #666;
	line-height: 1.6;
}

.contact-method {
	margin-top: 8px;
	padding-left: 15px;
	border-left: 3px solid #a6c0fe;
}

/* 反馈表单样式 */
.feedback-form {
	background-color: #fff;
	border-radius: 15px;
	padding: 15px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.feedback-type, .feedback-content {
	margin-bottom: 15px;
}

.feedback-type-value {
	color: #999;
	padding: 8px 10px;
	background-color: #f5f5f5;
	border-radius: 8px;
	font-size: 14px;
}

.feedback-textarea {
	width: 100%;
	height: 120px;
	padding: 10px;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	margin-top: 8px;
}

.feedback-button {
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	color: white;
	border: none;
	border-radius: 25px;
	padding: 10px 20px;
	width: 100%;
	font-size: 15px;
	margin-top: 10px;
	box-shadow: 0 4px 8px rgba(166, 192, 254, 0.3);
}
</style>