<template>
	<swipe-detector class="full-container">
		<view class="home-container">
			<!-- 主内容区 -->
			<scroll-view 
				scroll-y 
				class="content-scroll" 
				:scroll-top="scrollTop"
				@scroll="handleScroll"
				:show-scrollbar="false"
				enhanced
				bounces
				:enable-back-to-top="true"
				:fast-deceleration="true"
			>
				
				
				<!-- 自习室面板 -->
				<view class="panel study-room-panel">
					<view class="panel-header">
						<text class="panel-title">自习室</text>
					</view>
					
					<!-- 自习室操作选项 -->
					<room-options 
						:is-tablet="isTablet"
						@create-room="openCreateRoomModal"
						@join-room="joinRoom"
					/>
				</view>
				
				<!-- 热门自习室面板 -->
				<view class="panel popular-rooms-panel">
					<view class="panel-header">
						<text class="panel-title">热门自习室</text>
					</view>
					
					<popular-rooms 
						:rooms="visibleRooms" 
						@enter-room="enterRoom"
					/>
				</view>
				
				<!-- 学习排行面板 -->
				<view class="panel leaderboard-panel last-panel">
					<leaderboard 
						:leaderboard="leaderboardData"
					/>
				</view>
			</scroll-view>
			
			<!-- 底部导航栏 -->
			<tab-bar :current="0" @tabChange="handleTabChange"></tab-bar>
			
			<!-- 创建自习室弹窗 -->
			<create-room-modal 
				:visible="showCreateRoomModal" 
				@update:visible="showCreateRoomModal = $event"
				@created="handleRoomCreated"
				@cancel="handleCreateCancel"
				:key="`create-modal-${createModalKey}`"
			/>
		</view>
	</swipe-detector>
</template>

<script>
import TabBar from '@/components/TabBar.vue';
import PopularRooms from '@/components/home/PopularRooms.vue';
import RoomOptions from '@/components/home/RoomOptions.vue';
import Leaderboard from '@/components/home/Leaderboard.vue';
import SwipeDetector from '@/components/SwipeDetector.vue';
import CreateRoomModal from '@/components/modals/CreateRoomModal.vue';
import { Navigation } from '@/utils/navigation';
import { userStore } from '@/store/userStore';

export default {
	components: {
		TabBar,
		PopularRooms,
		RoomOptions,
		Leaderboard,
		SwipeDetector,
		CreateRoomModal
	},
	data() {
		return {
			isTablet: false, // 是否为平板设备
			scrollTop: 0, // 滚动位置
			lastScrollTop: 0, // 上次滚动位置
			scrollAction: null, // 滚动节流定时器
			activeTabIndex: 0,
			showCreateRoomModal: false, // 控制创建自习室弹窗显示
			createModalKey: Date.now(), // 创建自习室弹窗的唯一标识
			
			// 用户信息
			userInfo: userStore.getState(),

			
			// 热门自习室数据
			popularRooms: [],
			
			// 排行榜数据
			leaderboardData: []
		}
	},
	computed: {
		// 为了性能优化，控制显示的自习室数量
		visibleRooms() {
			// 先筛选出活跃的自习室
			const activeRooms = this.popularRooms.filter(room => room.isActive);
			// 只显示前4个活跃的自习室
			return activeRooms.slice(0, 4);
		}
	},
	onLoad() {
		// 页面加载时执行
		this.checkUserLogin();
		this.checkDeviceType();
		// 立即获取初始数据，避免页面空白
		this.fetchInitialData();
		// 加载学习时间数据
		this.loadStudyTimeData();

		// 添加监听器，接收用户数据更新
		userStore.subscribe('home-page', (newState) => {
			this.userInfo = {...newState};
		});
	},
	onUnload() {
		// 页面卸载时取消监听
		userStore.unsubscribe('home-page');
	},
	methods: {
		checkUserLogin() {
			Navigation.checkLoginStatus();
		},
		
		checkDeviceType() {
			// 检测设备类型
			try {
				// 尝试获取系统信息
				const systemInfo = uni.getSystemInfoSync();
				// 通常屏幕宽度大于768px的可以视为平板
				this.isTablet = systemInfo.windowWidth >= 768;
			} catch (e) {
				console.error('获取设备信息失败:', e);
			}
		},
		
		handleTabChange(data) {
			// 保存当前激活的标签索引
			this.activeTabIndex = data.index;
			console.log('Tab changed:', data);
		},
		
		// 处理滚动事件
		handleScroll(e) {
			// 滚动节流处理，避免频繁触发
			if (this.scrollAction) {
				clearTimeout(this.scrollAction);
			}
			
			this.scrollAction = setTimeout(() => {
				// 获取当前滚动位置
				this.lastScrollTop = e.detail.scrollTop;
			}, 100);
		},
		
		// 滚动到顶部
		scrollToTop() {
			this.scrollTop = 0;
		},
		
		// 打开创建自习室弹窗
		openCreateRoomModal() {
			// 每次打开都生成新的key，强制重新渲染模态框
			this.createModalKey = Date.now();
			
			// 短暂延迟后再打开，确保DOM完全更新
			setTimeout(() => {
				this.showCreateRoomModal = true;
			}, 100);
		},
		
		// 处理自习室创建成功事件
		handleRoomCreated(room) {
			console.log('创建的自习室:', room);
			// 创建自习室后的跳转由模态框自己处理
			
			// 更新createModalKey以防止下次打开时状态混淆
			this.createModalKey = Date.now();
			
			// 更新一下本地数据，将新创建的自习室添加到热门自习室列表
			if (room) {
				try {
					const newPopularRoom = {
						id: room.id,
						room_id: room.id, // 添加room_id字段确保兼容性
						name: room.name,
						ownerAvatar: "/static/default-avatar.png",
						memberCount: 1,
						currentMembers: 1, // 添加currentMembers字段确保兼容性
						duration: room.duration || (room.type === 'exam' ? "3小时/天" : 
								  room.type === 'civil' ? "4小时/天" : 
								  room.type === 'english' ? "1.5小时/天" : 
								  room.type === 'reading' ? "1小时/天" : 
								  room.type === 'work' ? "2.5小时/天" : 
								  "2小时/天"),
						tags: room.tags || [],
						isActive: true, // 确保新创建的自习室为活跃状态
						status: '开放中',
						roomCode: room.roomCode, // 添加roomCode字段
						room_code: room.roomCode, // 添加room_code字段确保兼容性
						roomType: room.type // 添加roomType字段
					};
					
					// 添加到热门自习室列表的开头
					this.popularRooms.unshift(newPopularRoom);
					
					// 刷新页面数据
					this.$forceUpdate();
					
					console.log('已将新创建的自习室添加到热门列表');
					
					// 重新加载推荐自习室列表，确保其他页面也能看到新创建的自习室
					setTimeout(() => {
						this.loadPopularRooms();
					}, 1000);
				} catch (e) {
					console.error('更新热门自习室列表失败:', e);
				}
			}
		},
		
		// 加入自习室
		joinRoom() {
			Navigation.navigateWithAnimation('/pages/room/join-room');
		},
		
		// 进入自习室
		enterRoom(room) {
			Navigation.toRoomDetail(room.id);
		},
		
		// 异步加载初始数据
		fetchInitialData() {
			// 加载热门自习室数据(初始占位，随后会被loadPopularRooms覆盖)
			this.popularRooms = [
				{
					id: 1,
					name: "考研英语冲刺",
					ownerAvatar: "/static/avatar1.png",
					memberCount: 35,
					duration: "2小时/天",
					tags: ["英语", "考研"],
					isActive: true
				},
				{
					id: 2,
					name: "计算机科学自习",
					ownerAvatar: "/static/avatar2.png",
					memberCount: 28,
					duration: "3小时/天",
					tags: ["编程", "算法"],
					isActive: true
				},
				{
					id: 3,
					name: "法学考证小组",
					ownerAvatar: "/static/avatar3.png",
					memberCount: 15,
					duration: "4小时/天",
					tags: ["法学", "考证"],
					isActive: true
				},
				{
					id: 4,
					name: "四六级备考群",
					ownerAvatar: "/static/avatar4.png",
					memberCount: 42,
					duration: "1.5小时/天",
					tags: ["英语", "四六级"],
					isActive: true
				},
				{
					id: 5,
					name: "设计素描练习",
					ownerAvatar: "/static/avatar5.png",
					memberCount: 20,
					duration: "2小时/天",
					tags: ["设计", "素描"],
					isActive: false
				}
			];
			// 加载排行榜数据
			this.leaderboardData = [
				{ name: '学霸王', avatar: '/static/avatar/avatar1.png', hours: 42 },
				{ name: '奋斗者', avatar: '/static/avatar/avatar2.png', hours: 38 },
				{ name: '知识追求者', avatar: '/static/avatar/avatar3.png', hours: 35 },
				{ name: '专注力Max', avatar: '/static/avatar/avatar4.png', hours: 30 },
				{ name: '自律达人', avatar: '/static/avatar/avatar5.png', hours: 28 }
			];
			// 异步拉取最新可用自习室
			this.loadPopularRooms();
		},
		 
		// 新增：加载热门/推荐自习室（来自模拟API）
		async loadPopularRooms() {
			try {
				const res = await uni.request({ url: '/api/available', method: 'GET' });
				if (res && res.data && res.data.code === 200) {
					const list = res.data.data || [];
					this.popularRooms = list.map(item => ({
						id: item.id || item.room_id,
						room_id: item.room_id || item.id,
						name: item.name,
						ownerAvatar: item.ownerAvatar || '/static/default-image.png',
						memberCount: item.currentMembers || item.memberCount || 1,
						currentMembers: item.currentMembers || item.memberCount || 1,
						duration: item.duration || '2小时/天',
						tags: item.tags || [],
						isActive: item.isActive !== undefined ? item.isActive : true,
						status: item.status || '开放中',
						roomCode: item.room_code || item.roomCode || '',
						roomType: item.roomType || '学习'
					}));
					this.$forceUpdate();
				} else {
					console.warn('加载热门自习室失败：', res && res.data);
				}
			} catch (e) {
				console.error('请求热门自习室出错：', e);
			}
		},
		
		handleCreateCancel() {
			console.log('创建自习室弹窗已取消');
			this.showCreateRoomModal = false;
			
			// 更新createModalKey以防止下次打开时状态混淆
			this.createModalKey = Date.now();
		},
		
		// 加载学习时间数据
		loadStudyTimeData() {
			try {
				// 获取学习时间数据
				const studyData = uni.getStorageSync('studyTimeData');
				
				if (studyData) {
					const data = JSON.parse(studyData);
					
					// 更新用户信息和全局状态
					const updatedInfo = {
						todayHours: data.todayHours || '0.0',
						totalHours: data.totalHours || '0.0',
						studyDays: data.studyDays || '0'
					};
					
					// 更新本地和全局状态
					this.userInfo = {...this.userInfo, ...updatedInfo};
					userStore.updateState(updatedInfo);
					
					console.log('已加载学习时间数据', updatedInfo);
				}
			} catch (e) {
				console.error('加载学习时间数据失败:', e);
			}
		}
	},
	onShow() {
		// 页面显示时检查数据加载状态
		if (this.popularRooms.length === 0) {
			this.startLoading();
		}
		
		// 每次页面显示时刷新学习时间数据
		this.loadStudyTimeData();
		
		// 确保创建自习室弹窗处于关闭状态
		this.showCreateRoomModal = false;
		
		// 增加一个新key，确保下次创建时状态正确
		this.createModalKey = Date.now();
		
		// 触发全局页面显示事件，通知组件刷新
		uni.$emit('page-show', {
			page: 'home',
			timestamp: Date.now()
		});
		
		// 确保正确设置TabBar选中状态
		this.activeTabIndex = 0;
		
		// 使用 nextTick 确保DOM更新后设置状态
		this.$nextTick(() => {
			const currentRoute = this.$route ? this.$route.path : '/pages/home/home';
			// 触发一个空的 tabChange 事件，确保状态同步
			uni.$emit('tabIndexUpdate', {
				index: 0,
				path: currentRoute
			});
		});
		
		// 监听自习室创建事件
		uni.$on('room-created', this.handleRoomCreated);
	},
	onHide() {
		// 保存页面状态
	},
	beforeDestroy() {
		// 清理工作
		if (this.scrollAction) {
			clearTimeout(this.scrollAction);
		}
		
		// 移除事件监听
		uni.$off('room-created', this.handleRoomCreated);
	}
}
</script>

<style>
page {
	background-color: #f8f3ff;
	height: 100%;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.home-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	position: relative;
	box-sizing: border-box;
	width: 100%;
	margin: 0 auto;
	overflow: hidden; /* 防止内容溢出 */
	/* 确保没有多余的内边距 */
	padding: 0;
}

/* 内容区域 */
.content-scroll {
	flex: 1;
	padding: 25px 20px 0 20px; /* 增加内边距 */
	height: 100%; 
	box-sizing: border-box;
	-webkit-overflow-scrolling: touch; /* 提升iOS滑动体验 */
	overflow-x: hidden; /* 防止水平滚动 */
	overflow-y: auto; /* 确保可以垂直滚动 */
	will-change: transform; /* 加速渲染 */
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE 和 Edge */
	padding-bottom: 56px; /* 为TabBar留出空间 */
	background-color: #f8f3ff;
	background-image: linear-gradient(135deg, #f8f3ff 0%, #f1f8ff 100%);
}



.user-avatar {
	width: 60px;
	height: 60px;
	border-radius: 30px;
	border: 3px solid rgba(255, 255, 255, 0.8);
	box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}



.quote-text {
	font-size: 14px;
	font-style: italic;
	color: rgba(255, 255, 255, 0.85);
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 面板样式 */
.panel {
	background-color: #fff;
	border-radius: 20px;
	padding: 22px;
	margin-bottom: 24px;
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	border: 1px solid rgba(166, 192, 254, 0.1);
	position: relative;
	overflow: hidden;
}

.panel:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.09);
}

.panel::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 4px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	opacity: 0.8;
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 18px;
	padding-bottom: 10px;
	border-bottom: 1px solid rgba(166, 192, 254, 0.15);
}

.panel-title {
	font-size: 19px;
	font-weight: bold;
	color: #333;
	background-image: linear-gradient(90deg, #a6c0fe, #c2a8fd);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.panel-more {
	font-size: 14px;
	color: #a6c0fe;
	padding: 5px 10px;
	border-radius: 15px;
	background-color: rgba(166, 192, 254, 0.1);
	transition: background-color 0.3s ease;
}

.panel-more:hover {
	background-color: rgba(166, 192, 254, 0.2);
}

/* 底部空白区域，防止内容被TabBar遮挡 */
.bottom-space {
	height: 0; /* 移除额外高度 */
	width: 100%;
	background-color: #ffffff; /* 与TabBar背景色一致 */
	margin: 0;
	padding: 0;
}

/* 响应式布局 - 平板设备 */
@media screen and (min-width: 768px) {
	.home-container {
		max-width: 768px;
		padding-left: 20px;
		padding-right: 20px;
	}
	
	.content-scroll {
		padding: 35px 25px 0 25px; /* 为平板设备增加内边距 */
	}
	.panel {
		padding: 25px;
		border-radius: 25px;
		margin-bottom: 28px;
	}
	
	.panel-title {
		font-size: 22px;
	}
	
	/* 平板下底部区域样式 */
	.bottom-space {
		max-width: 768px;
		margin: 0 auto;
	}
}

/* 隐藏滚动条但保留滚动功能 */
::-webkit-scrollbar {
	display: none; /* Chrome, Safari, Edge */
	width: 0;
	height: 0;
}

/* Firefox */
.content-scroll {
	scrollbar-width: none;
}

/* IE and Edge */
.content-scroll {
	-ms-overflow-style: none;
}

/* 最后一个面板特殊样式 */
.last-panel {
	margin-bottom: 56px; /* TabBar的高度 */
	border-bottom-left-radius: 18px; /* 保持圆角一致 */
	border-bottom-right-radius: 18px; /* 保持圆角一致 */
	background-color: #fff;
	padding-bottom: 18px;
}

.full-container {
	width: 100%;
	height: 100%;
	position: relative;
}
</style>