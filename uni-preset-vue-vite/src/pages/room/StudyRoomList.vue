<!-- <template>
    <view class="study-room-list">
      <view class="header">
        <text class="title">自习室列表</text>
      </view>
  
      <view class="room-list">
        <view 
          class="room-item" 
          v-for="(room, index) in rooms" 
          :key="index" 
          @click="goToRoomDetail(room.room_id)"
        >
          <view class="room-info">
            <view class="room-name">{{ room.name }}</view>
            <view class="room-meta">
              <text class="room-type">{{ room.room_type }}</text>
              <text class="room-members">{{ room.current_members }}/{{ room.max_capacity }}</text>
              <text class="room-status">{{ room.status }}</text>
            </view>
          </view>
        </view>
      </view>
  
      <button class="create-room-btn" @click="createRoom">创建自习室</button>
    </view>
  </template>
  
  <script>
  export default {
    data() {
      return {
        rooms: []
      };
    },
    onLoad() {
      this.loadRooms();
    },
    methods: {
  async loadRooms() {
    const res = await uni.request({
      url: '/api/rooms',
      method: 'GET'
    });
    
    if (res.data.code === 200) {
      this.rooms = res.data.data.map(room => ({
        room_id: room.id,
        name: room.name,
        roomType: room.roomType,
        current_members: room.currentMembers,
        max_capacity: room.maxCapacity,
        backgroundImage: room.backgroundImage,
        ambience: room.ambienceSettings
      }));
    }
  },
  goToRoomDetail(roomId) {
    uni.navigateTo({
      url: `/pages/room/room-detail?id=${roomId}`
    });
  }
  }
  };
  </script>
  
  <style>
  .study-room-list {
    padding: 15px;
  }
  
  .header {
    margin-bottom: 20px;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  
  .room-list {
    margin-bottom: 20px;
  }
  
  .room-item {
    background-color: #fff;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .room-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .room-meta {
    display: flex;
    font-size: 14px;
    color: #666;
  }
  
  .room-type, .room-members, .room-status {
    margin-right: 15px;
  }
  
  .create-room-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #4cd964;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(76, 217, 100, 0.5);
  }
  </style> -->