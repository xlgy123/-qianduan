<template>
  <view class="announcement-card">
    <view class="card-header">
      <text class="card-title">公告</text>
      <text class="more-link" @click="viewMore">更多</text>
    </view>
    <view class="announcement-content">
      <text class="announcement-text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Announcement',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  methods: {
    viewMore() {
      this.$emit('view-more');
    }
  }
}
</script>

<style>
/* 公告区域 */
.announcement-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 12px; /* 减少内边距 */
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  will-change: transform;
}

.announcement-card:hover,
.announcement-card:active {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  background-image: linear-gradient(90deg, #a6c0fe, #c2a8fd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.more-link {
  font-size: 14px;
  color: #a6c0fe;
}

.announcement-content {
  padding: 10px 15px;
  background-color: rgba(166, 192, 254, 0.1);
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.announcement-content:hover {
  background-color: rgba(166, 192, 254, 0.15);
}

.announcement-text {
  font-size: 14px;
  color: #555;
  line-height: 1.4;
}

/* 平板适配 */
@media screen and (min-width: 768px) {
  .announcement-card {
    border-radius: 20px;
    padding: 20px;
  }
}
</style> 