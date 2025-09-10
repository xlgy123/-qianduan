<template>
	<view class="create-post-container">
		<view class="header">
			<view class="back-button" @click="goBack">
				<text class="back-icon">←</text>
			</view>
			<text class="header-title">发布内容</text>
			<view class="publish-button" @click="publishPost" :class="{ 'disabled': !canPublish }">
				<text class="publish-text">发布</text>
			</view>
		</view>
		
		<view class="post-form">
			<view class="post-content-area">
				<textarea 
					class="content-input" 
					v-model="postContent" 
					placeholder="分享你的学习心得、经验或问题..." 
					maxlength="500" 
					auto-height
				/>
				<view class="content-counter">{{postContent.length}}/500</view>
			</view>
			
			<view class="post-images" v-if="postImages.length > 0">
				<view class="image-item" v-for="(image, index) in postImages" :key="index">
					<image class="preview-image" :src="image" mode="aspectFill" />
					<view class="delete-image" @click="removeImage(index)">
						<text class="delete-icon">×</text>
					</view>
				</view>
			</view>
			
			<view class="post-controls">
				<view class="control-item" @click="chooseImage">
					<text class="control-icon">🖼️</text>
					<text class="control-text">图片</text>
				</view>
				<view class="control-item" @click="showTagsSelector = true">
					<text class="control-icon">#</text>
					<text class="control-text">话题</text>
				</view>
			</view>
			
			<view class="selected-tags" v-if="selectedTags.length > 0">
				<view class="tag-item" v-for="(tag, index) in selectedTags" :key="index">
					<text class="tag-text">#{{tag}}</text>
					<text class="remove-tag" @click="removeTag(index)">×</text>
				</view>
			</view>
		</view>
		
		<!-- 话题选择器弹窗 -->
		<view class="tags-selector" v-if="showTagsSelector">
			<view class="tags-overlay" @click="showTagsSelector = false"></view>
			<view class="tags-panel">
				<view class="tags-header">
					<text class="tags-title">选择话题</text>
					<text class="tags-close" @click="showTagsSelector = false">×</text>
				</view>
				<view class="tags-list">
					<view 
						class="tag-option" 
						v-for="(tag, index) in availableTags" 
						:key="index"
						:class="{ 'selected': selectedTags.includes(tag) }"
						@click="toggleTag(tag)"
					>
						<text class="tag-option-text">#{{tag}}</text>
					</view>
				</view>
				<view class="tags-footer">
					<button class="confirm-button" @click="confirmTags">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { communityService } from '@/modules/community/services/community.service';
import { userStore } from '@/store/userStore';

export default {
	data() {
		return {
			postContent: '',
			postImages: [],
			selectedTags: [],
			availableTags: [
				'备考心得', '考研交流', '高效学习', '读书分享', '科目互助',
				'自习心得', '高效学习', '考试技巧', '自律', '学习方法'
			],
			showTagsSelector: false,
			userInfo: null
		}
	},
	computed: {
		canPublish() {
			return this.postContent.trim().length > 0;
		}
	},
	onLoad() {
		// 获取用户信息
		this.userInfo = userStore.getState();
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		
		// 发布帖子
		async publishPost() {
			if (!this.canPublish) {
				return;
			}
			
			uni.showLoading({
				title: '发布中...'
			});
			
			try {
				console.log(`开始发布帖子，内容长度: ${this.postContent.length}, 图片数量: ${this.postImages.length}, 标签数量: ${this.selectedTags.length}`);
				
				// 检查基础数据
				if (!this.userInfo) {
					this.userInfo = userStore.getState();
					console.log('重新获取用户信息');
				}
				
				// 准备帖子数据
				const postData = {
					username: this.userInfo.username || '用户',
					avatar: this.userInfo.avatar || '/static/default-avatar.png',
					content: this.postContent,
					images: this.filterSafeImages(this.postImages),
					tags: this.selectedTags
				};
				
				// 调用服务发布帖子
				const result = await communityService.createPost(postData);
				
				if (result) {
					console.log('帖子发布成功:', result.id);
					uni.hideLoading();
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					});
					
					// 清空表单
					this.postContent = '';
					this.postImages = [];
					this.selectedTags = [];
					
					// 发布成功后返回上一页
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} else {
					throw new Error('帖子发布失败，服务返回空结果');
				}
			} catch (error) {
				uni.hideLoading();
				uni.showToast({
					title: '发布失败，请重试',
					icon: 'none'
				});
				console.error('发布帖子失败:', error);
			}
		},
		
		// 过滤并确保图片数据安全有效
		filterSafeImages(images) {
			if (!images || !images.length) return [];
			
			console.log(`过滤前图片数量: ${images.length}`);
			
			// 过滤出有效的图片链接
			const safeImages = images.filter(img => {
				// 检查图片是否为有效的Base64或者本地路径
				const isBase64 = typeof img === 'string' && img.startsWith('data:image');
				const isLocalPath = typeof img === 'string' && (img.startsWith('/') || img.startsWith('file://'));
				
				if (!isBase64 && !isLocalPath) {
					console.warn('发现无效图片链接:', img.substring(0, 30) + '...');
				}
				
				return isBase64 || isLocalPath;
			});
			
			console.log(`过滤后图片数量: ${safeImages.length}`);
			return safeImages;
		},
		
		// 选择图片
		chooseImage() {
			if (this.postImages.length >= 9) {
				uni.showToast({
					title: '最多选择9张图片',
					icon: 'none'
				});
				return;
			}
			
			uni.chooseImage({
				count: 9 - this.postImages.length,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					try {
						// 检查当前环境
						// #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
						// App和小程序环境下，将图片转换为base64格式存储
						const tempFilePaths = res.tempFilePaths;
						const imagePromises = tempFilePaths.map(path => {
							return new Promise((resolve, reject) => {
								plus.io.resolveLocalFileSystemURL(path, (entry) => {
									entry.file((file) => {
										const reader = new plus.io.FileReader();
										reader.onloadend = function(e) {
											const base64Data = e.target.result;
											resolve(base64Data);
										};
										reader.onerror = function(e) {
											console.error('读取图片失败:', e);
											// 失败时直接使用原路径
											resolve(path);
										};
										reader.readAsDataURL(file);
									}, (error) => {
										console.error('读取文件失败:', error);
										resolve(path);
									});
								}, (error) => {
									console.error('解析文件路径失败:', error);
									resolve(path);
								});
							});
						});
						
						// 处理所有图片
						Promise.all(imagePromises)
							.then(base64Images => {
								// 添加新选择的图片
								this.postImages = [...this.postImages, ...base64Images];
							})
							.catch(err => {
								console.error('处理图片失败:', err);
								// 出错时直接使用临时路径
								this.postImages = [...this.postImages, ...res.tempFilePaths];
							});
						// #endif
						
						// #ifdef H5
						// H5环境下直接使用临时文件路径
						console.log('H5环境，直接使用临时文件路径');
						this.postImages = [...this.postImages, ...res.tempFilePaths];
						// #endif
					} catch (e) {
						console.error('选择图片处理失败:', e);
						// 降级处理，直接使用临时路径
						this.postImages = [...this.postImages, ...res.tempFilePaths];
					}
				}
			});
		},
		
		// 移除图片
		removeImage(index) {
			this.postImages.splice(index, 1);
		},
		
		// 选择/取消选择标签
		toggleTag(tag) {
			const index = this.selectedTags.indexOf(tag);
			if (index > -1) {
				// 已选择，取消选择
				this.selectedTags.splice(index, 1);
			} else {
				// 未选择，添加到已选标签
				if (this.selectedTags.length < 3) {
					this.selectedTags.push(tag);
				} else {
					uni.showToast({
						title: '最多选择3个话题',
						icon: 'none'
					});
				}
			}
		},
		
		// 移除已选标签
		removeTag(index) {
			this.selectedTags.splice(index, 1);
		},
		
		// 确认标签选择
		confirmTags() {
			this.showTagsSelector = false;
		}
	}
}
</script>

<style>
page {
	background-color: #f8f3ff;
	min-height: 100%;
}

.create-post-container {
	display: flex;
	flex-direction: column;
	padding-top: 10px;
	height: 100vh;
	box-sizing: border-box;
}

.header {
	display: flex;
	align-items: center;
	padding: 15px;
	position: relative;
	border-bottom: 1px solid #f0f0f0;
}

.back-button {
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	font-size: 24px;
	color: #333;
}

.header-title {
	flex: 1;
	text-align: center;
	font-size: 18px;
	font-weight: bold;
	color: #333;
}

.publish-button {
	padding: 8px 15px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	border-radius: 20px;
}

.publish-text {
	color: #fff;
	font-size: 14px;
	font-weight: 500;
}

.disabled {
	opacity: 0.6;
}

.post-form {
	flex: 1;
	padding: 15px;
	background-color: #fff;
}

.post-content-area {
	position: relative;
	margin-bottom: 15px;
}

.content-input {
	width: 100%;
	min-height: 150px;
	padding: 10px 0;
	font-size: 16px;
	line-height: 1.5;
	color: #333;
}

.content-counter {
	position: absolute;
	bottom: 5px;
	right: 5px;
	font-size: 12px;
	color: #999;
}

.post-images {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 15px;
}

.image-item {
	width: 31%;
	height: 100px;
	margin-right: 3%;
	margin-bottom: 10px;
	position: relative;
	border-radius: 8px;
	overflow: hidden;
}

.image-item:nth-child(3n) {
	margin-right: 0;
}

.preview-image {
	width: 100%;
	height: 100%;
}

.delete-image {
	position: absolute;
	top: 5px;
	right: 5px;
	width: 22px;
	height: 22px;
	border-radius: 11px;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.delete-icon {
	color: #fff;
	font-size: 16px;
}

.post-controls {
	display: flex;
	border-top: 1px solid #f0f0f0;
	padding-top: 15px;
	margin-bottom: 15px;
}

.control-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px 0;
}

.control-icon {
	font-size: 20px;
	margin-right: 5px;
}

.control-text {
	font-size: 14px;
	color: #666;
}

.selected-tags {
	display: flex;
	flex-wrap: wrap;
	margin-top: 10px;
}

.tag-item {
	display: flex;
	align-items: center;
	padding: 5px 10px;
	background-color: rgba(166, 192, 254, 0.1);
	border-radius: 15px;
	margin-right: 10px;
	margin-bottom: 10px;
}

.tag-text {
	font-size: 14px;
	color: #8a9eef;
}

.remove-tag {
	margin-left: 5px;
	font-size: 16px;
	color: #8a9eef;
}

/* 话题选择器弹窗 */
.tags-selector {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
	display: flex;
	align-items: flex-end;
}

.tags-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.tags-panel {
	width: 100%;
	background-color: #fff;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	position: relative;
	z-index: 101;
	display: flex;
	flex-direction: column;
	max-height: 70vh;
}

.tags-header {
	padding: 15px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid #f0f0f0;
}

.tags-title {
	flex: 1;
	text-align: center;
	font-size: 18px;
	font-weight: bold;
	color: #333;
}

.tags-close {
	font-size: 24px;
	color: #999;
}

.tags-list {
	padding: 15px;
	display: flex;
	flex-wrap: wrap;
	overflow-y: auto;
	max-height: 50vh;
}

.tag-option {
	padding: 8px 15px;
	background-color: #f5f7fa;
	border-radius: 20px;
	margin-right: 10px;
	margin-bottom: 10px;
}

.tag-option.selected {
	background: linear-gradient(to right, rgba(166, 192, 254, 0.2), rgba(194, 168, 253, 0.2));
}

.tag-option-text {
	font-size: 14px;
	color: #666;
}

.tag-option.selected .tag-option-text {
	color: #8a9eef;
	font-weight: 500;
}

.tags-footer {
	padding: 15px;
	border-top: 1px solid #f0f0f0;
}

.confirm-button {
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	color: #fff;
	border-radius: 25px;
	height: 45px;
	line-height: 45px;
	font-size: 16px;
}
</style> 