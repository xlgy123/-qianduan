<template>
  <button
    class="action-button"
    :class="[
      type ? `type-${type}` : '',
      size ? `size-${size}` : '',
      { 'is-block': block, 'is-disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <text v-if="loading" class="loading-icon">⟳</text>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    type: {
      type: String,
      default: 'primary', // primary, secondary, danger, outline
      validator: value => ['primary', 'secondary', 'danger', 'outline'].includes(value)
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    block: {
      type: Boolean,
      default: false // 是否撑满容器宽度
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(e) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', e);
      }
    }
  }
}
</script>

<style>
.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* 类型样式 */
.action-button.type-primary {
  background: var(--primary-gradient, linear-gradient(90deg, #a6c0fe, #c2a8fd));
  color: white;
}

.action-button.type-secondary {
  background-color: #f0f0f0;
  color: var(--text-primary, #333);
}

.action-button.type-danger {
  background-color: #ff4d4f;
  color: white;
}

.action-button.type-outline {
  background-color: transparent;
  border: 1px solid var(--primary-color, #8a9eef);
  color: var(--primary-color, #8a9eef);
}

/* 尺寸样式 */
.action-button.size-small {
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
  border-radius: 10px;
}

.action-button.size-medium {
  height: 44px;
  padding: 0 20px;
  font-size: 15px;
}

.action-button.size-large {
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 600;
}

/* 块级按钮 */
.action-button.is-block {
  display: flex;
  width: 100%;
}

/* 禁用状态 */
.action-button.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 加载中图标 */
.loading-icon {
  display: inline-block;
  animation: rotating 1.5s linear infinite;
  margin-right: 8px;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 按钮按下效果 */
.action-button:not(.is-disabled):active {
  transform: translateY(1px);
  opacity: 0.9;
}
</style> 