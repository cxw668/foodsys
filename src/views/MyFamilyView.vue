<template>
  <div class="common-layout">
    <el-container class="main-container">
      <el-aside width="240px" class="left-aside">
        <HomeSidebar />
      </el-aside>
      
      <el-main class="center-main">
        <div class="content-wrapper">
          <div class="header">
            <h2>My Family</h2>
            <el-button type="primary" round @click="showAddMemberModal = true">Add Member</el-button>
          </div>
          
          <el-dialog
            title="Add New Member"
            v-model="showAddMemberModal"
            width="300px"
          >
            <el-form :model="newMember" label-position="top">
              <el-form-item label="Name">
                <el-input v-model="newMember.name" placeholder="Enter name" />
              </el-form-item>
              <el-form-item label="Role">
                <el-select v-model="newMember.role" placeholder="Select role">
                  <el-option label="Member" value="Member" />
                  <el-option label="Admin" value="Admin" />
                  <el-option label="Child" value="Child" />
                  <el-option label="Elder" value="Elder" />
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="showAddMemberModal = false">Cancel</el-button>
              <el-button type="primary" @click="addMember">Add</el-button>
            </template>
          </el-dialog>
          <div class="members-grid">
             <div v-for="(member, index) in members" :key="index" class="member-card" :class="{ 'main-user': member.role === 'Admin' }">
               <el-avatar :size="64" :src="member.avatar || ''">{{ member.name.charAt(0) }}</el-avatar>
               <h3>{{ member.name }}</h3>
               <p>{{ member.role }}</p>
             </div>
          </div>

          <div class="family-stats">
            <h3>Family Health Overview</h3>
            <div class="stats-container">
              <div class="stats-card">
                 <div class="stat-item">
                   <div class="label">Total Members</div>
                   <div class="value">{{ members.length }}</div>
                 </div>
                 <div class="stat-item">
                   <div class="label">Meals Tracked (Week)</div>
                   <div class="value">{{ members.reduce((sum, m) => sum + (Number(m.meals)||0), 0) }}</div>
                 </div>
                 <div class="stat-item">
                    <div class="label">Avg Glucose (Family)</div>
                    <div class="value">
                      {{ (members.reduce((sum, m) => sum + Number(m.glucose), 0) / members.length).toFixed(1) }} 
                      <span class="unit">mmol/L</span>
                    </div>
                 </div>
              </div>
              
              <div class="chart-card">
                <div ref="chartRef" style="width: 100%; height: 250px;"></div>
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const baseUrl = import.meta.env.BASE_URL

const showAddMemberModal = ref(false)
const chartRef = ref(null)
let chartInstance = null

const members = ref([
  {
    name: 'Me',
    role: 'Admin',
    avatar: baseUrl + 'images/avatar.png',
    glucose: 5.4,
    meals: 21
  },
  {
    name: 'Partner',
    role: 'Member',
    avatar: '',
    glucose: 5.2,
    meals: 18
  }
])

const loadMembers = () => {
  const storedMembers = sessionStorage.getItem('members')
  if (storedMembers) {
    members.value = JSON.parse(storedMembers)
  }
  members.value = members.value.map(m => {
    if (!m.avatar) return m
    if (m.avatar.startsWith('/images/')) return { ...m, avatar: baseUrl + m.avatar.slice(1) }
    return m
  })
  // Ensure default stats if missing
  members.value.forEach(m => {
    if (m.glucose === undefined) m.glucose = (5 + Math.random()).toFixed(1)
    if (m.meals === undefined) m.meals = Math.floor(Math.random() * 20 + 10)
  })
}
loadMembers()

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.dispose()
  
  chartInstance = echarts.init(chartRef.value)
  
  const names = members.value.map(m => m.name)
  const glucoseData = members.value.map(m => m.glucose)
  
  const option = {
    title: {
      text: 'Weekly Glucose Avg',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'axis' },
    xAxis: { 
      type: 'category', 
      data: names,
      axisLabel: { interval: 0 }
    },
    yAxis: { 
      type: 'value',
      name: 'mmol/L',
      min: 4,
      max: 8
    },
    series: [
      {
        data: glucoseData,
        type: 'bar',
        itemStyle: { color: '#84cc16', borderRadius: [4, 4, 0, 0] },
        barWidth: '40%',
        label: { show: true, position: 'top' }
      }
    ],
    grid: {
      top: 40,
      bottom: 20,
      left: 40,
      right: 20
    }
  }
  
  chartInstance.setOption(option)
}

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', () => chartInstance?.resize())
  })
})

const newMember = reactive({
  name: '',
  role: 'Member'
})

const addMember = () => {
  if (!newMember.name) return
  members.value.push({
    name: newMember.name,
    role: newMember.role,
    avatar: '',
    glucose: (5 + Math.random()).toFixed(1),
    meals: 0
  })
  sessionStorage.setItem('members', JSON.stringify(members.value))
  showAddMemberModal.value = false
  newMember.name = ''
  newMember.role = 'Member'
  nextTick(() => initChart())
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
  margin-bottom: 32px;
}

.header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.member-card {
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.2s;
}

.member-card:hover {
  border-color: #84cc16;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.member-card h3 {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.member-card p {
  color: #9ca3af;
  font-size: 12px;
}

.add-card {
  border: 2px dashed #e5e7eb;
  cursor: pointer;
  color: #9ca3af;
}

.add-card:hover {
  border-color: #84cc16;
  color: #84cc16;
}

.add-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.family-stats h3 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.stats-card {
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f9fafb;
  padding-bottom: 12px;
}

.stat-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.stat-item .label {
  color: #6b7280;
  font-size: 14px;
}

.stat-item .value {
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
}

.stat-item .unit {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
}

.chart-card {
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  padding: 16px;
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
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
