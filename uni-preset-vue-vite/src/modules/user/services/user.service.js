/**
 * 用户服务模块
 */
import { http } from '@/modules/common/utils/request'

class UserService {
  // 更新用户信息
  async updateUserInfo(userData) {
    try {
      return await http.put('/user/update', userData);
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return null;
    }
  }

  // 获取用户学习记录
  async getStudyRecords() {
    try {
      return await http.get('/user/study-records');
    } catch (error) {
      console.error('获取学习记录失败:', error);
      return [];
    }
  }

  // 获取用户好友列表
  async getFriendsList() {
    try {
      return await http.get('/user/friends');
    } catch (error) {
      console.error('获取好友列表失败:', error);
      return [];
    }
  }
}

export const userService = new UserService(); 