# UI组件库

这是一个基于Vue 3的UI组件库，专为本项目定制，包含了一系列常用的UI组件，可以在项目中直接使用。

## 组件列表

1. `FormInput` - 表单输入框
2. `ActionButton` - 按钮
3. `ModalDialog` - 模态框
4. `MenuItem` - 菜单项
5. `StatCard` - 统计卡片

## 安装和使用

### 全局注册

这些组件已经在`main.js`中全局注册，可以直接在任何组件中使用：

```js
// main.js
import { createSSRApp } from "vue";
import App from "./App.vue";
import UIComponents from './components/ui';

export function createApp() {
  const app = createSSRApp(App);
  
  // 注册UI组件
  app.use(UIComponents);
  
  // ...其他配置
  
  return { app };
}
```

### 按需引入

也可以在需要的组件中单独引入：

```js
import { FormInput, ActionButton } from '@/components/ui';

export default {
  components: {
    FormInput,
    ActionButton
  }
  // ...
}
```

## 组件使用示例

### FormInput - 表单输入框

```vue
<template>
  <form-input
    v-model="username"
    label="用户名"
    placeholder="请输入用户名"
    icon="👤"
    :error="usernameError"
    @icon-click="handleIconClick"
  />
</template>

<script>
export default {
  data() {
    return {
      username: '',
      usernameError: ''
    }
  },
  methods: {
    handleIconClick() {
      // 处理图标点击事件
    }
  }
}
</script>
```

#### 属性

- `modelValue` - 输入框的值（v-model）
- `label` - 输入框标签
- `placeholder` - 输入框占位符
- `icon` - 输入框图标
- `type` - 输入框类型（text, password, number等）
- `error` - 错误信息
- `disabled` - 是否禁用

#### 事件

- `update:modelValue` - 值更新事件
- `icon-click` - 图标点击事件

### ActionButton - 按钮

```vue
<template>
  <action-button 
    type="primary" 
    size="medium"
    :loading="isLoading"
    :disabled="isDisabled"
    @click="handleClick"
  >
    提交
  </action-button>
</template>
```

#### 属性

- `type` - 按钮类型（primary, secondary, danger, outline）
- `size` - 按钮尺寸（small, medium, large）
- `block` - 是否为块级按钮
- `disabled` - 是否禁用
- `loading` - 是否显示加载中状态

#### 事件

- `click` - 点击事件

### ModalDialog - 模态框

```vue
<template>
  <modal-dialog
    v-model:visible="isVisible"
    title="提示"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    :confirm-loading="confirmLoading"
  >
    <p>这是模态框的内容</p>
  </modal-dialog>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      confirmLoading: false
    }
  },
  methods: {
    handleConfirm() {
      // 处理确认事件
      this.confirmLoading = true;
      setTimeout(() => {
        this.isVisible = false;
        this.confirmLoading = false;
      }, 1000);
    },
    handleCancel() {
      this.isVisible = false;
    }
  }
}
</script>
```

#### 属性

- `visible` - 是否显示模态框
- `title` - 模态框标题
- `showClose` - 是否显示关闭按钮
- `showFooter` - 是否显示底部按钮
- `showCancel` - 是否显示取消按钮
- `showConfirm` - 是否显示确认按钮
- `cancelText` - 取消按钮文本
- `confirmText` - 确认按钮文本
- `confirmLoading` - 确认按钮是否显示加载状态
- `size` - 模态框尺寸（small, medium, large, fullscreen）
- `maskClosable` - 点击遮罩是否可关闭

#### 事件

- `update:visible` - 可见性更新事件
- `close` - 关闭事件
- `cancel` - 取消事件
- `confirm` - 确认事件

### MenuItem - 菜单项

```vue
<template>
  <menu-item
    label="个人资料"
    icon="👤"
    iconClass="person-icon"
    badge="5"
    @click="handleClick"
  />
</template>
```

#### 属性

- `label` - 菜单项文本
- `icon` - 菜单项图标
- `iconClass` - 图标自定义样式类
- `badge` - 徽标内容
- `arrow` - 箭头内容
- `isLink` - 是否为链接样式

#### 事件

- `click` - 点击事件

### StatCard - 统计卡片

```vue
<template>
  <stat-card
    icon="⏱️"
    value="128"
    label="总学时"
    type="primary"
  />
</template>
```

#### 属性

- `value` - 统计值
- `label` - 统计标签
- `icon` - 统计图标
- `type` - 卡片类型（default, primary, success, warning, danger）
- `vertical` - 是否垂直布局
- `valueClass` - 值的自定义样式类

## 示例页面

项目中提供了完整的UI组件示例页面，可以通过访问`/pages/examples/ui-components`查看所有组件的使用效果。