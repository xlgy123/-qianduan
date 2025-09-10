<template>
  <view class="study-topics">
    <view class="section-header">
      <text class="section-title">学习主题</text>
      <text class="more-link" @click="viewAll">全部</text>
    </view>
    <view class="topic-grid">
      <view 
        class="topic-item" 
        v-for="(topic, index) in topics" 
        :key="index" 
        @click="selectTopic(topic)"
      >
        <view class="topic-icon-bg" :style="{ background: topic.bgColor }">
          <text class="topic-icon">{{topic.icon}}</text>
        </view>
        <text class="topic-name">{{topic.name}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'StudyTopics',
  props: {
    topics: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectTopic(topic) {
      this.$emit('select-topic', topic);
    },
    viewAll() {
      this.$emit('view-all');
    }
  }
}
</script>

<style>
/* 学习主题分类 */
.study-topics {
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  will-change: transform;
  transition: transform 0.3s ease;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
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

.topic-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 5px 0;
}

.topic-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
}

.topic-item:hover,
.topic-item:active {
  transform: translateY(-3px);
}

.topic-icon-bg {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
  will-change: transform;
  transition: transform 0.2s ease;
}

.topic-item:hover .topic-icon-bg,
.topic-item:active .topic-icon-bg {
  transform: scale(1.05);
}

.topic-icon {
  font-size: 24px;
  color: white;
}

.topic-name {
  font-size: 12px;
  color: #333;
  text-align: center;
}

/* 平板适配 */
@media screen and (min-width: 768px) {
  .topic-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}
</style> 