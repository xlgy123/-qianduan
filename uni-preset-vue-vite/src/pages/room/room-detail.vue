<template>
	<view class="room-detail-container">
		<!-- 返回按钮 - 优化样式 -->
		<view class="back-button" @tap="goBack">
			<text class="back-icon">←</text>
		</view>
		
		<!-- 房间信息头部 -->
		<view class="room-header">
			<view class="room-info-section">
				<view class="room-title">
					<text class="title-text">{{roomInfo.name}}</text>
					<view class="room-status" :class="{'status-active': roomInfo.isActive}">
						<text>{{roomInfo.isActive ? '进行中' : '未开始'}}</text>
					</view>
				</view>
				<view class="room-tags">
					<text class="room-tag" v-for="(tag, index) in roomInfo.tags" :key="index">{{tag}}</text>
				</view>
				<view class="room-stats">
					<view class="stat-item">
						<text class="stat-icon">👥</text>
						<text class="stat-value">{{roomInfo.memberCount}}人</text>
					</view>
					<view class="stat-item">
						<text class="stat-icon">⏱️</text>
						<text class="stat-value">{{roomInfo.duration}}</text>
					</view>
					<view class="stat-item">
						<text class="stat-icon">📅</text>
						<text class="stat-value">{{roomInfo.schedule || '每天'}}</text>
					</view>
					<view class="stat-item">
						<text class="stat-icon">🔢</text>
						<text class="stat-value">{{roomInfo.roomCode}}</text>
					</view>
				</view>
			</view>
			
			<view class="room-actions">
				<button class="action-btn join-btn" @click="joinStudyRoom">加入学习</button>
				<button class="action-btn share-btn" @click="shareRoom">分享</button>
			</view>
		</view>
		
		<!-- 学习者列表 -->
		<view class="members-section">
			<view class="section-title">学习者 ({{roomInfo.memberCount}})</view>
			<scroll-view class="members-list" scroll-x show-scrollbar="false">
				<view class="member-item" v-for="(member, index) in roomMembers" :key="index">
					<image class="member-avatar" :src="member.avatar"></image>
					<text class="member-name">{{member.name}}</text>
					<view class="member-badge" v-if="member.isHost">房主</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 学习规则 -->
		<view class="rules-section">
			<view class="section-title">学习规则</view>
			<view class="rule-list">
				<view class="rule-item" v-for="(rule, index) in roomInfo.rules" :key="index">
					<text class="rule-number">{{index + 1}}.</text>
					<text class="rule-text">{{rule}}</text>
				</view>
			</view>
		</view>
		
		<!-- 学习记录 -->
		<view class="records-section">
			<view class="section-title">学习记录</view>
			<view class="record-list">
				<view class="record-item" v-for="(record, index) in studyRecords" :key="index">
					<view class="record-date">{{record.date}}</view>
					<view class="record-members">{{record.members}}人参与</view>
					<view class="record-duration">总计{{record.totalHours}}小时</view>
				</view>
				<view class="empty-records" v-if="studyRecords.length === 0">
					<text>暂无学习记录</text>
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="bottom-actions">
			<button class="primary-btn" @click="joinStudyRoom">立即加入学习</button>
		</view>
	</view>
</template>

<script>
import { navigateBack } from '@/utils/navigation';

export default {
	data() {
		return {
			roomId: null,
			roomInfo: {
				id: 0,
				name: "",
				ownerName: "",
				ownerAvatar: "",
				memberCount: 0,
				duration: "",
				schedule: "",
				isActive: false,
				roomCode: "",
				tags: [],
				rules: []
			},
			roomMembers: [],
			studyRecords: []
		}
	},
	onLoad(options) {
		if (options.id) {
			this.roomId = options.id;
			this.fetchRoomDetails();
		} else {
			uni.showToast({
				title: '房间信息不存在',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}
	},
	methods: {
		// 获取房间详情
		fetchRoomDetails() {
			// 模拟API请求
			// 实际开发中应替换为真实的API调用
			setTimeout(() => {
				// 模拟数据
				this.roomInfo = {
					id: this.roomId,
					name: "考研英语冲刺",
					ownerName: "学霸王",
					ownerAvatar: "/static/avatar/avatar1.png",
					memberCount: 35,
					duration: "2小时/天",
					schedule: "每天19:00-21:00",
					isActive: true,
					roomCode: "123456", // 添加房间号
					tags: ["英语", "考研", "四六级"],
					rules: [
						"每日打卡，连续学习",
						"保持安静，专注学习",
						"可在学习群内讨论问题",
						"每周有阶段性测试",
						"违反规则三次将被移出"
					]
				};
				
				this.roomMembers = [
					{ id: 1, name: "学霸王", avatar: "/static/avatar/avatar1.png", isHost: true },
					{ id: 2, name: "奋斗者", avatar: "/static/avatar/avatar2.png", isHost: false },
					{ id: 3, name: "知识追求者", avatar: "/static/avatar/avatar3.png", isHost: false },
					{ id: 4, name: "专注力Max", avatar: "/static/avatar/avatar4.png", isHost: false },
					{ id: 5, name: "自律达人", avatar: "/static/avatar/avatar5.png", isHost: false },
					{ id: 6, name: "学习达人", avatar: "/static/avatar/avatar5.png", isHost: false }
				];
				
				this.studyRecords = [
					{ date: "2023-05-15", members: 32, totalHours: 64 },
					{ date: "2023-05-14", members: 28, totalHours: 56 },
					{ date: "2023-05-13", members: 30, totalHours: 60 }
				];
			}, 500);
		},
		
		// 加入学习
		joinStudyRoom() {
			uni.showModal({
				title: '加入自习室',
				content: '确定要加入该自习室进行学习吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '正在加入'
						});
						
						// 模拟加入过程
						setTimeout(() => {
							uni.hideLoading();
							uni.showToast({
								title: '加入成功',
								icon: 'success'
							});
							
							// 导航到学习界面
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/room/study-room?id=' + this.roomId
								});
							}, 1000);
						}, 1500);
					}
				}
			});
		},
		
		// 分享房间
		shareRoom() {
			// 准备分享的信息
			const shareInfo = {
				roomCode: this.roomInfo.roomCode || '000000', // 确保有房间号
				name: this.roomInfo.name,
				id: this.roomId
			};
			
			// 转换为字符串
			const shareText = JSON.stringify(shareInfo);
			
			// 创建分享内容
			const shareData = {
				title: `邀请你加入"${this.roomInfo.name}"自习室`,
				path: `/pages/room/join-room?inviteCode=${this.roomInfo.roomCode}`,
				imageUrl: '/static/images/share-cover.png', // 分享图片，需要预先准备
				success: (res) => {
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
			};
			
			// 检查平台，使用合适的分享方法
			// #ifdef MP-WEIXIN
			return uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			// #endif
			
			// #ifdef H5 || APP-PLUS
			// 生成分享码
			this.generateShareQRCode(shareInfo);
			// #endif
		},
		
		// 生成分享二维码
		generateShareQRCode(shareInfo) {
			uni.showLoading({
				title: '生成分享码中...'
			});
			
			// 这里简化处理，实际开发中可以使用服务端接口生成二维码
			setTimeout(() => {
				uni.hideLoading();
				
				// 显示分享提示
				uni.showModal({
					title: '分享邀请码',
					content: `邀请码: ${shareInfo.roomCode}\n请将此邀请码分享给好友`,
					showCancel: true,
					confirmText: '复制邀请码',
					success: (res) => {
						if (res.confirm) {
							// 复制邀请码到剪贴板
							uni.setClipboardData({
								data: shareInfo.roomCode,
								success: () => {
									uni.showToast({
										title: '邀请码已复制',
										icon: 'success'
									});
								}
							});
						}
					}
				});
			}, 800);
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack();
		}
	}
}
</script>

<style>
page {
	background-color: #f8f3ff;
	height: 100%;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.room-detail-container {
	padding: 15px;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	position: relative;
	padding-top: 60px; /* 为返回按钮留出空间 */
}

/* 返回按钮 */
.back-button {
	position: absolute;
	top: 15px;
	right: 15px;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #8e9eff;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 8px rgba(138, 158, 239, 0.4);
	z-index: 10;
}

.back-button:active {
	transform: scale(0.95);
	background: #a6c0fe;
}

.back-icon {
	font-size: 20px;
	color: white;
	font-weight: bold;
}

/* 房间信息头部 */
.room-header {
	background-color: #fff;
	border-radius: 16px;
	padding: 20px;
	margin-bottom: 15px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	margin-top: 60px; /* 为顶部元素留出空间 */
}

.room-info-section {
	margin-bottom: 20px;
}

.room-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.title-text {
	font-size: 22px;
	font-weight: bold;
	color: #333;
	margin-top: 10px;
}

.room-status {
	font-size: 13px;
	color: #fff;
	background-color: #65dfa9;
	padding: 4px 10px;
	border-radius: 15px;
	margin-left: auto;
}

.status-active {
	color: #fff;
	background-color: #65dfa9;
}

.room-tags {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 12px;
}

.room-tag {
	font-size: 12px;
	color: #8a9eef;
	background-color: rgba(166, 192, 254, 0.1);
	padding: 4px 8px;
	border-radius: 10px;
	margin-right: 8px;
	margin-bottom: 8px;
}

.room-stats {
	display: flex;
	background-color: #f9f6ff;
	border-radius: 12px;
	padding: 10px;
	flex-wrap: wrap;
}

.stat-item {
	display: flex;
	align-items: center;
	margin-right: 15px;
	margin-bottom: 8px;
}

.stat-icon {
	font-size: 16px;
	margin-right: 5px;
}

.stat-value {
	font-size: 13px;
	color: #666;
}

.room-actions {
	display: flex;
	gap: 10px;
}

.action-btn {
	flex: 1;
	height: 40px;
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 15px;
	font-weight: 500;
	border: none;
}

.join-btn {
	background: linear-gradient(to right, #a6c0fe, #8e9eff);
	color: white;
}

.share-btn {
	background-color: #f5f5f5;
	color: #666;
}

.share-btn:active {
	background-color: #eaeaea;
}

/* 学习者列表 */
.members-section {
	background-color: #fff;
	border-radius: 16px;
	padding: 20px;
	margin-bottom: 15px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-title {
	font-size: 16px;
	font-weight: 600;
	color: #333;
	margin-bottom: 15px;
	border-left: 4px solid #a6c0fe;
	padding-left: 10px;
}

.members-list {
	white-space: nowrap;
	margin: 0 -5px;
}

.member-item {
	display: inline-block;
	margin-right: 15px;
	position: relative;
	text-align: center;
}

.member-avatar {
	width: 60px;
	height: 60px;
	border-radius: 30px;
	margin-bottom: 6px;
	border: 2px solid #f0f0f0;
}

.member-name {
	font-size: 13px;
	color: #666;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 60px;
	display: block;
}

.member-badge {
	position: absolute;
	top: 0;
	right: 0;
	background-color: #a6c0fe;
	color: white;
	font-size: 10px;
	padding: 2px 5px;
	border-radius: 8px;
}

/* 学习规则 */
.rules-section {
	background-color: #fff;
	border-radius: 16px;
	padding: 20px;
	margin-bottom: 15px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.rule-list {
	padding: 5px;
}

.rule-item {
	display: flex;
	margin-bottom: 12px;
	padding-bottom: 12px;
	border-bottom: 1px solid #f5f5f5;
}

.rule-item:last-child {
	margin-bottom: 0;
	padding-bottom: 0;
	border-bottom: none;
}

.rule-number {
	color: #a6c0fe;
	font-weight: bold;
	margin-right: 10px;
	min-width: 20px;
}

.rule-text {
	color: #555;
	flex: 1;
	line-height: 1.5;
	font-size: 14px;
}

/* 学习记录 */
.records-section {
	background-color: #fff;
	border-radius: 16px;
	padding: 20px;
	margin-bottom: 60px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.record-list {
	padding: 5px;
}

.record-item {
	display: flex;
	justify-content: space-between;
	padding: 12px 0;
	border-bottom: 1px solid #f5f5f5;
}

.record-item:last-child {
	border-bottom: none;
}

.record-date {
	color: #333;
	font-weight: 500;
}

.record-members, .record-duration {
	color: #666;
	font-size: 13px;
}

.empty-records {
	text-align: center;
	padding: 30px 0;
	color: #999;
}

/* 底部按钮 */
.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: white;
	padding: 15px;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
	z-index: 100;
}

.primary-btn {
	width: 100%;
	height: 44px;
	border-radius: 22px;
	background: linear-gradient(90deg, #a6c0fe, #c2a8fd);
	color: white;
	font-size: 16px;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
}

.primary-btn:active {
	opacity: 0.9;
	transform: scale(0.98);
}
</style>