<template>
  <div class="right-panel">
    <!-- User Profile -->
    <div class="user-profile">
      <div class="user-info">
        <el-avatar :size="40" :src="baseUrl + 'images/avatar.png'" />
        <span class="username">Kim's home</span>
      </div>
      <div class="user-actions">
        <el-icon class="action-icon"><ChatDotRound /></el-icon>
        <el-icon class="action-icon"><Bell /></el-icon>
      </div>
    </div>

    <!-- Overview Chart -->
    <div class="section-title">Overview</div>
    <div class="chart-container" ref="overviewChartRef"></div>

    <!-- Share Grid -->
    <div class="section-title">Share</div>
    <div class="share-grid">
      <div class="share-item" v-for="(image, i) in shareImages" :key="image">
        <el-image 
          :src="image" 
          fit="cover" 
          class="share-img"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ChatDotRound, Bell, Picture } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const baseUrl = import.meta.env.BASE_URL

const overviewChartRef = ref(null)

const shareImages = [
  baseUrl + 'images/营养搭配图片生成 (1).png',
  baseUrl + 'images/营养搭配图片生成 (2).png',
  baseUrl + 'images/营养搭配图片生成 (3).png',
  baseUrl + 'images/营养搭配图片生成 (4).png'
]

onMounted(() => {
  if (overviewChartRef.value) {
    const myChart = echarts.init(overviewChartRef.value)
    const option = {
      grid: {
        top: 20,
        bottom: 20,
        left: 0,
        right: 0,
        containLabel: false
      },
      xAxis: {
        type: 'category',
        data: ['10/10', '10/13', '10/16', '10/19'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9ca3af', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [
        {
          data: [15, 28, 12, 40],
          type: 'line',
          smooth: true,
          symbol: 'none', // hide points except maybe emphasis
          lineStyle: {
            color: '#bef264',
            width: 3
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(190, 242, 100, 0.5)' },
              { offset: 1, color: 'rgba(190, 242, 100, 0)' }
            ])
          }
        }
      ]
    }
    myChart.setOption(option)
    window.addEventListener('resize', () => myChart.resize())
  }
})
</script>

<style scoped>
.right-panel {
  height: 100%;
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.user-profile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.user-actions {
  display: flex;
  gap: 15px;
}

.action-icon {
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 15px;
}

.chart-container {
  height: 200px;
  margin-bottom: 30px;
}

.share-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.share-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
}

.share-img {
  width: 100%;
  height: 100%;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  color: #9ca3af;
}
</style>
