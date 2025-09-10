/**
 * 模拟API服务
 * 用于替代真实的后端API调用，提供模拟数据
 */

// 模拟延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟自习室数据
const mockRooms = [
  {
    id: '1',
    room_id: '1',
    name: '高效学习自习室',
    room_code: 'STUDY001',
    roomType: '安静学习',
    description: '专注学习的环境，适合需要高度集中注意力的学习者',
    currentMembers: 15,
    maxCapacity: 30,
    status: '开放中',
    backgroundImage: '/static/images/room-bg-1.jpg',
    createdAt: '2023-05-15T08:00:00Z',
    ambienceSettings: {
      background: 'library',
      music: 'light_piano',
      volume: 0.5
    }
  },
  {
    id: '2',
    room_id: '2',
    name: '编程技术讨论室',
    room_code: 'CODE002',
    roomType: '讨论学习',
    description: '适合程序员和编程爱好者交流讨论的虚拟空间',
    currentMembers: 8,
    maxCapacity: 20,
    status: '开放中',
    backgroundImage: '/static/images/room-bg-2.jpg',
    createdAt: '2023-05-16T10:30:00Z',
    ambienceSettings: {
      background: 'cafe',
      music: 'soft_jazz',
      volume: 0.4
    }
  },
  {
    id: '3',
    room_id: '3',
    name: '考研备考自习室',
    room_code: 'EXAM003',
    roomType: '安静学习',
    description: '为考研学生提供的专属学习空间，保持安静',
    currentMembers: 25,
    maxCapacity: 40,
    status: '开放中',
    backgroundImage: '/static/images/room-bg-3.jpg',
    createdAt: '2023-05-17T09:15:00Z',
    ambienceSettings: {
      background: 'classroom',
      music: 'nature_sounds',
      volume: 0.3
    }
  }
];

// 新增：从本地存储加载/保存模拟数据
function loadPersistedRooms() {
  try {
    const saved = uni.getStorageSync('mockRooms');
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr)) {
        mockRooms.splice(0, mockRooms.length, ...arr);
        console.log('[Mock API] 已从本地存储加载自习室：', mockRooms.length);
      }
    }
  } catch (e) {
    console.warn('[Mock API] 加载本地 mockRooms 失败：', e);
  }
}
function persistRooms() {
  try {
    uni.setStorageSync('mockRooms', JSON.stringify(mockRooms));
  } catch (e) {
    console.warn('[Mock API] 保存 mockRooms 失败：', e);
  }
}
// 初始化时尝试加载
loadPersistedRooms();

// 模拟API响应
const mockApiResponse = async (url, method, data) => {
  // 添加随机延迟模拟网络请求
  await delay(300 + Math.random() * 700);
  
  // 解析URL路径
  const urlParts = url.split('/');
  const endpoint = urlParts[urlParts.length - 1];
  
  console.log(`模拟API请求: ${method} ${url}`, data);
  console.log('请求数据:', JSON.stringify(data));
  
  // 根据URL和方法返回不同的模拟数据
  if (url.includes('/api/rooms') && method === 'GET') {
    // 获取所有自习室
    if (url === 'http://localhost:3000/api/rooms' || url === '/api/rooms') {
      return {
        statusCode: 200,
        data: {
          code: 200,
          message: '获取自习室列表成功',
          data: mockRooms
        }
      };
    }
    
    // 获取特定自习室详情
    if (url.match(/\/api\/rooms\/[\w\d]+$/)) {
      const roomId = url.split('/').pop();
      console.log('查找房间ID:', roomId);
      
      // 打印所有房间ID以便调试
      console.log('可用房间IDs:', mockRooms.map(r => ({ id: r.id, room_id: r.room_id })));
      
      // 不区分类型进行比较（将所有ID转为字符串）
      const room = mockRooms.find(r => 
        String(r.id) === String(roomId) || 
        String(r.room_id) === String(roomId)
      );
      
      if (room) {
        console.log('找到房间:', room);
        return {
          statusCode: 200,
          data: {
            code: 200,
            message: '获取自习室详情成功',
            data: room
          }
        };
      } else {
        console.log('未找到房间ID为', roomId, '的房间');
        return {
          statusCode: 200,
          data: {
            code: 404,
            message: '未找到该自习室'
          }
        };
      }
    }
    
    // 通过房间码搜索自习室
    if (url.match(/\/api\/rooms\/code\/[\w\d]+$/)) {
      const roomCode = url.split('/').pop();
      console.log('搜索房间码:', roomCode);
      // 不区分大小写搜索
      const room = mockRooms.find(r => r.room_code.toLowerCase() === roomCode.toLowerCase());
      
      if (room) {
        console.log('找到房间:', room);
        return {
          statusCode: 200,
          data: {
            code: 200,
            message: '搜索自习室成功',
            data: room
          }
        };
      } else {
        console.log('未找到房间码为', roomCode, '的房间');
        return {
          statusCode: 200,
          data: {
            code: 404,
            message: '未找到该自习室'
          }
        };
      }
    }
  }
  
  // 获取可用自习室
  if (url === 'http://localhost:3000/api/available' || url === '/api/available') {
    // 返回所有自习室，确保新创建的自习室也能显示在热门列表中
    return {
      statusCode: 200,
      data: {
        code: 200,
        message: '获取推荐自习室成功',
        data: mockRooms.sort(() => 0.5 - Math.random())
      }
    };
  }
  
  // 获取自习室详情
  if (url === 'http://localhost:3000/api/getRoomDetails' || url === '/api/getRoomDetails') {
    return {
      statusCode: 200,
      data: {
        code: 200,
        message: '获取自习室详情成功',
        data: mockRooms
      }
    };
  }
  
  // 创建自习室
  if ((url === 'http://localhost:3000/api/rooms' || url === '/api/rooms') && method === 'POST') {
    console.log('创建自习室请求数据:', data);
    
    // 确保字段存在，处理可能的undefined
    const providedCode = (data && (data.room_code || data.roomCode)) || null;
    const newRoom = {
      id: (mockRooms.length + 1).toString(),
      room_id: (mockRooms.length + 1).toString(),
      name: data.roomName || data.name || '未命名自习室', // 支持roomName和name
      room_code: providedCode || `ROOM${Math.floor(1000 + Math.random() * 9000)}`,
      roomType: data.roomType || '安静学习',
      description: data.description || '自习室描述',
      currentMembers: 1,
      maxCapacity: parseInt(data.maxCapacity) || 20,
      status: '开放中',
      backgroundImage: data.backgroundImage || '/static/images/room-bg-1.jpg',
      createdAt: new Date().toISOString(),
      tags: data.tags || [],
      ambienceSettings: typeof data.ambienceSettings === 'string' ? 
        JSON.parse(data.ambienceSettings) : 
        (data.ambienceSettings || {
          background: 'library',
          music: 'light_piano',
          volume: 0.5
        })
    };
    
    // 添加到模拟数据中并持久化
    mockRooms.push(newRoom);
    persistRooms();
    
    console.log('创建自习室成功:', newRoom);
    
    return {
      statusCode: 200,
      data: {
        code: 200,
        message: '创建自习室成功',
        data: {
          room_id: newRoom.id,
          room_code: newRoom.room_code
        }
      }
    };
  }
  
  // 默认返回404
  return {
    statusCode: 404,
    data: {
      code: 404,
      message: '接口不存在'
    }
  };
};

// 重写uni.request方法，拦截API请求并返回模拟数据
export const setupMockApi = () => {
  const originalRequest = uni.request;
  
  // 替换原始的request方法
  uni.request = (options) => {
    const { url, method = 'GET', data } = options;
    
    // 检查是否是需要模拟的API请求
    if (url.includes('/api/') || url.includes('localhost:3000')) {
      console.log(`[Mock API] 拦截请求: ${method} ${url}`, data);
      
      // 创建模拟请求任务对象
      const requestTask = {};
      
      // 支持Promise方式调用
      if (!options.success && !options.fail) {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await mockApiResponse(url, method, data);
            console.log(`[Mock API] Promise响应:`, response);
            resolve(response);
          } catch (error) {
            console.error(`[Mock API] Promise错误:`, error);
            reject(error);
          }
        });
      }
      
      // 异步处理模拟响应 (回调方式)
      mockApiResponse(url, method, data).then(response => {
        console.log(`[Mock API] 回调响应:`, response);
        
        // 调用成功回调
        if (options.success) {
          options.success(response);
        }
        
        // 调用完成回调
        if (options.complete) {
          options.complete(response);
        }
      }).catch(error => {
        console.error(`[Mock API] 回调错误:`, error);
        
        // 调用失败回调
        if (options.fail) {
          options.fail(error);
        }
        
        // 调用完成回调
        if (options.complete) {
          options.complete(error);
        }
      });
      
      return requestTask;
    }
    
    // 对于非模拟API的请求，使用原始的request方法
    return originalRequest(options);
  };
  
  console.log('[Mock API] 已启用模拟API服务');
};

// 导出模拟数据，方便其他模块使用
export const mockData = {
  rooms: mockRooms
};