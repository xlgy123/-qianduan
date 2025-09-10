<template>
  <view class="demo-container">
    <view class="header">
      <text class="title">过渡动画组件示例</text>
      <text class="subtitle">这个页面展示了三种过渡动画组件的使用方法</text>
    </view>
    
    <view class="section">
      <text class="section-title">1. 基础过渡动画组件</text>
      <view class="demo-card">
        <view class="control-bar">
          <button class="control-btn" @click="toggleContent">
            {{ showContent ? '隐藏内容' : '显示内容' }}
          </button>
          <view class="direction-select">
            <text>方向:</text>
            <radio-group class="radio-group" @change="setDirection">
              <label class="radio"><radio value="left" :checked="direction === 'left'" />左侧</label>
              <label class="radio"><radio value="right" :checked="direction === 'right'" />右侧</label>
            </radio-group>
          </view>
        </view>
        
        <TransitionView :isActive="showContent" :direction="direction">
          <view class="demo-content">
            <text class="demo-text">这是一段使用 TransitionView 的内容</text>
            <view class="color-box"></view>
          </view>
        </TransitionView>
      </view>
    </view>
    
    <view class="section">
      <text class="section-title">2. 标签页过渡组件</text>
      <view class="demo-card">
        <TabTransition :tabs="tabs" @change="onTabChange">
          <template #tab-0>
            <view class="demo-content">
              <text class="demo-text">标签一的内容</text>
              <view class="content-row">
                <view class="color-box blue"></view>
                <view class="color-box purple"></view>
              </view>
            </view>
          </template>
          
          <template #tab-1>
            <view class="demo-content">
              <text class="demo-text">标签二的内容</text>
              <view class="content-row">
                <view class="color-box green"></view>
                <view class="color-box yellow"></view>
              </view>
            </view>
          </template>
          
          <template #tab-2>
            <view class="demo-content">
              <text class="demo-text">标签三的内容</text>
              <view class="content-row">
                <view class="color-box pink"></view>
                <view class="color-box orange"></view>
              </view>
            </view>
          </template>
        </TabTransition>
      </view>
    </view>
    
    <view class="section">
      <text class="section-title">3. 选项切换组件</text>
      <view class="demo-card">
        <SwitchTabView :options="options" @change="onOptionChange">
          <template #option-0>
            <view class="demo-content">
              <text class="demo-text">选项一内容</text>
              <view class="form-demo">
                <input class="input-demo" placeholder="请输入手机号" />
                <button class="button-demo">提交</button>
              </view>
            </view>
          </template>
          
          <template #option-1>
            <view class="demo-content">
              <text class="demo-text">选项二内容</text>
              <view class="form-demo">
                <input class="input-demo" placeholder="请输入邮箱" />
                <button class="button-demo">提交</button>
              </view>
            </view>
          </template>
        </SwitchTabView>
      </view>
    </view>
    
    <view class="footer">
      <text class="footer-text">查看 components/README.md 获取更多使用说明</text>
    </view>
  </view>
</template>

<script>
import TransitionView from '@/components/TransitionView.vue'
import TabTransition from '@/components/TabTransition.vue'
import SwitchTabView from '@/components/SwitchTabView.vue'

export default {
  components: {
    TransitionView,
    TabTransition,
    SwitchTabView
  },
  data() {
    return {
      // 基础过渡组件
      showContent: true,
      direction: 'right',
      
      // 标签页组件
      tabs: [
        { label: '标签一' },
        { label: '标签二' },
        { label: '标签三' }
      ],
      
      // 选项切换组件
      options: [
        { label: '选项一' },
        { label: '选项二' }
      ]
    }
  },
  methods: {
    // 基础过渡组件方法
    toggleContent() {
      this.showContent = !this.showContent;
    },
    setDirection(e) {
      this.direction = e.detail.value;
    },
    
    // 标签页组件方法
    onTabChange(index) {
      console.log('切换到标签:', index);
    },
    
    // 选项切换组件方法
    onOptionChange(index) {
      console.log('切换到选项:', index);
    }
  }
}
</script>

<style>
.demo-container {
  padding: 20px;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #444;
  margin-bottom: 15px;
  display: block;
}

.demo-card {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.control-btn {
  background: linear-gradient(90deg, #a6c0fe, #c2a8fd);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
}

.direction-select {
  display: flex;
  align-items: center;
}

.direction-select text {
  margin-right: 10px;
  font-size: 14px;
  color: #666;
}

.radio-group {
  display: flex;
}

.radio {
  margin-right: 10px;
  font-size: 14px;
  color: #666;
}

.demo-content {
  padding: 20px;
  background-color: #f9f7ff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.demo-text {
  margin-bottom: 20px;
  font-size: 16px;
  color: #444;
}

.content-row {
  display: flex;
  gap: 10px;
}

.color-box {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  margin-bottom: 10px;
}

.color-box.blue {
  background: linear-gradient(135deg, #7FB3D5, #3498DB);
}

.color-box.purple {
  background: linear-gradient(135deg, #BB8FCE, #8E44AD);
}

.color-box.green {
  background: linear-gradient(135deg, #7DCEA0, #27AE60);
}

.color-box.yellow {
  background: linear-gradient(135deg, #F9E79F, #F1C40F);
}

.color-box.pink {
  background: linear-gradient(135deg, #F5B7B1, #E74C3C);
}

.color-box.orange {
  background: linear-gradient(135deg, #FAD7A0, #E67E22);
}

.form-demo {
  width: 100%;
  max-width: 300px;
}

.input-demo {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  margin-bottom: 15px;
  font-size: 14px;
}

.button-demo {
  width: 100%;
  background: linear-gradient(90deg, #a6c0fe, #c2a8fd);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
  font-weight: 500;
}

.footer {
  padding: 20px 0;
  text-align: center;
}

.footer-text {
  font-size: 14px;
  color: #888;
}
</style> 