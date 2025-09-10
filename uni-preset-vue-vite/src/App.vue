<template>
	<error-boundary>
		<loading-handler>
			<page-transition-manager class="content-container">
				<view class="content-scroll">
					<!-- 使用v-once确保router-view只被渲染一次 -->
					<router-view class="router-view-container" v-once></router-view>
				</view>
			</page-transition-manager>
		</loading-handler>
	</error-boundary>
</template>

<script>
import PageTransitionManager from './components/PageTransitionManager.vue';
import ErrorBoundary from './components/ErrorBoundary.vue';
import LoadingHandler from './components/LoadingHandler.vue';

export default {
  components: {
    PageTransitionManager,
    ErrorBoundary,
    LoadingHandler
  },
  globalData: {
    isTablet: false,
    systemInfo: null,
    statusBarHeight: 0,
    safeAreaInsets: null,
    tabPages: [
      '/pages/home/home',
      '/pages/community/community',
      '/pages/friends/friends',
      '/pages/profile/profile'
    ]
  },
  onLaunch: function () {
    console.log('App Launch');
    this.getSystemInfo();
    this.initSwipeGesture();
    this.setupErrorHandler();
  },
  onShow: function () {
    console.log('App Show');
    
    // 触发全局页面显示事件
    uni.$emit('app-show', {
      timestamp: Date.now(),
      source: 'app-lifecycle'
    });
    
    // 清除创建自习室缓存，防止冲突
    setTimeout(() => {
      try {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const currentRoute = currentPage?.route;
        
        // 不管当前在哪个页面，都触发一次模态框重置
        // 这样可以确保所有页面上的模态框状态都被正确重置
        uni.$emit('reset-modals', {
          timestamp: Date.now(),
          route: currentRoute,
          source: 'app-show'
        });
        
        console.log('已触发全局模态框重置事件');
      } catch (e) {
        console.error('重置模态框状态失败:', e);
      }
    }, 200); // 增加延迟确保页面已加载
  },
  onHide: function () {
    console.log('App Hide');
  },
  methods: {
    getSystemInfo() {
      uni.getSystemInfo({
        success: (res) => {
          const globalData = this.$options.globalData;
          globalData.statusBarHeight = res.statusBarHeight;
          globalData.safeAreaInsets = res.safeAreaInsets;
          globalData.isTablet = res.windowWidth >= 768;
          globalData.systemInfo = res;
        }
      });
    },
    
    initSwipeGesture() {
      uni.$on('swipeDirection', (data) => {
        if (!data || !data.direction) return;
        
        try {
          const pages = this.$options.globalData.tabPages;
          
          // 使用提供的fromIndex和toIndex直接切换
          if (typeof data.fromIndex !== 'undefined' && typeof data.toIndex !== 'undefined') {
            const fromIndex = data.fromIndex;
            const toIndex = data.toIndex;
            
            if (fromIndex >= 0 && toIndex >= 0 && fromIndex < pages.length && toIndex < pages.length) {
              uni.redirectTo({
                url: pages[toIndex],
                success: () => {
                  uni.$emit('tabIndexUpdate', {
                    index: toIndex,
                    path: pages[toIndex]
                  });
                }
              });
              return;
            }
          }
          
          // 根据当前路由计算目标页面
          const currentRoute = getCurrentPages()[getCurrentPages().length - 1].route;
          const currentPath = '/' + currentRoute;
          const currentIndex = pages.findIndex(path => path === currentPath);
          
          if (currentIndex === -1) return;
          
          let targetIndex = currentIndex;
          
          if (data.direction === 'left') {
            targetIndex = Math.min(currentIndex + 1, pages.length - 1);
          } else if (data.direction === 'right') {
            targetIndex = Math.max(currentIndex - 1, 0);
          }
          
          if (targetIndex !== currentIndex) {
            uni.redirectTo({
              url: pages[targetIndex],
              success: () => {
                uni.$emit('tabIndexUpdate', {
                  index: targetIndex,
                  path: pages[targetIndex]
                });
              }
            });
          }
        } catch (e) {
          console.error('处理页面滑动时出错:', e);
        }
      });
    },
    
    setupErrorHandler() {
      // 配置全局未捕获的Promise错误处理
      if (typeof window !== 'undefined') {
        window.addEventListener('unhandledrejection', event => {
          console.error('未处理的Promise错误:', event.reason);
          
          // 防止默认处理
          event.preventDefault();
          
          // 如果是网络相关错误，提示用户
          if (event.reason && (
            event.reason.message?.includes('Failed to fetch') || 
            event.reason.message?.includes('Network Error')
          )) {
            uni.showToast({
              title: '网络连接问题，请检查网络',
              icon: 'none',
              duration: 2000
            });
          }
        });
      }
      
      // 处理应用全局错误
      uni.onError(err => {
        console.error('全局错误:', err);
      });
    }
  }
}
</script>

<style>
/*每个页面公共css */
page {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  background-color: #f8f3ff;
  -webkit-overflow-scrolling: touch;
  -webkit-tap-highlight-color: transparent;
}

view, text, scroll-view, input, button {
  box-sizing: border-box;
}

button {
  margin: 0;
  padding: 0;
  line-height: 1;
}

button::after {
  border: none;
}

.content-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.content-scroll {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* 添加底部内边距，避免内容被TabBar遮挡 */
  padding-bottom: calc(56px + env(safe-area-inset-bottom));
}

/* 为不同屏幕尺寸调整底部内边距 */
@media screen and (max-width: 480px) {
  .content-scroll {
    padding-bottom: calc(52px + env(safe-area-inset-bottom));
  }
}

@media screen and (max-width: 360px) {
  .content-scroll {
    padding-bottom: calc(48px + env(safe-area-inset-bottom));
  }
}

/* 通用动画持续时间和缓动函数 */
:root {
  --transition-duration: 0.3s;
  --transition-timing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* 安全区域变量 */
  --safe-area-inset-top: 0px;
  --safe-area-inset-right: 0px;
  --safe-area-inset-bottom: 0px;
  --safe-area-inset-left: 0px;
  
  /* 颜色变量 */
  --primary-color: #8a9eef;
  --primary-gradient: linear-gradient(90deg, #a6c0fe, #c2a8fd);
  --background-color: #f8f3ff;
  --card-color: #ffffff;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #f0f0f0;
  
  /* 组件变量 */
  --card-radius: 16px;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 通用布局类 */
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-row { display: flex; flex-direction: row; align-items: center; }
.flex-column { display: flex; flex-direction: column; }
.space-between { justify-content: space-between; }

/* 通用样式类 */
.gradient-bg { background: var(--primary-gradient); }
.gradient-text {
  background-image: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.card {
  background: #fff;
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  padding: 15px;
}

/* 安全区域适配 */
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-top {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

/* 平板设备样式 */
.tablet-styles {
  font-size: 18px;
}

.tablet-styles .card { padding: 20px; }
.tablet-styles .btn { height: 50px; font-size: 18px; }
.tablet-styles .input { height: 50px; font-size: 16px; }

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

scroll-view {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

view, scroll-view {
  -webkit-overflow-scrolling: touch;
}
</style>
