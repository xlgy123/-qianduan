<template>
	<view class="login-container">
		<!-- 背景 -->
		<view class="login-bg"></view>
		
		<!-- 登录卡片 -->
		<view class="login-card">
			<!-- 顶部标签页切换 - 在忘记密码页面隐藏 -->
			<TabTransition 
				v-if="currentPage !== 'forgot'"
				:tabs="[{label: '登录'}, {label: '注册'}]"
				:initialTab="currentPage === 'login' ? 0 : 1"
				@change="handleTabChange"
				class="login-tab-transition"
			>
				<!-- 登录页面 -->
				<template #tab-0>
					<text class="page-title">欢迎回来</text>
					<text class="page-subtitle">登录您的自习室账号</text>·
					
					<!-- 登录方式选择 -->
					<SwitchTabView 
						:options="loginOptions" 
						:initialIndex="loginType === 'phone' ? 0 : 1"
						@change="handleLoginTypeChange"
					>
						<!-- 手机号登录表单 -->
						<template #option-0>
							<view class="input-group">
								<text class="input-label">手机号</text>
								<input type="number" class="input-field" v-model="phoneForm.phone" placeholder="请输入手机号" />
								<text class="input-icon">📱</text>
								<text class="error-message" v-if="errors.phone">{{errors.phone}}</text>
							</view>
							
							<view class="input-group">
								<text class="input-label">验证码</text>
								<view class="flex-group">
									<input type="text" class="input-field" v-model="phoneForm.captcha" placeholder="请输入验证码" />
									<button class="action-button captcha-button" @click="sendPhoneCaptcha" :disabled="captchaTimer > 0">
										{{captchaTimer > 0 ? `${captchaTimer}秒后重发` : '获取验证码'}}
									</button>
								</view>
								<text class="error-message" v-if="errors.phoneCaptcha">{{errors.phoneCaptcha}}</text>
							</view>
							
							<button class="action-button login-btn" @click="handlePhoneLogin">登 录</button>
						</template>
						
						<!-- 邮箱登录表单 -->
						<template #option-1>
							<view class="input-group">
								<text class="input-label">邮箱</text>
								<input type="text" class="input-field" v-model="loginForm.email" placeholder="请输入邮箱" />
								<text class="input-icon">📧</text>
								<text class="error-message" v-if="errors.loginEmail">{{errors.loginEmail}}</text>
							</view>
							
							<view class="input-group">
								<text class="input-label">密码</text>
								<input :type="passwordVisible ? 'text' : 'password'" class="input-field" v-model="loginForm.password" placeholder="请输入密码" />
								<text class="input-icon" @click="togglePasswordVisibility">{{passwordVisible ? '👁️' : '🔒'}}</text>
								<text class="error-message" v-if="errors.loginPassword">{{errors.loginPassword}}</text>
							</view>
							
							<view class="checkbox-group">
								<label class="checkbox-wrapper">
									<checkbox class="checkbox" v-model="loginForm.remember" color="#a6c0fe" />
									<text>记住我</text>
								</label>
								<text class="link-text" @click="switchToForgot">忘记密码?</text>
							</view>
							
							<button class="action-button login-btn" @click="handleLogin">登 录</button>
						</template>
					</SwitchTabView>
					
					<!-- 第三方登录 -->
					<view class="oauth-section">
						<view class="divider">或通过以下方式登录</view>
						
						<view class="oauth-buttons">
							<view class="oauth-button wechat-button" @click="handleOauthLogin('wechat')">
								<text class="wechat-text">微</text>
							</view>
							<view class="oauth-button qq-button" @click="handleOauthLogin('qq')">
								<text class="qq-text">Q</text>
							</view>
						</view>
					</view>
				</template>
				
				<!-- 注册页面 -->
				<template #tab-1>
					<text class="page-title">创建账号</text>
					<text class="page-subtitle">加入我们的自习室社区</text>
					
					<view class="form-container register-form">
						<view class="input-group">
							<text class="input-label">用户名</text>
							<input type="text" class="input-field" v-model="registerForm.username" placeholder="请输入用户名" />
							<text class="input-icon">👤</text>
							<text class="error-message" v-if="errors.registerUsername">{{errors.registerUsername}}</text>
						</view>
						
						<view class="input-group">
							<text class="input-label">邮箱</text>
							<input type="text" class="input-field" v-model="registerForm.email" placeholder="请输入邮箱" />
							<text class="input-icon">📧</text>
							<text class="error-message" v-if="errors.registerEmail">{{errors.registerEmail}}</text>
						</view>
						
						<view class="input-group">
							<text class="input-label">密码</text>
							<input type="password" class="input-field" v-model="registerForm.password" placeholder="请输入密码" />
							<text class="input-icon">🔒</text>
							<text class="error-message" v-if="errors.registerPassword">{{errors.registerPassword}}</text>
						</view>
						
						<view class="input-group">
							<text class="input-label">确认密码</text>
							<input type="password" class="input-field" v-model="registerForm.confirmPassword" placeholder="请再次输入密码" />
							<text class="input-icon">🔐</text>
							<text class="error-message" v-if="errors.registerConfirmPassword">{{errors.registerConfirmPassword}}</text>
						</view>
						
						<button class="action-button login-btn" @click="handleRegister">注 册</button>
					</view>
					
					<!-- 第三方登录 -->
					<view class="oauth-section">
						<view class="divider">或通过以下方式登录</view>
						
						<view class="oauth-buttons">
							<view class="oauth-button wechat-button" @click="handleOauthLogin('wechat')">
								<text class="wechat-text">微</text>
							</view>
							<view class="oauth-button qq-button" @click="handleOauthLogin('qq')">
								<text class="qq-text">Q</text>
							</view>
						</view>
					</view>
				</template>
			</TabTransition>
			
			<!-- 忘记密码页面 -->
			<view v-if="currentPage === 'forgot'">
				<view class="back-header">
					<text class="header-title">找回密码</text>
				</view>
				
				<TransitionView :isActive="currentPage === 'forgot'" :direction="animationDirection">
					<text class="page-subtitle">我们将发送重置链接到您的邮箱</text>
					
					<view class="form-container forgot-form">
						<view class="input-group">
							<text class="input-label">邮箱账号</text>
							<input type="text" class="input-field" v-model="forgotForm.email" placeholder="请输入注册邮箱" />
							<text class="input-icon">📧</text>
							<text class="error-message" v-if="errors.forgotEmail">{{errors.forgotEmail}}</text>
						</view>
						
						<view class="input-group">
							<text class="input-label">验证码</text>
							<view class="flex-group">
								<input type="text" class="input-field" v-model="forgotForm.captcha" placeholder="请输入验证码" />
								<button class="action-button captcha-button" @click="sendCaptcha" :disabled="captchaTimer > 0">
									{{captchaTimer > 0 ? `${captchaTimer}秒后重发` : '获取验证码'}}
								</button>
							</view>
							<text class="error-message" v-if="errors.forgotCaptcha">{{errors.forgotCaptcha}}</text>
						</view>
						
						<!-- 添加新密码输入框 -->
						<view class="input-group">
							<text class="input-label">新密码</text>
							<input type="password" class="input-field" v-model="forgotForm.newPassword" placeholder="请输入新密码" />
							<text class="input-icon">🔒</text>
							<text class="error-message" v-if="errors.forgotNewPassword">{{errors.forgotNewPassword}}</text>
						</view>
						
						<!-- 添加确认密码输入框 -->
						<view class="input-group">
							<text class="input-label">确认密码</text>
							<input type="password" class="input-field" v-model="forgotForm.confirmPassword" placeholder="请再次输入新密码" />
							<text class="input-icon">🔐</text>
							<text class="error-message" v-if="errors.forgotConfirmPassword">{{errors.forgotConfirmPassword}}</text>
						</view>
						
						<button class="action-button login-btn" @click="handleResetPassword">重置密码</button>
						<button class="action-button return-btn" @click="switchToLogin">返回登录</button>
					</view>
				</TransitionView>
			</view>
		</view>
	</view>
</template>

<script>
import TabTransition from '@/components/TabTransition.vue'
import SwitchTabView from '@/components/SwitchTabView.vue'
import TransitionView from '@/components/TransitionView.vue'
import { Navigation } from '@/utils/navigation';
import { userStore } from '@/store/userStore';

export default {
	components: {
		TabTransition,
		SwitchTabView,
		TransitionView
	},
	data() {
		return {
			currentPage: 'login',
			loginType: 'phone', // 默认为手机号登录
			passwordVisible: false,
			captchaTimer: 0,
			animationDirection: 'right',
			
			// 选项配置
			loginOptions: [
				{ label: '手机号登录' },
				{ label: '邮箱登录' }
			],
			
			phoneForm: {
				phone: '',
				captcha: ''
			},
			loginForm: {
				email: '',
				password: '',
				remember: false
			},
			registerForm: {
				username: '',
				email: '',
				password: '',
				confirmPassword: ''
			},
			forgotForm: {
				email: '',
				captcha: '',
				newPassword: '',
				confirmPassword: ''
			},
			errors: {
				phone: '',
				phoneCaptcha: '',
				loginEmail: '',
				loginPassword: '',
				registerUsername: '',
				registerEmail: '',
				registerPassword: '',
				registerConfirmPassword: '',
				forgotEmail: '',
				forgotCaptcha: '',
				forgotNewPassword: '',
				forgotConfirmPassword: ''
			},
			isTablet: false, // 添加设备类型标识
		}
	},
	onLoad() {
		// 检查设备类型
		this.checkDeviceType();
		
		// 检查登录状态，如果已登录直接跳转到首页
		const token = uni.getStorageSync('token');
		if (token) {
			// 直接跳转到首页，不使用Navigation类避免循环
			uni.redirectTo({
				url: '/pages/home/home'
			});
		}
	},
	methods: {
		// 检查设备类型
		checkDeviceType() {
			try {
				const app = getApp();
				if (app && app.globalData) {
					this.isTablet = app.globalData.isTablet;
				} else {
					// 如果全局变量不可用，则使用自己的方法检测
					const systemInfo = uni.getSystemInfoSync();
					this.isTablet = systemInfo.windowWidth >= 768;
				}
			} catch (e) {
				console.error('获取设备信息失败:', e);
			}
		},
		
		// 处理标签页切换
		handleTabChange(index) {
			this.clearErrors();
			this.animationDirection = index === 0 ? 'left' : 'right';
			this.currentPage = index === 0 ? 'login' : 'register';
		},
		
		// 处理登录类型切换
		handleLoginTypeChange(index) {
			this.clearErrors();
			this.animationDirection = index === 0 ? 'left' : 'right';
			this.loginType = index === 0 ? 'phone' : 'email';
		},
		
		// 切换到忘记密码页面
		switchToForgot() {
			this.clearErrors();
			this.animationDirection = 'right';
			this.currentPage = 'forgot';
		},
		
		// 切换到登录页面
		switchToLogin() {
			this.clearErrors();
			this.animationDirection = 'left';
			this.currentPage = 'login';
		},
		
		// 切换密码可见性
		togglePasswordVisibility() {
			this.passwordVisible = !this.passwordVisible;
		},
		
		// 清空错误信息
		clearErrors() {
			for (let key in this.errors) {
				this.errors[key] = '';
			}
		},
		 // 新增手机号格式验证
		 isValidPhone(phone) {
          return /^1[3-9]\d{9}$/.test(phone);
         },
		// 新增密码复杂度验证（至少6位）
		isValidPassword(pwd) {
           return pwd.length >= 6;
        },
		// 验证邮箱格式
		isValidEmail(email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(email);
		},
		
		// 验证手机号格式
		isValidPhone(phone) {
			const phoneRegex = /^1[3-9]\d{9}$/;
			return phoneRegex.test(phone);
		},
		// 发送手机验证码
		sendPhoneCaptcha() {
			this.clearErrors();
			
			// 验证手机号
			if (!this.isValidPhone(this.phoneForm.phone)) {
				this.errors.phone = '请输入有效的手机号';
				return;
			}
			
			// 开始倒计时
			this.captchaTimer = 60;
			const timer = setInterval(() => {
				this.captchaTimer--;
				if (this.captchaTimer <= 0) {
					clearInterval(timer);
				}
			}, 1000);
			
			// 模拟发送验证码
			uni.showToast({
				title: '验证码已发送',
				icon: 'success'
			});
		},
		
	
	
// 模拟登录功能
handlePhoneLogin() {
  this.clearErrors();
  let hasError = false;

  // 手机号验证
  if (!this.isValidPhone(this.phoneForm.phone)) {
    this.errors.phone = '请输入有效的手机号';
    hasError = true;
  }
  
  // 验证码验证
  if (!this.phoneForm.captcha) {
    this.errors.phoneCaptcha = '验证码不能为空';
    hasError = true;
  }

  if (hasError) return;

  uni.showLoading({ title: '登录中...' });
  
  // 模拟登录成功
  setTimeout(() => {
    // 创建模拟用户数据
    const mockUser = {
      id: '123456',
      username: '模拟用户_' + this.phoneForm.phone.substring(7),
      phone: this.phoneForm.phone,
      avatar: '/static/avatar/avatar1.png',
      email: 'user' + this.phoneForm.phone.substring(7) + '@example.com'
    };
    
    // 创建模拟token
    const mockToken = 'mock_token_' + Date.now();
    
    // 存储模拟数据
    uni.setStorageSync('token', mockToken);
    uni.setStorageSync('userInfo', mockUser);
    
    // 使用userStore的login方法更新用户状态
    const store = userStore;
    store.login(mockUser);
    
    uni.hideLoading();
    
    // 显示登录成功提示
    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 跳转到首页
        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/home/home'
          });
        }, 1500);
      }
    });
  }, 1000); // 模拟网络延迟
},

// 邮箱登录处理 - 模拟登录
handleLogin() {
  this.clearErrors();
  let hasError = false;
  
  // 邮箱验证
  if (!this.isValidEmail(this.loginForm.email)) {
    this.errors.loginEmail = '请输入有效的邮箱地址';
    hasError = true;
  }
  
  // 密码验证
  if (!this.loginForm.password) {
    this.errors.loginPassword = '密码不能为空';
    hasError = true;
  }
  
  if (hasError) return;
  
  uni.showLoading({ title: '登录中...' });
  
  // 模拟登录成功
  setTimeout(() => {
    // 从邮箱中提取用户名
    const emailParts = this.loginForm.email.split('@');
    const username = emailParts[0];
    
    // 创建模拟用户数据
    const mockUser = {
      id: '654321',
      username: '模拟用户_' + username,
      email: this.loginForm.email,
      avatar: '/static/avatar/avatar2.png'
    };
    
    // 创建模拟token
    const mockToken = 'mock_token_' + Date.now();
    
    // 存储模拟数据
    uni.setStorageSync('token', mockToken);
    uni.setStorageSync('userInfo', mockUser);
    
    // 使用userStore的login方法更新用户状态
    const store = userStore;
    store.login(mockUser);
    
    uni.hideLoading();
    
    // 显示登录成功提示
    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 跳转到首页
        setTimeout(() => {
          uni.redirectTo({
            url: '/pages/home/home'
          });
        }, 1500);
      }
    });
  }, 1000); // 模拟网络延迟
},

// 注册处理 - 模拟注册
handleRegister() {
  this.clearErrors();
  let hasError = false;
  
  // 用户名验证
  if (!this.registerForm.username) {
    this.errors.registerUsername = '用户名不能为空';
    hasError = true;
  }
  
  // 邮箱验证
  if (!this.isValidEmail(this.registerForm.email)) {
    this.errors.registerEmail = '请输入有效的邮箱地址';
    hasError = true;
  }
  
  // 密码验证
  if (this.registerForm.password.length < 6) {
    this.errors.registerPassword = '密码至少需要6个字符';
    hasError = true;
  }
  
  // 确认密码验证
  if (this.registerForm.password !== this.registerForm.confirmPassword) {
    this.errors.registerConfirmPassword = '两次输入的密码不一致';
    hasError = true;
  }
  
  if (hasError) return;
  
  uni.showLoading({ title: '注册中...' });
  
  // 模拟注册过程
  setTimeout(() => {
    uni.hideLoading();
    
    // 模拟注册成功
    uni.showToast({
      title: '注册成功，请登录',
      icon: 'success',
      duration: 2000
    });
    
    // 将注册信息存储到本地，以便在登录时使用
    const registeredUsers = uni.getStorageSync('registeredUsers') || [];
    registeredUsers.push({
      username: this.registerForm.username,
      email: this.registerForm.email,
      password: this.registerForm.password, // 实际应用中应该加密存储
      avatar: '/static/avatar/avatar' + Math.floor(Math.random() * 5 + 1) + '.png'
    });
    uni.setStorageSync('registeredUsers', registeredUsers);
    
    // 切换到登录页并填充邮箱
    setTimeout(() => {
      this.loginForm.email = this.registerForm.email;
      this.switchToLogin();
    }, 2000);
  }, 1500); // 模拟网络延迟
},
		// 发送验证码 - 模拟发送
		sendCaptcha() {
		  this.clearErrors();
		  
		  // 验证邮箱
		  if (!this.isValidEmail(this.forgotForm.email)) {
		    this.errors.forgotEmail = '请输入有效的邮箱地址';
		    return;
		  }
		  
		  // 开始倒计时
		  this.captchaTimer = 60;
		  const timer = setInterval(() => {
		    this.captchaTimer--;
		    if (this.captchaTimer <= 0) {
		      clearInterval(timer);
		    }
		  }, 1000);
		  
		  // 模拟发送验证码
		  uni.showToast({
		    title: '验证码已发送',
		    icon: 'success'
		  });
		  
		  // 将验证码存储在本地，实际应用中应该通过服务器发送
		  uni.setStorageSync('resetCaptcha_' + this.forgotForm.email, '123456');
		},

		// 重置密码 - 模拟重置
		handleResetPassword() {
		  this.clearErrors();
		  let hasError = false;
		  
		  // 邮箱验证
		  if (!this.isValidEmail(this.forgotForm.email)) {
		    this.errors.forgotEmail = '请输入有效的邮箱地址';
		    hasError = true;
		  }
		  
		  // 验证码验证
		  if (!this.forgotForm.captcha) {
		    this.errors.forgotCaptcha = '验证码不能为空';
		    hasError = true;
		  } else if (this.forgotForm.captcha !== '123456') { // 模拟验证码检查
		    this.errors.forgotCaptcha = '验证码错误';
		    hasError = true;
		  }
		  
		  // 新密码验证
		  if (this.forgotForm.newPassword.length < 6) {
		    this.errors.forgotNewPassword = '密码至少需要6个字符';
		    hasError = true;
		  }
		  
		  // 确认密码验证
		  if (this.forgotForm.newPassword !== this.forgotForm.confirmPassword) {
		    this.errors.forgotConfirmPassword = '两次输入的密码不一致';
		    hasError = true;
		  }
		  
		  if (hasError) return;
		  
		  uni.showLoading({ title: '重置中...' });
		  
		  // 模拟重置密码过程
		  setTimeout(() => {
		    // 获取已注册用户
		    const registeredUsers = uni.getStorageSync('registeredUsers') || [];
		    let userFound = false;
		    
		    // 查找用户并更新密码
		    for (let i = 0; i < registeredUsers.length; i++) {
		      if (registeredUsers[i].email === this.forgotForm.email) {
		        registeredUsers[i].password = this.forgotForm.newPassword;
		        userFound = true;
		        break;
		      }
		    }
		    
		    // 如果找到用户，更新存储
		    if (userFound) {
		      uni.setStorageSync('registeredUsers', registeredUsers);
		    }
		    
		    uni.hideLoading();
		    
		    // 显示成功消息
		    uni.showToast({
		      title: '密码重置成功，请登录',
		      icon: 'success',
		      duration: 2000
		    });
		    
		    // 切换到登录页
		    setTimeout(() => {
		      this.loginForm.email = this.forgotForm.email;
		      this.switchToLogin();
		    }, 2000);
		  }, 1500); // 模拟网络延迟
		},
		
		// 第三方登录
		handleOauthLogin(type) {
			let provider = '';
			
			switch(type) {
				case 'wechat':
					provider = '微信';
					break;
				case 'qq':
					provider = 'QQ';
					break;
			}
			
			uni.showToast({
				title: `正在使用${provider}登录`,
				icon: 'none'
			});
		}
	}
}
</script>

<style>
/* 全局过渡效果 */
* {
	transition-property: none; /* 移除全局过渡效果 */
}

page {
	background: #f8f3ff; /* 淡紫色背景 */
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

.login-container {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	padding: 30px 0;
	box-sizing: border-box;
	flex: 1;
}

.login-bg {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom, #e0d0ff, #f8f3ff);
	z-index: -1;
}

.login-card {
	width: 90%;
	max-width: 360px;
	background-color: #ffffff;
	border-radius: 24px;
	padding: 25px 20px 20px; /* 增加底部内边距 */
	box-shadow: 0 10px 30px rgba(166, 192, 254, 0.15);
	position: relative;
	overflow: visible;
	height: auto;
	min-height: 520px; /* 略微增加最小高度 */
	margin: 10px 0;
	display: flex;
	flex-direction: column;
	z-index: 1; /* 确保卡片不会覆盖标签线条 */
}

.page-title {
	color: #333;
	font-size: 24px;
	font-weight: 700;
	text-align: center;
	display: block;
	margin-bottom: 5px;
	background-image: linear-gradient(90deg, #a6c0fe, #c2a8fd);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
}

.page-subtitle {
	color: #666;
	font-size: 14px;
	text-align: center;
	display: block;
	margin-bottom: 20px;
}

.input-group {
	margin-bottom: 15px;
	position: relative;
	width: 100%;
}

.input-label {
	display: block;
	color: #555;
	font-size: 14px;
	margin-bottom: 6px;
	font-weight: 500;
}

.input-field {
	width: 100%;
	padding: 12px 36px 12px 16px;
	border: 1px solid #e0e0e0;
	border-radius: 12px;
	font-size: 15px;
	background-color: #ffffff;
	color: #333;
	box-sizing: border-box;
	height: 44px;
	margin-bottom: 0;
}

.input-field:focus {
	border-color: #a6c0fe;
	box-shadow: 0 0 0 3px rgba(166, 192, 254, 0.2);
}

.input-icon {
	position: absolute;
	right: 16px;
	top: 38px;
	color: #999;
	font-size: 16px;
}

.checkbox-group {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
	width: 100%;
}

.checkbox-wrapper {
	display: flex;
	align-items: center;
	font-size: 14px;
	color: #666;
}

.checkbox {
	margin-right: 6px;
	transform: scale(0.85);
}

.link-text {
	color: #a6c0fe;
	font-size: 14px;
	text-decoration: none;
	font-weight: 500;
}

.link-text:hover {
	color: #c2a8fd;
}

.action-button {
	width: 100%;
	padding: 0;
	background: linear-gradient(90deg, #a6c0fe, #c2a8fd);
	border: none;
	border-radius: 12px;
	color: white;
	font-size: 16px;
	font-weight: 600;
	position: relative;
	overflow: hidden;
	height: 44px;
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
				transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.login-btn {
	margin-top: 10px;
	margin-bottom: 15px;
	box-shadow: 0 4px 15px rgba(166, 192, 254, 0.3);
}

.return-btn {
	background: white;
	color: #a6c0fe;
	border: 1px solid #a6c0fe;
	box-shadow: none;
	margin-top: 10px;
}

.return-btn:hover {
	background: rgba(166, 192, 254, 0.05);
	box-shadow: 0 2px 6px rgba(166, 192, 254, 0.2);
}

.return-btn:active {
	transform: scale(0.98);
	background: rgba(166, 192, 254, 0.1);
}

.action-button:active {
	transform: scale(0.98);
	box-shadow: 0 2px 10px rgba(166, 192, 254, 0.2);
}

.flex-group {
	display: flex;
	gap: 10px;
	width: 100%;
}

.captcha-button {
	flex: 0 0 110px;
	padding: 0;
	font-size: 13px;
	border-radius: 12px;
}

.divider {
	display: flex;
	align-items: center;
	margin: 5px 0;
	color: #999;
	font-size: 13px;
	width: 100%;
}

.divider::before, .divider::after {
	content: "";
	flex: 1;
	height: 1px;
	background: #eee;
}

.divider::before {
	margin-right: 12px;
}

.divider::after {
	margin-left: 12px;
}

.oauth-buttons {
	display: flex;
	justify-content: center;
	gap: 25px;
	margin-top: 5px;
	margin-bottom: 2px;
	width: 100%;
}

.oauth-button {
	width: 46px;
	height: 46px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #eee;
	background: white;
	font-size: 18px;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.oauth-button:hover {
	transform: translateY(-2px);
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.wechat-button {
	background-color: #07C160;
	border: none;
}

.qq-button {
	background-color: #12B7F5;
	border: none;
}

.wechat-text, .qq-text {
	color: white;
	font-size: 16px;
	font-weight: bold;
}

.oauth-button:active {
	transform: translateY(2px);
}

.error-message {
	color: #ff6b6b;
	font-size: 12px;
	margin-top: 4px;
	margin-bottom: 0;
	line-height: 1.2;
	display: block;
	animation: fadeIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.back-header {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 25px;
	padding-bottom: 15px;
	border-bottom: 1px solid #eee;
}

.header-title {
	font-size: 18px;
	font-weight: 600;
	color: #333;
	text-align: center;
}

/* 使第三方登录部分保持在底部固定位置 */
.oauth-section {
	padding-top: 5px;
	padding-bottom: 0;
	background-color: #fff;
	z-index: 10;
	margin-top: auto; /* 保持在底部 */
}

/* 注册表单和忘记密码表单样式 */
.form-container {
	width: 100%;
	display: flex;
	flex-direction: column;
}

.register-form, .forgot-form {
	width: 100%;
	height: auto;
	position: relative;
	display: flex;
	flex-direction: column;
	margin-bottom: 30px;
}

/* 响应式调整 */
@media screen and (max-height: 700px) {
	.oauth-section {
		margin-top: 10px; /* 减少间距 */
	}
}

@media screen and (min-width: 768px) and (max-width: 1024px) and (min-height: 900px) {
	.login-card {
		margin: 40px 0;
	}
	
	.oauth-section {
		margin-top: 10px; /* 减少顶部边距 */
	}
}

@media screen and (min-width: 768px) and (max-height: 900px) {
	.login-card {
		padding: 25px 30px 10px; /* 减少底部内边距 */
	}
	
	.input-group {
		margin-bottom: 12px;
	}
	
	.action-button {
		margin-bottom: 10px;
	}
}

@media screen and (min-width: 1280px) {
	.login-card {
		max-width: 550px;
		padding: 40px 50px 20px; /* 调整内边距 */
	}
	
	.input-field {
		height: 54px;
		font-size: 16px;
	}
	
	.action-button {
		height: 54px;
		font-size: 18px;
	}
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

/* 底部空白区域，防止内容被TabBar遮挡 */
.bottom-space {
	height: 70px;
	width: 100%;
}

/* 登录页标签样式 */
.login-tab-transition .tabs-container {
	margin-bottom: 15px;
}

.login-tab-transition .tabs-inner {
	border-bottom: none;
}

.login-tab-transition .tab {
	font-weight: 600;
	padding: 15px 8px;
}

.login-tab-transition .tab.active {
	color: #4f70fe;
}

.login-tab-transition .tab-underline {
	height: 3px;
	background: linear-gradient(90deg, #6084fe, #9665ff);
	left: 15%;
	width: 70%;
}

/* 加载状态样式 */
</style>
