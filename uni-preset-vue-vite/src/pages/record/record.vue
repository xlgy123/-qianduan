<!-- <template>
	<view class="record-container">
		<view class="total-time-card">
			<text class="card-title">累计学习时长</text>
			<text class="time-text">25小时36分钟</text>
		</view>
		
		<view class="section-title">学习记录</view>
		
		<view class="record-list">
			<view class="record-item" v-for="(item, index) in records" :key="index">
				<view class="record-info">
					<text class="record-name">{{item.name}}</text>
					<text class="record-time">{{item.time}}</text>
				</view>
				<text class="record-date">{{item.date}}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			records: [
				{
					name: '高数自习',
					time: '02:30:00',
					date: '2023-05-18'
				},
				{
					name: '英语阅读',
					time: '01:45:20',
					date: '2023-05-17'
				},
				{
					name: '物理实验',
					time: '03:10:05',
					date: '2023-05-16'
				},
				{
					name: '程序设计',
					time: '04:20:15',
					date: '2023-05-15'
				}
			]
		}
	},
	methods: {
		
	}
}
</script>

<style>
page {
	background-color: #f8f8f8;
}

.record-container {
	padding: 20px;
}

.total-time-card {
	background: linear-gradient(135deg, #a6c0fe 0%, #c2a8fd 100%);
	border-radius: 15px;
	padding: 25px;
	margin-bottom: 30px;
	box-shadow: 0 5px 15px rgba(166, 192, 254, 0.3);
}

.card-title {
	color: rgba(255, 255, 255, 0.9);
	font-size: 16px;
	display: block;
	margin-bottom: 10px;
}

.time-text {
	color: #fff;
	font-size: 28px;
	font-weight: bold;
	display: block;
}

.section-title {
	font-size: 18px;
	font-weight: 600;
	color: #333;
	margin-bottom: 20px;
}

.record-list {
	background-color: #fff;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.record-item {
	padding: 20px;
	border-bottom: 1px solid #f0f0f0;
}

.record-item:last-child {
	border-bottom: none;
}

.record-info {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
}

.record-name {
	font-size: 16px;
	font-weight: 500;
	color: #333;
}

.record-time {
	font-size: 16px;
	color: #a6c0fe;
	font-weight: 500;
}

.record-date {
	font-size: 14px;
	color: #999;
}
</style>  -->