<template>
  <view class="popular-rooms">
    <scroll-view 
      scroll-x 
      class="popular-rooms-scroll" 
      show-scrollbar="false"
      enhanced
      :enable-flex="true"
      :scroll-left="scrollLeftValue"
      @scroll="onScroll"
      :enable-back-to-top="false"
      :scroll-with-animation="true"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      ref="scrollView"
    >
      <view class="rooms-container">
        <view class="popular-room-card" v-for="(room, index) in rooms" :key="index" @click="enterRoom(room)">
          <view class="room-header">
            <image class="room-owner-avatar" :src="room.ownerAvatar" :lazy-load="true"></image>
            <text class="room-name">{{room.name}}</text>
          </view>
          <view class="room-info-row">
            <view class="room-stat">
              <text class="room-stat-icon">👥</text>
              <text class="room-stat-value">{{room.memberCount}}人</text>
            </view>
            <view class="room-stat">
              <text class="room-stat-icon">⏱️</text>
              <text class="room-stat-value">{{room.duration}}</text>
            </view>
          </view>
          <view class="room-tags">
            <text class="room-tag" v-for="(tag, tagIndex) in room.tags" :key="tagIndex">{{tag}}</text>
          </view>
          <view class="room-status" :class="{'room-status-active': room.isActive}">
            <text>{{room.isActive ? '进行中' : '未开始'}}</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 左右滑动按钮 -->
    <view class="scroll-buttons" v-if="rooms.length > 1">
      <view class="scroll-btn scroll-btn-left" @click="scrollToLeft" :class="{'scroll-btn-disabled': isLeftDisabled}">
        <text class="btn-icon">‹</text>
      </view>
      <view class="scroll-btn scroll-btn-right" @click="scrollRight" :class="{'scroll-btn-disabled': isRightDisabled}">
        <text class="btn-icon">›</text>
      </view>
    </view>
    
    <!-- 指示点 -->
    <view class="dots-container" v-if="rooms.length > 1">
      <view 
        class="dot" 
        v-for="(dot, index) in Math.min(rooms.length, 5)" 
        :key="index"
        :class="{'dot-active': currentIndex === index}"
        @click="scrollToIndex(index)"
      ></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PopularRooms',
  props: {
    rooms: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollLeftValue: 0,
      maxScrollLeft: 0,
      currentIndex: 0,
      calculateTimer: null,
      cardWidth: 212, // 卡片宽度 + 边距
      touchStartX: 0,
      touchEndX: 0,
      isScrolling: false,
      isLeftDisabled: false,
      isRightDisabled: false
    };
  },
  mounted() {
    // 初始化时计算一次
    setTimeout(() => {
      this.initScrollParams();
    }, 500);
  },
  methods: {
    enterRoom(room) {
      this.$emit('enter-room', room);
    },
    
    onScroll(e) {
      this.scrollLeftValue = e.detail.scrollLeft;
      // 根据滚动位置计算当前索引
      this.currentIndex = Math.round(this.scrollLeftValue / this.cardWidth);
      
      // 更新按钮禁用状态
      this.updateButtonStates();
    },
    
    // 处理触摸开始
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
    },
    
    // 处理触摸结束
    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].clientX;
      
      // 计算滑动距离
      const swipeDistance = this.touchEndX - this.touchStartX;
      
      // 如果滑动距离足够大，则触发滑动
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          // 向右滑动，显示上一个
          this.scrollToLeft();
        } else {
          // 向左滑动，显示下一个
          this.scrollRight();
        }
      }
    },
    
    updateButtonStates() {
      // 左按钮在滚动位置为0时禁用
      this.isLeftDisabled = this.scrollLeftValue <= 0;
      
      // 右按钮在达到最大滚动位置时禁用
      // 添加一个小的容差值，避免因为舍入误差导致按钮提前禁用
      this.isRightDisabled = this.scrollLeftValue >= (this.maxScrollLeft - 5);
    },
    
    scrollToLeft() {
      if (this.scrollLeftValue > 0 && !this.isScrolling) {
        this.isScrolling = true;
        const newScrollLeft = Math.max(0, this.scrollLeftValue - this.cardWidth);
        this.manualScroll(newScrollLeft);
        
        // 更新当前索引
        this.currentIndex = Math.max(0, this.currentIndex - 1);
        
        setTimeout(() => {
          this.isScrolling = false;
          // 更新按钮状态
          this.updateButtonStates();
        }, 300);
      }
    },
    
    scrollRight() {
    // 添加额外的安全检查，不完全依赖maxScrollLeft
    const canScrollRight = this.scrollLeftValue < this.maxScrollLeft || 
                           (this.rooms.length > 2 && this.scrollLeftValue < this.cardWidth * (this.rooms.length - 2));
    
    if (canScrollRight && !this.isScrolling) {
      this.isScrolling = true;
      const newScrollLeft = Math.min(this.maxScrollLeft || (this.cardWidth * (this.rooms.length - 1)), 
                                     this.scrollLeftValue + this.cardWidth);
      this.manualScroll(newScrollLeft);
      
      // 更新当前索引
      this.currentIndex = Math.min(this.rooms.length - 1, this.currentIndex + 1);
      
      setTimeout(() => {
        this.isScrolling = false;
        // 更新按钮状态
        this.updateButtonStates();
      }, 300);
    }
  },
    
    scrollToIndex(index) {
      if (!this.isScrolling) {
        this.isScrolling = true;
        const newScrollLeft = Math.min(this.maxScrollLeft, index * this.cardWidth);
        this.manualScroll(newScrollLeft);
        setTimeout(() => {
          this.isScrolling = false;
        }, 300);
      }
    },
    
    manualScroll(position) {
      // 更新滚动位置
      this.scrollLeftValue = position;
      
      // 使用scroll-view的scrollTo方法
      const scrollView = this.$refs.scrollView;
      if (scrollView) {
        // 尝试使用uni-app的API
        uni.createSelectorQuery()
          .in(this)
          .select('.popular-rooms-scroll')
          .node()
          .exec((res) => {
            if (res && res[0] && res[0].node) {
              res[0].node.scrollTo({ left: position, behavior: 'smooth' });
            } else {
              // 如果无法获取节点，使用替代方法
              this.$nextTick(() => {
                // 直接设置scroll-left属性
                this.scrollLeftValue = position;
              });
            }
          });
      }
    },
    
    initScrollParams() {
    // 计算最大滚动距离
    if (this.rooms.length > 0) {
      // 容器宽度 = 卡片数 * 卡片宽度
      const containerWidth = this.rooms.length * this.cardWidth;
      
      try {
        // 获取系统信息，使用uni-app API获取屏幕宽度
        const systemInfo = uni.getSystemInfoSync();
        // 调整边距计算，确保可视区域宽度合理
        const viewportWidth = systemInfo.windowWidth - 20; // 减少边距值，确保有足够的滚动空间
        
        // 最大滚动距离
        this.maxScrollLeft = Math.max(0, containerWidth - viewportWidth);
        
        // 添加调试日志，帮助监控计算结果
        console.log('滚动参数计算结果:', {
          containerWidth,
          viewportWidth,
          maxScrollLeft: this.maxScrollLeft,
          roomsCount: this.rooms.length,
          cardWidth: this.cardWidth
        });
        
      } catch (error) {
        console.error('获取系统信息失败:', error);
        // 降级处理，确保至少有一个合理的滚动值
        this.maxScrollLeft = Math.max(0, containerWidth - 300);
      }
      
      // 确保maxScrollLeft不为0，除非确实无法滚动
      if (this.rooms.length > 2 && this.maxScrollLeft <= 0) {
        // 如果房间数量足够但计算结果不允许滚动，则强制设置一个最小滚动值
        this.maxScrollLeft = this.cardWidth * 2; // 至少允许滚动两张卡片
        console.warn('强制设置最小滚动距离:', this.maxScrollLeft);
      }
    } else {
      this.maxScrollLeft = 0;
    }
    
    // 重置滚动位置和当前索引
    if (this.scrollLeftValue > this.maxScrollLeft) {
      this.scrollLeftValue = 0;
      this.currentIndex = 0;
    }
    
    // 更新按钮状态
    this.updateButtonStates();
    }
  },
  watch: {
    rooms: {
      handler() {
        // 当房间数据变化时，重新计算
        if (this.calculateTimer) {
          clearTimeout(this.calculateTimer);
        }
        this.calculateTimer = setTimeout(() => {
          this.initScrollParams();
          // 重置滚动位置
          this.scrollLeftValue = 0;
          this.currentIndex = 0;
        }, 300);
      },
      immediate: false
    }
  }
}
</script>

<style>
/* 热门自习室 */
.popular-rooms {
  margin-bottom: 10px;
  border-radius: 16px;
  padding: 0;
  position: relative;
}

.popular-rooms-scroll {
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s ease;
  padding: 5px 0;
  -webkit-overflow-scrolling: touch; /* 增强iOS滚动体验 */
  scroll-behavior: smooth; /* 原生平滑滚动 */
}

.rooms-container {
  display: flex;
  flex-direction: row;
  min-width: max-content;
}

.popular-room-card {
  display: inline-block;
  width: 200px;
  margin-right: 12px;
  background: linear-gradient(135deg, #ffffff, #f9f6ff);
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(166, 192, 254, 0.12);
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid rgba(166, 192, 254, 0.1);
  flex-shrink: 0;
}

.popular-room-card:hover,
.popular-room-card:active {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(166, 192, 254, 0.2);
  border-color: rgba(166, 192, 254, 0.2);
}

.room-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.room-owner-avatar {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  margin-right: 10px;
  border: 2px solid rgba(166, 192, 254, 0.3);
  will-change: opacity;
}

.room-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.room-info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.room-stat {
  display: flex;
  align-items: center;
}

.room-stat-icon {
  font-size: 15px;
  margin-right: 5px;
}

.room-stat-value {
  font-size: 14px;
  color: #555;
}

.room-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.room-tag {
  font-size: 12px;
  color: #8a9eef;
  background-color: rgba(166, 192, 254, 0.15);
  padding: 3px 8px;
  border-radius: 12px;
  margin-right: 6px;
  margin-bottom: 6px;
  box-shadow: 0 2px 4px rgba(166, 192, 254, 0.1);
}

.room-status {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 12px;
  color: #999;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

.room-status-active {
  color: #fff;
  background: linear-gradient(to right, #65dfa9, #5cc698);
  box-shadow: 0 2px 5px rgba(101, 223, 169, 0.3);
}

/* 滑动指示器 */
.scroll-indicators {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 0 10px;
}

.scroll-nav {
  display: flex;
  gap: 10px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(166, 192, 254, 0.3);
  transition: all 0.3s ease;
}

.nav-btn:active {
  transform: scale(0.95);
}

.nav-btn-disabled {
  background: #e0e0e0;
  box-shadow: none;
  opacity: 0.5;
}

.nav-icon {
  font-size: 18px;
  color: white;
  font-weight: bold;
}

.dots-container {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  position: relative;
  z-index: 15;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #e0e0e0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.dot:hover {
  transform: scale(1.2);
  background-color: #d0d0d0;
}

.dot-active {
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  box-shadow: 0 2px 4px rgba(166, 192, 254, 0.4);
  width: 10px;
  height: 10px;
}

/* 平板适配 */
@media screen and (min-width: 768px) {
  .popular-room-card {
    width: 220px;
    padding: 18px;
  }
  
  .room-name {
    font-size: 17px;
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
  }
  
  .nav-icon {
    font-size: 20px;
  }
}

/* 滑动按钮样式 */
.scroll-buttons {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  z-index: 10; /* 确保按钮在最上层 */
}

.scroll-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 20; /* 确保按钮可点击 */
}

.scroll-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.scroll-btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.scroll-btn-left {
  margin-right: auto;
}

.scroll-btn-right {
  margin-left: auto;
}
</style>