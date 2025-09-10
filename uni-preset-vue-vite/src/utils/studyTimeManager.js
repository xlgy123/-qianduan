/**
 * 学习时间管理工具类
 * 用于记录、统计和获取用户的学习时间
 */

// 学习记录的存储键名
const STORAGE_KEYS = {
  STUDY_RECORDS: 'studyRecords',
  TOTAL_STUDY_TIME: 'totalStudyTime',
  TODAY_STUDY_TIME: 'todayStudyTime',
  USER_POINTS: 'userPoints',
  STUDY_DAYS: 'studyDays'
};

/**
 * 保存学习记录
 * @param {Object} record 学习记录，包含roomId, roomName, duration, earnedPoints, date等信息
 */
export function saveStudyRecord(record) {
  try {
    // 检查记录是否有效
    if (!record || typeof record !== 'object' || record.duration === undefined) {
      console.error('无效的学习记录', record);
      return false;
    }
    
    // 确保记录有日期，如果没有则添加当前日期
    if (!record.date) {
      record.date = new Date().toISOString();
    }
    
    // 从存储中获取现有记录
    let records = uni.getStorageSync(STORAGE_KEYS.STUDY_RECORDS) || [];
    
    // 添加新记录
    records.unshift(record);
    
    // 限制记录数量，只保留最近的100条
    if (records.length > 100) {
      records = records.slice(0, 100);
    }
    
    // 保存回存储
    uni.setStorageSync(STORAGE_KEYS.STUDY_RECORDS, records);
    
    // 更新总学习时间
    updateTotalStudyTime(record.duration);
    
    // 更新今日学习时间
    updateTodayStudyTime(record.duration);
    
    // 更新学习天数
    updateStudyDays(record.date);
    
    console.log('学习记录保存成功:', record);
    return true;
  } catch (e) {
    console.error('保存学习记录失败:', e);
    return false;
  }
}

/**
 * 更新总学习时间
 * @param {Number} duration 新增学习时长（秒）
 */
function updateTotalStudyTime(duration) {
  if (duration === undefined || duration < 0) return;
  
  try {
    // 获取当前总学习时间
    const totalTime = uni.getStorageSync(STORAGE_KEYS.TOTAL_STUDY_TIME) || 0;
    
    // 累加新时间
    const newTotalTime = totalTime + duration;
    
    // 保存回存储
    uni.setStorageSync(STORAGE_KEYS.TOTAL_STUDY_TIME, newTotalTime);
    
    console.log(`总学习时间已更新：${formatStudyTime(newTotalTime)}`);
  } catch (e) {
    console.error('更新总学习时间失败:', e);
  }
}

/**
 * 更新今日学习时间
 * @param {Number} duration 新增学习时长（秒）
 */
function updateTodayStudyTime(duration) {
  if (duration === undefined || duration < 0) return;
  
  try {
    // 获取今天的日期字符串 (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // 获取存储的今日学习时间对象
    let todayTimeObj = uni.getStorageSync(STORAGE_KEYS.TODAY_STUDY_TIME) || {};
    
    // 如果日期不是今天，重置
    if (todayTimeObj.date !== today) {
      todayTimeObj = { date: today, duration: 0 };
    }
    
    // 累加时间
    todayTimeObj.duration += duration;
    
    // 保存回存储
    uni.setStorageSync(STORAGE_KEYS.TODAY_STUDY_TIME, todayTimeObj);
    
    console.log(`今日学习时间已更新：${formatStudyTime(todayTimeObj.duration)}`);
  } catch (e) {
    console.error('更新今日学习时间失败:', e);
  }
}

/**
 * 更新学习天数
 * @param {String} dateStr 日期字符串
 */
function updateStudyDays(dateStr) {
  try {
    // 获取日期的年月日部分
    const dateYMD = dateStr.split('T')[0];
    
    // 获取已学习日期集合
    let studyDays = uni.getStorageSync(STORAGE_KEYS.STUDY_DAYS) || [];
    
    // 如果该日期不在集合中，添加它
    if (!studyDays.includes(dateYMD)) {
      studyDays.push(dateYMD);
      
      // 按日期排序
      studyDays.sort();
      
      // 保存回存储
      uni.setStorageSync(STORAGE_KEYS.STUDY_DAYS, studyDays);
      
      console.log(`学习天数已更新：${studyDays.length}天`);
    }
  } catch (e) {
    console.error('更新学习天数失败:', e);
  }
}

/**
 * 获取今日学习时间（秒）
 * @returns {Number} 今日学习时间，单位秒
 */
export function getTodayStudyTime() {
  try {
    // 获取今天的日期字符串 (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // 获取存储的今日学习时间对象
    const todayTimeObj = uni.getStorageSync(STORAGE_KEYS.TODAY_STUDY_TIME) || {};
    
    // 如果日期是今天，返回时间，否则返回0
    return (todayTimeObj.date === today) ? todayTimeObj.duration : 0;
  } catch (e) {
    console.error('获取今日学习时间失败:', e);
    return 0;
  }
}

/**
 * 获取总学习时间（秒）
 * @returns {Number} 总学习时间，单位秒
 */
export function getTotalStudyTime() {
  try {
    return uni.getStorageSync(STORAGE_KEYS.TOTAL_STUDY_TIME) || 0;
  } catch (e) {
    console.error('获取总学习时间失败:', e);
    return 0;
  }
}

/**
 * 获取学习天数
 * @returns {Number} 学习天数
 */
export function getStudyDays() {
  try {
    const studyDays = uni.getStorageSync(STORAGE_KEYS.STUDY_DAYS) || [];
    return studyDays.length;
  } catch (e) {
    console.error('获取学习天数失败:', e);
    return 0;
  }
}

/**
 * 将秒数格式化为可读的学习时间格式
 * @param {Number} seconds 秒数
 * @returns {String} 格式化后的时间字符串
 */
export function formatStudyTime(seconds) {
  if (seconds === undefined || seconds < 0) return "00:00:00";
  
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  
  return `${hours}:${minutes}:${secs}`;
}

/**
 * 将学习时间转换为小时数（用于展示）
 * @param {Number} seconds 秒数
 * @returns {String} 小时数，保留一位小数
 */
export function getHoursFromSeconds(seconds) {
  if (seconds === undefined || seconds < 0) return "0";
  
  const hours = seconds / 3600;
  return hours.toFixed(1);
}

/**
 * 获取用户学习记录列表
 * @param {Number} limit 限制返回的记录数量，默认为10
 * @returns {Array} 学习记录数组
 */
export function getStudyRecords(limit = 10) {
  try {
    const records = uni.getStorageSync(STORAGE_KEYS.STUDY_RECORDS) || [];
    return records.slice(0, limit);
  } catch (e) {
    console.error('获取学习记录失败:', e);
    return [];
  }
} 