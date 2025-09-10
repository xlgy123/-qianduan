/**
 * 自习室房间工具类
 * 用于生成、验证和管理房间号
 */

// 存储房间信息的本地存储键名
const STORAGE_KEYS = {
  STUDY_ROOMS: 'studyRooms',
  JOINED_ROOMS: 'joinedRooms'
};

/**
 * 生成6位数字房间号
 * @returns {string} 6位数字房间号
 */
export function generateRoomCode() {
  // 生成6位随机数字
  const min = 100000; // 最小6位数
  const max = 999999; // 最大6位数
  
  // 生成随机房间号
  const roomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // 由于getAllRooms是异步的，我们不在这里检查重复性
  // 直接返回生成的房间号
  return roomCode.toString();
}

/**
 * 创建一个新的自习室
 * @param {Object} roomData 自习室数据
 * @returns {Object} 创建的自习室信息，包含roomCode
 */
export function createRoom(roomData) {
  if (!roomData || typeof roomData !== 'object') {
    console.error('无效的自习室数据');
    return null;
  }
  
  // 生成房间号
  const roomCode = generateRoomCode();
  
  // 创建完整的房间信息
  const newRoom = {
    ...roomData,
    roomCode,
    createdAt: new Date().toISOString(),
    members: [roomData.ownerId || '当前用户'], // 默认创建者为成员
    memberCount: 1
  };
  
  try {
    // 获取现有房间列表
    const rooms = getAllRooms();
    
    // 添加新房间
    rooms.push(newRoom);
    
    // 保存更新后的房间列表
    uni.setStorageSync(STORAGE_KEYS.STUDY_ROOMS, JSON.stringify(rooms));
    
    // 同时将该房间添加到已加入房间列表
    addToJoinedRooms(newRoom);
    
    console.log('自习室创建成功:', newRoom);
    return newRoom;
  } catch (e) {
    console.error('创建自习室失败:', e);
    return null;
  }
}

/**
 * 获取所有自习室
 * @returns {Array} 自习室列表
 */
export async function getAllRooms() {
  try {
    const res = await uni.request({
      url: '/api/getRoomDetails',
      method: 'GET',
      timeout: 5000 // 添加超时控制
    });
    
    console.log('获取自习室列表响应:', res);
    // 处理嵌套的响应结构
    if (res.data && res.data.data && res.data.data.code === 200) {
      return res.data.data.data || [];
    }
    console.error('获取自习室列表失败:', res.data?.data?.msg || res.data?.msg);
    return [];
  } catch (e) {
    console.error('网络请求失败:', e);
    return [];
  }
}

/**
 * 根据房间号查找自习室
 * @param {string} roomCode 房间号
 * @returns {Object|null} 找到的自习室信息或null
 */
export function findRoomByCode(roomCode) {
  if (!roomCode) return null;
  
  try {
    const rooms = getAllRooms();
    return rooms.find(room => room.roomCode === roomCode.toString()) || null;
  } catch (e) {
    console.error('查找自习室失败:', e);
    return null;
  }
}

/**
 * 搜索自习室
 * @param {Object} query 查询条件，可包含name和roomCode
 * @returns {Array} 匹配的自习室列表
 */
export function searchRooms(query = {}) {
  try {
    const rooms = getAllRooms();
    
    if (!query || Object.keys(query).length === 0) {
      // 无查询条件，返回所有房间
      return rooms;
    }
    
    return rooms.filter(room => {
      let matchName = true;
      let matchCode = true;
      
      // 按名称搜索
      if (query.name) {
        matchName = room.name.toLowerCase().includes(query.name.toLowerCase());
      }
      
      // 按房间号搜索
      if (query.roomCode) {
        matchCode = room.roomCode.includes(query.roomCode);
      }
      
      // 同时满足名称和房间号的筛选条件
      return matchName && matchCode;
    });
  } catch (e) {
    console.error('搜索自习室失败:', e);
    return [];
  }
}

/**
 * 将房间添加到已加入房间列表
 * @param {Object} room 房间信息
 */
function addToJoinedRooms(room) {
  try {
    const joinedRoomsStr = uni.getStorageSync(STORAGE_KEYS.JOINED_ROOMS);
    const joinedRooms = joinedRoomsStr ? JSON.parse(joinedRoomsStr) : [];
    
    // 避免重复添加
    if (!joinedRooms.some(r => r.roomCode === room.roomCode)) {
      joinedRooms.push({
        id: room.id,
        roomCode: room.roomCode,
        name: room.name,
        joinTime: new Date().toISOString()
      });
      
      uni.setStorageSync(STORAGE_KEYS.JOINED_ROOMS, JSON.stringify(joinedRooms));
    }
  } catch (e) {
    console.error('添加到已加入房间失败:', e);
  }
}

/**
 * 加入自习室
 * @param {string} roomCode 房间号
 * @returns {Object|null} 加入的自习室信息或null
 */
export function joinRoom(roomCode) {
  const room = findRoomByCode(roomCode);
  
  if (!room) {
    console.error('房间不存在:', roomCode);
    return null;
  }
  
  try {
    // 获取所有房间
    const rooms = getAllRooms();
    
    // 找到目标房间的索引
    const roomIndex = rooms.findIndex(r => r.roomCode === roomCode);
    
    if (roomIndex !== -1) {
      // 更新房间成员数
      rooms[roomIndex].memberCount = (rooms[roomIndex].memberCount || 0) + 1;
      
      // TODO: 实际应用中，这里应该添加当前用户ID到成员列表中
      
      // 保存更新后的房间列表
      uni.setStorageSync(STORAGE_KEYS.STUDY_ROOMS, JSON.stringify(rooms));
      
      // 添加到已加入房间列表
      addToJoinedRooms(rooms[roomIndex]);
      
      console.log('成功加入自习室:', rooms[roomIndex]);
      return rooms[roomIndex];
    }
    
    return null;
  } catch (e) {
    console.error('加入自习室失败:', e);
    return null;
  }
}

/**
 * 获取用户已加入的自习室列表
 * @returns {Array} 已加入的自习室列表
 */
export function getJoinedRooms() {
  try {
    const joinedRoomsStr = uni.getStorageSync(STORAGE_KEYS.JOINED_ROOMS);
    return joinedRoomsStr ? JSON.parse(joinedRoomsStr) : [];
  } catch (e) {
    console.error('获取已加入自习室列表失败:', e);
    return [];
  }
}