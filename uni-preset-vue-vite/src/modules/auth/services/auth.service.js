/**
 * 认证服务模块
 */
import { ROUTES } from '@/utils/navigation'
import { http } from '@/modules/common/utils/request'

class AuthService {
  // 登录方法
  async login(username, password) {
    try {
      const response = await http.post('/auth/login', { username, password });
      if (response.token) {
        uni.setStorageSync('token', response.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  }

  // 登出方法
  logout() {
    uni.removeStorageSync('token');
    uni.redirectTo({ url: ROUTES.LOGIN });
  }

  // 检查登录状态
  isLoggedIn() {
    return !!uni.getStorageSync('token');
  }

  // 获取用户信息
  async getUserInfo() {
    try {
      return await http.get('/user/info');
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }
}

export const authService = new AuthService(); 