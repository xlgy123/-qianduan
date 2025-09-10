# 过渡动画组件使用指南

本文档介绍了项目中三个过渡动画组件的使用方法，这些组件提取自登录页面的动画效果，可在其他页面复用。

## 1. TransitionView - 基础过渡动画组件

最简单的过渡动画组件，提供左右滑入动画效果。

### 使用方法

```vue
<template>
  <TransitionView :isActive="showContent" direction="right">
    <view>这里是需要过渡动画的内容</view>
  </TransitionView>
</template>

<script>
import TransitionView from '@/components/TransitionView.vue'

export default {
  components: {
    TransitionView
  },
  data() {
    return {
      showContent: true
    }
  }
}
</script>
```

### 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| isActive | Boolean | false | 是否显示内容 |
| direction | String | 'right' | 动画方向，可选值: 'left', 'right' |

## 2. TabTransition - 标签页过渡组件

适用于登录/注册等多标签页切换的场景，带有顶部标签和滑块指示器。

### 使用方法

```vue
<template>
  <TabTransition :tabs="tabs" @change="onTabChange">
    <!-- 第一个标签内容 -->
    <template #tab-0>
      <view>第一个标签的内容</view>
    </template>
    
    <!-- 第二个标签内容 -->
    <template #tab-1>
      <view>第二个标签的内容</view>
    </template>
  </TabTransition>
</template>

<script>
import TabTransition from '@/components/TabTransition.vue'

export default {
  components: {
    TabTransition
  },
  data() {
    return {
      tabs: [
        { label: '标签一' },
        { label: '标签二' }
      ]
    }
  },
  methods: {
    onTabChange(index) {
      console.log('切换到标签:', index)
    }
  }
}
</script>
```

### 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| tabs | Array | 必填 | 标签配置，每项需包含label属性 |
| showTabs | Boolean | true | 是否显示顶部标签栏 |
| initialTab | Number | 0 | 初始选中的标签索引 |

### 事件

| 事件名 | 参数 | 说明 |
|-------|------|------|
| change | index | 标签切换时触发，返回当前标签索引 |

## 3. SwitchTabView - 选项切换组件

适用于手机号/邮箱登录等选项切换的场景，带有圆角背景和滑块指示器。

### 使用方法

```vue
<template>
  <SwitchTabView :options="loginOptions" @change="onLoginTypeChange">
    <!-- 第一个选项内容 -->
    <template #option-0>
      <view>手机号登录表单</view>
    </template>
    
    <!-- 第二个选项内容 -->
    <template #option-1>
      <view>邮箱登录表单</view>
    </template>
  </SwitchTabView>
</template>

<script>
import SwitchTabView from '@/components/SwitchTabView.vue'

export default {
  components: {
    SwitchTabView
  },
  data() {
    return {
      loginOptions: [
        { label: '手机号登录' },
        { label: '邮箱登录' }
      ]
    }
  },
  methods: {
    onLoginTypeChange(index) {
      console.log('切换登录方式:', index)
    }
  }
}
</script>
```

### 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| options | Array | 必填 | 选项配置，每项需包含label属性 |
| initialIndex | Number | 0 | 初始选中的选项索引 |

### 事件

| 事件名 | 参数 | 说明 |
|-------|------|------|
| change | index | 选项切换时触发，返回当前选项索引 |

## 组件样式定制

这些组件使用了与登录页面一致的渐变色 (#a6c0fe 到 #c2a8fd)，如果需要修改颜色风格，可以覆盖以下CSS变量：

```css
/* 在App.vue或全局样式中覆盖 */
:root {
  --primary-gradient: linear-gradient(90deg, #新颜色1, #新颜色2);
  --primary-color: #新颜色1;
  --primary-shadow: rgba(新颜色1数值, 新颜色1数值, 新颜色1数值, 0.3);
}
```

后续会对组件进行升级，支持通过CSS变量自定义样式。 