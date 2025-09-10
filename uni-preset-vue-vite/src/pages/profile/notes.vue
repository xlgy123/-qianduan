<template>
	<swipe-detector class="full-container" :tab-index="1">
		<view class="notes-container">
			<!-- 顶部背景延伸，防止上拉露白 -->
			<view class="header-extension"></view>
			
			<!-- 可滚动内容区域，包含所有内容 -->
			<scroll-view 
				scroll-y="true" 
				class="scrollable-content full-scroll" 
				:bounce="true"
				:show-scrollbar="false"
			>
				<!-- 页面标题 -->
				<view class="page-header">
					<text class="page-title">学习笔记</text>
				</view>
				
				<!-- 笔记搜索栏 -->
				<view class="search-bar">
					<view class="search-input-container">
						<text class="search-icon">🔍</text>
						<input
							class="search-input"
							type="text"
							v-model="searchText"
							placeholder="搜索笔记..."
							@input="searchNotes"
						/>
						<button class="clear-search-btn" v-if="searchText" @click="clearSearch">✕</button>
					</view>
				</view>
				
				<!-- 笔记分类 -->
				<view class="notes-categories">
					<view 
						class="category-item" 
						v-for="category in categories" 
						:key="category.id"
						:class="{ active: currentCategory === category.id }"
						@click="changeCategory(category.id)"
					>
						<text class="category-text">{{ category.name }}</text>
						<text class="category-count">{{ getCategoryCount(category.id) }}</text>
					</view>
				</view>
				
				<!-- 笔记列表 -->
				<view class="notes-list">
					<view 
						class="note-item" 
						v-for="note in filteredNotes" 
						:key="note.id"
						:class="{ 'note-item-active': editingNoteId === note.id }"
						@click="showNote(note)"
					>
						<view class="note-header">
							<text class="note-title">{{ note.title }}</text>
							<text class="note-date">{{ formatDate(note.date) }}</text>
						</view>
						<view class="note-preview">
							<text class="note-content" v-if="note.content">{{ getShortContent(note.content) }}</text>
							<text class="note-content empty" v-else>暂无内容</text>
						</view>
						<view class="note-tags">
							<view 
								class="note-tag" 
								v-for="tag in note.tags" 
								:key="tag"
							>
								<text class="tag-text">{{ tag }}</text>
							</view>
						</view>
					</view>
					
					<!-- 空状态 -->
					<view class="empty-state" v-if="filteredNotes.length === 0">
						<view class="empty-icon">📝</view>
						<text class="empty-text">你还没有笔记</text>
						<button class="create-note-btn" @click="createNewNote">创建第一篇笔记</button>
					</view>
				</view>
				
				<!-- 浮动添加按钮 -->
				<view class="add-note-btn" @click="createNewNote">
					<text class="add-text">+</text>
				</view>
				
				<!-- 底部填充，确保能滚动到底部 -->
				<view style="height: 60px;"></view>
			</scroll-view>
			
			<!-- 笔记详情弹窗 -->
			<view class="note-modal" v-if="showNoteModal">
				<view class="note-modal-mask" @click="closeNoteModal"></view>
				<view class="note-modal-content">
					<view class="note-modal-header">
						<view class="note-actions" v-if="currentNote">
							<view class="note-action-item" @click.stop="editNote">
								<text class="note-action-icon">✏️</text>
								<text class="note-action-text">编辑</text>
							</view>
							<view class="note-action-item" @click.stop="deleteNote">
								<text class="note-action-icon">🗑️</text>
								<text class="note-action-text">删除</text>
							</view>
						</view>
						<view class="note-close" @click="closeNoteModal">×</view>
					</view>
					
					<view class="note-modal-body">
						<view class="note-detail-header">
							<view class="note-detail-title-container">
								<text class="note-detail-title">{{ currentNote.title }}</text>
								<view class="note-detail-date">{{ formatDate(currentNote.date) }}</view>
							</view>
							<view class="note-detail-tags">
								<view 
									class="note-detail-tag" 
									v-for="tag in currentNote.tags" 
									:key="tag"
								>
									<text class="tag-text">{{ tag }}</text>
								</view>
							</view>
						</view>
						
						<view class="note-detail-content">
							<view class="note-content-placeholder" v-if="!currentNote.content">
								<text class="placeholder-text">笔记内容为空</text>
							</view>
							<rich-text :nodes="parseNoteContent(currentNote.content)"></rich-text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 笔记编辑弹窗 -->
			<view class="edit-note-modal" v-if="showEditModal">
				<view class="edit-note-modal-mask" @click="closeEditModal"></view>
				<view class="edit-note-modal-content">
					<view class="edit-note-header">
						<text class="edit-note-title">{{ editingNoteId ? '编辑笔记' : '新建笔记' }}</text>
						<view class="edit-note-close" @click="closeEditModal">×</view>
					</view>
					
					<view class="edit-note-body">
						<view class="edit-form-item">
							<text class="edit-form-label">标题</text>
							<input 
								type="text" 
								class="edit-form-input" 
								v-model="editNoteData.title"
								placeholder="输入笔记标题"
							/>
						</view>
						
						<view class="edit-form-item">
							<text class="edit-form-label">标签</text>
							<view class="edit-tag-container">
								<view 
									class="edit-tag-item"
									v-for="(tag, index) in editNoteData.tags"
									:key="index"
								>
									<text class="tag-text">{{ tag }}</text>
									<text class="remove-tag" @click="removeTag(index)">×</text>
								</view>
								<input
									class="edit-tag-input"
									type="text"
									@keypress.enter="addTag"
									@blur="addTag"
									v-model="newTag"
									placeholder="+ 添加标签"
								/>
							</view>
						</view>
						
						<view class="edit-form-item">
							 <text class="edit-form-label">选择分类</text>
							 <view class="category-select">
								 <picker 
									mode="selector" 
									:range="categories.map(c => c.name)" 
									@change="changeNoteCategory"
								>
									<view class="category-picker">
										<text class="current-category">{{ currentCategoryName }}</text>
										<text class="arrow-icon">▼</text>
									</view>
								</picker>
							</view>
						</view>
						
						<view class="edit-form-item">
							<text class="edit-form-label">内容</text>
							<textarea 
								class="edit-note-content" 
								v-model="editNoteData.content"
								:placeholder="editingNoteId ? '编辑笔记内容...' : '开始输入笔记内容...'"
								:auto-focus="true"
								:fixed="true"
								@linechange="adjustTextareaHeight"
							/>
						</view>
					</view>
					
					<view class="edit-note-footer">
						<button class="edit-cancel-btn" @click="closeEditModal">取消</button>
						<button class="edit-save-btn" @click="saveNote">保存</button>
					</view>
				</view>
			</view>
			
			<!-- 底部导航栏 -->
			<view class="tab-bar-wrapper">
				<tab-bar :current="1" @tabChange="handleTabChange"></tab-bar>
			</view>
		</view>
	</swipe-detector>
</template>

<script>
import TabBar from '@/components/TabBar.vue';
import SwipeDetector from '@/components/SwipeDetector.vue';

export default {
	components: {
		TabBar,
		SwipeDetector
	},
	data() {
		return {
			searchText: '',
			showNoteModal: false,
			showEditModal: false,
			currentNote: null,
			currentCategory: 'all',
			categories: [
				{ id: 'all', name: '全部笔记' },
				{ id: 'study', name: '学习笔记' },
				{ id: 'life', name: '生活记录' },
				{ id: 'work', name: '工作笔记' },
				{ id: 'idea', name: '灵感闪现' }
			],
			notes: this.loadNotesData(),
			editingNoteId: null,
			editNoteData: {
				title: '',
				content: '',
				tags: [],
				category: 'study',
				date: new Date().toISOString()
			},
			newTag: '',
			editMode: false
		}
	},
	computed: {
		currentCategoryName() {
			const category = this.categories.find(c => c.id === this.currentCategory);
			return category ? category.name : '未分类';
		},
		filteredNotes() {
			if (this.searchText) {
				const searchTerm = this.searchText.toLowerCase();
				return this.notes.filter(note => 
					note.title.toLowerCase().includes(searchTerm) || 
					(note.content && note.content.toLowerCase().includes(searchTerm)) ||
					note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
				);
			} else {
				if (this.currentCategory === 'all') {
					return this.notes;
				} else {
					return this.notes.filter(note => note.category === this.currentCategory);
				}
			}
		}
	},
	watch: {
		notes: {
			handler(newNotes) {
				this.saveNotesData(newNotes);
			},
			deep: true
		}
	},
	methods: {
		// 加载笔记数据
		loadNotesData() {
			try {
				const notesData = uni.getStorageSync('appNotes');
				if (notesData) {
					return JSON.parse(notesData);
				}
				return [];
			} catch (e) {
				console.error('加载笔记数据失败:', e);
				return [];
			}
		},
		
		// 保存笔记数据
		saveNotesData(notes) {
			try {
				uni.setStorageSync('appNotes', JSON.stringify(notes));
			} catch (e) {
				console.error('保存笔记数据失败:', e);
			}
		},
		
		// 获取分类笔记数量
		getCategoryCount(categoryId) {
			if (categoryId === 'all') {
				return this.notes.length;
			}
			return this.notes.filter(note => note.category === categoryId).length;
		},
		
		// 切换分类
		changeCategory(categoryId) {
			this.currentCategory = categoryId;
			this.searchText = '';
		},
		
		// 搜索框清空
		clearSearch() {
			this.searchText = '';
			this.searchNotes();
		},
		
		// 搜索条件更新
		searchNotes() {
			this.$forceUpdate();
		},
		
		// 显示笔记详情
		showNote(note) {
			this.currentNote = note;
			this.showNoteModal = true;
			this.editingNoteId = null;
		},
		
		// 关闭笔记详情弹窗
		closeNoteModal() {
			this.showNoteModal = false;
			this.currentNote = null;
		},
		
		// 显示编辑笔记弹窗
		editNote() {
			this.showNoteModal = false;
			this.editingNoteId = this.currentNote.id;
			this.editNoteData = {
				...this.currentNote
			};
			this.newTag = '';
			this.showEditModal = true;
		},
		
		// 关闭编辑弹窗
		closeEditModal() {
			this.showEditModal = false;
			this.editNoteData = {
				title: '',
				content: '',
				tags: [],
				category: 'study',
				date: new Date().toISOString()
			};
			this.editingNoteId = null;
			this.newTag = '';
		},
		
		// 创建新笔记
		createNewNote() {
			this.editNoteData = {
				title: '',
				content: '',
				tags: [],
				category: 'study',
				date: new Date().toISOString()
			};
			this.editingNoteId = null;
			this.newTag = '';
			this.showEditModal = true;
		},
		
		// 删除笔记
		deleteNote() {
			uni.showModal({
				title: '删除笔记',
				content: '确定要删除这篇笔记吗？删除后将无法恢复。',
				success: (res) => {
					if (res.confirm) {
						this.notes = this.notes.filter(note => note.id !== this.currentNote.id);
						this.closeNoteModal();
						uni.showToast({
							title: '笔记已删除',
							icon: 'success'
						});
					}
				}
			});
		},
		
		// 保存笔记
		saveNote() {
			if (!this.editNoteData.title.trim()) {
				uni.showToast({
					title: '请输入笔记标题',
					icon: 'none'
				});
				return;
			}
			
			const noteId = this.editingNoteId || Date.now().toString();
			const noteIndex = this.notes.findIndex(note => note.id === noteId);
			
			if (noteIndex !== -1) {
				// 更新现有笔记
				this.notes[noteIndex] = {
					...this.editNoteData,
					id: noteId,
					date: new Date().toISOString()
				};
			} else {
				// 创建新笔记
				this.notes.push({
					...this.editNoteData,
					id: noteId,
					date: new Date().toISOString()
				});
			}
			
			this.closeEditModal();
			this.showNoteModal = false;
			this.currentNote = null;
			this.editingNoteId = null;
			this.editNoteData = {
				title: '',
				content: '',
				tags: [],
				category: 'study',
				date: new Date().toISOString()
			};
			this.newTag = '';
			
			uni.showToast({
				title: '笔记已保存',
				icon: 'success'
			});
		},
		
		// 添加标签
		addTag() {
			const tag = this.newTag.trim();
			if (tag && !this.editNoteData.tags.includes(tag)) {
				this.editNoteData.tags.push(tag);
				this.newTag = '';
			}
		},
		
		// 移除标签
		removeTag(index) {
			this.editNoteData.tags.splice(index, 1);
		},
		
		// 切换笔记分类
		changeNoteCategory(e) {
			const categoryIndex = e.detail.value;
			this.editNoteData.category = this.categories[categoryIndex].id;
		},
		
		// 格式化日期
		formatDate(dateString) {
			const date = new Date(dateString);
			return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
		},
		
		// 获取简短内容
		getShortContent(content) {
			if (!content) return '';
			return content.length > 50 ? content.substring(0, 50) + '...' : content;
		},
		
		// 解析笔记内容（支持简单的Markdown）
		parseNoteContent(content) {
			if (!content) return '';
			return content.replace(/\n/g, '<br>');
		},
		
		// 调整textarea高度
		adjustTextareaHeight() {
			const textarea = document.querySelector('.edit-note-content');
			if (textarea) {
				textarea.style.height = 'auto';
				textarea.style.height = textarea.scrollHeight + 'px';
			}
		},
		
		// 处理标签切换
		handleTabChange(data) {
			if (data && data.route) {
				this.$emit('tabChange', data.route);
			}
		}
	}
}
</script>

<style>
/* 全局容器 */
.full-container {
	width: 100%;
	height: 100%;
	position: relative;
}

.notes-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	position: relative;
	background-color: #f8f3ff;
	padding: 0;
	margin: 0;
	overflow: hidden;
	padding-bottom: 50px; /* 为底部导航栏腾出空间 */
}

/* 顶部背景延伸 */
.header-extension {
	height: 100px;
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	position: absolute;
	top: -100px;
	left: 0;
	right: 0;
	z-index: 1;
}

/* 页面标题 */
.page-header {
	text-align: center;
	padding: 20px 0;
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	color: white;
	font-size: 20px;
	font-weight: bold;
	position: relative;
	z-index: 2;
	margin-top: -1px;
	padding-top: 31px;
}

/* 搜索功能 */
.search-bar {
	padding: 15px;
	position: relative;
	z-index: 2;
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
}

.search-input-container {
	background-color: rgba(255, 255, 255, 0.85);
	border-radius: 20px;
	padding: 8px 15px;
	display: flex;
	align-items: center;
}

.search-icon {
	color: #666;
	margin-right: 10px;
}

.search-input {
	flex: 1;
	border: none;
	background: transparent;
	font-size: 14px;
}

.clear-search-btn {
	background: none;
	border: none;
	color: #999;
	padding: 0;
	margin-left: 10px;
	font-size: 12px;
}

/* 笔记分类 */
.notes-categories {
	display: flex;
	overflow-x: auto;
	padding: 10px 15px;
	background: rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(5px);
	border-radius: 20px;
	margin: 0 15px;
	position: relative;
	z-index: 3;
}

.category-item {
	padding: 8px 15px;
	border-radius: 15px;
	margin-right: 8px;
	background-color: #f0f0f0;
	font-size: 14px;
	color: #666;
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: all 0.3s;
}

.category-item.active {
	background-color: #a6c0fe;
	color: white;
	box-shadow: 0 2px 10px rgba(166, 192, 254, 0.5);
}

.category-count {
	font-size: 10px;
	margin-top: 3px;
}

/* 笔记列表 */
.notes-list {
	padding: 15px;
	flex: 1;
}

.note-item {
	background-color: white;
	border-radius: 15px;
	padding: 15px;
	margin-bottom: 15px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
	overflow: hidden;
}

.note-item-active {
	box-shadow: 0 0 0 2px #a6c0fe;
}

.note-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.note-title {
	font-size: 16px;
	font-weight: bold;
	color: #333;
}

.note-date {
	font-size: 12px;
	color: #999;
}

.note-preview {
	margin-bottom: 12px;
}

.note-content {
	font-size: 14px;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.note-content.empty {
	color: #ccc;
}

.note-tags {
	display: flex;
	flex-wrap: wrap;
}

.note-tag {
	background-color: #f0f0f0;
	border-radius: 10px;
	padding: 4px 8px;
	font-size: 12px;
	color: #666;
	margin-right: 6px;
	margin-bottom: 5px;
}

/* 空状态 */
.empty-state {
	text-align: center;
	padding: 40px 0;
	color: #ccc;
}

.empty-icon {
	font-size: 60px;
	margin-bottom: 15px;
}

.empty-text {
	font-size: 16px;
	margin-bottom: 20px;
}

.create-note-btn {
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	color: white;
	border: none;
	border-radius: 20px;
	padding: 10px 20px;
	font-size: 14px;
}

/* 浮动添加按钮 */
.add-note-btn {
	position: fixed;
	right: 20px;
	bottom: 80px;
	width: 56px;
	height: 56px;
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	border-radius: 50%;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 99;
}

.add-text {
	color: white;
	font-size: 30px;
	font-weight: bold;
}

/* 笔记详情弹窗 */
.note-modal {
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

.note-modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: -1;
}

.note-modal-content {
	width: 85%;
	max-width: 400px;
	background-color: white;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.note-modal-header {
	padding: 15px;
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.note-actions {
	display: flex;
}

.note-action-item {
	margin-right: 15px;
	display: flex;
	align-items: center;
	color: white;
	font-size: 14px;
}

.note-action-icon {
	margin-right: 5px;
}

.note-close {
	font-size: 24px;
	color: white;
}

.note-modal-body {
	padding: 20px;
}

.note-detail-header {
	margin-bottom: 15px;
	padding-bottom: 15px;
	border-bottom: 1px solid #f0f0f0;
}

.note-detail-title-container {
	margin-bottom: 10px;
}

.note-detail-title {
	font-size: 20px;
	font-weight: bold;
	color: #333;
}

.note-detail-date {
	font-size: 12px;
	color: #999;
}

.note-detail-tags {
	display: flex;
	flex-wrap: wrap;
}

.note-detail-tag {
	background-color: #f0f0f0;
	border-radius: 10px;
	padding: 4px 8px;
	font-size: 12px;
	color: #666;
	margin-right: 6px;
	margin-bottom: 5px;
}

.note-detail-content {
	min-height: 200px;
}

.note-content-placeholder {
	text-align: center;
	color: #ccc;
	padding: 20px 0;
}

.placeholder-text {
	font-size: 14px;
}

/* 笔记编辑弹窗 */
.edit-note-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.edit-note-modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: -1;
}

.edit-note-modal-content {
	width: 85%;
	max-width: 400px;
	background-color: white;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.edit-note-header {
	padding: 15px;
	background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.edit-note-title {
	font-size: 18px;
	font-weight: bold;
	color: white;
}

.edit-note-close {
	font-size: 24px;
	color: white;
}

.edit-note-body {
	padding: 20px;
}

.edit-form-item {
	margin-bottom: 20px;
}

.edit-form-label {
	font-size: 14px;
	color: #666;
	margin-bottom: 8px;
}

.edit-form-input {
	width: 100%;
	height: 40px;
	border: 1px solid #eee;
	border-radius: 10px;
	padding: 0 15px;
	font-size: 14px;
}

.edit-tag-container {
	display: flex;
	flex-wrap: wrap;
	border: 1px solid #eee;
	border-radius: 10px;
	padding: 10px;
}

.edit-tag-item {
	background-color: #f0f0f0;
	border-radius: 10px;
	padding: 4px 10px;
	font-size: 12px;
	color: #666;
	margin-right: 8px;
	margin-bottom: 8px;
	display: flex;
	align-items: center;
}

.remove-tag {
	margin-left: 5px;
	color: #999;
	font-size: 14px;
}

.edit-tag-input {
	border: none;
	background: transparent;
	width: 100%;
	margin-top: 5px;
	font-size: 12px;
}

.category-select {
	width: 100%;
}

.category-picker {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	background-color: #f5f5f5;
	border-radius: 10px;
}

.current-category {
	flex: 1;
}

.arrow-icon {
	color: #999;
}

.edit-note-content {
	width: 100%;
	border: 1px solid #eee;
	border-radius: 10px;
	padding: 15px;
	font-size: 14px;
	line-height: 1.6;
	min-height: 200px;
	box-sizing: border-box;
	background-color: #f9f9f9;
}

.edit-note-footer {
	display: flex;
	padding: 10px 20px 20px;
}

.edit-cancel-btn, .edit-save-btn {
	flex: 1;
	height: 40px;
	line-height: 40px;
	text-align: center;
	border-radius: 10px;
	margin: 0 5px;
	font-size: 14px;
}

.edit-cancel-btn {
	background-color: #f0f0f0;
	color: #666;
}

.edit-save-btn {
	background: linear-gradient(to right, #a6c0fe, #c2a8fd);
	color: white;
}

/* 底部导航栏容器 */
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
	-webkit-overflow-scrolling: touch;
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