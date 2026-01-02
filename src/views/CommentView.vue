<template>
  <div class="common-layout">
    <el-container class="main-container">
      <el-aside width="240px" class="left-aside">
        <HomeSidebar />
      </el-aside>
      
      <el-main class="center-main">
        <div class="content-wrapper">
          <div class="header">
            <h2>Comments & Feedback</h2>
          </div>
          
          <div class="comment-box">
            <el-input
              v-model="newComment"
              type="textarea"
              :rows="3"
              placeholder="Share your thoughts..."
              resize="none"
            />
            <div class="comment-actions">
               <el-button type="primary" round @click="submitComment">Post Comment</el-button>
            </div>
          </div>

          <div class="comments-list">
             <div v-for="item in commentContents" :key="item.author" class="comment-item">
               <img :src="usersImage(item.id)" alt="">
               <div class="comment-body">
                 <div class="comment-author">{{ item.author }} <span class="comment-time">{{ item.time }}</span></div>
                 <div class="comment-text">{{ item.text }}</div>
                <div class="comment-footer">
                  <el-button link size="small"><el-icon><ChatDotRound /></el-icon> {{ item.comments.length || '' }}</el-button>
                  <el-button link size="small"><el-icon><Star /></el-icon> {{ item.likes || '' }}</el-button>
                </div>

                <!-- Nested Replies -->
                <div v-if="item.comments && item.comments.length > 0" class="nested-comments">
                  <div v-for="(reply, idx) in item.comments" :key="idx" class="reply-item">
                    <div class="reply-content">
                      <div class="reply-header">
                        <span class="reply-author">{{ reply.author }}</span>
                        <span class="reply-time">{{ reply.time }}</span>
                      </div>
                      <div class="reply-text">{{ reply.text }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-main>
      
      <el-aside width="300px" class="right-aside">
        <HomeRightPanel />
      </el-aside>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HomeSidebar from '../components/HomeSidebar.vue'
import HomeRightPanel from '../components/HomeRightPanel.vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Star } from '@element-plus/icons-vue'

const baseUrl = import.meta.env.BASE_URL

const usersImage = (index) => {
  if (index >= 3) return baseUrl + 'images/avatar.png'
  return baseUrl + 'images/users/用户头像 (' + index + ').png'
}

const newComment = ref('')

const submitComment = () => {
  if (!newComment.value.trim()) return
  ElMessage.success('Comment posted!')
  newComment.value = ''
}

const commentContents = ref([
  {
    id: 1,
    author: 'Sarah Jenkins',
    time: '2 hours ago',
    text: 'This app has really helped me track my glucose levels better. The daily reports are a lifesaver!',
    likes: 12,
    comments: [
      {
        author: 'Dr. Smith',
        time: '1 hour ago',
        text: 'Glad to hear that, Sarah! Consistency is key.',
        likes: 3
      }
    ]
  },
  {
    id: 2,
    author: 'Mike Chen',
    time: '4 hours ago',
    text: 'Is there a way to export the weekly data as a PDF? I want to show it to my nutritionist.',
    likes: 8,
    comments: [
      {
        author: 'Support Team',
        time: '3 hours ago',
        text: 'Hi Mike! Yes, go to the Profile tab and click on "Export Data".',
        likes: 5
      },
      {
        author: 'Mike Chen',
        time: '2 hours ago',
        text: 'Found it, thanks!',
        likes: 1
      }
    ]
  },
  {
    id: 3,
    author: 'Emily White',
    time: '1 day ago',
    text: 'The new recipe recommendations are delicious. Highly recommend the Keto Avocado Salad!',
    likes: 24,
    comments: []
  },
  {
    id: 4,
    author: 'David Kim',
    time: '2 days ago',
    text: 'Can we add custom food items that are not in the database?',
    likes: 15,
    comments: [
      {
        author: 'Alice Cooper',
        time: '1 day ago',
        text: 'I think you can use the "Scan" feature or manually input nutrition info.',
        likes: 2
      }
    ]
  },
  {
    id: 5,
    author: 'Jessica Lee',
    time: '3 days ago',
    text: 'Loving the UI update. Much cleaner and faster.',
    likes: 45,
    comments: []
  }
])
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
  background: #fff;
  padding: 0;
  overflow-y: auto;
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
  margin-bottom: 24px;
}

.header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.comment-box {
  background: #fff;
  margin-bottom: 32px;
}

.comment-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.comment-item {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.comment-item img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-body {
  flex: 1;
}

.comment-author {
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.comment-time {
  font-weight: 400;
  color: #9ca3af;
  font-size: 12px;
  margin-left: 8px;
}

.comment-text {
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 8px;
}

.comment-footer {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.nested-comments {
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
}

.reply-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.reply-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.reply-content {
  flex: 1;
}

.reply-header {
  margin-bottom: 4px;
}

.reply-author {
  font-weight: 600;
  font-size: 13px;
  color: #374151;
}

.reply-time {
  font-size: 11px;
  color: #9ca3af;
  margin-left: 6px;
}

.reply-text {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.4;
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
}
</style>
