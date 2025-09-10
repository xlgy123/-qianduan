<template>
  <view class="stat-card" :class="[`type-${type}`, { 'is-vertical': vertical }]">
    <view v-if="icon" class="stat-icon">{{ icon }}</view>
    <view class="stat-content">
      <text class="stat-value" :class="valueClass">{{ value }}</text>
      <text class="stat-label">{{ label }}</text>
    </view>
    <slot name="extra"></slot>
  </view>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default', // default, primary, success, warning, danger
      validator: value => ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
    },
    vertical: {
      type: Boolean,
      default: false
    },
    valueClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-card.is-vertical {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.stat-icon {
  font-size: 24px;
  margin-right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card.is-vertical .stat-icon {
  margin-right: 0;
  margin-bottom: 12px;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-card.is-vertical .stat-content {
  align-items: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 类型样式 */
.stat-card.type-default {
  background-color: #fff;
}

.stat-card.type-primary {
  background-color: rgba(166, 192, 254, 0.1);
}

.stat-card.type-primary .stat-icon {
  background-color: rgba(166, 192, 254, 0.2);
  color: #8a9eef;
}

.stat-card.type-success {
  background-color: rgba(82, 196, 26, 0.1);
}

.stat-card.type-success .stat-icon {
  background-color: rgba(82, 196, 26, 0.2);
  color: #52c41a;
}

.stat-card.type-warning {
  background-color: rgba(250, 173, 20, 0.1);
}

.stat-card.type-warning .stat-icon {
  background-color: rgba(250, 173, 20, 0.2);
  color: #faad14;
}

.stat-card.type-danger {
  background-color: rgba(255, 77, 79, 0.1);
}

.stat-card.type-danger .stat-icon {
  background-color: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
}
</style> 