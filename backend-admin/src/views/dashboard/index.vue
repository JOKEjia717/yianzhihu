<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col :span="6" v-for="card in statisticsCards" :key="card.title">
        <el-card class="statistics-card" :body-style="{ backgroundColor: card.color }">
          <div class="card-content">
            <div class="card-icon">
              <el-icon><component :is="card.icon" /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value">{{ card.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 老人年龄分布 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>老人年龄分布</span>
            </div>
          </template>
          <div class="chart-container" ref="ageChartRef"></div>
        </el-card>
      </el-col>

      <!-- 老人性别比例 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>老人性别比例</span>
            </div>
          </template>
          <div class="chart-container" ref="genderChartRef"></div>
        </el-card>
      </el-col>

      <!-- 护理需求分布 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>护理需求分布</span>
            </div>
          </template>
          <div class="chart-container" ref="careChartRef"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 志愿者服务评分 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>志愿者服务评分</span>
            </div>
          </template>
          <div class="chart-container" ref="ratingChartRef"></div>
        </el-card>
      </el-col>

      <!-- 院长绩效 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>院长绩效</span>
            </div>
          </template>
          <div class="chart-container" ref="performanceChartRef"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import * as echarts from 'echarts'
import { elderlyData, caregiversData, directorsData } from '../../api/mock'

// 统计卡片数据
const statisticsCards = reactive([
  { title: '老人总数', value: elderlyData.total, icon: 'UserFilled', color: '#67C23A' },
  { title: '志愿者人数', value: caregiversData.length, icon: 'First-aid-kit', color: '#409EFF' },
  { title: '院长人数', value: directorsData.length, icon: 'Management', color: '#E6A23C' },
  { title: '子女数量', value: 18, icon: 'User', color: '#F56C6C' }
])

// 图表引用
const ageChartRef = ref(null)
const genderChartRef = ref(null)
const careChartRef = ref(null)
const ratingChartRef = ref(null)
const performanceChartRef = ref(null)

// 初始化年龄分布图表
const initAgeChart = () => {
  const chart = echarts.init(ageChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: elderlyData.ageGroups.map(item => item.age)
    },
    series: [
      {
        name: '年龄分布',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: elderlyData.ageGroups.map(item => {
          return { value: item.count, name: item.age }
        })
      }
    ]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化性别比例图表
const initGenderChart = () => {
  const chart = echarts.init(genderChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: ['男性', '女性']
    },
    series: [
      {
        name: '性别比例',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: elderlyData.male, name: '男性' },
          { value: elderlyData.female, name: '女性' }
        ]
      }
    ]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化护理需求图表
const initCareChart = () => {
  const chart = echarts.init(careChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: elderlyData.careNeeds.map(item => item.level)
    },
    series: [
      {
        name: '护理需求',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: elderlyData.careNeeds.map(item => {
          return { value: item.count, name: item.level }
        })
      }
    ]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化志愿者评分图表
const initRatingChart = () => {
  const chart = echarts.init(ratingChartRef.value)
  
  const caregiverNames = caregiversData.map(item => item.name)
  const caregiverRatings = caregiversData.map(item => item.rating)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: caregiverNames,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        min: 4,
        max: 5
      }
    ],
    series: [
      {
        name: '服务评分',
        type: 'bar',
        barWidth: '60%',
        data: caregiverRatings
      }
    ]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化院长绩效图表
const initPerformanceChart = () => {
  const chart = echarts.init(performanceChartRef.value)
  
  const directorNames = directorsData.map(item => item.name)
  const directorPerformances = directorsData.map(item => item.performance)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: directorNames,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        min: 80,
        max: 100
      }
    ],
    series: [
      {
        name: '绩效评分',
        type: 'bar',
        barWidth: '60%',
        data: directorPerformances
      }
    ]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  initAgeChart()
  initGenderChart()
  initCareChart()
  initRatingChart()
  initPerformanceChart()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.statistics-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.card-content {
  display: flex;
  align-items: center;
  padding: 20px;
  color: white;
}

.card-icon {
  font-size: 36px;
  margin-right: 15px;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 16px;
  margin-bottom: 5px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 280px;
}
</style> 