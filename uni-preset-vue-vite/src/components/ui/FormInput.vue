<template>
  <view class="input-group">
    <text class="input-label" v-if="label">{{ label }}</text>
    <view class="input-container" :class="{ 'has-error': error }">
      <input
        :type="getInputType"
        class="input-field"
        :value="modelValue"
        @input="onInput"
        :placeholder="placeholder"
        :disabled="disabled"
      />
      <text v-if="icon" class="input-icon" @click="onIconClick">{{ icon }}</text>
      <slot name="append"></slot>
    </view>
    <text class="error-message" v-if="error">{{ error }}</text>
  </view>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    error: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getInputType() {
      return this.type;
    }
  },
  methods: {
    onInput(e) {
      this.$emit('update:modelValue', e.target.value);
    },
    onIconClick() {
      this.$emit('icon-click');
    }
  }
}
</script>

<style>
.input-group {
  margin-bottom: 16px;
  width: 100%;
}

.input-label {
  font-size: 14px;
  color: var(--text-secondary, #666);
  margin-bottom: 6px;
  display: block;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-field {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--border-color, #e0e0e0);
  padding: 0 40px 0 12px;
  font-size: 14px;
  background-color: #fff;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-field:focus {
  border-color: var(--primary-color, #8a9eef);
  box-shadow: 0 0 0 2px rgba(138, 158, 239, 0.1);
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: var(--text-secondary, #666);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
}

.error-message {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
  display: block;
}

.has-error .input-field {
  border-color: #ff4d4f;
}

.input-field:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style> 