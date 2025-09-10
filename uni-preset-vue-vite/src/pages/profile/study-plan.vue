<template>
	<swipe-detector class="full-container" :tab-index="3">
		<view class="plan-container">
			<!-- 顶部背景延伸，防止上拉露白 -->
			<view class="header-extension"></view>
			
			<!-- 可滚动内容区域，包含所有内容 -->
			<scroll-view 
				scroll-y="true" 
				class="scrollable-content full-scroll" 
				:bounce="true"
				:show-scrollbar="false"
				:refresher-enabled="false"
			>
				<!-- 顶部用户信息卡片 -->
				<view class="user-header">
					<view class="blur-bg"></view>
					<view class="plan-header">
						<view class="plan-title">
							<text class="plan-title-text">我的学习计划</text>
						</view>
						<view class="stats-summary">
							<view class="plan-stats-item">
								<text class="stat-value">{{completedPlansCount}}</text>
								<text class="stat-label">已完成</text>
							</view>
							<view class="plan-stats-item">
								<text class="stat-value">{{pendingPlansCount}}</text>
								<text class="stat-label">待完成</text>
							</view>
							<view class="plan-stats-item">
								<text class="stat-value">{{totalPlansCount}}</text>
								<text class="stat-label">总计划</text>
							</view>
							<view class="plan-stats-item">
								<text class="stat-value">{{completionRate}}%</text>
								<text class="stat-label">完成率</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 计划选择器 -->
				<view class="plan-selector">
					<view class="plan-tabs">
						<view 
							:class="['plan-tab', { 'active': currentTab === tab.value }]"
							v-for="tab in planTabs"
							:key="tab.value"
							@click="changeTab(tab.value)"
						>
							<text class="plan-tab-text">{{tab.label}}</text>
						</view>
					</view>
				</view>
				
				<!-- 计划列表 -->
				<view class="plan-list-container">
					<view class="plan-empty-state" v-if="filteredPlans.length === 0">
						<view class="empty-icon">📝</view>
						<text class="empty-text">暂无学习计划</text>
						<button class="create-plan-btn" @click="showCreatePlanModal">创建第一个计划</button>
					</view>
					
					<view class="plan-card" v-for="(plan, index) in filteredPlans" :key="index">
						<view class="plan-header">
							<view class="plan-icon">
								<text v-if="plan.priority === 'high'" class="priority-icon-high">🔥</text>
								<text v-else-if="plan.priority === 'medium'" class="priority-icon-medium">🔔</text>
								<text v-else class="priority-icon-low">⏱️</text>
							</view>
							<view class="plan-title-container">
								<text class="plan-title-text">{{plan.title}}</text>
								<text class="plan-date">{{formatDate(plan.date)}}</text>
							</view>
							<view class="plan-status" :class="plan.status">
								{{plan.status === 'completed' ? '已完成' : '进行中'}}
							</view>
						</view>
						<view class="plan-details">
							<text class="plan-description">{{plan.description}}</text>
							<view class="plan-progress">
								<text class="progress-label">进度: </text>
								<view class="progress-bar">
									<view 
										class="progress-fill" 
										:style="{ width: `${plan.progress}%` }"
										:class="plan.status === 'completed' ? 'completed' : ''"
									></view>
								</view>
								<text class="progress-value">{{plan.progress}}%</text>
							</view>
							<view class="plan-actions">
								<view class="plan-action" @click="editPlan(plan)">
									<text class="action-icon">✏️</text>
								</view>
								<view class="plan-action" @click="togglePlanStatus(plan)">
									<text class="action-icon" :class="plan.status === 'completed' ? 'completed-icon' : 'pending-icon'">
										{{plan.status === 'completed' ? '✅' : '⭕'}}
									</text>
								</view>
								<view class="plan-action" @click="deletePlan(plan.id)">
									<text class="action-icon delete-icon">🗑️</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 底部按钮 -->
				<view class="plan-bottom-actions">
					<button class="create-plan-btn-large" @click="showCreatePlanModal">+ 创建新计划</button>
				</view>
				
				<!-- 底部填充，确保能滚动到底部 -->
				<view style="height: 60px;"></view>
			</scroll-view>
			
			<!-- 底部导航栏 -->
			<view class="tab-bar-wrapper">
				<tab-bar :current="3" @tabChange="handleTabChange"></tab-bar>
			</view>
		</view>
		
		<!-- 添加计划弹窗 -->
		<view class="plan-modal" v-if="showCreatePlan">
			<view class="plan-modal-mask" @click="closeCreatePlanModal"></view>
			<view class="plan-modal-content">
				<view class="plan-modal-header">
					<text class="plan-modal-title">{{editMode ? '编辑' : '创建'}}学习计划</text>
					<view class="plan-modal-close" @click="closeCreatePlanModal">×</view>
				</view>
				
				<view class="plan-modal-body">
					<view class="plan-form-item">
						<text class="plan-form-label">计划标题</text>
						<input 
							type="text" 
							class="plan-form-input" 
							v-model="currentPlan.title" 
							placeholder="输入计划标题"
						/>
					</view>
					
					<view class="plan-form-item">
						<text class="plan-form-label">计划描述</text>
						<textarea 
							class="plan-form-textarea" 
							v-model="currentPlan.description" 
							placeholder="详细描述你的学习计划..."
							:auto-height="true"
						></textarea>
					</view>
					
					<view class="plan-form-item">
						<text class="plan-form-label">计划日期</text>
						<picker 
							mode="date" 
							:value="currentPlan.date" 
							@change="setPlanDate"
							class="plan-date-picker"
						>
							<view class="picker-value">
								<text>{{formatDate(currentPlan.date)}}</text>
								<text class="picker-arrow">↓</text>
							</view>
						</picker>
					</view>
					
					<view class="plan-form-item">
							<text class="plan-form-label">优先级</text>
							<view class="plan-priority-selector">
								<view 
									class="priority-option" 
									v-for="priority in priorities" 
									:key="priority.value"
									:class="{ selected: currentPlan.priority === priority.value }"
									@click="setPriority(priority.value)"
								>
									<text class="priority-label">{{priority.label}}</text>
								</view>
							</view>
					</view>
					
					<view class="plan-form-item">
						<text class="plan-form-label">目标完成时间(小时)</text>
						<input 
							type="number" 
							class="plan-form-input" 
							v-model="currentPlan.targetHours" 
							placeholder="设置目标完成时间"
						/>
					</view>
					
					<view class="plan-form-item">
						<text class="plan-form-label">提醒设置</text>
						<view class="plan-toggle">
							<text>{{currentPlan.reminderEnabled ? '已开启' : '已关闭'}}</text>
							<switch color="#a6c0fe" :checked="currentPlan.reminderEnabled" @change="toggleReminder" />
						</view>
					</view>
					
					<view class="plan-form-item" v-if="currentPlan.reminderEnabled">
						<text class="plan-form-label">提醒时间</text>
						<picker 
							mode="time" 
							:value="currentPlan.reminderTime" 
							@change="setReminderTime"
							class="plan-time-picker"
						>
							<view class="picker-value">
								<text>{{currentPlan.reminderTime}}</text>
								<text class="picker-arrow">↓</text>
							</view>
						</picker>
					</view>
				</view>
				
				<view class="plan-modal-footer">
					<button class="plan-cancel-btn" @click="closeCreatePlanModal">取消</button>
					<button class="plan-save-btn" @click="savePlan">{{editMode ? '更新' : '保存'}}</button>
				</view>
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
			showCreatePlan: false,
			editMode: false,
			priorities: [
				{ value: 'low', label: '低优先级' },
				{ value: 'medium', label: '中优先级' },
				{ value: 'high', label: '高优先级' }
			],
			currentTab: 'all',
			planTabs: [
				{ value: 'all', label: '全部' },
				{ value: 'today', label: '今天' },
				{ value: 'week', label: '本周' },
				{ value: 'month', label: '本月' }
			],
			plans: [],
			currentPlan: {
				id: null,
				title: '',
				description: '',
				date: new Date().toISOString().split('T')[0],
				priority: 'medium',
				targetHours: 0,
				reminderEnabled: false,
				reminderTime: '08:00',
				progress: 0,
				status: 'pending'
			},
			completedPlansCount: 0,
			pendingPlansCount: 0,
			totalPlansCount: 0,
			completionRate: 0
		}
	},
	watch: {
		plans: {
			handler() {
				this.updateStats();
			},
			deep: true
		}
	},
	computed: {
		filteredPlans() {
			switch(this.currentTab) {
				case 'today':
					return this.plans.filter(plan => this.isToday(plan.date));
				case 'week':
					return this.plans.filter(plan => this.isCurrentWeek(plan.date));
				case 'month':
					return this.plans.filter(plan => this.isCurrentMonth(plan.date));
				default:
					return this.plans;
			}
		}
	},
	onLoad() {
		this.loadPlans();
	},
	methods: {
		loadPlans() {
			try {
				const savedPlans = uni.getStorageSync('userPlans');
				if (savedPlans) {
					this.plans = JSON.parse(savedPlans);
					this.updateStats();
				}
			} catch (e) {
				console.error('加载计划失败:', e);
			}
		},
		savePlans() {
			try {
				uni.setStorageSync('userPlans', JSON.stringify(this.plans));
			} catch (e) {
				console.error('保存计划失败:', e);
			}
		},
		showCreatePlanModal() {
			this.showCreatePlan = true;
			this.editMode = false;
			this.resetCurrentPlan();
		},
		closeCreatePlanModal() {
			this.showCreatePlan = false;
		},
		editPlan(plan) {
			this.editMode = true;
			this.showCreatePlan = true;
			this.currentPlan = { ...plan };
		},
		deletePlan(id) {
			uni.showModal({
				title: '删除计划',
				content: '确定要删除这个计划吗？',
				success: (res) => {
					if (res.confirm) {
						this.plans = this.plans.filter(plan => plan.id !== id);
						this.savePlans();
						this.updateStats();
						uni.showToast({
							title: '已删除',
							icon: 'success'
						});
					}
				}
			});
		},
		togglePlanStatus(plan) {
			const planIndex = this.plans.findIndex(p => p.id === plan.id);
			if (planIndex !== -1) {
				this.plans[planIndex].status = this.plans[planIndex].status === 'completed' ? 'pending' : 'completed';
				this.plans[planIndex].progress = this.plans[planIndex].status === 'completed' ? 100 : 50;
				this.savePlans();
				this.updateStats();
			}
		},
		setPlanDate(e) {
			this.currentPlan.date = e.detail.value;
		},
		setPriority(priority) {
			this.currentPlan.priority = priority;
		},
		toggleReminder(e) {
			this.currentPlan.reminderEnabled = e.detail.value;
		},
		setReminderTime(e) {
			this.currentPlan.reminderTime = e.detail.value;
		},
		savePlan() {
			if (!this.currentPlan.title) {
				uni.showToast({
					title: '请输入计划标题',
					icon: 'none'
				});
				return;
			}
			
			if (!this.currentPlan.targetHours || this.currentPlan.targetHours <= 0) {
				uni.showToast({
					title: '请输入有效的目标时间',
					icon: 'none'
				});
				return;
			}
			
			if (this.editMode) {
				// 如果是编辑模式，更新现有计划
				const index = this.plans.findIndex(plan => plan.id === this.currentPlan.id);
				if (index !== -1) {
					this.plans[index] = { ...this.currentPlan };
				}
			} else {
				// 如果是创建模式，添加新计划
				this.currentPlan.id = Date.now();
				this.plans.push({ ...this.currentPlan });
			}
			
			this.savePlans();
			this.closeCreatePlanModal();
			this.updateStats();
			
			uni.showToast({
				title: this.editMode ? '更新成功' : '创建成功',
				icon: 'success'
			});
		},
		changeTab(tabValue) {
			this.currentTab = tabValue;
		},
		updateStats() {
			this.totalPlansCount = this.plans.length;
			this.completedPlansCount = this.plans.filter(plan => plan.status === 'completed').length;
			this.pendingPlansCount = this.plans.length - this.completedPlansCount;
			this.completionRate = this.plans.length > 0 
				? Math.round((this.completedPlansCount / this.plans.length) * 100) 
				: 0;
		},
		isToday(dateString) {
			const today = new Date();
			const planDate = new Date(dateString);
			return today.toDateString() === planDate.toDateString();
		},
		isCurrentWeek(dateString) {
			const currentDate = new Date();
			const currentWeekday = currentDate.getDay();
			const planDate = new Date(dateString);
			const planWeekday = planDate.getDay();
			const planDateYear = planDate.getFullYear();
			const currentDateYear = currentDate.getFullYear();
			
			if (planDateYear !== currentDateYear) {
				return false;
			}
			
			const startOfWeek = new Date(currentDate);
			startOfWeek.setDate(currentDate.getDate() - currentWeekday);
			
			const endOfWeek = new Date(currentDate);
			endOfWeek.setDate(currentDate.getDate() + (6 - currentWeekday));
			
			return planDate >= startOfWeek && planDate <= endOfWeek;
		},
		isCurrentMonth(dateString) {
			const currentDate = new Date();
			const planDate = new Date(dateString);
			return currentDate.getMonth() === planDate.getMonth() && 
				   currentDate.getFullYear() === planDate.getFullYear();
		},
		formatDate(dateString) {
			if (!dateString) return '';
			const date = new Date(dateString);
			return `${date.getMonth() + 1}月${date.getDate()}日`;
		},
		resetCurrentPlan() {
			this.currentPlan = {
				id: null,
				title: '',
				description: '',
				date: new Date().toISOString().split('T')[0],
				priority: 'medium',
				targetHours: 0,
				reminderEnabled: false,
				reminderTime: '08:00',
				progress: 0,
				status: 'pending'
			};
		},
		handleTabChange(data) {
			if (data && data.route) {
				Navigation.switchTab(data.route);
			}
		}
	}
}
</script>

<style>
.full-container {
	width: 100%;
	height: 100%;
	position: relative;
}

.plan-container {
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

/* 顶部计划标题区域 */
.plan-header {
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	border-bottom-left-radius: 30px;
	border-bottom-right-radius: 30px;
	padding: 30px 20px 20px;
	position: relative;
	margin-bottom: 20px;
	margin-top: -1px;
	padding-top: 31px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
	z-index: 2;
}

.plan-title {
	margin-bottom: 15px;
}

.plan-title-text {
	font-size: 20px;
	font-weight: bold;
	color: #fff;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.stats-summary {
	display: flex;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 15px;
	padding: 12px;
}

.plan-stats-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.stat-value {
	font-size: 22px;
	font-weight: bold;
	color: #fff;
	margin-bottom: 4px;
}

.stat-label {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.8);
}

/* 计划选择器 */
.plan-selector {
	margin: 15px;
	background-color: #fff;
	border-radius: 15px;
	padding: 10px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.plan-tabs {
	display: flex;
	justify-content: space-between;
}

.plan-tab {
	flex: 1;
	text-align: center;
	padding-bottom: 5px;
	color: #666;
}

.plan-tab.active {
	color: #c2a8fd;
	border-bottom: 2px solid #c2a8fd;
}

.plan-tab-text {
	font-size: 14px;
}

/* 计划列表 */
.plan-list-container {
	padding: 15px;
}

.plan-card {
	background-color: #fff;
	border-radius: 15px;
	margin-bottom: 15px;
	overflow: hidden;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.plan-header {
	display: flex;
	align-items: center;
	padding: 15px;
	border-bottom: 1px solid #f5f5f5;
}

.plan-icon {
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	margin-right: 10px;
}

.priority-icon-high {
	color: #ff5252;
}

.priority-icon-medium {
	color: #ffa000;
}

.priority-icon-low {
	color: #4caf50;
}

.plan-title-container {
	flex: 1;
}

.plan-title-text {
	font-size: 16px;
	font-weight: 500;
	color: #333;
}

.plan-date {
	font-size: 12px;
	color: #999;
	margin-top: 2px;
}

.plan-status {
	padding: 2px 8px;
	border-radius: 10px;
	font-size: 12px;
	font-weight: 500;
}

.plan-status.pending {
	background-color: #f0f0f0;
	color: #666;
}

.plan-status.completed {
	background-color: #e0f2e0;
	color: #4caf50;
}

.plan-details {
	padding: 15px;
}

.plan-description {
	font-size: 14px;
	color: #666;
	line-height: 1.5;
	margin-bottom: 10px;
}

.plan-progress {
	display: flex;
	align-items: center;
	margin-bottom: 15px;
}

.progress-label {
	font-size: 12px;
	color: #666;
	margin-right: 5px;
}

.progress-bar {
	flex: 1;
	height: 6px;
	background-color: #f0f0f0;
	border-radius: 3px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background-color: #c2a8fd;
	border-radius: 3px;
}

.progress-fill.completed {
	background-color: #4caf50;
}

.progress-value {
	font-size: 12px;
	color: #666;
	margin-left: 5px;
}

.plan-actions {
	display: flex;
	justify-content: flex-end;
}

.plan-action {
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f5f5f5;
	border-radius: 50%;
	margin-left: 5px;
}

.action-icon {
	font-size: 16px;
}

.completed-icon {
	color: #4caf50;
}

.pending-icon {
	color: #666;
}

.delete-icon {
	color: #ff5252;
}

/* 无计划状态 */
.plan-empty-state {
	text-align: center;
	padding: 40px 20px;
}

.empty-icon {
	font-size: 40px;
	color: #c2a8fd;
	margin-bottom: 10px;
}

.empty-text {
	font-size: 14px;
	color: #999;
	margin-bottom: 20px;
}

.create-plan-btn {
	width: 160px;
	padding: 8px 15px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	color: white;
	border: none;
	border-radius: 20px;
	font-size: 14px;
	text-align: center;
}

/* 底部按钮 */
.plan-bottom-actions {
	padding: 15px;
}

.create-plan-btn-large {
	width: 100%;
	padding: 12px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	color: white;
	border: none;
	border-radius: 10px;
	font-size: 16px;
	text-align: center;
	box-shadow: 0 4px 10px rgba(166, 192, 254, 0.3);
}

/* 弹窗样式 */
.plan-modal {
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

.plan-modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: -1;
}

.plan-modal-content {
	width: 80%;
	max-width: 350px;
	background-color: #fff;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.plan-modal-header {
	padding: 15px;
	border-bottom: 1px solid #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.plan-modal-title {
	font-size: 18px;
	font-weight: bold;
	color: #333;
}

.plan-modal-close {
	font-size: 24px;
	color: #999;
	padding: 0 5px;
}

.plan-modal-body {
	padding: 15px;
}

.plan-form-item {
	margin-bottom: 15px;
}

.plan-form-label {
	font-size: 14px;
	color: #666;
	margin-bottom: 5px;
	display: block;
}

.plan-form-input {
	width: 100%;
	height: 40px;
	border: 1px solid #eee;
	border-radius: 10px;
	padding: 0 15px;
	font-size: 14px;
}

.plan-form-textarea {
	width: 100%;
	border: 1px solid #eee;
	border-radius: 10px;
	padding: 10px 15px;
	font-size: 14px;
	line-height: 1.5;
}

.plan-priority-selector {
	display: flex;
	margin-top: 8px;
}

.priority-option {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 8px;
	border-radius: 10px;
	background-color: #f5f5f5;
	margin: 0 3px;
}

.priority-option.selected {
	background-color: #c2a8fd;
	color: white;
}

.plan-toggle {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.plan-modal-footer {
	display: flex;
	padding: 10px 15px 15px;
}

.plan-cancel-btn, .plan-save-btn {
	flex: 1;
	height: 40px;
	line-height: 40px;
	text-align: center;
	border-radius: 10px;
	margin: 0 5px;
	font-size: 14px;
}

.plan-cancel-btn {
	background-color: #f5f5f5;
	color: #666;
}

.plan-save-btn {
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	color: #fff;
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