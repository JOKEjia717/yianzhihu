<template>
  <div class="directors-container">
    <el-row :gutter="20">
      <!-- 卡片展示区域 -->
      <el-col :span="24">
        <div class="card-list">
          <el-card v-for="director in directorsData" :key="director.id" class="director-card">
            <div class="card-top">
              <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
              <div class="director-info">
                <h3>{{ director.name }}</h3>
                <p>{{ director.department }}</p>
                <div class="performance">
                  <span :data-score="director.performance">绩效评分</span>
                  <el-progress :percentage="director.performance" :color="getPerformanceColor(director.performance)"></el-progress>
                </div>
              </div>
              <div class="card-actions">
                <el-button size="small" type="primary" @click="handleEdit(director)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(director)">删除</el-button>
              </div>
            </div>
            <el-divider></el-divider>
            <div class="card-details">
              <div class="detail-item">
                <span class="label">性别</span>
                <span class="value">{{ director.gender }}</span>
              </div>
              <div class="detail-item">
                <span class="label">年龄</span>
                <span class="value">{{ director.age }}</span>
              </div>
              <div class="detail-item">
                <span class="label">联系电话</span>
                <span class="value">{{ director.phone }}</span>
              </div>
              <div class="detail-item">
                <span class="label">学历</span>
                <span class="value">{{ director.education }}</span>
              </div>
              <div class="detail-item">
                <span class="label">专业</span>
                <span class="value">{{ director.major }}</span>
              </div>
              <div class="detail-item">
                <span class="label">工作经验</span>
                <span class="value">{{ director.experience }}</span>
              </div>
              <div class="detail-item">
                <span class="label">资质证书</span>
                <span class="value">{{ director.certification }}</span>
              </div>
            </div>
          </el-card>
          
          <!-- 添加院长卡片 -->
          <el-card class="add-card" @click="handleAdd">
            <div class="add-content">
              <el-icon class="add-icon"><Plus /></el-icon>
              <span>添加管理人员</span>
            </div>
          </el-card>
        </div>
      </el-col>
      
      <!-- 绩效对比图表 -->
      <el-col :span="24" class="chart-container">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>管理人员绩效对比</span>
            </div>
          </template>
          <div ref="performanceChartRef" class="performance-chart"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="30" :max="70" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-select v-model="form.education" placeholder="请选择学历" style="width: 100%">
            <el-option label="专科" value="专科"></el-option>
            <el-option label="本科" value="本科"></el-option>
            <el-option label="硕士" value="硕士"></el-option>
            <el-option label="博士" value="博士"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入专业"></el-input>
        </el-form-item>
        <el-form-item label="工作经验" prop="experience">
          <el-input v-model="form.experience" placeholder="请输入工作经验，如：10年"></el-input>
        </el-form-item>
        <el-form-item label="资质证书" prop="certification">
          <el-select v-model="form.certification" placeholder="请选择资质证书" style="width: 100%">
            <el-option label="养老机构管理师" value="养老机构管理师"></el-option>
            <el-option label="高级养老机构管理师" value="高级养老机构管理师"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择部门" style="width: 100%">
            <el-option label="综合管理" value="综合管理"></el-option>
            <el-option label="医疗护理" value="医疗护理"></el-option>
            <el-option label="行政事务" value="行政事务"></el-option>
            <el-option label="生活服务" value="生活服务"></el-option>
            <el-option label="健康管理" value="健康管理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绩效评分" prop="performance">
          <el-slider v-model="form.performance" :min="0" :max="100" :step="1"></el-slider>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { directorsData as mockDirectorsData } from '../../api/mock'

// 管理人员数据
const directorsData = ref([...mockDirectorsData])

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加管理人员')
const formRef = ref(null)
const form = reactive({
  id: '',
  name: '',
  gender: '',
  age: 45,
  phone: '',
  education: '',
  major: '',
  experience: '',
  certification: '',
  department: '',
  performance: 85
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  education: [{ required: true, message: '请选择学历', trigger: 'change' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  experience: [{ required: true, message: '请输入工作经验', trigger: 'blur' }],
  certification: [{ required: true, message: '请选择资质证书', trigger: 'change' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }]
}

// 重置表单
const resetForm = () => {
  form.id = ''
  form.name = ''
  form.gender = ''
  form.age = 45
  form.phone = ''
  form.education = ''
  form.major = ''
  form.experience = ''
  form.certification = ''
  form.department = ''
  form.performance = 85
}

// 添加操作
const handleAdd = () => {
  dialogTitle.value = '添加管理人员'
  resetForm()
  dialogVisible.value = true
}

// 编辑操作
const handleEdit = (director) => {
  dialogTitle.value = '编辑管理人员'
  // 复制对象
  Object.keys(form).forEach(key => {
    form[key] = director[key]
  })
  dialogVisible.value = true
}

// 删除操作
const handleDelete = (director) => {
  ElMessageBox.confirm('确定要删除该管理人员吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    directorsData.value = directorsData.value.filter(item => item.id !== director.id)
    ElMessage.success('删除成功')
    // 重新初始化图表
    initPerformanceChart()
  }).catch(() => {})
}

// 提交表单
const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (form.id) {
        // 编辑
        const index = directorsData.value.findIndex(item => item.id === form.id)
        if (index !== -1) {
          directorsData.value[index] = { ...form }
          ElMessage.success('修改成功')
        }
      } else {
        // 添加
        const newId = Math.max(...directorsData.value.map(item => item.id)) + 1
        directorsData.value.push({
          ...form,
          id: newId
        })
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
      // 重新初始化图表
      initPerformanceChart()
    }
  })
}

// 根据绩效得分返回颜色
const getPerformanceColor = (score) => {
  if (score >= 90) return '#67C23A'
  if (score >= 80) return '#409EFF'
  if (score >= 70) return '#E6A23C'
  return '#F56C6C'
}

// 绩效图表
const performanceChartRef = ref(null)

const initPerformanceChart = () => {
  if (!performanceChartRef.value) return
  
  const chart = echarts.init(performanceChartRef.value)
  
  const names = directorsData.value.map(item => item.name)
  const performances = directorsData.value.map(item => item.performance)
  const positions = directorsData.value.map(item => item.department)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const index = params[0].dataIndex
        return `${names[index]}<br/>部门: ${positions[index]}<br/>绩效: ${performances[index]}`
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
        data: names,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value} 分'
        }
      }
    ],
    series: [
      {
        name: '绩效评分',
        type: 'bar',
        barWidth: '60%',
        data: performances,
        itemStyle: {
          color: function(params) {
            return getPerformanceColor(params.value)
          }
        }
      }
    ]
  }
  
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  initPerformanceChart()
})
</script>

<style scoped>
.directors-container {
  padding: 20px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.director-card, .add-card {
  width: calc(50% - 10px);
  min-width: 360px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.director-card:hover, .add-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.1);
}

.card-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.director-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.director-info h3 {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.director-info p {
  color: #606266;
  margin: 0 0 12px 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.performance {
  margin-top: auto;
}

.performance span {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

.performance span::after {
  content: attr(data-score) '%';
  font-weight: 600;
  color: #409EFF;
}

.el-progress-bar__outer {
  height: 6px;
  border-radius: 3px;
  background-color: #e4e7ed;
}

.el-progress-bar__inner {
  border-radius: 3px;
  transition: width 0.6s ease;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.card-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 15px;
  margin-top: 15px;
}

.detail-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 4px 0;
}

.label {
  color: #909399;
  font-size: 13px;
  flex-shrink: 0;
  width: 70px;
  text-align: right;
  margin-right: 8px;
}

.value {
  font-weight: 500;
  font-size: 13px;
  color: #303133;
  flex: 1;
  text-align: left;
  word-break: break-all;
  white-space: normal;
  min-height: 20px;
}

.add-card {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  min-height: 294px;
}

.add-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-icon {
  font-size: 36px;
  margin-bottom: 10px;
  color: #409EFF;
}

.chart-container {
  margin-top: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.performance-chart {
  height: 300px;
}

@media (max-width: 1400px) {
  .director-card, .add-card {
    width: calc(33.333% - 13.333px);
  }
}

@media (max-width: 1200px) {
  .director-card, .add-card {
    width: calc(33.333% - 13.333px);
  }
  
  .card-details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .director-card, .add-card {
    width: calc(50% - 10px);
  }
}

@media (max-width: 768px) {
  .director-card, .add-card {
    width: 100%;
  }
  
  .card-top {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .card-actions {
    flex-direction: row;
    margin-top: 12px;
  }
}
</style> 