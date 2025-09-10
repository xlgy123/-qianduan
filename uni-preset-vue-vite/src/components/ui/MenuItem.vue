<template>
  <view class="menu-item" :class="{ 'is-link': isLink, 'has-badge': badge }" @click="handleClick">
    <view v-if="icon" class="menu-icon" :class="iconClass">{{ icon }}</view>
    <text class="menu-label">{{ label }}</text>
    <view v-if="badge" class="menu-badge">{{ badge }}</view>
    <text v-if="arrow" class="menu-arrow">{{ arrow }}</text>
    <slot name="extra"></slot>
  </view>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    },
    badge: {
      type: [String, Number],
      default: ''
    },
    arrow: {
      type: String,
      default: '→'
    },
    isLink: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
    }
  }
}
</script>

<style>
.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 18px;
  border-radius: 6px;
}

.menu-label {
  flex: 1;
  font-size: 15px;
  color: var(--text-primary);
}

.menu-badge {
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background-color: #ff4d4f;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.menu-arrow {
  font-size: 16px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.menu-item.is-link:active {
  background-color: #f8f8f8;
}

/* 预设的图标背景样式 */
.menu-icon.study-icon {
  background-color: rgba(166, 192, 254, 0.1);
  color: #8a9eef;
}

.menu-icon.plan-icon {
  background-color: rgba(194, 168, 253, 0.1);
  color: #c2a8fd;
}

.menu-icon.goal-icon {
  background-color: rgba(250, 173, 20, 0.1);
  color: #faad14;
}

.menu-icon.medal-icon {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.menu-icon.notes-icon {
  background-color: rgba(245, 106, 0, 0.1);
  color: #f56a00;
}

.menu-icon.todo-icon {
  background-color: rgba(22, 119, 255, 0.1);
  color: #1677ff;
}

.menu-icon.clock-icon {
  background-color: rgba(237, 64, 20, 0.1);
  color: #ed4014;
}

.menu-icon.person-icon {
  background-color: rgba(114, 46, 209, 0.1);
  color: #722ed1;
}

.menu-icon.notify-icon {
  background-color: rgba(255, 213, 0, 0.1);
  color: #ffd500;
}
</style> 