/**
 * 社区服务模块
 */
import { http } from '@/modules/common/utils/request'

class CommunityService {
  // 获取帖子列表
  async getPosts(type = 'recommend') {
    try {
      // 模拟API调用
      return this.getMockPosts(type);
    } catch (error) {
      console.error('获取帖子列表失败:', error);
      return [];
    }
  }

  // 发布帖子
  async createPost(postData) {
    try {
      // 模拟API调用
      const newPost = {
        id: `post_${Date.now()}`,
        username: postData.username || '用户',
        avatar: postData.avatar || '/static/default-avatar.png',
        time: '刚刚',
        content: postData.content,
        images: postData.images || [],
        tags: postData.tags || [],
        likes: 0,
        comments: 0,
        shares: 0,
        isFollowing: false,
        isUserPost: true // 标记为用户发布的帖子
      };
      
      // 存储到本地
      this.savePost(newPost);
      
      return newPost;
    } catch (error) {
      console.error('发布帖子失败:', error);
      return null;
    }
  }

  // 删除帖子
  async deletePost(postId) {
    try {
      // 从本地存储中删除帖子
      const posts = this.getLocalPosts();
      const updatedPosts = posts.filter(post => post.id !== postId);
      
      // 保存更新后的帖子列表
      uni.setStorageSync('user_posts', JSON.stringify(updatedPosts));
      
      return true;
    } catch (error) {
      console.error('删除帖子失败:', error);
      return false;
    }
  }

  // 获取本地存储的帖子
  getLocalPosts() {
    try {
      const postsStr = uni.getStorageSync('user_posts');
      return postsStr ? JSON.parse(postsStr) : [];
    } catch (error) {
      console.error('获取本地帖子失败:', error);
      return [];
    }
  }

  // 保存帖子到本地
  savePost(post) {
    try {
      const posts = this.getLocalPosts();
      posts.unshift(post); // 添加到列表开头
      uni.setStorageSync('user_posts', JSON.stringify(posts));
    } catch (error) {
      console.error('保存帖子失败:', error);
    }
  }

  // 获取模拟帖子数据（测试用）
  getMockPosts(type) {
    try {
      // 获取用户自己发布的帖子
      const userPosts = this.getLocalPosts();
      
      console.log(`获取帖子(${type}): 找到${userPosts.length}条用户帖子`);
      
      // 合并示例帖子和用户帖子，并根据类型进行排序
      let allPosts = [];
      
      // 检查是否有帖子数据，如果没有，显示空状态
      if (userPosts.length === 0) {
        console.log('没有找到帖子数据');
        return [];
      }
      
      // 根据不同的标签页，返回不同的数据
      switch (type) {
        case 'latest':
          // 最新帖子：只显示最近发布的帖子（包括用户帖子）
          allPosts = [...userPosts];
          // 按时间排序（实际项目中应该使用时间戳）
          allPosts.sort((a, b) => {
            if (a.time === '刚刚') return -1;
            if (b.time === '刚刚') return 1;
            return 0;
          });
          break;
          
        case 'following':
          // 关注帖子：只显示已关注用户的帖子
          // 示例中，只显示用户自己发的帖子
          allPosts = [...userPosts];
          break;
          
        case 'recommend':
        default:
          // 推荐帖子：显示所有帖子，但用户自己发的优先显示
          allPosts = [...userPosts];
          break;
      }
      
      return allPosts;
    } catch (error) {
      console.error('获取帖子失败:', error);
      return [];
    }
  }
}

// 创建并导出单例实例
export const communityService = new CommunityService(); 