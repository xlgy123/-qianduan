<template>
  <swipe-detector class="full-container" :tab-index="3">
    <view class="todo-container">
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
          <view class="stats-row">
            <view class="todo-stat-item">
              <text class="todo-stat-value">{{totalTodos}}</text>
              <text class="todo-stat-label">总任务</text>
            </view>
            <view class="todo-stat-item">
              <text class="todo-stat-value">{{completedTodos}}</text>
              <text class="todo-stat-label">已完成</text>
            </view>
            <view class="todo-stat-item">
              <text class="todo-stat-value">{{pendingTodos}}</text>
              <text class="todo-stat-label">待完成</text>
            </view>
            <view class="todo-stat-item">
              <text class="todo-stat-value">{{completionRate}}%</text>
              <text class="todo-stat-label">完成率</text>
            </view>
          </view>
        </view>
        
        <!-- 添加任务 -->
        <view class="add-todo-section">
          <view class="add-todo-input-container">
            <input 
              type="text" 
              v-model="newTodo.text" 
              placeholder="添加新任务..." 
              @confirm="addTodo"
              confirm-type="done"
            />
            <button class="add-todo-button" @click="addTodo">添加</button>
          </view>
        </view>
        
        <!-- 任务筛选 -->
        <view class="filter-section">
          <view 
            class="filter-option" 
            :class="{ active: currentFilter === filter.value }" 
            v-for="filter in filters" 
            :key="filter.value"
            @click="currentFilter = filter.value"
          >
            {{ filter.label }}
          </view>
        </view>
        
        <!-- 任务列表 -->
        <view class="todo-list">
          <view 
            class="todo-item" 
            v-for="(todo, index) in filteredTodos" 
            :key="index"
          >
            <view class="todo-checkbox" @click="toggleTodoStatus(index)">
              <text v-if="todo.completed" class="check-icon">✓</text>
            </view>
            <view class="todo-content">
              <text :class="['todo-text', { completed: todo.completed }]">{{ todo.text }}</text>
              <text v-if="todo.dueDate" class="todo-date">截止: {{ formatDate(todo.dueDate) }}</text>
            </view>
            <view class="todo-actions">
              <view class="todo-action" @click="editTodo(index)">
                <text class="todo-action-icon">✏️</text>
              </view>
              <view class="todo-action" @click="deleteTodo(index)">
                <text class="todo-action-icon delete">🗑️</text>
              </view>
            </view>
          </view>
          
          <view v-if="filteredTodos.length === 0" class="empty-todo-list">
            <text class="empty-icon">📝</text>
            <text class="empty-text">暂无任务</text>
            <text class="empty-desc">点击上方添加新任务</text>
          </view>
        </view>
        
        <!-- 底部填充，确保能滚动到底部 -->
        <view style="height: 60px;"></view>
      </scroll-view>
      
      <!-- 编辑任务弹窗 -->
      <view class="edit-todo-modal" v-if="editingTodo !== null">
        <view class="edit-todo-mask" @click="closeEditModal"></view>
        <view class="edit-todo-content">
          <view class="edit-todo-header">
            <text class="edit-todo-title">编辑任务</text>
            <view class="edit-todo-close" @click="closeEditModal">×</view>
          </view>
          
          <view class="edit-todo-body">
            <view class="edit-todo-form-item">
              <text class="edit-todo-form-label">任务内容</text>
              <input 
                type="text" 
                class="edit-todo-form-input" 
                v-model="currentEditTodo.text" 
                placeholder="输入任务内容"
              />
            </view>
            
            <view class="edit-todo-form-item">
              <text class="edit-todo-form-label">截止日期</text>
              <picker 
                mode="date" 
                :value="currentEditTodo.dueDate || ''" 
                @change="setDueDate"
              >
                <view class="picker-value">
                  <text>{{ currentEditTodo.dueDate ? formatDate(currentEditTodo.dueDate) : '选择日期' }}</text>
                  <text class="picker-arrow">↓</text>
                </view>
              </picker>
            </view>
          </view>
          
          <view class="edit-todo-footer">
            <button class="edit-todo-cancel-btn" @click="closeEditModal">取消</button>
            <button class="edit-todo-save-btn" @click="saveEditTodo">保存</button>
          </view>
        </view>
      </view>
      
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

export default {
  components: {
    TabBar,
    SwipeDetector
  },
  data() {
    return {
      userInfo: userStore.getState(),
      newTodo: {
        text: '',
        dueDate: '',
        completed: false
      },
      todos: [],
      currentFilter: 'all',
      filters: [
        { value: 'all', label: '全部' },
        { value: 'active', label: '待办' },
        { value: 'completed', label: '已完成' }
      ],
      editingTodo: null,
      currentEditTodo: {
        text: '',
        dueDate: '',
        completed: false
      }
    };
  },
  computed: {
    totalTodos() {
      return this.todos.length;
    },
    completedTodos() {
      return this.todos.filter(todo => todo.completed).length;
    },
    pendingTodos() {
      return this.totalTodos - this.completedTodos;
    },
    completionRate() {
      return this.totalTodos === 0 ? 0 : Math.round((this.completedTodos / this.totalTodos) * 100);
    },
    filteredTodos() {
      if (this.currentFilter === 'active') {
        return this.todos.filter(todo => !todo.completed);
      } else if (this.currentFilter === 'completed') {
        return this.todos.filter(todo => todo.completed);
      }
      return this.todos;
    }
  },
  onLoad() {
    this.checkUserLogin();
    this.loadTodos();
  },
  methods: {
    checkUserLogin() {
      Navigation.checkLoginStatus();
    },
    loadTodos() {
      try {
        const todosData = uni.getStorageSync('todos');
        if (todosData) {
          this.todos = JSON.parse(todosData);
        }
      } catch (e) {
        console.error('加载任务失败:', e);
      }
    },
    saveTodos() {
      try {
        uni.setStorageSync('todos', JSON.stringify(this.todos));
      } catch (e) {
        console.error('保存任务失败:', e);
      }
    },
    addTodo() {
      if (!this.newTodo.text.trim()) {
        uni.showToast({
          title: '请输入任务内容',
          icon: 'none'
        });
        return;
      }
      
      this.todos.push({
        text: this.newTodo.text,
        dueDate: this.newTodo.dueDate,
        completed: false
      });
      
      this.saveTodos();
      this.newTodo.text = '';
      this.newTodo.dueDate = '';
      
      uni.showToast({
        title: '任务添加成功',
        icon: 'success'
      });
    },
    toggleTodoStatus(index) {
      this.todos[index].completed = !this.todos[index].completed;
      this.saveTodos();
    },
    editTodo(index) {
      this.editingTodo = index;
      this.currentEditTodo = { ...this.todos[index] };
    },
    closeEditModal() {
      this.editingTodo = null;
    },
    setDueDate(e) {
      this.currentEditTodo.dueDate = e.detail.value;
    },
    saveEditTodo() {
      if (!this.currentEditTodo.text.trim()) {
        uni.showToast({
          title: '请输入任务内容',
          icon: 'none'
        });
        return;
      }
      
      this.todos[this.editingTodo] = { ...this.currentEditTodo };
      this.saveTodos();
      this.closeEditModal();
      
      uni.showToast({
        title: '任务已更新',
        icon: 'success'
      });
    },
    deleteTodo(index) {
      uni.showModal({
        title: '删除任务',
        content: '确定要删除这个任务吗？',
        success: (res) => {
          if (res.confirm) {
            this.todos.splice(index, 1);
            this.saveTodos();
            uni.showToast({
              title: '任务已删除',
              icon: 'success'
            });
          }
        }
      });
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
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
  }
}
</script>

<style>
.full-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.todo-container {
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

/* 统计栏 */
.todo-stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.todo-stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
}

.todo-stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* 添加任务区域 */
.add-todo-section {
  padding: 15px;
  background-color: #fff;
  border-radius: 15px;
  margin: 0 15px 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.add-todo-input-container {
  display: flex;
}

.add-todo-input-container input {
  flex: 1;
  height: 44px;
  border: 1px solid #eee;
  border-radius: 22px;
  padding: 0 15px;
  font-size: 14px;
  margin-right: 10px;
}

.add-todo-button {
  height: 44px;
  background: linear-gradient(to right, #a6c0fe, #c2a8fd);
  color: white;
  border: none;
  border-radius: 22px;
  padding: 0 20px;
  font-size: 14px;
}

/* 筛选区域 */
.filter-section {
  display: flex;
  margin: 0 15px 15px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.filter-option {
  flex: 1;
  padding: 12px 0;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.filter-option.active {
  color: #a6c0fe;
  font-weight: 500;
  background-color: rgba(166, 192, 254, 0.1);
}

/* 任务列表 */
.todo-list {
  padding: 0 15px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  position: relative;
}

.todo-checkbox {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.todo-checkbox .check-icon {
  color: #a6c0fe;
  font-size: 16px;
}

.todo-content {
  flex: 1;
}

.todo-text {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
}

.todo-text.completed {
  text-decoration: line-through;
  color: #999;
}

.todo-date {
  font-size: 12px;
  color: #666;
}

.todo-actions {
  display: flex;
}

.todo-action {
  margin-left: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(245, 245, 245, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-action-icon {
  font-size: 16px;
  color: #666;
}

.todo-action-icon.delete {
  color: #ff5252;
}

/* 空任务列表 */
.empty-todo-list {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 5px;
}

.empty-desc {
  font-size: 12px;
}

/* 编辑任务弹窗 */
.edit-todo-modal {
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

.edit-todo-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.edit-todo-content {
  width: 80%;
  max-width: 350px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.edit-todo-header {
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-todo-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.edit-todo-close {
  font-size: 24px;
  color: #999;
  padding: 0 5px;
}

.edit-todo-body {
  padding: 15px;
}

.edit-todo-form-item {
  margin-bottom: 15px;
}

.edit-todo-form-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  display: block;
}

.edit-todo-form-input {
  width: 100%;
  height: 40px;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 0 15px;
  font-size: 14px;
}

.edit-todo-footer {
  display: flex;
  padding: 10px 15px 15px;
}

.edit-todo-cancel-btn, .edit-todo-save-btn {
  flex: 1;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 10px;
  margin: 0 5px;
  font-size: 14px;
}

.edit-todo-cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.edit-todo-save-btn {
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