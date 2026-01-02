<template>
  <div class="main-content">
    <!-- Dashboard View -->
    <div v-if="!isScanning" class="dashboard-view">
      <!-- Header -->
      <div class="header-section">
        <div class="date-display">
          <el-icon class="calendar-icon">
            <Calendar />
          </el-icon>
          <span>{{ currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}</span>
        </div>
        <el-button class="add-btn" @click="startScan"><el-icon>
            <Plus />
          </el-icon>Add</el-button>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-container">
        <div class="week-header">
          <div v-for="day in weekDays" :key="day" class="week-day">{{ day }}</div>
        </div>
        <div class="days-grid">
          <div v-for="(day, index) in days" :key="index" class="day-cell">
            <div class="day-number" v-if="day.date">{{ day.date }}</div>
            <div class="day-content" v-if="day.image">
              <el-image :src="day.image" fit="cover" class="food-img" />
            </div>
          </div>
        </div>
      </div>

      <!-- Changes Chart -->
      <div class="chart-section">
        <div class="chart-header">
          <span class="chart-title">Changes</span>
          <span class="chart-filter">year <el-icon>
              <ArrowDown />
            </el-icon></span>
        </div>
        <div class="main-chart" ref="mainChartRef"></div>
      </div>
    </div>

    <!-- Scan View -->
    <div v-else class="scan-view">
      <!-- Scan Header -->
      <div class="scan-header">
        <el-button circle class="back-btn" @click="stopScan">
          <el-icon>
            <ArrowLeft />
          </el-icon>
        </el-button>
        <span class="scan-title">Scan</span>
        <div class="header-placeholder"></div>
      </div>

      <!-- Camera Area -->
      <div class="camera-container">
        <div class="receipt-preview">
          <div class="receipt-paper">
            <div class="receipt-header-line"></div>
            <div class="receipt-content">
              <div class="r-line w-full"></div>
              <div class="r-line w-80"></div>
              <div class="r-line w-60"></div>
              <div class="r-line w-90"></div>
              <div class="gap"></div>
              <div class="r-line w-full"></div>
              <div class="r-line w-70"></div>
              <div class="r-line w-50"></div>
              <div class="gap"></div>
              <div class="r-line w-80"></div>
              <div class="r-line w-40"></div>
            </div>
            <div class="receipt-footer">
              <div class="barcode"></div>
            </div>
          </div>
        </div>

        <!-- Scan Overlay -->
        <div class="scan-overlay">
          <div class="scan-box">
            <div class="scan-line"></div>
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
          </div>
        </div>

        <!-- Manual Input Button -->
        <div class="manual-input-area">
          <el-button type="info" round class="manual-btn">Enter Manually</el-button>
        </div>
      </div>

      <!-- Result Card -->
      <div class="result-card" v-if="scanResult">
        <div class="result-item" v-for="(item, idx) in scanResult" :key="idx">
          <div class="item-icon">
            <!-- Simple placeholder icons based on type -->
            <span v-if="item.type === 'meat'">🥩</span>
            <span v-else-if="item.type === 'dairy'">🥛</span>
            <span v-else>🥦</span>
          </div>
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-portion">{{ item.portion }}</div>
            <div class="item-macros">
              <span class="macro"><i class="dot green"></i> {{ item.calories }} kcal</span>
              <span class="macro"><i class="dot red"></i> {{ item.carbs }} g</span>
              <span class="macro"><i class="dot orange"></i> {{ item.protein }} g</span>
              <span class="macro"><i class="dot purple"></i> {{ item.fat }} g</span>
            </div>
          </div>
        </div>
        <div class="add-confirm-btn">
          <el-button circle type="success" class="plus-circle-btn" @click="addScanResult">
            <el-icon>
              <Plus />
            </el-icon>
            添加到食材库
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { Calendar, Plus, ArrowDown, ArrowLeft } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { usePantryStore } from '@/stores/pantryStore'
import { PRODUCTS } from '@/mock/products.js'

const baseUrl = import.meta.env.BASE_URL

const currentDate = ref(new Date())
// State
const isScanning = ref(false)
const scanResult = ref(null)
const pantryStore = usePantryStore()

// Mock Scan Data Logic
const generateRandomScanData = () => {
  // Get all unique categories
  const categories = [...new Set(Object.values(PRODUCTS).map(p => p.category))]

  // Shuffle categories and pick 3
  const shuffledCats = categories.sort(() => 0.5 - Math.random()).slice(0, 3)

  // For each category, pick one random product
  return shuffledCats.map(cat => {
    const productsInCat = Object.values(PRODUCTS).filter(p => p.category === cat)
    const randomProduct = productsInCat[Math.floor(Math.random() * productsInCat.length)]

    return {
      name: randomProduct.name,
      productId: randomProduct.id,
      quantity: 1,
      type: randomProduct.category,
      portion: `100${randomProduct.unit}`,
      calories: randomProduct.nutrition.energy,
      carbs: randomProduct.nutrition.carbs,
      protein: randomProduct.nutrition.energy > 150 ? 20 : 5, // Mock protein based on energy roughly if not in data? 
      // Actually PRODUCTS has nutrition but maybe not all fields matching UI?
      // PRODUCTS has carbs, sugar, sodium, energy.
      // UI expects: calories, carbs, protein, fat.
      // Let's use what we have and mock missing reasonable values or 0
      fat: 0 // Mock fat as 0 for now as it's not in PRODUCTS nutrition
    }
  })
}

// Camera Logic
const startScan = async () => {
  isScanning.value = true
  scanResult.value = null // Reset results
  await nextTick()

  // Simulate scan success after 3 seconds
  setTimeout(() => {
    scanResult.value = generateRandomScanData()
  }, 3000)
}

const stopScan = () => {
  isScanning.value = false
  // Re-init chart if needed when switching back
  // In a real app we might need to keep the chart instance or re-render it
  // Since dashboard is v-if'ed out, it will be destroyed. We need to re-init chart on dashboard mount.
  // The existing onMounted handles initial load. When toggling back, we need to handle it.
  // We can extract chart init logic.
  nextTick(() => {
    initChart()
  })
}

const addScanResult = () => {
  if (!scanResult.value) return

  // Transform to format expected by store: { productName, quantity }
  // The store uses productName to look up PRODUCTS by key (id)
  const itemsToAdd = scanResult.value.map(item => ({
    productName: item.productId,
    quantity: item.quantity
  }))
  pantryStore.addFromReceipt(itemsToAdd)
  ElMessage.success('Added to Pantry Successfully!')
  stopScan()
}

// Chart Logic
const mainChartRef = ref(null)
let myChart = null

const initChart = () => {
  if (mainChartRef.value) {
    myChart = echarts.init(mainChartRef.value)
    const option = {
      tooltip: { trigger: 'axis' },
      grid: { top: 30, bottom: 30, left: 30, right: 30, containLabel: true },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9ca3af' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } }
      },
      series: [
        {
          name: 'Green Bar',
          type: 'bar',
          data: [70, 45, 95, 70, 70, 40, 75, 60, 40, 95, 85],
          itemStyle: { color: '#dcfce7' },
          barWidth: 12
        },
        {
          name: 'Orange Bar',
          type: 'bar',
          data: [60, 25, 65, 60, 45, 30, 65, 85, 55, 75, 60],
          itemStyle: { color: '#ffedd5' },
          barWidth: 12,
          barGap: '20%'
        },
        {
          name: 'Trend',
          type: 'line',
          data: [55, 60, 80, 52, 48, 20, 50, 85, 68, 75, 45],
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: '#333', borderColor: '#fff', borderWidth: 2 },
          lineStyle: { color: '#333', width: 3 }
        }
      ]
    }
    myChart.setOption(option)
    window.addEventListener('resize', () => myChart && myChart.resize())
  }
}
// 这里存储了14张图片序号，从1到10
const getImages = (i) => {
  if (i > 13) {
    return `${baseUrl}images/dishes/dish (${i % 13}).png`
  } 
  return `${baseUrl}images/dishes/dish (${i}).png`
}

// Week days
const weekDays = ['日', '一', '二', '三', '四', '五', '六']


// Generate 14 days (2 weeks)
const days = computed(() => {
  const start = new Date(currentDate.value)
  start.setDate(start.getDate() - start.getDay()) // Start from Sunday
  
  const result = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const dateStr = d.getDate().toString()
    
    result.push({
      date: dateStr,
      image: getImages(dateStr),
      fullDate: new Date(d)
    })
  }
  return result
})

onMounted(() => {
  initChart()
})
</script>

<style scoped>
.main-content {
  padding: 0;
  /* Changed to 0 to allow full height scan view */
  height: 100%;
  overflow-y: auto;
  background: #fff;
  position: relative;
}

/* Dashboard Styles */
.dashboard-view {
  padding: 20px 40px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.calendar-icon {
  color: #84cc16;
}

.add-btn {
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #333;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.add-btn:hover {
  background: #f9fafb;
  color: #84cc16;
  border-color: #84cc16;
}

.calendar-container {
  margin-bottom: 40px;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
}

.day-cell {
  height: 180px;
  border-right: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.day-cell:nth-child(7n) {
  border-right: none;
}

.day-number {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 10px;
}

.day-content {
  flex-grow: 1;
  border-radius: 50%;
  overflow: hidden;
  width: 100px;
  height: 100px;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.food-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chart-section {
  margin-top: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.chart-filter {
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.main-chart {
  height: 300px;
  width: 100%;
}

/* Scan View Styles */
.scan-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f3f4f6;
  position: relative;
}

.scan-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  /* Or overlay on video? Design shows separate header area usually or floating */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.back-btn {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 18px;
}

.scan-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-placeholder {
  width: 32px;
}

.camera-container {
  flex-grow: 1;
  background: #374151;
  /* Dark grey background */
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.receipt-preview {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.receipt-paper {
  width: 220px;
  height: 350px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transform: rotate(-2deg);
  /* Slight rotation for realism */
}

/* Zigzag border effect at top and bottom using mask or simple css */
.receipt-paper::before,
.receipt-paper::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(135deg, transparent 5px, #fff 5px) 0 0,
    linear-gradient(225deg, transparent 5px, #fff 5px) 0 0;
  background-size: 20px 20px;
  background-repeat: repeat-x;
}

.receipt-paper::before {
  top: -10px;
  transform: rotate(180deg);
}

.receipt-paper::after {
  bottom: -10px;
}

.receipt-header-line {
  height: 24px;
  background: #e5e7eb;
  width: 60%;
  margin: 0 auto 10px;
  border-radius: 4px;
}

.receipt-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.r-line {
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
}

.gap {
  height: 12px;
}

.w-full {
  width: 100%;
}

.w-90 {
  width: 90%;
}

.w-80 {
  width: 80%;
}

.w-70 {
  width: 70%;
}

.w-60 {
  width: 60%;
}

.w-50 {
  width: 50%;
}

.w-40 {
  width: 40%;
}

.receipt-footer {
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  border-top: 1px dashed #e5e7eb;
}

.barcode {
  width: 80%;
  height: 40px;
  background: repeating-linear-gradient(90deg,
      #333,
      #333 2px,
      #fff 2px,
      #fff 4px);
}

.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-box {
  width: 250px;
  height: 250px;
  position: relative;
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
  /* Dim surrounding area */
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: #fff;
  border-style: solid;
}

.top-left {
  top: 0;
  left: 0;
  border-width: 3px 0 0 3px;
  border-top-left-radius: 12px;
}

.top-right {
  top: 0;
  right: 0;
  border-width: 3px 3px 0 0;
  border-top-right-radius: 12px;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-width: 0 0 3px 3px;
  border-bottom-left-radius: 12px;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-width: 0 3px 3px 0;
  border-bottom-right-radius: 12px;
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: #84cc16;
  /* Lime green */
  box-shadow: 0 0 10px #84cc16;
  top: 0;
  animation: scanMove 2s infinite linear;
}

@keyframes scanMove {
  0% {
    top: 0;
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    top: 100%;
    opacity: 0;
  }
}

.manual-input-area {
  position: absolute;
  bottom: 150px;
  /* Above the result card area */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 15;
}

.manual-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  backdrop-filter: blur(4px);
}

.manual-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: #fff;
  color: #fff;
}

.result-card {
  background: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
  min-height: 200px;
  position: relative;
  z-index: 20;
  margin-top: -20px;
  /* Overlap camera slightly */
}

.result-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.item-icon {
  font-size: 24px;
  margin-right: 15px;
}

.item-info {
  flex-grow: 1;
}

.item-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.item-portion {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 5px;
}

.item-macros {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #333;
}

.macro {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.dot.green {
  background: #84cc16;
}

.dot.red {
  background: #ef4444;
}

.dot.orange {
  background: #f97316;
}

.dot.purple {
  background: #a855f7;
}

.plus-circle-btn {
  width: 100%;
  height: 48px;
  font-size: 24px;
  background-color: #bef264;
  border-color: #bef264;
  color: #b3afaf;

  &:hover {
    background-color: #a7f3d0;
    border-color: #a7f3d0;
    color: #777676;
  }
}
</style>
