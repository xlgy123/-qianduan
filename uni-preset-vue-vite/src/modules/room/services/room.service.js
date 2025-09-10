/**
 * 自习室服务模块
 */
import { http } from '@/modules/common/utils/request'

class RoomService {
  // 获取自习室列表
  async getRoomList() {
    try {
      return await http.get('/rooms');
    } catch (error) {
      console.error('获取自习室列表失败:', error);
      return [];
    }
  }

  // 获取自习室详情
  async getRoomDetail(roomId) {
    try {
      return await http.get(`/rooms/${roomId}`);
    } catch (error) {
      console.error('获取自习室详情失败:', error);
      return null;
    }
  }

  // 加入自习室
  async joinRoom(roomId) {
    try {
      return await http.post(`/rooms/${roomId}/join`);
    } catch (error) {
      console.error('加入自习室失败:', error);
      return false;
    }
  }

  // 离开自习室
  async leaveRoom(roomId) {
    try {
      return await http.post(`/rooms/${roomId}/leave`);
    } catch (error) {
      console.error('离开自习室失败:', error);
      return false;
    }
  }
}

export const roomService = new RoomService(); 