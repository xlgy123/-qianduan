<template>
  <modal-dialog 
    :visible="visible" 
    @update:visible="updateVisible"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleCancel"
    title="创建自习室"
    confirmText="创建"
    :confirm-loading="isLoading"
    :mask-closable="true"
    size="medium"
    :key="modalKey">
    <view class="create-room-form">
      <!-- 自习室名称 -->
      <view class="form-item">
        <text class="form-label">自习室名称</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="roomForm.name" 
          placeholder="给自习室起个名字（2-15个字符）"
          maxlength="15"
          :id="`name-input-${modalKey}`"/>
        <text v-if="errors.name" class="form-error">{{ errors.name }}</text>
      </view>
      
      <!-- 房间号显示（自动生成，只读） -->
      <view class="form-item">
        <text class="form-label">房间号</text>
        <view class="room-code-display">
          <text class="room-code">{{ roomForm.roomCode }}</text>
          <text class="room-code-hint">（自动生成，用于邀请好友加入）</text>
        </view>
      </view>
      
      <!-- 学习方向 -->
      <view class="form-item">
        <text class="form-label">学习方向</text>
        <view class="type-options">
          <view 
            class="type-option" 
            v-for="(type, index) in roomTypes" 
            :key="`type-${index}-${modalKey}`"
            :class="{'type-selected': roomForm.type === type.value}"
            @tap.stop="selectRoomType(type.value)">
            <text class="type-icon">{{type.icon}}</text>
            <text class="type-text">{{type.label}}</text>
          </view>
        </view>
      </view>
      
      <!-- 学习标签 -->
      <view class="form-item">
        <view class="label-with-hint">
          <text class="form-label">学习标签</text>
          <text class="hint-text">（最多选择3个）</text>
        </view>
        <view class="tags-container">
          <view 
            class="tag-item" 
            v-for="(tag, index) in allTags" 
            :key="`tag-${index}-${modalKey}`"
            :class="{'tag-selected': isTagSelected(tag)}"
            @tap.stop="toggleTag(tag)">
            <text>{{tag}}</text>
          </view>
        </view>
        <text v-if="errors.tags" class="form-error">{{ errors.tags }}</text>
      </view>
    </view>
  </modal-dialog>
</template>

<script>
import ModalDialog from '@/components/ui/ModalDialog.vue';
import { Navigation } from '@/utils/navigation';
import { createRoom, generateRoomCode } from '@/utils/roomUtils';
import { API_BASE_URL } from '@/config/apiConfig';
export default {
  components: {
    ModalDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      roomForm: {
        name: '',
        type: 'study',
        tags: [],
        roomCode: ''
      },
      errors: {
        name: '',
        tags: ''
      },
      roomTypes: [
        { label: '自由学习', value: 'study', icon: '📚' },
        { label: '考研', value: 'exam', icon: '📝' },
        { label: '考公', value: 'civil', icon: '🏛️' },
        { label: '四六级', value: 'english', icon: '🔤' },
        { label: '阅读', value: 'reading', icon: '📖' },
        { label: '工作', value: 'work', icon: '💼' }
      ],
      allTags: ['英语', '数学', '编程', '法学', '医学', '考研', '四六级', '考公', '工作', '阅读', '写作', '研究'],
      modalKey: Date.now() // 用于强制重新渲染整个模态框
    }
  },
  watch: {
    visible(newVal) {
      console.log('CreateRoomModal visible 变化:', newVal);
      if (newVal) {
        // 重置表单数据
        this.resetFormData();
        
        // 如果可见，生成一个新的房间号
        this.roomForm.roomCode = generateRoomCode();
        
        // 生成新的key强制重新渲染
        this.modalKey = Date.now();
        
        // 确保在数据重置后才渲染DOM
        this.$nextTick(() => {
          // 延迟执行DOM操作，确保组件已完全挂载
          setTimeout(() => {
            this.clearDOMElements();
          }, 50);
        });
      }
    },
    'roomForm.name'() {
      // 清除名称错误
      this.errors.name = '';
    },
    'roomForm.tags'() {
      // 清除标签错误
      this.errors.tags = '';
    }
  },
  created() {
    // 创建组件时初始化状态
    this.resetFormData();
  },
  mounted() {
    // 添加全局事件监听器，在页面切换时强制重置
    uni.$on('page-show', this.handlePageShow);
    
    // 监听App级别的显示事件
    uni.$on('app-show', this.handleAppShow);
    
    // 监听重置模态框的事件
    uni.$on('reset-modals', this.handleResetModals);
  },
  // uni-app生命周期方法
  onLoad() {
    console.log('CreateRoomModal - onLoad生命周期');
    this.resetFormData();
  },
  onShow() {
    console.log('CreateRoomModal - onShow生命周期');
    // 如果是显示时自动打开，先进行一次重置
    if (this.visible) {
      this.resetFormData();
      this.modalKey = Date.now();
    }
  },
  onUnload() {
    console.log('CreateRoomModal - onUnload生命周期');
    // 清理事件监听
    this.cleanup();
  },
  onHide() {
    console.log('CreateRoomModal - onHide生命周期');
    // 页面隐藏时确保模态框关闭
    if (this.visible) {
      this.updateVisible(false);
    }
  },
  beforeDestroy() {
    // 移除全局事件监听器
    this.cleanup();
  },
  methods: {
    // 清理所有事件监听和状态
    cleanup() {
      uni.$off('page-show', this.handlePageShow);
      uni.$off('app-show', this.handleAppShow);
      uni.$off('reset-modals', this.handleResetModals);
      
      // 强制进行一次彻底的清理
      this.resetFormData();
    },
    // 重置表单数据
    resetFormData() {
      this.roomForm = {
        name: '',
        type: 'study',
        tags: [],
        roomCode: generateRoomCode() // 确保每次重置都生成新的房间号
      };
      this.errors = {
        name: '',
        tags: ''
      };
      this.isLoading = false;
    },
    
    // 清除DOM元素状态（只处理DOM，不修改数据）
    clearDOMElements() {
      try {
        // 使用uni-app的API进行DOM操作
        uni.createSelectorQuery()
          .in(this)
          .select(`#name-input-${this.modalKey}`)
          .boundingClientRect(data => {
            if (data) {
              console.log('找到表单输入框元素');
            }
          }).exec();
        
        console.log('DOM元素已清理');
      } catch (e) {
        console.error('清理DOM元素失败:', e);
      }
    },
    
    // App显示时的强制重置
    handleAppShow() {
      // 确保模态框关闭
      if (this.visible) {
        this.updateVisible(false);
      }
      
      // 强制重置
      this.resetFormData();
      this.modalKey = Date.now();
    },
    
    // 处理重置模态框事件
    handleResetModals() {
      console.log('收到重置模态框事件');
      
      // 关闭并重置模态框
      this.updateVisible(false);
      this.resetFormData();
      this.modalKey = Date.now();
    },
    
    // 页面显示时强制重置
    handlePageShow(event) {
      if (this.visible) {
        this.updateVisible(false);
      }
      
      // 无论模态框是否可见，都重置状态
      this.resetFormData();
      this.modalKey = Date.now();
    },
    
    // 更新可见状态
    updateVisible(val) {
      console.log('更新visible', val);
      this.$emit('update:visible', val);
      
      if (!val) {
        // 延迟重置，确保动画完成后再清理
        setTimeout(() => {
          this.resetFormData();
          this.modalKey = Date.now();
        }, 300);
      }
    },
    
    // 处理取消事件
    handleCancel() {
      console.log('触发取消事件');
      this.updateVisible(false);
      this.$emit('cancel');
    },
    
    // 选择自习室类型
    selectRoomType(type) {
      this.roomForm.type = type;
      // 添加触感反馈
      if (uni.vibrateShort) {
        uni.vibrateShort({ type: 'light' });
      }
    },
    
    // 切换标签选择状态
    toggleTag(tag) {
      const index = this.roomForm.tags.indexOf(tag);
      if (index === -1) {
        // 最多选择3个标签
        if (this.roomForm.tags.length < 3) {
          this.roomForm.tags.push(tag);
          // 添加触感反馈
          if (uni.vibrateShort) {
            uni.vibrateShort({ type: 'light' });
          }
        } else {
          uni.showToast({
            title: '最多选择3个标签',
            icon: 'none'
          });
        }
      } else {
        this.roomForm.tags.splice(index, 1);
        // 添加触感反馈
        if (uni.vibrateShort) {
          uni.vibrateShort({ type: 'light' });
        }
      }
    },
    
    // 判断标签是否已选择
    isTagSelected(tag) {
      return this.roomForm.tags.includes(tag);
    },
    
    // 获取房间类型的标签文本
    getRoomTypeLabel(type) {
      const typeMap = {
        study: '自由学习',
        exam: '考研',
        civil: '考公',
        english: '四六级',
        reading: '阅读',
        work: '工作'
      };
      return typeMap[type] || '自由学习';
    },
    
    // 验证表单
    validateForm() {
      let isValid = true;
      
      // 重置错误消息
      this.errors = {
        name: '',
        tags: ''
      };
      
      // 验证名称
      if (!this.roomForm.name.trim()) {
        this.errors.name = '请输入自习室名称';
        isValid = false;
      } else if (this.roomForm.name.trim().length < 2) {
        this.errors.name = '自习室名称至少需要2个字符';
        isValid = false;
      }
      
      // 验证标签
      if (this.roomForm.tags.length === 0) {
        this.errors.tags = '请至少选择一个标签';
        isValid = false;
      }
      
      return isValid;
    },
    
    // 处理确认
    async handleConfirm() {
  if (!this.validateForm()) return;
  
  this.isLoading = true;
  
  try {
    // 根据不同类型设置不同的背景图片和环境设置
    let backgroundImage = '/static/images/room-bg-1.jpg';
    let ambienceSettings = {
      volume: 50,
      music: 'classical'
    };
    
    // 根据房间类型设置不同的背景和环境
    switch(this.roomForm.type) {
      case 'study':
        backgroundImage = '/static/images/room-bg-1.jpg';
        ambienceSettings = { volume: 50, music: 'light_piano' };
        break;
      case 'exam':
        backgroundImage = '/static/images/room-bg-3.jpg';
        ambienceSettings = { volume: 40, music: 'nature_sounds' };
        break;
      case 'civil':
        backgroundImage = '/static/images/room-bg-4.jpg';
        ambienceSettings = { volume: 45, music: 'soft_ambient' };
        break;
      case 'english':
        backgroundImage = '/static/images/room-bg-2.jpg';
        ambienceSettings = { volume: 55, music: 'soft_jazz' };
        break;
      case 'reading':
        backgroundImage = '/static/images/room-bg-5.jpg';
        ambienceSettings = { volume: 30, music: 'light_classical' };
        break;
      case 'work':
        backgroundImage = '/static/images/room-bg-6.jpg';
        ambienceSettings = { volume: 60, music: 'focus_beats' };
        break;
    }
    
    // 设置默认规则
    const defaultRules = [
      '保持安静，专注学习',
      '互相尊重，不打扰他人',
      '按时完成学习目标'
    ];
    
    // 根据房间类型添加特定规则
    let rules = [...defaultRules];
    if (this.roomForm.type === 'exam') {
      rules.push('模拟考试环境，严格遵守时间');
    } else if (this.roomForm.type === 'reading') {
      rules.push('分享阅读心得，互相推荐好书');
    } else if (this.roomForm.type === 'work') {
      rules.push('定时休息，保持高效工作状态');
    } else if (this.roomForm.type === 'civil') {
      rules.push('按公务员考试要求学习，定期模拟考试');
    } else if (this.roomForm.type === 'english') {
      rules.push('每天练习口语和听力，积累词汇');
    }
    
    // 设置不同类型房间的学习时长
    let duration = '2小时';
    switch(this.roomForm.type) {
      case 'study': duration = '2小时'; break;
      case 'exam': duration = '3小时'; break;
      case 'civil': duration = '4小时'; break;
      case 'english': duration = '1.5小时'; break;
      case 'reading': duration = '1小时'; break;
      case 'work': duration = '2.5小时'; break;
    }
    
    console.log('开始创建自习室，提交数据:', this.roomForm);
    const response = await uni.request({
      url: `/api/rooms`,  // 修正为正确的API路径
      method: 'POST',
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`,
        'Content-Type': 'application/json'
      },
      data: {
        roomName: this.roomForm.name, // 修正字段名为mockApi期望的roomName
        name: this.roomForm.name, // 同时提供name字段确保兼容性
        roomType: this.roomForm.type,
        tags: this.roomForm.tags,
        maxCapacity: 20,
        backgroundImage: backgroundImage,
        ambienceSettings: JSON.stringify(ambienceSettings),
        rules: rules,
        room_code: this.roomForm.roomCode, // 确保房间号正确传递
        roomCode: this.roomForm.roomCode, // 同时提供roomCode字段确保兼容性
        currentMembers: 1, // 默认创建者为第一个成员
        status: '开放中',
        isActive: true,
        duration: duration, // 添加学习时长
        description: `${this.roomForm.name}，一个${this.getRoomTypeLabel(this.roomForm.type)}自习室` // 添加描述
      },
      timeout: 10000
    });

    console.log('创建自习室完整响应:', response);
    // 修正：处理嵌套的响应结构（response.data.data代表嵌套的API响应）
    if (response.data && response.data.code === 200) {
      uni.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 2000
      });
      
      // 创建成功后，发送事件通知首页更新热门自习室列表
      uni.$emit('room-created', {
        id: response.data.data.room_id,
        name: this.roomForm.name,
        type: this.roomForm.type,
        tags: this.roomForm.tags,
        roomCode: this.roomForm.roomCode,
        duration: duration
      });
      
      setTimeout(() => {
        uni.redirectTo({
          url: `/pages/room/room-detail?id=${response.data.data.room_id}` // 使用正确的嵌套数据结构
        });
      }, 1000);
    } else {
      throw new Error((response.data && response.data.message) || '创建失败');
    }
  } catch (error) {
    console.error('创建自习室失败:', error);
    uni.showToast({
      title: error.errMsg || error.message || '创建失败',
      icon: 'none'
    });
  } finally {
    this.isLoading = false;
    this.updateVisible(false);
  }
}
  }
}
</script>

<style>
.create-room-form {
  padding: 10px 5px;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.label-with-hint {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.hint-text {
  font-size: 13px;
  color: #888;
  margin-left: 5px;
  font-weight: normal;
}

.form-input {
  width: 100%;
  height: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  color: #333;
  background-color: #f8f8f8;
}

.form-input:focus {
  border-color: #a6c0fe;
  box-shadow: 0 0 0 2px rgba(166, 192, 254, 0.2);
  background-color: #fff;
}

.form-error {
  font-size: 13px;
  color: #ff6b6b;
  margin-top: 6px;
  display: block;
  animation: fadeIn 0.3s ease;
}

.type-options {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 -6px;
}

.type-option {
  width: calc(33.33% - 12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 86px;
  margin: 6px;
  border-radius: 16px;
  background-color: #f5f5f5;
  transition: all 0.3s;
}

.type-option:active {
  transform: scale(0.96);
}

.type-selected {
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(166, 192, 254, 0.3);
}

.type-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.type-text {
  font-size: 15px;
  font-weight: 500;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -4px;
}

.tag-item {
  padding: 8px 14px;
  border-radius: 20px;
  background-color: #f5f5f5;
  margin: 5px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
}

.tag-item:active {
  transform: scale(0.96);
}

.tag-selected {
  background: linear-gradient(135deg, #a6c0fe, #c2a8fd);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(166, 192, 254, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 房间号显示样式 */
.room-code-display {
  background-color: rgba(166, 192, 254, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.room-code {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  letter-spacing: 2px;
  background-image: linear-gradient(90deg, #a6c0fe, #c2a8fd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.room-code-hint {
  font-size: 13px;
  color: #888;
  margin-left: 8px;
}
</style>