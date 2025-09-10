<template>
  <view v-if="internalVisible" class="modal-container">
    <view class="modal-mask" @tap.stop="maskClosable && handleClose()"></view>
    <view class="modal-wrapper">
      <view class="modal-content" :class="[`size-${size}`]">
        <!-- 标题区域 -->
        <view v-if="title || $slots.header" class="modal-header">
          <slot name="header">
            <text class="modal-title">{{ title }}</text>
          </slot>
          <view v-if="showClose" class="modal-close" @tap.stop="handleClose">×</view>
        </view>
        
        <!-- 内容区域 -->
        <view class="modal-body">
          <slot></slot>
        </view>
        
        <!-- 底部区域 -->
        <view v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </view>
        
        <!-- 默认底部按钮 -->
        <view v-else-if="showFooter" class="modal-footer">
          <button 
            v-if="showCancel" 
            class="modal-btn modal-cancel-btn" 
            @tap.stop="handleCancel"
          >{{ cancelText }}</button>
          <button 
            v-if="showConfirm" 
            class="modal-btn modal-confirm-btn" 
            @tap.stop="handleConfirm"
            :class="{ 'is-loading': confirmLoading }"
          >
            <text v-if="confirmLoading" class="loading-icon">⟳</text>
            {{ confirmText }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ModalDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    confirmLoading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: value => ['small', 'medium', 'large', 'fullscreen'].includes(value)
    },
    maskClosable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      internalVisible: this.visible,
      isClosing: false
    };
  },
  watch: {
    visible(val) {
      console.log('ModalDialog visible变化:', val);
      this.internalVisible = val;
      
      if (val) {
        // 显示时重置状态
        this.isClosing = false;
        
        // 模拟强制DOM更新
        this.$nextTick(() => {
          document.body.classList.add('modal-open');
        });
      } else {
        // 隐藏时标记
        this.isClosing = true;
        
        // 延迟一下才完全移除，避免动画问题
        setTimeout(() => {
          this.isClosing = false;
          document.body.classList.remove('modal-open');
        }, 300);
      }
    }
  },
  mounted() {
    if (this.visible) {
      document.body.classList.add('modal-open');
    }
  },
  beforeDestroy() {
    document.body.classList.remove('modal-open');
  },
  methods: {
    handleClose() {
      // 避免重复关闭
      if (this.isClosing) return;
      
      console.log('模态框关闭');
      this.isClosing = true;
      this.$emit('update:visible', false);
      this.$emit('close');
      
      // 延迟重置状态
      setTimeout(() => {
        this.isClosing = false;
      }, 300);
    },
    handleCancel() {
      console.log('模态框取消');
      this.handleClose();
      this.$emit('cancel');
    },
    handleConfirm() {
      console.log('模态框确认');
      this.$emit('confirm');
    }
  }
}
</script>

<style>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

.modal-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeScale 0.3s ease;
}

@keyframes fadeScale {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.modal-content {
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  max-width: 90%;
  min-width: 280px;
}

/* 尺寸 */
.modal-content.size-small {
  width: 320px;
}

.modal-content.size-medium {
  width: 420px;
}

.modal-content.size-large {
  width: 520px;
}

.modal-content.size-fullscreen {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  border-radius: 0;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-close {
  font-size: 24px;
  color: #999;
  cursor: pointer;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  transition: all 0.2s;
}

.modal-close:active {
  background-color: #f5f5f5;
  color: #666;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px 24px 20px;
  display: flex;
  justify-content: flex-end;
  border-top: none;
}

.modal-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  margin-left: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.modal-cancel-btn:active {
  background-color: #e8e8e8;
}

.modal-confirm-btn {
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  color: white;
  box-shadow: 0 4px 10px rgba(166, 192, 254, 0.3);
}

.modal-confirm-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(166, 192, 254, 0.3);
}

.modal-btn.is-loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.loading-icon {
  display: inline-block;
  animation: rotating 1.5s linear infinite;
  margin-right: 8px;
}

@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 