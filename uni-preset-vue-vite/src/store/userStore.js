// userStore.js - 用户数据全局存储，用于在主页和个人页面之间共享用户数据

// 初始化用户数据
const defaultUserState = {
  username: '游客用户',
  avatar: '/static/default-avatar.png',
  todayHours: '0',
  totalHours: '0',
  studyDays: '0',
  points: '0',
  isLoggedIn: false // 添加登录状态标志
};

// 全局状态管理
class UserStore {
  constructor() {
    // 如果已经有实例，直接返回实例
    if (UserStore.instance) {
      return UserStore.instance;
    }
    
    // 否则创建新实例
    UserStore.instance = this;
    
    // 初始化状态
    this.state = this.loadState();
    
    // 创建事件总线，用于页面间通信
    this.listeners = new Map();
  }
  
  // 从本地存储加载用户状态
  loadState() {
    try {
      const savedState = uni.getStorageSync('userState');
      return savedState ? JSON.parse(savedState) : {...defaultUserState};
    } catch (e) {
      console.error('加载用户状态失败:', e);
      return {...defaultUserState};
    }
  }
  
  // 保存状态到本地存储
  saveState() {
    try {
      uni.setStorageSync('userState', JSON.stringify(this.state));
    } catch (e) {
      console.error('保存用户状态失败:', e);
    }
  }
  
  // 获取用户状态
  getState() {
    return {...this.state};
  }
  
  // 更新用户状态
  updateState(newState) {
    this.state = {...this.state, ...newState};
    this.saveState();
    this.notifyListeners();
    return this.state;
  }
  
  // 更新单个字段
  updateField(field, value) {
    this.state[field] = value;
    this.saveState();
    this.notifyListeners();
    return this.state;
  }
  
  // 备份用户数据到特定账号的存储中
  backupUserData(userId) {
    try {
      if (!userId) {
        console.warn('未提供用户ID，无法备份用户数据');
        return false;
      }
      
      // 将当前状态保存到用户特定的存储中
      const userDataKey = `userData_${userId}`;
      uni.setStorageSync(userDataKey, JSON.stringify(this.state));
      console.log(`已备份用户数据到 ${userDataKey}`);
      return true;
    } catch (e) {
      console.error('备份用户数据失败:', e);
      return false;
    }
  }
  
  // 从特定账号的存储中恢复用户数据
  restoreUserData(userId) {
    try {
      if (!userId) {
        console.warn('未提供用户ID，无法恢复用户数据');
        return false;
      }
      
      // 从用户特定的存储中加载数据
      const userDataKey = `userData_${userId}`;
      const savedData = uni.getStorageSync(userDataKey);
      
      if (savedData) {
        // 恢复用户数据
        this.state = JSON.parse(savedData);
        this.saveState();
        this.notifyListeners();
        console.log(`已恢复用户数据从 ${userDataKey}`);
        return true;
      } else {
        console.log(`未找到用户数据: ${userDataKey}`);
        return false;
      }
    } catch (e) {
      console.error('恢复用户数据失败:', e);
      return false;
    }
  }
  
  // 重置用户状态
  resetState() {
    // 在重置前尝试备份当前用户数据
    try {
      const userId = uni.getStorageSync('currentUserId');
      if (userId) {
        this.backupUserData(userId);
      }
    } catch (e) {
      console.error('备份用户数据失败:', e);
    }
    
    // 然后重置状态
    this.state = {...defaultUserState};
    this.saveState();
    this.notifyListeners();
    return this.state;
  }
  
  // 模拟登录
  login(userData) {
    // 更新用户状态
    this.state = {
      ...this.state,
      ...userData,
      isLoggedIn: true,
      // 添加一些随机的学习数据
      todayHours: Math.floor(Math.random() * 5).toString(),
      totalHours: Math.floor(Math.random() * 100 + 10).toString(),
      studyDays: Math.floor(Math.random() * 30 + 1).toString(),
      points: Math.floor(Math.random() * 1000 + 100).toString()
    };
    
    this.saveState();
    this.notifyListeners();
    return this.state;
  }
  
  // 退出登录
  logout() {
    // 清除token和用户信息
    uni.removeStorageSync('token');
    uni.removeStorageSync('userInfo');
    
    // 重置状态
    this.resetState();
    
    return this.state;
  }
  
  // 添加监听器
  subscribe(id, callback) {
    this.listeners.set(id, callback);
  }
  
  // 移除监听器
  unsubscribe(id) {
    this.listeners.delete(id);
  }
  
  // 通知所有监听器
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.state);
      } catch (e) {
        console.error('执行监听器回调失败:', e);
      }
    });
  }
}

// 创建并导出单例实例
export const userStore = new UserStore();