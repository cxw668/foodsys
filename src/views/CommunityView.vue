<template>
  <div class="common-layout">
    <el-container class="main-container">
      <el-aside width="240px" class="left-aside">
        <HomeSidebar />
      </el-aside>
      
      <el-main class="center-main">
        <div class="content-wrapper">
          <div class="header">
            <h2>Community</h2>
            <el-button type="primary" round @click="handleNewPost">New Post</el-button>
          </div>
          <div class="feed">
            <el-card v-for="item in mockPosts" :key="item.text" class="post-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <div class="user-info">
                    <span class="user-avatar">{{ item?.userAvatar }}</span>
                    <div class="user-details">
                      <span class="username">{{ item?.username || 'User ' + item.id }}</span>
                      <span class="post-time">{{ item?.timeAgo || '刚刚' }}</span>
                    </div>
                  </div>
                  <el-button 
                    :type="followedUsers.has(item.username) ? 'info' : 'primary'" 
                    link 
                    @click="toggleFollow(item.username)"
                  >
                    {{ followedUsers.has(item.username) ? 'Following' : 'Follow' }}
                  </el-button>
                </div>
              </template>
              <div class="post-content">
                <p>{{ item?.text }}</p>
                <div class="post-images">
                  <div 
                    class="placeholder-img" 
                    :style="{ 
                      backgroundImage: item.customImage ? 'url(\'' + item.customImage + '\')' : 'url(\'' + getImages(item.id) + '\')',
                      backgroundColor: item?.imageColor || 'transparent'
                    }"
                  >
                    <!-- 背景图加载失败时显示emoji标签 -->
                    <!-- <span class="img-fallback">{{ item?.imgLabel || '🥗 羽衣甘蓝沙拉' }}</span> -->
                  </div>
                </div>
              </div>
              <div class="post-actions">
                <span @click="toggleLike(item)" :class="{ 'liked': likedPosts.has(item.id) }">
                  <el-icon><component :is="likedPosts.has(item.id) ? StarFilled : Star" /></el-icon> 
                  {{ item?.likes || 0 }}
                </span>
                <span @click="toggleComment(item)"><el-icon><ChatDotRound /></el-icon> {{ item?.comments || 0 }}</span>
                <span @click="handleShare(item)"><el-icon><Share /></el-icon> {{ item?.shares || 0 }}</span> 
              </div>
              
              <!-- 评论区域 -->
              <div v-if="activeCommentId === item.id" class="comment-section">
                <div class="comment-input-area">
                  <el-input
                    v-model="commentInput"
                    placeholder="Add a comment..."
                    :rows="2"
                    type="textarea"
                    resize="none"
                  />
                  <div class="comment-actions">
                    <el-button size="small" @click="activeCommentId = null">Cancel</el-button>
                    <el-button type="primary" size="small" @click="submitComment(item)" :disabled="!commentInput.trim()">Post</el-button>
                  </div>
                </div>
                
                <div class="comments-list" v-if="item.commentList && item.commentList.length > 0">
                  <div v-for="(comment, idx) in item.commentList" :key="idx" class="comment-item">
                    <span class="comment-user">{{ comment.username }}:</span>
                    <span class="comment-text">{{ comment.text }}</span>
                  </div>
                </div>
                <div v-else class="no-comments">
                  No comments yet. Be the first to share your thoughts!
                </div>
              </div>
            </el-card>
          </div>

          <!-- New Post Dialog -->
          <el-dialog
            v-model="newPostDialogVisible"
            title="Create New Post"
            width="500px"
            destroy-on-close
          >
            <el-form :model="newPostForm">
              <el-form-item>
                <el-input
                  v-model="newPostForm.text"
                  type="textarea"
                  :rows="4"
                  placeholder="What's on your mind? Share your healthy food journey..."
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item>
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :show-file-list="false"
                  :on-change="handleFileChange"
                  :auto-upload="false"
                >
                  <el-button size="small" type="primary">Upload Image</el-button>
                </el-upload>
                <div v-if="newPostForm.image" class="avatar-preview">
                  <img :src="newPostForm.image" alt="Preview" class="preview-image">
                  <div class="delete-btn" @click="removeImage">
                    <el-icon><Delete /></el-icon>
                  </div>
                </div>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="newPostDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submitPost" :disabled="!newPostForm.text.trim()">
                  Post
                </el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </el-main>
      
      <el-aside width="300px" class="right-aside">
        <HomeRightPanel />
      </el-aside>
    </el-container>
  </div>
</template>

<script setup>
import HomeSidebar from '../components/HomeSidebar.vue'
import HomeRightPanel from '../components/HomeRightPanel.vue'
import { Star, ChatDotRound, Share, Delete, StarFilled } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const baseUrl = import.meta.env.BASE_URL

const newPostDialogVisible = ref(false)
const newPostForm = reactive({
  text: '',
  image: null
})

const defaultPosts = [
  {
    id: 1,
    username: "HealthyFoodie",
    userAvatar: "🍎",
    text: "刚刚尝试了这个超健康的羽衣甘蓝沙拉！做法简单又美味，强烈推荐给减脂期的朋友们 #健康饮食 #沙拉 #减肥餐",
    imageColor: "#a7f3d0",
    imgLabel: "🥗 羽衣甘蓝沙拉",
    likes: 42,
    comments: 8,
    shares: 3,
    timeAgo: "2小时前"
  },
  {
    id: 2,
    username: "FamilyChef456",
    userAvatar: "👨‍🍳",
    text: "周末做了地中海风味烤蔬菜拼盘，色彩丰富营养均衡，老公孩子都爱吃！分享食谱给大家 #家庭料理 #地中海饮食 #素食",
    imageColor: "#fde68a",
    imgLabel: "🍆 烤蔬菜拼盘",
    likes: 28,
    comments: 5,
    shares: 2,
    timeAgo: "5小时前"
  },
  {
    id: 3,
    username: "SweetToothBaker",
    userAvatar: "🍰",
    text: "新学的低卡燕麦香蕉松饼，不加糖不用面粉，早餐吃这个太幸福了！详细步骤已分享到社区 #低卡甜品 #健康早餐 #烘焙",
    imageColor: "#fed7aa",
    imgLabel: "🥞 燕麦松饼",
    likes: 56,
    comments: 12,
    shares: 4,
    timeAgo: "1天前"
  },
  {
    id: 4,
    username: "FitProteinKing",
    userAvatar: "💪",
    text: "用空气炸锅做了香酥鸡胸肉条，外酥里嫩热量还低！减脂期也能放心吃的蛋白质来源 #高蛋白 #空气炸锅 #健身餐",
    imageColor: "#fecaca",
    imgLabel: "🍗 香酥鸡胸肉",
    likes: 89,
    comments: 15,
    shares: 7,
    timeAgo: "1天前"
  },
  {
    id: 5,
    username: "OfficeLunchPro",
    userAvatar: "💼",
    text: "今日午餐：三文鱼牛油果波奇碗，优质脂肪+蛋白质+碳水的完美组合，吃完活力满满！ #波奇碗 #轻食 #上班族午餐",
    imageColor: "#bfdbfe",
    imgLabel: "🍣 三文鱼波奇碗",
    likes: 37,
    comments: 6,
    shares: 1,
    timeAgo: "2天前"
  },
  {
    id: 6,
    username: "MealPrepMaster",
    userAvatar: "📅",
    text: "尝试了网红隔夜燕麦杯，果然名不虚传！提前一晚做好放冰箱，早上直接带走，太适合打工人了 #快手早餐 #隔夜燕麦 #mealprep",
    imageColor: "#ddd6fe",
    imgLabel: "🥣 隔夜燕麦杯",
    likes: 63,
    comments: 9,
    shares: 5,
    timeAgo: "2天前"
  },
  {
    id: 7,
    username: "VeganDessertGuru",
    userAvatar: "🌱",
    text: "用豆腐做了伪芝士蛋糕，口感和真芝士几乎一样，热量却只有1/3！无糖无油版本分享给大家 #低卡甜品 #素食烘焙 #创新料理",
    imageColor: "#fbcfe8",
    imgLabel: "🍰 豆腐芝士蛋糕",
    likes: 45,
    comments: 11,
    shares: 3,
    timeAgo: "3天前"
  },
  {
    id: 8,
    username: "KoreanFoodLover",
    userAvatar: "🇰🇷",
    text: "冬日必备暖身汤：韩式泡菜豆腐汤，酸辣开胃又低卡，十分钟就能搞定！配上糙米饭绝了 #快手汤品 #韩料 #冬日暖食",
    imageColor: "#fda4af",
    imgLabel: "🍲 泡菜豆腐汤",
    likes: 52,
    comments: 7,
    shares: 2,
    timeAgo: "3天前"
  },
  {
    id: 9,
    username: "MiddleEastFlavors",
    userAvatar: "🧆",
    text: "解锁了鹰嘴豆泥的N种吃法，涂面包、拌沙拉、做蘸酱都超棒！高蛋白高纤维，减脂期友好 #健康蘸酱 #中东美食 #素食蛋白",
    imageColor: "#fef08a",
    imgLabel: "🫓 鹰嘴豆泥",
    likes: 31,
    comments: 4,
    shares: 1,
    timeAgo: "4天前"
  },
  {
    id: 10,
    username: "KetoQueen",
    userAvatar: "👑",
    text: "用花椰菜代替米饭做了'炒饭'，口感意外的好！碳水减少了一大半，饱腹感还很强 #低碳水 #生酮饮食 #创意料理",
    imageColor: "#bbf7d0",
    imgLabel: "🥦 花椰菜炒饭",
    likes: 71,
    comments: 13,
    shares: 6,
    timeAgo: "5天前"
  }
]

// Initialize mockPosts from sessionStorage or defaultPosts
const loadPosts = () => {
  const stored = sessionStorage.getItem('community-posts')
  return stored ? JSON.parse(stored) : defaultPosts
}

const mockPosts = ref(loadPosts())

// State for interactions
const followedUsers = ref(new Set(JSON.parse(sessionStorage.getItem('community-followed') || '[]')))
const likedPosts = ref(new Set(JSON.parse(sessionStorage.getItem('community-liked') || '[]')))
const activeCommentId = ref(null)
const commentInput = ref('')

// Interaction Handlers
const toggleFollow = (username) => {
  if (followedUsers.value.has(username)) {
    followedUsers.value.delete(username)
    ElMessage.info(`Unfollowed ${username}`)
  } else {
    followedUsers.value.add(username)
    ElMessage.success(`Followed ${username}`)
  }
  sessionStorage.setItem('community-followed', JSON.stringify([...followedUsers.value]))
}

const toggleLike = (post) => {
  if (likedPosts.value.has(post.id)) {
    likedPosts.value.delete(post.id)
    post.likes--
  } else {
    likedPosts.value.add(post.id)
    post.likes++
  }
  sessionStorage.setItem('community-liked', JSON.stringify([...likedPosts.value]))
  sessionStorage.setItem('community-posts', JSON.stringify(mockPosts.value))
}

const toggleComment = (post) => {
  if (activeCommentId.value === post.id) {
    activeCommentId.value = null
  } else {
    activeCommentId.value = post.id
    commentInput.value = ''
  }
}

const submitComment = (post) => {
  if (!commentInput.value.trim()) return

  if (!post.commentList) {
    post.commentList = []
  }
  
  post.commentList.unshift({
    username: 'CurrentUser',
    text: commentInput.value.trim(),
    time: new Date().toISOString()
  })
  
  post.comments++
  sessionStorage.setItem('community-posts', JSON.stringify(mockPosts.value))
  ElMessage.success('Comment posted!')
  commentInput.value = ''
}

const handleShare = (post) => {
  post.shares++
  sessionStorage.setItem('community-posts', JSON.stringify(mockPosts.value))
  ElMessage.success('Link copied to clipboard!')
}

// 获取图片
const getImages = (index) => {
  // Cycle through 1-10 images for indices > 10
  const imageIndex = (index - 1) % 10 + 1
  return `${baseUrl}images/community/社区分享图片 (${imageIndex}).png`
}

// 处理新建帖子
const handleNewPost = () => {
  newPostDialogVisible.value = true
}

// 处理图片上传
const handleFileChange = (uploadFile) => {
  const file = uploadFile.raw
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newPostForm.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 移除图片
const removeImage = () => {
  newPostForm.image = null
}

const submitPost = () => {
  if (!newPostForm.text.trim()) return

  const newId = mockPosts.value.length > 0 ? Math.max(...mockPosts.value.map(p => p.id)) + 1 : 1
  
  const newPost = {
    id: newId,
    username: "CurrentUser",
    userAvatar: "👤",
    text: newPostForm.text,
    imageColor: "#e5e7eb",
    imgLabel: "🆕 New Post",
    customImage: newPostForm.image, // 保存自定义图片
    likes: 0,
    comments: 0,
    shares: 0,
    timeAgo: "刚刚"
  }

  mockPosts.value.unshift(newPost)
  sessionStorage.setItem('community-posts', JSON.stringify(mockPosts.value))
  
  newPostDialogVisible.value = false
  newPostForm.text = ''
  newPostForm.image = null
}
</script>

<style scoped>
.common-layout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #f9fafb;
}

.main-container {
  height: 100%;
}

.left-aside,
.right-aside {
  background: #fff;
  border-right: 1px solid #f3f4f6;
  border-left: 1px solid #f3f4f6;
  overflow: hidden;
  transition: width 0.3s;
}

.center-main {
  max-height: 100vh;
  background: #fff;
  padding: 0;
  overflow-y: auto;
}

.left-aside {
  border-right: 1px solid #f3f4f6;
  border-left: none;
}

.right-aside {
  border-left: 1px solid #f3f4f6;
  border-right: none;
}

.content-wrapper {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.post-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  font-size: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f3f4f6;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  color: #374151;
  font-size: 16px;
}

.post-time {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.post-content {
  margin-bottom: 16px;
}

.post-content p {
  margin-bottom: 12px;
  color: #4b5563;
  line-height: 1.5;
  font-size: 15px;
}

.placeholder-img {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* 背景图设置 */
  background-color: #f3f4f6; /* 默认背景色，图片加载失败时显示 */
  background-image: var(--bg-image, none);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain; /* 关键：完整显示图片，不裁剪 */
  background-origin: content-box;
  
  /* 可选：添加渐变遮罩 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0) 20%,
      rgba(0, 0, 0, 0) 80%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }
}

/* 背景图加载失败时显示的标签 */
.img-fallback {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  z-index: 1;
  background: rgba(255, 255, 255, 0.85);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 80%;
}

.post-actions {
  display: flex;
  gap: 24px;
  color: #6b7280;
  font-size: 14px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.post-actions span {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 4px 8px;
  border-radius: 4px;
}

.post-actions span:hover {
  color: #84cc16;
  background-color: #f7fee7;
}

.post-actions span.liked {
  color: #eab308;
}

.post-actions span.liked:hover {
  background-color: #fef9c3;
}

.center-main::-webkit-scrollbar {
  width: 8px;
}

.center-main::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.center-main::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.center-main::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 1024px) {
  .right-aside {
    display: none;
  }
}

@media (max-width: 768px) {
  .left-aside {
    display: none;
  }
  .content-wrapper {
    padding: 16px;
  }
}

.avatar-preview {
  margin-top: 10px;
  position: relative;
  width: 100%;
  height: 200px; /* 固定高度防止撑破弹窗 */
  border-radius: 8px;
  overflow: hidden;
  border: 1px dashed #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 10;
}

.delete-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.comment-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
  animation: fadeIn 0.3s ease;
}

.comment-input-area {
  margin-bottom: 16px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  font-size: 14px;
  line-height: 1.5;
  background-color: #f9fafb;
  padding: 8px 12px;
  border-radius: 8px;
}

.comment-user {
  font-weight: 600;
  color: #374151;
  margin-right: 8px;
}

.comment-text {
  color: #4b5563;
}

.no-comments {
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
  padding: 12px 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
