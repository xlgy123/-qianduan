/**
 * 导航工具模块
 */

// 页面导航工具类
export const Navigation = {
  // 跳转到登录页面
  toLogin() {
    // 检查当前是否已经在登录页面，避免重复跳转
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage && currentPage.route === 'pages/login/login') {
      return;
    }
    
    uni.redirectTo({
      url: '/pages/login/login'
    });
  },

  // 跳转到首页
  toHome() {
    // 检查当前是否已经在首页，避免重复跳转
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage && currentPage.route === 'pages/home/home') {
      return;
    }
    
    uni.redirectTo({
      url: '/pages/home/home'
    });
  },

  // 跳转到自习室详情
  toRoomDetail(roomId) {
    uni.navigateTo({
      url: `/pages/room/room-detail?id=${roomId}`
    });
  },

  // 直接进入自习室学习页面
  toStudyRoom(roomId) {
    uni.showLoading({ title: '加载中...' });
    
    uni.navigateTo({
      url: `/pages/room/study-room?id=${roomId}`,
      success: () => {
        console.log('导航成功');
      },
      fail: (err) => {
        console.error('导航失败，尝试重定向:', err);
        uni.redirectTo({
          url: `/pages/room/study-room?id=${roomId}`
        });
      },
      complete: () => {
        uni.hideLoading();
      }
    });
  },

  // 带动画效果的页面跳转
  navigateWithAnimation(url) {
    // 直接跳转，不使用动画
    uni.navigateTo({
      url: url
      // 移除动画参数
    });
  },

  // 检查用户登录状态
  checkLoginStatus() {
    const token = uni.getStorageSync('token');
    if (!token) {
      this.toLogin();
      return false;
    }
    return true;
  },

  // 返回上一页或多个页面
  navigateBack(delta = 1) {
    uni.navigateBack({
      delta
    });
  },
  
  // 添加switchTab方法，用于在Tab页面之间切换
  switchTab(url) {
    try {
      uni.switchTab({
        url: url,
        fail: function(err) {
          console.error('Tab切换失败:', err);
          // 如果切换失败，尝试使用redirectTo作为备选
          uni.redirectTo({
            url: url,
            fail: function(redirectErr) {
              console.error('重定向到Tab页面也失败:', redirectErr);
            }
          });
        }
      });
    } catch (e) {
      console.error('Tab切换出错:', e);
      // 如果出错，尝试使用navigateTo作为第二备选
      uni.navigateTo({
        url: url,
        fail: function() {
          // 如果navigateTo也失败，最后尝试redirectTo
          uni.redirectTo({
            url: url
          });
        }
      });
    }
  },
  
  // 重定向到页面
  redirectTo(url) {
    uni.redirectTo({
      url: url
    });
  }
};

// 页面跳转方法
export const navigateTo = (url, params = {}) => {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return uni.navigateTo({
    url: fullUrl
  });
};

// 重定向方法
export const redirectTo = (url, params = {}) => {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return uni.redirectTo({
    url: fullUrl
  });
};

// 返回方法
export const navigateBack = (delta = 1) => {
  return uni.navigateBack({
    delta
  });
};

// 预加载页面
export const preloadPage = (url) => {
  return new Promise((resolve, reject) => {
    try {
      // 使用 vite-ignore 注释忽略动态导入分析警告
      import(/* @vite-ignore */`@/pages${url}.vue`)
        .then(() => {
          console.log(`页面预加载成功: ${url}`);
          resolve();
        })
        .catch(err => {
          console.error(`页面预加载失败: ${url}`, err);
          reject(err);
        });
    } catch (e) {
      console.error('预加载过程中出错:', e);
      reject(e);
    }
  });
};

// 常用页面路由
export const ROUTES = {
  LOGIN: '/pages/login/login',
  HOME: '/pages/home/home',
  SETTINGS: '/pages/settings/settings'
};