<template>
	<swipe-detector class="full-container" :tab-index="3">
		<view class="statistics-container">
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
					<view class="user-card">
						<image class="avatar" :src="userInfo.avatar || '/src/static/avatar/default-avatar.png'" mode="aspectFill"></image>
						<view class="user-info">
							<text class="username">{{userInfo.username || '学习达人'}}</text>
						</view>
						<view class="settings-button" @click="goToSettings">
							<text class="settings-icon">⚙️</text>
						</view>
					</view>
				</view>
				
				<!-- 统计概览 -->
				<view class="stats-overview">
					<view class="stats-card">
						<view class="stats-title">
							<text class="stats-title-text">学习统计概览</text>
						</view>
						<view class="stats-row">
							<view class="stat-item">
								<text class="stat-value">{{studyStats.totalHours}}</text>
								<text class="stat-label">总学习时长(小时)</text>
							</view>
							<view class="stat-item">
								<text class="stat-value">{{studyStats.studyDays}}</text>
								<text class="stat-label">学习天数</text>
							</view>
							<view class="stat-item">
								<text class="stat-value">{{studyStats.averageDailyHours ? studyStats.averageDailyHours.toFixed(1) : '0.0'}}</text>
								<text class="stat-label">平均每日学习(小时)</text>
							</view>
							<view class="stat-item">
								<text class="stat-value">{{userPoints}}</text>
								<text class="stat-label">学习积分</text>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 每日学习趋势 -->
				<view class="chart-section">
					<view class="chart-header">
						<text class="chart-title">每日学习趋势</text>
						<view class="chart-period-selector">
							<text 
								class="period-option" 
								:class="{ active: currentPeriod === period.value }" 
								v-for="period in periodOptions" 
								:key="period.value"
								@click="changePeriod(period.value)"
							>{{period.label}}</text>
						</view>
					</view>
					<view class="chart-container">
						<view ref="dailyChart" class="chart"></view>
					</view>
				</view>
				
				<!-- 每周学习统计 -->
				<view class="chart-section">
					<view class="chart-header">
						<text class="chart-title">每周学习分布</text>
					</view>
					<view class="chart-container">
						<view ref="weeklyChart" class="chart"></view>
					</view>
				</view>
				
				<!-- 学科分布 -->
				<view class="chart-section">
					<view class="chart-header">
						<text class="chart-title">学科学习时间分布</text>
					</view>
					<view class="chart-container">
						<view ref="subjectChart" class="chart"></view>
					</view>
				</view>
				
				<!-- 学习效率分析 -->
				<view class="chart-section">
					<view class="chart-header">
						<text class="chart-title">学习效率分析</text>
					</view>
					<view class="efficiency-metrics">
						<view class="efficiency-item">
							<view class="efficiency-icon">🎯</view>
							<view class="efficiency-data">
								<text class="efficiency-value">{{efficiencyData.focusRate ? efficiencyData.focusRate.toFixed(1) : '0.0'}}%</text>
								<text class="efficiency-label">专注度</text>
							</view>
						</view>
						<view class="efficiency-item">
							<view class="efficiency-icon">⏱️</view>
							<view class="efficiency-data">
								<text class="efficiency-value">{{efficiencyData.averageSession ? efficiencyData.averageSession.toFixed(1) : '0.0'}} 分钟</text>
								<text class="efficiency-label">平均专注时长</text>
							</view>
						</view>
						<view class="efficiency-item">
							<view class="efficiency-icon">📈</view>
							<view class="efficiency-data">
								<text class="efficiency-value">{{efficiencyData.improvementRate ? efficiencyData.improvementRate.toFixed(1) : '0.0'}}%</text>
								<text class="efficiency-label">提升率</text>
							</view>
						</view>
					</view>
					<view class="chart-container">
						<view ref="efficiencyChart" class="chart"></view>
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
import { userStore } from '@/store/userStore';
import * as echarts from 'echarts';

export default {
	components: {
		TabBar,
		SwipeDetector
	},
	data() {
		return {
			userInfo: userStore.getState(),
			studyStats: {
				totalHours: userStore.getState().totalHours || '0',
				studyDays: userStore.getState().studyDays || '0',
				averageDailyHours: userStore.getState().averageDailyHours || 0,
				todayHours: userStore.getState().todayHours || '0'
			},
			userPoints: userStore.getState().points || '0',
			periodOptions: [
				{ value: 'week', label: '本周' },
				{ value: 'month', label: '本月' },
				{ value: 'year', label: '本年' }
			],
			currentPeriod: 'month',
			efficiencyData: {
				focusRate: 78, // 专注度
				averageSession: 45, // 平均专注时长
				improvementRate: 15 // 提升率
			},
			charts: {
				daily: null,
				weekly: null,
				subject: null,
				efficiency: null
			}
		}
	},
	onLoad() {
		this.checkUserLogin();
		this.loadStudyData();
		this.initCharts();
		userStore.subscribe('statistics-page', (newState) => {
			this.userInfo = { ...newState };
			this.studyStats = {
				totalHours: newState.totalHours || '0',
				studyDays: newState.studyDays || '0',
				averageDailyHours: newState.averageDailyHours || 0,
				todayHours: newState.todayHours || '0'
			};
			this.userPoints = newState.points || '0';
		});
	},
	onUnload() {
		userStore.unsubscribe('statistics-page');
		this.destroyCharts();
	},
	methods: {
		checkUserLogin() {
			Navigation.checkLoginStatus();
		},
		loadStudyData() {
			try {
				const studyData = uni.getStorageSync('studyTimeData');
				if (studyData) {
					const data = JSON.parse(studyData);
					
					this.studyStats = {
						totalHours: data.totalHours || '0',
						studyDays: data.studyDays || '0',
						averageDailyHours: data.averageDailyHours || 0,
						todayHours: data.todayHours || '0'
					};
					
					this.userPoints = data.points || '0';
					
					userStore.updateState({
						totalHours: this.studyStats.totalHours,
						studyDays: this.studyStats.studyDays,
						averageDailyHours: this.studyStats.averageDailyHours,
						todayHours: this.studyStats.todayHours,
						points: this.userPoints
					});
				}
			} catch (e) {
				console.error('加载学习数据失败:', e);
			}
		},
		initCharts() {
			this.initDailyChart();
			this.initWeeklyChart();
			this.initSubjectChart();
			this.initEfficiencyChart();
		},
		initDailyChart() {
			this.charts.daily = echarts.init(this.$refs.dailyChart);
			const option = {
				grid: {
					left: '5%',
					right: '5%',
					bottom: '10%',
					top: '10%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: ['1日', '5日', '10日', '15日', '20日', '25日', '30日'],
					axisLine: {
						lineStyle: {
							color: '#ddd'
						}
					},
					axisLabel: {
						color: '#666'
					}
				},
				yAxis: {
					type: 'value',
					axisLine: {
						show: false
					},
					splitLine: {
						lineStyle: {
							color: '#eee'
						}
					},
					axisLabel: {
						color: '#666'
					}
				},
				series: [{
					data: [1.5, 2.3, 3.1, 4.2, 3.8, 2.9, 3.5],
					type: 'line',
					smooth: true,
					lineStyle: {
						width: 3,
						color: '#a6c0fe'
					},
					itemStyle: {
						color: '#a6c0fe'
					},
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0,
								color: 'rgba(166, 192, 254, 0.5)'
							}, {
								offset: 1,
								color: 'rgba(166, 192, 254, 0.1)'
							}]
						}
					}
				}],
				color: ['#a6c0fe']
			};
			this.charts.daily.setOption(option);
		},
		initWeeklyChart() {
			this.charts.weekly = echarts.init(this.$refs.weeklyChart);
			const option = {
				grid: {
					left: '5%',
					right: '5%',
					bottom: '10%',
					top: '10%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
					axisLine: {
						lineStyle: {
							color: '#ddd'
						}
					},
					axisLabel: {
						color: '#666'
					}
				},
				yAxis: {
					type: 'value',
					axisLine: {
						show: false
					},
					splitLine: {
						lineStyle: {
							color: '#eee'
						}
					},
					axisLabel: {
						color: '#666'
					}
				},
				series: [{
					data: [2.5, 3.2, 2.8, 4.1, 3.6, 5.2, 4.8],
					type: 'bar',
					barWidth: '40%',
					itemStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0,
								color: '#a6c0fe'
							}, {
								offset: 1,
								color: '#c2a8fd'
							}]
						}
					}
				}],
				color: ['#a6c0fe']
			};
			this.charts.weekly.setOption(option);
		},
		initSubjectChart() {
			this.charts.subject = echarts.init(this.$refs.subjectChart);
			const option = {
				grid: {
					left: '5%',
					right: '5%',
					bottom: '10%',
					top: '10%',
					containLabel: true
				},
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				legend: {
					orient: 'horizontal',
					bottom: '0%',
					itemWidth: 10,
					itemHeight: 10,
					textStyle: {
						color: '#666',
						fontSize: 12
					}
				},
				series: [{
					name: '学科分布',
					type: 'pie',
					radius: ['40%', '70%'],
					avoidLabelOverlap: false,
					label: {
						show: false,
						position: 'center'
					},
					emphasis: {
						label: {
							show: true,
							fontSize: '14',
							fontWeight: 'bold'
						}
					},
					labelLine: {
						show: false
					},
					data: [
						{ value: 35, name: '数学' },
						{ value: 25, name: '语文' },
						{ value: 20, name: '英语' },
						{ value: 15, name: '物理' },
						{ value: 5, name: '其他' }
					],
					itemStyle: {
						borderRadius: 5,
						borderColor: '#fff',
						borderWidth: 2
					}
				}]
			};
			this.charts.subject.setOption(option);
		},
		initEfficiencyChart() {
			this.charts.efficiency = echarts.init(this.$refs.efficiencyChart);
			const option = {
				grid: {
					left: '5%',
					right: '5%',
					bottom: '10%',
					top: '10%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: ['6:00', '9:00', '12:00', '15:00', '18:00', '21:00'],
					axisLine: {
						lineStyle: {
							color: '#ddd'
						}
					},
					axisLabel: {
						color: '#666'
					}
				},
				yAxis: {
					type: 'value',
					axisLine: {
						show: false
					},
					splitLine: {
						lineStyle: {
							color: '#eee'
						}
					},
					axisLabel: {
						color: '#666'
					},
					min: 0,
					max: 100
				},
				series: [{
					data: [65, 75, 85, 70, 60, 55],
					type: 'line',
					smooth: true,
					lineStyle: {
						width: 3,
						color: '#ff9f43'
					},
					itemStyle: {
						color: '#ff9f43'
					},
					areaStyle: {
						color: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0,
								color: 'rgba(255, 159, 67, 0.5)'
							}, {
								offset: 1,
								color: 'rgba(255, 159, 67, 0.1)'
							}]
						}
					}
				}],
				color: ['#ff9f43']
			};
			this.charts.efficiency.setOption(option);
		},
		changePeriod(period) {
			this.currentPeriod = period;
			this.updateDailyChart();
		},
		updateDailyChart() {
			const data = {
				week: [1.5, 2.3, 3.1, 4.2, 3.8, 2.9, 3.5],
				month: [1.5, 2.3, 3.1, 4.2, 3.8, 2.9, 3.5, 4.0, 3.2, 2.8, 3.6, 4.5, 3.9, 2.7, 3.3, 4.1, 3.7, 3.0, 2.5, 3.8, 4.4, 3.6, 3.2, 2.9, 3.5],
				year: [1.5, 2.3, 3.1, 4.2, 3.8, 2.9, 3.5, 4.0, 3.2, 2.8, 3.6, 4.5, 3.9, 2.7, 3.3, 4.1, 3.7, 3.0, 2.5, 3.8, 4.4, 3.6, 3.2, 2.9, 3.5, 4.2, 3.8, 2.9, 3.5, 4.0, 3.2, 2.8, 3.6, 4.5, 3.9, 2.7, 3.3, 4.1, 3.7, 3.0, 2.5, 3.8, 4.4, 3.6, 3.2, 2.9, 3.5]
			};
			
			const xAxisData = {
				week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
				month: Array.from({length: 25}, (_, i) => `${i+1}日`),
				year: Array.from({length: 50}, (_, i) => `${i+1}周`)
			};
			
			this.charts.daily.setOption({
				xAxis: {
					data: xAxisData[this.currentPeriod]
				},
				series: [{
					data: data[this.currentPeriod]
				}]
			});
		},
		destroyCharts() {
			if (this.charts.daily) {
				this.charts.daily.dispose();
				this.charts.daily = null;
			}
			if (this.charts.weekly) {
				this.charts.weekly.dispose();
				this.charts.weekly = null;
			}
			if (this.charts.subject) {
				this.charts.subject.dispose();
				this.charts.subject = null;
			}
			if (this.charts.efficiency) {
				this.charts.efficiency.dispose();
				this.charts.efficiency = null;
			}
		},
		goToSettings() {
			uni.showToast({
				title: '设置功能开发中',
				icon: 'none'
			});
		},
		handleTabChange(data) {
			if (data && data.route) {
				Navigation.switchTab(data.route);
			}
		}
	},
	onResize() {
		if (this.charts.daily) this.charts.daily.resize();
		if (this.charts.weekly) this.charts.weekly.resize();
		if (this.charts.subject) this.charts.subject.resize();
		if (this.charts.efficiency) this.charts.efficiency.resize();
	}
}
</script>

<style>
.full-container {
	width: 100%;
	height: 100%;
	position: relative;
}

.statistics-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	position: relative;
	background-color: #f8f3ff;
	padding: 0;
	margin: 0;
	overflow: hidden; /* 防止容器本身滚动 */
	padding-bottom: 50px; /* 为底部导航栏腾出空间 */
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

/* 顶部用户卡片 */
.user-header {
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	border-bottom-left-radius: 30px;
	border-bottom-right-radius: 30px;
	padding: 30px 20px 20px;
	position: relative;
	margin-bottom: 20px;
	/* 防止滑动时看到上方白色 */
	margin-top: -1px;
	padding-top: 31px;
	/* 增加阴影效果，突出层次感 */
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
	/* 确保在延伸背景之上 */
	z-index: 2;
}

.blur-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(135deg, rgba(166, 192, 254, 0.8), rgba(194, 168, 253, 0.9));
	filter: blur(5px);
	opacity: 0.5;
	z-index: 0;
	border-bottom-left-radius: 30px;
	border-bottom-right-radius: 30px;
}

.user-card {
	display: flex;
	align-items: center;
	position: relative;
	z-index: 1;
}

.avatar {
	width: 70px;
	height: 70px;
	border-radius: 35px;
	border: 3px solid rgba(255, 255, 255, 0.7);
}

.user-info {
	flex: 1;
	padding-left: 15px;
}

.username {
	font-size: 20px;
	font-weight: bold;
	color: #fff;
	margin-bottom: 4px;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.settings-button {
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background: rgba(255, 255, 255, 0.25);
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(5px);
}

.settings-icon {
	font-size: 20px;
}

/* 统计卡片 */
.stats-overview {
	padding: 0 15px;
	margin-bottom: 20px;
}

.stats-card {
	background-color: #fff;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.stats-title {
	padding: 15px;
	background-color: #f8f3ff;
}

.stats-title-text {
	font-size: 16px;
	color: #666;
	font-weight: 500;
}

.stats-row {
	display: flex;
	padding: 15px;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 15px;
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.stat-value {
	font-size: 22px;
	font-weight: bold;
	color: #333;
	margin-bottom: 4px;
}

.stat-label {
	font-size: 12px;
	color: #666;
}

/* 图表部分 */
.chart-section {
	padding: 15px;
	margin-bottom: 20px;
	background-color: #fff;
	border-radius: 15px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.chart-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.chart-title {
	font-size: 16px;
	color: #333;
	font-weight: 500;
}

.chart-period-selector {
	display: flex;
}

.period-option {
	padding: 5px 10px;
	font-size: 12px;
	color: #666;
	border-radius: 10px;
	margin-left: 5px;
}

.period-option.active {
	background-color: #f0f0f0;
	color: #666;
	font-weight: 500;
}

.chart-container {
	height: 250px;
	background-color: #fafafa;
	border-radius: 10px;
	overflow: hidden;
}

.chart {
	width: 100%;
	height: 100%;
}

/* 效率指标 */
.efficiency-metrics {
	display: flex;
	justify-content: space-around;
	margin-bottom: 15px;
}

.efficiency-item {
	display: flex;
	align-items: center;
}

.efficiency-icon {
	font-size: 24px;
	margin-right: 10px;
}

.efficiency-data {
	text-align: center;
}

.efficiency-value {
	font-size: 18px;
	font-weight: bold;
	color: #333;
}

.efficiency-label {
	font-size: 12px;
	color: #666;
	margin-top: 5px;
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
	-webkit-overflow-scrolling: touch; /* 增加iOS滑动流畅度 */
}

/* 全屏滚动区域 */
.full-scroll {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 50px; /* 为底部导航栏留出空间 */
	z-index: 5;
}
</style>