<template>
  <div class="caregivers-container">
    <el-row :gutter="20">
      <!-- 护工管理表格 -->
      <el-col :span="18">
        <el-card class="caregivers-card">
          <template #header>
            <div class="card-header">
              <span>护工信息管理</span>
              <el-button type="primary" @click="handleAdd">添加护工信息</el-button>
            </div>
          </template>
          
          <!-- 搜索区域 -->
          <div class="search-container">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="姓名">
                <el-input v-model="searchForm.name" placeholder="请输入护工姓名" clearable></el-input>
              </el-form-item>
              <el-form-item label="职位">
                <el-select v-model="searchForm.position" placeholder="请选择职位" clearable style="width: 120px">
                  <el-option label="护理员" value="护理员"></el-option>
                  <el-option label="高级护理员" value="高级护理员"></el-option>
                  <el-option label="主管护理员" value="主管护理员"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 表格区域 -->
          <el-table :data="filteredTableData" style="width: 100%" border>
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="name" label="姓名" width="100"></el-table-column>
            <el-table-column prop="gender" label="性别" width="60"></el-table-column>
            <el-table-column prop="age" label="年龄" width="60"></el-table-column>
            <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
            <el-table-column prop="position" label="职位" width="100"></el-table-column>
            <el-table-column prop="experience" label="工作经验" width="80"></el-table-column>
            <el-table-column prop="certification" label="资质证书" width="120"></el-table-column>
            <el-table-column prop="elderlyCount" label="负责老人数" width="100"></el-table-column>
            <el-table-column prop="rating" label="评分" width="80">
              <template #default="scope">
                <el-rate
                  v-model="scope.row.rating"
                  disabled
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                  :max="5"
                  :show-score="true"
                  text-color="#ff9900"
                ></el-rate>
              </template>
            </el-table-column>
            <el-table-column prop="salary" label="薪资" width="80"></el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页区域 -->
          <div class="pagination-container">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredTableData.length"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-card>
      </el-col>
      
      <!-- 护工统计信息 -->
      <el-col :span="6">
        <el-card class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>护工统计信息</span>
            </div>
          </template>
          
          <div class="statistics-item">
            <div class="statistics-label">护工总数</div>
            <div class="statistics-value">{{ tableData.length }}</div>
          </div>
          
          <div class="statistics-item">
            <div class="statistics-label">平均年龄</div>
            <div class="statistics-value">{{ averageAge }}</div>
          </div>
          
          <div class="statistics-item">
            <div class="statistics-label">平均工作经验</div>
            <div class="statistics-value">{{ averageExperience }}</div>
          </div>
          
          <div class="statistics-item">
            <div class="statistics-label">平均服务评分</div>
            <div class="statistics-value">{{ averageRating }}</div>
          </div>
          
          <div class="statistics-item">
            <div class="statistics-label">平均负责老人数</div>
            <div class="statistics-value">{{ averageElderlyCount }}</div>
          </div>
          
          <div class="chart-container" ref="certificationChartRef"></div>
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
          <el-input-number v-model="form.age" :min="18" :max="65" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-select v-model="form.position" placeholder="请选择职位" style="width: 100%">
            <el-option label="护理员" value="护理员"></el-option>
            <el-option label="高级护理员" value="高级护理员"></el-option>
            <el-option label="主管护理员" value="主管护理员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作经验" prop="experience">
          <el-input v-model="form.experience" placeholder="请输入工作经验，如：5年"></el-input>
        </el-form-item>
        <el-form-item label="资质证书" prop="certification">
          <el-select v-model="form.certification" placeholder="请选择资质证书" style="width: 100%">
            <el-option label="初级养老护理师" value="初级养老护理师"></el-option>
            <el-option label="养老护理师" value="养老护理师"></el-option>
            <el-option label="高级养老护理师" value="高级养老护理师"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责老人数" prop="elderlyCount">
          <el-input-number v-model="form.elderlyCount" :min="0" :max="10" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="form.rating" :max="5" style="width: 100%"></el-rate>
        </el-form-item>
        <el-form-item label="薪资" prop="salary">
          <el-input-number v-model="form.salary" :min="3000" :max="10000" :step="100" style="width: 100%"></el-input-number>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { caregiversData } from '../../api/mock'

// 表格数据
const tableData = ref([...caregiversData])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const handleSizeChange = (size) => {
  pageSize.value = size
}
const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 搜索表单
const searchForm = reactive({
  name: '',
  position: ''
})

// 过滤后的表格数据
const filteredTableData = computed(() => {
  let data = tableData.value
  if (searchForm.name) {
    data = data.filter(item => item.name.includes(searchForm.name))
  }
  if (searchForm.position) {
    data = data.filter(item => item.position === searchForm.position)
  }
  return data
})

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.position = ''
}

// 搜索操作
const handleSearch = () => {
  currentPage.value = 1
}

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加护工信息')
const formRef = ref(null)
const form = reactive({
  id: '',
  name: '',
  gender: '',
  age: 30,
  phone: '',
  position: '',
  experience: '',
  certification: '',
  elderlyCount: 0,
  rating: 4.0,
  salary: 4500
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
  position: [{ required: true, message: '请选择职位', trigger: 'change' }],
  experience: [{ required: true, message: '请输入工作经验', trigger: 'blur' }],
  certification: [{ required: true, message: '请选择资质证书', trigger: 'change' }],
  elderlyCount: [{ required: true, message: '请输入负责老人数', trigger: 'blur' }],
  salary: [{ required: true, message: '请输入薪资', trigger: 'blur' }]
}

// 重置表单
const resetForm = () => {
  form.id = ''
  form.name = ''
  form.gender = ''
  form.age = 30
  form.phone = ''
  form.position = ''
  form.experience = ''
  form.certification = ''
  form.elderlyCount = 0
  form.rating = 4.0
  form.salary = 4500
}

// 添加操作
const handleAdd = () => {
  dialogTitle.value = '添加护工信息'
  resetForm()
  dialogVisible.value = true
}

// 编辑操作
const handleEdit = (row) => {
  dialogTitle.value = '编辑护工信息'
  // 复制对象
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
  dialogVisible.value = true
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该条记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 提交表单
const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (form.id) {
        // 编辑
        const index = tableData.value.findIndex(item => item.id === form.id)
        if (index !== -1) {
          tableData.value[index] = { ...form }
          ElMessage.success('修改成功')
        }
      } else {
        // 添加
        const newId = Math.max(...tableData.value.map(item => item.id)) + 1
        tableData.value.push({
          ...form,
          id: newId
        })
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    }
  })
}

// 统计信息相关
const averageAge = computed(() => {
  if (tableData.value.length === 0) return 0
  const sum = tableData.value.reduce((acc, cur) => acc + cur.age, 0)
  return (sum / tableData.value.length).toFixed(1)
})

const averageExperience = computed(() => {
  if (tableData.value.length === 0) return '0年'
  const experienceValues = tableData.value.map(item => parseInt(item.experience))
  const sum = experienceValues.reduce((acc, cur) => acc + cur, 0)
  return (sum / tableData.value.length).toFixed(1) + '年'
})

const averageRating = computed(() => {
  if (tableData.value.length === 0) return 0
  const sum = tableData.value.reduce((acc, cur) => acc + cur.rating, 0)
  return (sum / tableData.value.length).toFixed(1)
})

const averageElderlyCount = computed(() => {
  if (tableData.value.length === 0) return 0
  const sum = tableData.value.reduce((acc, cur) => acc + cur.elderlyCount, 0)
  return (sum / tableData.value.length).toFixed(1)
})

// 证书分布图表
const certificationChartRef = ref(null)

const initCertificationChart = () => {
  const chart = echarts.init(certificationChartRef.value)
  
  // 统计证书分布
  const certCounts = {}
  tableData.value.forEach(item => {
    if (certCounts[item.certification]) {
      certCounts[item.certification]++
    } else {
      certCounts[item.certification] = 1
    }
  })
  
  const certNames = Object.keys(certCounts)
  const certValues = Object.values(certCounts)
  
  const option = {
    title: {
      text: '证书分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
      {
        name: '证书分布',
        type: 'pie',
        radius: '65%',
        center: ['50%', '60%'],
        data: certNames.map((name, index) => {
          return { value: certValues[index], name: name }
        }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
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
  initCertificationChart()
})
</script>

<style scoped>
.caregivers-container {
  padding: 20px;
}

.caregivers-card, .statistics-card {
  margin-bottom: 20px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-container {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.statistics-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f7f7f7;
  border-radius: 4px;
}

.statistics-label {
  font-weight: bold;
  color: #606266;
}

.statistics-value {
  font-size: 18px;
  color: #409EFF;
  font-weight: bold;
}

.chart-container {
  height: 200px;
  margin-top: 20px;
}
</style> 