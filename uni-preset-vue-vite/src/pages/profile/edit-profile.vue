<template>
  <view class="edit-profile-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">编辑个人资料</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 头像选择区域 -->
    <view class="avatar-section">
      <view class="avatar-wrapper" @tap="chooseAvatar">
        <image 
          class="profile-avatar" 
          :src="userInfo.avatar || '/src/static/avatar/default-avatar.png'" 
          mode="aspectFill"
        ></image>
        <view class="avatar-edit-icon">
          <text class="edit-icon">📷</text>
        </view>
      </view>
      <text class="avatar-hint">点击更换头像</text>
    </view>

    <!-- 个人信息表单 -->
    <view class="form-section">
      <!-- 用户名 -->
      <view class="form-item">
        <text class="form-label">用户名</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="userInfo.username" 
          placeholder="请输入用户名"
          maxlength="20"
        />
      </view>

      <!-- 性别选择 -->
      <view class="form-item">
        <text class="form-label">性别</text>
        <picker 
          class="form-picker" 
          mode="selector" 
          :range="genderOptions" 
          :value="genderIndex" 
          @change="onGenderChange"
        >
          <view class="picker-value">
            <text>{{ genderOptions[genderIndex] }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>

      <!-- 生日选择 -->
      <view class="form-item">
        <text class="form-label">生日</text>
        <picker 
          class="form-picker" 
          mode="date" 
          :value="userInfo.birthday" 
          :start="birthdayRange.start" 
          :end="birthdayRange.end" 
          @change="onBirthdayChange"
        >
          <view class="picker-value">
            <text>{{ userInfo.birthday || '请选择生日' }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>

      <!-- 年龄（自动计算或手动输入） -->
      <view class="form-item">
        <text class="form-label">年龄</text>
        <view class="age-display">
          <text>{{ calculatedAge }}岁</text>
          <text class="age-hint" v-if="userInfo.birthday">（根据生日自动计算）</text>
        </view>
      </view>

      <!-- 个人简介 -->
      <view class="form-item">
        <text class="form-label">个人简介</text>
        <textarea 
          class="form-textarea" 
          v-model="userInfo.bio" 
          placeholder="请输入个人简介（选填）"
          maxlength="100"
        ></textarea>
        <text class="textarea-counter">{{ userInfo.bio ? userInfo.bio.length : 0 }}/100</text>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="action-section">
      <button class="save-button" @tap="saveProfile">保存</button>
      <button class="cancel-button" @tap="goBack">取消</button>
    </view>
  </view>
</template>

<script>
import { Navigation } from '@/utils/navigation';
import { userStore } from '@/store/userStore';

export default {
  data() {
    return {
      userInfo: {
        username: '',
        gender: 0, // 0: 未设置, 1: 男, 2: 女
        birthday: '',
        bio: '',
        avatar: ''
      },
      genderOptions: ['未设置', '男', '女'],
      birthdayRange: {
        start: '1950-01-01',
        end: new Date().toISOString().split('T')[0] // 今天
      },
      avatarList: [] // 存储本地头像列表
    };
  },
  computed: {
    genderIndex() {
      return this.userInfo.gender;
    },
    calculatedAge() {
      if (!this.userInfo.birthday) return '--';
      
      const today = new Date();
      const birthDate = new Date(this.userInfo.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= 0 ? age : 0;
    }
  },
  onLoad() {
    // 加载现有用户信息
    this.loadUserInfo();
    // 加载头像列表
    this.loadAvatarList();
  },
  methods: {
    // 加载用户信息
    loadUserInfo() {
      try {
        // 先尝试从全局状态获取用户信息
        const globalUserInfo = userStore.getState();
        
        // 再尝试从本地存储获取更详细的用户信息
        const savedUserInfo = uni.getStorageSync('userProfile');
        
        if (savedUserInfo) {
          const parsedInfo = JSON.parse(savedUserInfo);
          
          // 合并全局状态和本地存储的信息
          this.userInfo = {
            ...parsedInfo,
            username: globalUserInfo.username || parsedInfo.username || '学习达人',
            avatar: globalUserInfo.avatar || parsedInfo.avatar || '/static/default-avatar.png'
          };
        } else {
          // 使用全局状态信息
          this.userInfo = {
            username: globalUserInfo.username || '学习达人',
            gender: 0,
            birthday: '',
            bio: '',
            avatar: globalUserInfo.avatar || '/static/default-avatar.png'
          };
        }
        
        // 确保性别值有效
        if (this.userInfo.gender === undefined || this.userInfo.gender === null) {
          this.userInfo.gender = 0;
        }
        
        console.log('加载用户信息:', this.userInfo);
      } catch (e) {
        console.error('加载用户信息失败:', e);
        uni.showToast({
          title: '加载用户信息失败',
          icon: 'none'
        });
      }
    },
    
    // 加载头像列表
    loadAvatarList() {
      this.avatarList = [
        '/src/static/avatar/default-avatar.png',
        '/src/static/avatar/avatar1.png', 
        '/src/static/avatar/avatar2.png',
        '/src/static/avatar/avatar3.png',
        '/src/static/avatar/avatar4.png',
        '/src/static/avatar/avatar5.png'
      ];
    },
    
    // 选择头像
    chooseAvatar() {
      uni.showActionSheet({
        itemList: ['从相册选择', '从预设头像选择'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.chooseImageFromAlbum();
          } else if (res.tapIndex === 1) {
            this.showAvatarPicker();
          }
        }
      });
    },
    
    // 从相册选择图片
    chooseImageFromAlbum() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0];
          
          // 实际应用中，这里应该上传图片到服务器
          console.log('选择的图片路径:', res.tempFilePaths[0]);
        }
      });
    },
    
    // 显示预设头像选择器
    showAvatarPicker() {
      // 创建临时列表用于显示
      const displayList = this.avatarList.map(path => '头像');
      
      uni.showActionSheet({
        itemList: displayList,
        success: (res) => {
          const selectedAvatar = this.avatarList[res.tapIndex];
          this.userInfo.avatar = selectedAvatar;
          console.log('选择的预设头像:', selectedAvatar);
        }
      });
    },
    
    // 性别选择变更
    onGenderChange(e) {
      this.userInfo.gender = parseInt(e.detail.value);
    },
    
    // 生日选择变更
    onBirthdayChange(e) {
      this.userInfo.birthday = e.detail.value;
    },
    
    // 保存个人资料
    saveProfile() {
      // 验证输入
      if (!this.userInfo.username || this.userInfo.username.trim() === '') {
        uni.showToast({
          title: '用户名不能为空',
          icon: 'none'
        });
        return;
      }
      
      try {
        // 保存到本地存储
        uni.setStorageSync('userProfile', JSON.stringify(this.userInfo));
        
        // 更新全局状态 - 只更新头像和用户名
        userStore.updateState({
          username: this.userInfo.username,
          avatar: this.userInfo.avatar
        });
        
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        });
        
        // 延迟后返回
        setTimeout(() => {
          this.goBack();
        }, 1000);
      } catch (e) {
        console.error('保存用户信息失败:', e);
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    },
    
    // 返回上一页
    goBack() {
      // 优先尝试返回上一页，如果没有则跳转到个人页面
      let pages = getCurrentPages();
      if (pages.length > 1) {
        Navigation.navigateBack();
      } else {
        Navigation.redirectTo('/pages/profile/profile');
      }
    }
  }
};
</script>

<style>
.edit-profile-container {
  min-height: 100vh;
  background-color: #f8f3ff;
  padding-bottom: 30px;
}

/* 导航栏样式 */
.nav-bar {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  color: #fff;
  position: relative;
}

.nav-back {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 24px;
  font-weight: bold;
}

.nav-title {
  font-size: 17px;
  font-weight: 500;
}

.nav-placeholder {
  width: 44px;
}

/* 头像选择区域 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  background-color: #fff;
  margin-bottom: 15px;
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #f0f0f0;
}

.avatar-edit-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #8a9eef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.edit-icon {
  font-size: 16px;
}

.avatar-hint {
  font-size: 14px;
  color: #999;
}

/* 表单样式 */
.form-section {
  background-color: #fff;
  border-radius: 12px;
  margin: 0 15px 20px;
  padding: 15px;
}

.form-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 15px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.form-input {
  height: 40px;
  font-size: 16px;
  color: #333;
  width: 100%;
  padding: 0 5px;
}

.form-picker {
  height: 40px;
}

.picker-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-size: 16px;
  color: #333;
}

.picker-arrow {
  color: #999;
  font-size: 12px;
}

.age-display {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #333;
}

.age-hint {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}

.form-textarea {
  width: 100%;
  height: 100px;
  font-size: 16px;
  color: #333;
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.textarea-counter {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

/* 按钮样式 */
.action-section {
  padding: 0 15px;
}

.save-button {
  background: linear-gradient(to right, #8a9eef, #c2a8fd);
  color: #fff;
  height: 45px;
  line-height: 45px;
  border-radius: 22.5px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
}

.cancel-button {
  background-color: #f0f0f0;
  color: #666;
  height: 45px;
  line-height: 45px;
  border-radius: 22.5px;
  font-size: 16px;
}
</style> 