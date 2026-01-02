<template>
  <div class="common-layout">
    <el-container class="main-container">
      <el-aside width="240px" class="left-aside">
        <HomeSidebar />
      </el-aside>
      
      <el-main class="center-main">
        <div class="content-wrapper">
          <div class="header">
            <h2>Latest News</h2>
          </div>
          <div class="news-list">
            <div v-for="news in newsList" :key="news.id" class="news-item">
              <div 
                class="news-image"
                :style="{ backgroundColor: news.imageColor, backgroundImage: `url(${news.image})` }"
              ></div>
              <div class="news-content">
                <div class="news-tag">{{ news.tag }}</div>
                <h3 class="news-title">{{ news.title }}</h3>
                <p class="news-summary">{{ news.summary }}</p>
                <div class="news-meta">
                  <span>{{ news.date }}</span> • <span>{{ news.readTime }}</span>
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
import HomeSidebar from '../components/HomeSidebar.vue'
import HomeRightPanel from '../components/HomeRightPanel.vue'
import { ref } from 'vue'

const baseUrl = import.meta.env.BASE_URL

// 创建10条新闻数据
const newsList = ref([
  {
    id: 1,
    tag: "Nutrition",
    title: "Understanding Glycemic Index: A Complete Guide",
    summary: "Learn how different foods affect your blood sugar levels and how to make better dietary choices for long-term health.",
    date: "Dec 28, 2025",
    readTime: "5 min read",
    imageColor: "#a7f3d0", // 浅绿色
    image: baseUrl + "images/news/营养.png"
  },
  {
    id: 2,
    tag: "Fitness",
    title: "10-Minute Morning Workouts for Busy People",
    summary: "Discover efficient workout routines that can boost your metabolism and energy levels without taking up too much time.",
    date: "Dec 26, 2025",
    readTime: "4 min read",
    imageColor: "#fef3c7", // 浅黄色
    image: baseUrl + "images/news/运动.png"
  },
  {
    id: 3,
    tag: "Recipes",
    title: "5 Healthy Meal Prep Ideas for the Whole Week",
    summary: "Save time and eat healthier with these delicious meal prep recipes that are easy to make and perfect for busy schedules.",
    date: "Dec 24, 2025",
    readTime: "7 min read",
    imageColor: "#fecaca", // 浅红色
    image: baseUrl + "images/news/健康饮食.png"
  },
  {
    id: 4,
    tag: "Mental Health",
    title: "Mindful Eating: Connecting with Your Food",
    summary: "Explore the practice of mindful eating and how it can improve your relationship with food and overall well-being.",
    date: "Dec 22, 2025",
    readTime: "6 min read",
    imageColor: "#dbeafe", // 浅蓝色
    image: baseUrl + "images/news/精神.png"
  },
  {
    id: 5,
    tag: "Science",
    title: "The Gut-Brain Connection: How Your Diet Affects Mood",
    summary: "Recent research reveals fascinating insights into how gut health influences mental health and cognitive function.",
    date: "Dec 20, 2025",
    readTime: "8 min read",
    imageColor: "#e9d5ff", // 浅紫色
    image: baseUrl + "images/news/science.png"
  },
  {
    id: 6,
    tag: "Sustainability",
    title: "Reducing Food Waste: Practical Tips for Every Household",
    summary: "Learn simple yet effective strategies to minimize food waste while saving money and helping the environment.",
    date: "Dec 18, 2025",
    readTime: "5 min read",
    imageColor: "#bbf7d0", // 浅绿色
    image: baseUrl + "images/news/转化.png"
  },
  {
    id: 7,
    tag: "Technology",
    title: "How AI is Revolutionizing Personalized Nutrition",
    summary: "Discover how artificial intelligence is being used to create customized diet plans based on individual health data.",
    date: "Dec 16, 2025",
    readTime: "9 min read",
    imageColor: "#fbcfe8", // 浅粉色
    image: baseUrl + "images/news/科技.png"
  },
  {
    id: 8,
    tag: "Nutrition",
    title: "Plant-Based Proteins: A Complete Guide for Beginners",
    summary: "Explore the best plant-based protein sources and how to incorporate them into a balanced diet for optimal health.",
    date: "Dec 14, 2025",
    readTime: "7 min read",
    imageColor: "#fed7aa", // 浅橙色
    image: baseUrl + "images/news/营养均衡.png"
  },
  {
    id: 9,
    tag: "Health Tips",
    title: "Boosting Your Immune System Naturally with Food",
    summary: "Learn which foods and nutrients are most effective for supporting immune function and preventing illness.",
    date: "Dec 12, 2025",
    readTime: "6 min read",
    imageColor: "#c7d2fe", // 浅靛蓝色
    image: baseUrl + "images/news/健康提示.png"
  },
  {
    id: 10,
    tag: "Trends",
    title: "Top 5 Food Trends to Watch in 2026",
    summary: "From fermented foods to sustainable packaging, discover the food trends that will shape the coming year.",
    date: "Dec 10, 2025",
    readTime: "8 min read",
    imageColor: "#fde68a", // 浅琥珀色
    image: baseUrl + "images/news/trends.png"
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

.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
  cursor: pointer;
}

.news-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: #d9f99d;
}

.news-image {
  width: 120px;
  height: 120px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.news-item:hover .news-image {
  transform: scale(1.05);
}

.news-content {
  flex: 1;
  min-width: 0; /* 防止文本溢出 */
}

.news-tag {
  display: inline-block;
  padding: 4px 8px;
  background-color: #ecfccb;
  color: #4d7c0f;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.news-item:hover .news-tag {
  background-color: #d9f99d;
  color: #3f6212;
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.news-item:hover .news-title {
  color: #84cc16;
}

.news-summary {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  gap: 8px;
  align-items: center;
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
  .news-item {
    flex-direction: column;
  }
  .news-image {
    width: 100%;
    height: 160px;
  }
  .content-wrapper {
    padding: 16px;
  }
}
</style>
