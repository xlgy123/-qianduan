<template>
    <view class="profile-container">
        <view class="header-background"></view>
        <!-- 顶部状态栏 -->
        <view 
            :class="['page-overlay', showMenu ? 'show' : '']" 
            @click="closeMenu"
        ></view>
        <view class="status-bar">
            <view class="left-status"></view>
            <view class="right-status">
                <view class="status-item">
                    <text class="status-icon">👁️</text>
                    <text class="status-count">1访客</text>
                </view>
                <view class="menu-button" @click="toggleMenu">
                    <text class="menu-icon">☰</text>
                </view>
            </view>
        </view>
        
        <!-- 主内容区域 -->
        <view class="main-content"@click="closeMenuIfOutside">
            <!-- 可滚动内容区域 -->
            <view class="scrollable-content">
                
                
                <!-- 用户信息面板 -->
                <view class="user-info-panel">
                    <!-- 用户卡片 -->
                    <view class="user-card">
                        <image class="avatar" :src="userInfo.avatar || '/src/static/avatar/default-avatar.png'" mode="aspectFill"></image>
                        <view class="user-actions">
                            <view class="action-item">
                                <text class="action-icon">★</text>
                                <text class="action-text">成就</text>
                            </view>
                            <view class="action-item">
                                <text class="action-icon">👍</text>
                                <text class="action-count">0</text>
                            </view>
                        </view>
                    </view>
                    
                    <view class="user-name-container">
                        <text class="user-name">{{userInfo.username || '用户名'}}</text>
                        <text class="voice-badge">+ 声音卡片</text>
                    </view>
                    
                    <text class="user-bio">{{userInfo.bio || '个人简介'}}</text>
                    
                    <view class="user-tags">
                        <view class="tag">
                            <text class="tag-text">栀子</text>
                        </view>
                        <view class="tag">
                            <text class="tag-text">+ 0 ></text>
                        </view>
                        <view class="tag">
                            <text class="tag-text">23</text>
                        </view>
                        <view class="tag">
                            <text class="tag-text">栀子号 98870282</text>
                        </view>
                        <view class="tag">
                            <text class="tag-text">甘肃</text>
                        </view>
                    </view>
                    
                    <view class="user-stats">
                        <view class="stat">
                            <text class="stat-value">0</text>
                            <text class="stat-label">亮度</text>
                        </view>
                        <view class="stat">
                            <text class="stat-value">0</text>
                            <text class="stat-label">朋友</text>
                        </view>
                        <view class="stat">
                            <text class="stat-value">0</text>
                            <text class="stat-label">比心</text>
                        </view>
                        <view class="stat">
                            <text class="stat-value">0</text>
                            <text class="stat-label">被比心</text>
                        </view>
                    </view>
                    
                    <view class="user-actions-panel">
                        <view class="action-button" @click="goToEditProfile">
                            <text class="action-button-text">完善资料</text>
                        </view>
                        <view class="vip-button">
                            <text class="vip-text">添加朋友</text>
                        </view>
                    </view>
                </view>
                
                <view class="tab-switcher">
                    <view class="tab">
                        <text class="tab-text">动态</text>
                    </view>
                    <view class="tab active">
                        <text class="tab-text">我的</text>
                    </view>
                </view>
                
                <view class="content-tabs">
                    <view class="content-tab">
                        <text class="content-tab-text">看过</text>
                    </view>
                    <view class="content-tab">
                        <text class="content-tab-text">收藏</text>
                    </view>
                    <view class="content-tab">
                        <text class="content-tab-text">创建的自习室</text>
                    </view>
                    <view class="content-tab">
                        <text class="content-tab-text">加入的自习室</text>
                    </view>
                </view> 
                
                <!-- 空内容提示 -->
                <view class="empty-content">
                    <image class="empty-icon" src="/src/static/avatar/avatar1.png" mode="aspectFit"></image>
                    <text class="empty-text">空空如也</text>
                </view>
            </view>
        </view>
        
        <!-- 右侧菜单 -->
        <view :class="['side-menu', showMenu ? 'show' : '']">
            <view class="menu-item" @click="goToStudyStatistics">
                <view class="menu-icon">📊</view>
                <text class="menu-text">学习统计</text>
            </view>
            <view class="menu-item" @click="goToStudyPlan">
                <view class="menu-icon">📝</view>
                <text class="menu-text">学习计划</text>
            </view>
            <view class="menu-item" @click="showGoalModal">
                <view class="menu-icon">🎯</view>
                <text class="menu-text">学习目标</text>
            </view>
            <view class="menu-item" @click="goToStudyMedal">
                <view class="menu-icon">🏅</view>
                <text class="menu-text">我的勋章</text>
            </view>
            <view class="menu-item" @click="goToNotes">
                <view class="menu-icon">📓</view>
                <text class="menu-text">学习笔记</text>
            </view>
            <view class="menu-item" @click="goToToDoList">
                <view class="menu-icon">✅</view>
                <text class="menu-text">待办清单</text>
            </view>
            <view class="menu-item" @click="goToTomatoClock">
                <view class="menu-icon">⏰</view>
                <text class="menu-text">番茄钟</text>
            </view>
            <view class="menu-item" @click="goToAIAnswer">
                <view class="menu-icon">🤖</view>
                <text class="menu-text">AI问答</text>
            </view>
            <view class="menu-item" @click="goToMessageNotification">
                <view class="menu-icon">🔔</view>
                <text class="menu-text">消息通知</text>
            </view>
            <view class="menu-item" @click="goToSettings">
                <view class="menu-icon">⚙️</view>
                <text class="menu-text">设置</text>
            </view>
            <view class="menu-item" @click="handleLogout">
                <view class="menu-icon">🚪</view>
                <text class="menu-text">退出登录</text>
            </view>
        </view>
        
        <!-- 底部导航栏 -->
        <tab-bar :current="4" ref="tabBar" @tabChange="handleTabChange"></tab-bar>
    </view>
</template>

<script>
import TabBar from '@/components/TabBar.vue';
import { userStore } from '@/store/userStore';

export default {
    components: {
        TabBar
    },
    data() {
        return {
            userInfo: {
                avatar: '/src/static/avatar/avatar1.png',
                username: '学习达人',
                bio: '萌新一枚，刚来微光，欢迎你找我聊天~',
            },
            showMenu: false,
        };
    },
    onLoad() {
        this.initTabBar();
    },
    onShow() {
        this.initTabBar();
    },
    onUnload() {
        this.showMenu = false;
    },
    methods: {
        initTabBar() {
            this.$refs.tabBar && this.$refs.tabBar.initCurrentTab();
        },
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        closeMenu() {
            this.showMenu = false;
        },
        closeMenuIfOutside(event) {
            // 检查点击的目标是否在侧边菜单内部
            const sideMenu = event.currentTarget.querySelector('.side-menu');
            if (!sideMenu || !sideMenu.contains(event.target)) {
                this.closeMenu();
            }
        },
        switchTab(tabName) {
            this.showMenu = false;
            this.navigateToPage(tabName);
        },
        navigateToPage(tabName) {
            this.showMenu = false;
            switch(tabName) {
                case 'home':
                    uni.switchTab({
                        url: '/pages/home/home'
                    });
                    break;
                case 'community':
                    uni.switchTab({
                        url: '/pages/community/community'
                    });
                    break;
                case 'friends':
                    uni.switchTab({
                        url: '/pages/friends/friends'
                    });
                    break;
                case 'messages':
                    uni.switchTab({
                        url: '/pages/messages/messages'
                    });
                    break;
                case 'profile':
                    uni.switchTab({
                        url: '/pages/profile/profile'
                    });
                    break;
                case 'statistics':
                    uni.navigateTo({
                        url: '/pages/profile/study-statistics'
                    });
                    break;
                case 'plan':
                    uni.navigateTo({
                        url: '/pages/profile/study-plan'
                    });
                    break;
                case 'goals':
                    uni.navigateTo({
                        url: '/pages/profile/goals'
                    });
                    break;
                case 'medal':
                    uni.navigateTo({
                        url: '/pages/profile/study-medal'
                    });
                    break;
                case 'notes':
                    uni.navigateTo({
                        url: '/pages/profile/notes'
                    });
                    break;
                case 'todo':
                    uni.navigateTo({
                        url: '/pages/profile/to-do-list'
                    });
                    break;
                case 'tomato':
                    uni.navigateTo({
                        url: '/pages/profile/tomato-clock'
                    });
                    break;
                case 'ai':
                    uni.navigateTo({
                        url: '/pages/profile/ai-answer'
                    });
                    break;
                case 'editProfile':
                    uni.navigateTo({
                        url: '/pages/profile/edit-profile'
                    });
                    break;
                case 'notifications':
                    uni.navigateTo({
                        url: '/pages/profile/message-notification'
                    });
                    break;
                case 'settings':
                    uni.navigateTo({
                        url: '/pages/profile/settings'
                    });
                    break;
                default:
                    break;
            }
        },
        goToStudyStatistics() {
            this.navigateToPage('statistics');
        },
        goToStudyPlan() {
            this.navigateToPage('plan');
        },
        goToStudyMedal() {
            this.navigateToPage('medal');
        },
        goToNotes() {
            this.navigateToPage('notes');
        },
        goToToDoList() {
            this.navigateToPage('todo');
        },
        goToTomatoClock() {
            this.navigateToPage('tomato');
        },
        goToAIAnswer() {
            this.navigateToPage('ai');
        },
        goToEditProfile() {
            this.navigateToPage('editProfile');
        },
        goToMessageNotification() {
            this.navigateToPage('notifications');
        },
        showGoalModal() {
            this.navigateToPage('goals');
        },
        goToSettings() {
            this.navigateToPage('settings');
        },
        handleLogout() {
            uni.showModal({
                title: '退出登录',
                content: '确定要退出登录吗？',
                success: (res) => {
                    if (res.confirm) {
                        // 使用userStore的logout方法
                        userStore.logout();
                        
                        uni.showToast({
                            title: '已退出登录',
                            icon: 'success'
                        });
                        setTimeout(() => {
                            uni.reLaunch({
                                url: '/pages/login/login'
                            });
                        }, 1000);
                    }
                }
            });
        },
        handleTabChange(data) {
            if (data && data.index !== undefined) {
                this.switchTab(data.index);
            }
        }
    }
};
</script>

<style>
.profile-container {
  width: 100%;
  min-height: 100vh;
  background: #f8f3ff; /* 设置背景为白色 */
  position: relative;
  overflow: hidden;
  padding-bottom: 70px; /* 确保内容区域与底部导航栏不重叠 */
}

.profile-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e6e9ff 100%);
  z-index: -1;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  position: absolute; /* 修改为绝对定位 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 10; /* 确保状态栏高于主内容区域 */
  background-color: transparent; /* 状态栏完全透明 */
  box-shadow: none; /* 移除阴影 */
}
/* 页面遮罩层 */
.page-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 500;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.page-overlay.show {
    opacity: 1;
    visibility: visible;
}
.main-content {
  width: 100%;
  position: relative;
  z-index: 5; /* 确保主内容区域高于状态栏 */
  background-color: #f8f3ff; /* 确保主内容区域背景为白色 */
}

.left-status, .right-status {
    display: flex;
    align-items: center;
}

.status-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    background-color: rgba(100, 70, 240, 0.2);
    border-radius: 20px;
    padding: 5px 15px;
}

.status-icon {
    font-size: 20px;
    margin-right: 5px;
    color: #555;
}

.status-count {
    color: #555;
    font-size: 14px;
}

.menu-button {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: rgba(100, 70, 240, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    position: relative;
}

.menu-icon {
    font-size: 20px;
    color: #555;
}

.menu-button::after {
    content: '';
    position: absolute;
    top: -5px;
    right: -5px;
    width: 10px;
    height: 10px;
    background-color: #ff5252;
    border-radius: 50%;
}

.main-content {
    width: 100%;
    position: relative;
    z-index: 5;
}

/* 可滚动内容区域 */
.scrollable-content {
    width: 100%;
    background-color: #f8f3ff;
    border-radius: 20px 20px 0 0;
    padding: 100px 20px 20px; /* 增加顶部内边距 */
    margin-top: 25px;
    max-height: calc(150vh - 100px);
    overflow-y: auto;
    box-sizing: border-box;
    position: relative;
}

/* 背景图 */
.header-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 150px; /* 设置背景图片的高度 */
    background-image: url('/src/static/images/000.png'); /* 设置背景图片路径 */
    background-size: cover;
    background-position: center;
    z-index: -1; /* 确保背景图片在其他内容之下 */
    opacity: 1; /* 确保透明度为1 */
}

/* 用户信息面板 */
.user-info-panel {
    background-color: #ffffff;
    border-radius: 15px;
    margin-bottom: 20px;
    padding: 20px;
    position: relative;
    z-index: 3; /* 确保头像在背景图上方 */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

/* 用户卡片 */
.user-card {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid rgba(100, 70, 240, 0.3);
    position: absolute;
    top: -40px; /* 头像重叠背景图 */
    left: 20px;
}

.user-actions {
    margin-left: auto;
    display: flex;
    position: relative;
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(100, 70, 240, 0.2);
    border-radius: 20px;
    padding: 5px 10px;
    margin-left: 15px;
}

.action-icon {
    font-size: 18px;
    color: #555;
}

.action-text, .action-count {
    color: #555;
    font-size: 12px;
    margin-top: 3px;
}

.user-name-container {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.user-name {
    color: #333;
    font-size: 20px;
    font-weight: bold;
}

.voice-badge {
    background-color: rgba(100, 70, 240, 0.2);
    border-radius: 10px;
    padding: 2px 10px;
    font-size: 12px;
    color: #555;
    margin-left: 10px;
}

.user-bio {
    color: #666;
    font-size: 14px;
    margin: 10px 0;
    line-height: 1.4;
}

.user-tags {
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;
}

.tag {
    background-color: rgba(100, 70, 240, 0.15);
    border-radius: 15px;
    padding: 5px 12px;
    margin-right: 8px;
    margin-bottom: 8px;
}

.tag-text {
    color: #555;
    font-size: 12px;
}

.user-stats {
    display: flex;
    margin: 15px 0;
}

.stat {
    margin-right: 20px;
}

.stat-value {
    color: #333;
    font-size: 16px;
    font-weight: bold;
}

.stat-label {
    color: #666;
    font-size: 12px;
}

.user-actions-panel {
    display: flex;
    margin-top: 15px;
}

.action-button {
    flex: 1;
    background-color: rgba(100, 70, 240, 0.15);
    border-radius: 20px;
    padding: 12px 0;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.action-button-text {
    color: #555;
    font-size: 14px;
}

.vip-button {
    flex: 1;
    background: linear-gradient(90deg, #a6c0fe, #c2a8fd);
    border-radius: 20px;
    padding: 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.vip-text {
    color: white;
    font-size: 14px;
}

/* 标签切换器 */
.tab-switcher {
    display: flex;
    background-color: #f8f3ff;
    border-radius: 15px;
    margin: 20px 0;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.tab {
    flex: 1;
    padding: 15px 0;
    text-align: center;
    background-color: #ffffff;
    cursor: pointer;
}

.tab-text {
    color: #666;
    font-size: 14px;
}

.tab.active {
    background-color: #ffffff;
}

.tab.active .tab-text {
    color: #333;
    font-weight: bold;
}

/* 内容标签 */
.content-tabs {
    display: flex;
    background-color:#f8f3ff;
    border-radius: 15px;
    margin: 15px 0;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.content-tab {
    flex: 1;
    padding: 10px 0;
    text-align: center;
    background-color: #ffffff;
    cursor: pointer;
}

.content-tab-text {
    color: #666;
    font-size: 14px;
}

.content-tab:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.05);
}

/* 空内容提示 */
.empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
}

.empty-icon {
    width: 100px;
    height: 100px;
    margin-bottom: 15px;
}

.empty-text {
    color: #999;
    font-size: 14px;
}

/* 右侧菜单容器 */
.side-menu {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100%;
    width: 300px;
    max-width: 80%;
    background-color: #fff;
    border-radius: 15px 0 0 15px;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
    z-index: 600;
    transition: right 0.3s ease;
    overflow-y: auto; /* 添加垂直滚动 */
    overflow-x: hidden;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
}

/* 菜单项分组 */
.menu-group {
    margin-bottom: 15px;
}

.menu-group-title {
    color: #aaa;
    font-size: 12px;
    margin-bottom: 8px;
    padding: 0 20px;
}

/* 菜单项 */
.menu-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    transition: background-color 0.2s;
    border-radius: 8px;
}

.menu-item:hover {
    background-color: rgba(100, 70, 240, 0.05);
}

.menu-item.active {
    background-color: rgba(100, 70, 240, 0.1);
}

.menu-icon {
    font-size: 20px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5%;
    color: #555;
}

.menu-text {
    color: #555;
    font-size: 16px;
}

/* 分隔线 */
.menu-divider {
    height: 1px;
    background-color: rgba(0, 0, 0, 0.05);
    margin: 10px 20px;
}

/* 菜单显示状态 */
.side-menu.show {
    right: 0;
}

/* 响应式设计 */
@media (max-width: 768px) { /* 小屏幕设备 */
    .side-menu {
        width: 80%; /* 小屏幕下菜单宽度占80% */
    }
    
    .menu-item {
        padding: 12px 0; /* 调整菜单项间距 */
    }
}

@media (min-width: 769px) { /* 大屏幕设备 */
    .side-menu {
        width: 300px; /* 大屏幕下固定宽度 */
        max-width: 40%; /* 设置最大宽度 */
    }
    
    .menu-item {
        padding: 18px 0; /* 调整菜单项间距 */
    }
}

@media (min-width: 1200px) { /* 超大屏幕设备 */
    .side-menu {
        width: 350px; /* 超大屏幕下固定宽度 */
        max-width: 30%; /* 设置最大宽度 */
    }
}
</style>