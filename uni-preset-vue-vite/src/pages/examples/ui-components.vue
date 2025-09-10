<template>
  <view class="container">
    <page-transition transition-type="fade">
      <view class="example-header">
        <text class="example-title">UI组件示例</text>
      </view>
      
      <scroll-view scroll-y class="example-scroll">
        <!-- 表单输入框示例 -->
        <view class="section">
          <text class="section-title">表单输入框</text>
          <view class="section-content">
            <form-input
              v-model="formData.username"
              label="用户名"
              placeholder="请输入用户名"
              icon="👤"
              :error="formErrors.username"
            />
            
            <form-input
              v-model="formData.password"
              type="password"
              label="密码"
              placeholder="请输入密码"
              icon="🔒"
              @icon-click="togglePasswordVisible"
              :error="formErrors.password"
            />
            
            <form-input
              v-model="formData.email"
              label="邮箱"
              placeholder="请输入邮箱地址"
              icon="📧"
              :error="formErrors.email"
            />
          </view>
        </view>
        
        <!-- 按钮示例 -->
        <view class="section">
          <text class="section-title">按钮</text>
          <view class="section-content">
            <view class="button-group">
              <action-button type="primary" @click="showModal">主要按钮</action-button>
              <action-button type="secondary">次要按钮</action-button>
              <action-button type="danger">危险按钮</action-button>
              <action-button type="outline">描边按钮</action-button>
            </view>
            
            <view class="button-group">
              <action-button size="small">小按钮</action-button>
              <action-button>中按钮</action-button>
              <action-button size="large">大按钮</action-button>
            </view>
            
            <view class="button-group">
              <action-button disabled>禁用按钮</action-button>
              <action-button loading>加载中</action-button>
              <action-button block>块级按钮</action-button>
            </view>
          </view>
        </view>
        
        <!-- 菜单项示例 -->
        <view class="section">
          <text class="section-title">菜单项</text>
          <view class="section-content menu-list">
            <menu-item
              label="学习统计"
              icon="📊"
              iconClass="study-icon"
              @click="handleMenuClick('学习统计')"
            />
            
            <menu-item
              label="个人资料"
              icon="👤"
              iconClass="person-icon"
              @click="handleMenuClick('个人资料')"
            />
            
            <menu-item
              label="消息通知"
              icon="🔔"
              iconClass="notify-icon"
              badge="5"
              @click="handleMenuClick('消息通知')"
            />
            
            <menu-item
              label="学习目标"
              icon="🎯"
              iconClass="goal-icon"
              @click="handleMenuClick('学习目标')"
            />
          </view>
        </view>
        
        <!-- 统计卡片示例 -->
        <view class="section">
          <text class="section-title">统计卡片</text>
          <view class="section-content">
            <view class="stat-row">
              <stat-card
                icon="⏱️"
                value="128"
                label="总学时"
                type="primary"
              />
              
              <stat-card
                icon="🔥"
                value="30"
                label="连续打卡"
                type="warning"
              />
            </view>
            
            <view class="stat-row">
              <stat-card
                icon="🏆"
                value="5"
                label="获得勋章"
                type="success"
              />
              
              <stat-card
                icon="📈"
                value="85"
                label="效率指数"
                type="danger"
              />
            </view>
          </view>
        </view>
      </scroll-view>
    </page-transition>
    
    <!-- 模态框示例 -->
    <modal-dialog
      v-model:visible="modalVisible"
      title="模态框示例"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
      :confirm-loading="confirmLoading"
    >
      <view class="modal-example-content">
        <text class="modal-text">这是一个模态框示例，展示了如何使用ModalDialog组件。</text>
        <form-input
          v-model="modalInput"
          label="备注信息"
          placeholder="请输入备注信息"
        />
      </view>
    </modal-dialog>
  </view>
</template>

<script>
import PageTransition from '@/components/PageTransition.vue';
import { FormInput, ActionButton, ModalDialog, MenuItem, StatCard } from '@/components/ui';

export default {
  components: {
    PageTransition,
    FormInput,
    ActionButton,
    ModalDialog,
    MenuItem,
    StatCard
  },
  data() {
    return {
      // 表单数据
      formData: {
        username: '',
        password: '',
        email: ''
      },
      // 表单错误
      formErrors: {
        username: '',
        password: '',
        email: ''
      },
      // 是否显示密码
      passwordVisible: false,
      // 模态框显示状态
      modalVisible: false,
      // 模态框确认按钮加载状态
      confirmLoading: false,
      // 模态框输入内容
      modalInput: ''
    };
  },
  methods: {
    // 切换密码可见性
    togglePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
      // 修改密码输入框类型
      const passwordInput = document.querySelector('input[type="password"]');
      if (passwordInput) {
        passwordInput.type = this.passwordVisible ? 'text' : 'password';
      }
    },
    
    // 处理菜单点击
    handleMenuClick(menuName) {
      uni.showToast({
        title: `点击了${menuName}菜单`,
        icon: 'none'
      });
    },
    
    // 显示模态框
    showModal() {
      this.modalVisible = true;
    },
    
    // 模态框确认
    handleModalConfirm() {
      this.confirmLoading = true;
      
      // 模拟异步操作
      setTimeout(() => {
        this.confirmLoading = false;
        this.modalVisible = false;
        
        uni.showToast({
          title: `提交成功: ${this.modalInput}`,
          icon: 'success'
        });
      }, 1500);
    },
    
    // 模态框取消
    handleModalCancel() {
      this.modalVisible = false;
    },
    
    // 验证表单
    validateForm() {
      let isValid = true;
      
      // 重置错误信息
      Object.keys(this.formErrors).forEach(key => {
        this.formErrors[key] = '';
      });
      
      // 验证用户名
      if (!this.formData.username.trim()) {
        this.formErrors.username = '请输入用户名';
        isValid = false;
      }
      
      // 验证密码
      if (!this.formData.password) {
        this.formErrors.password = '请输入密码';
        isValid = false;
      } else if (this.formData.password.length < 6) {
        this.formErrors.password = '密码至少需要6个字符';
        isValid = false;
      }
      
      // 验证邮箱
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.formData.email) {
        this.formErrors.email = '请输入邮箱地址';
        isValid = false;
      } else if (!emailRegex.test(this.formData.email)) {
        this.formErrors.email = '请输入有效的邮箱地址';
        isValid = false;
      }
      
      return isValid;
    }
  }
};
</script>

<style>
.container {
  position: relative;
  height: 100vh;
  background-color: var(--background-color);
}

.example-header {
  padding: 48px 20px 20px;
  background-color: var(--primary-color);
}

.example-title {
  font-size: 22px;
  color: #fff;
  font-weight: 600;
}

.example-scroll {
  height: calc(100vh - 90px);
}

.section {
  margin: 20px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.section-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--card-shadow);
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.menu-list {
  border-radius: 12px;
  overflow: hidden;
}

.stat-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.stat-row .stat-card {
  flex: 1;
}

.modal-example-content {
  padding: 10px 0;
}

.modal-text {
  margin-bottom: 20px;
  display: block;
  color: var(--text-secondary);
}
</style> 