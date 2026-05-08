<template>
  <div class="activity-container">
    <el-row :gutter="20">
      <!-- 活动管理表格 -->
      <el-col :span="24">
        <el-card class="activity-card">
          <template #header>
            <div class="card-header">
              <span>活动管理</span>
              <el-button type="primary" @click="handleAdd">添加活动</el-button>
            </div>
          </template>
          
          <!-- 搜索区域 -->
          <div class="search-container">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="活动名称">
                <el-input v-model="searchForm.name" placeholder="请输入活动名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="活动类型">
                <el-select v-model="searchForm.type" placeholder="请选择活动类型" clearable style="width: 120px">
                  <el-option label="文娱活动" value="文娱活动"></el-option>
                  <el-option label="体育活动" value="体育活动"></el-option>
                  <el-option label="节日庆典" value="节日庆典"></el-option>
                  <el-option label="健康讲座" value="健康讲座"></el-option>
                  <el-option label="社交聚会" value="社交聚会"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="活动状态">
                <el-select v-model="searchForm.status" placeholder="请选择活动状态" clearable style="width: 120px">
                  <el-option label="未开始" value="未开始"></el-option>
                  <el-option label="进行中" value="进行中"></el-option>
                  <el-option label="已结束" value="已结束"></el-option>
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
            <el-table-column prop="name" label="活动名称" width="150"></el-table-column>
            <el-table-column prop="type" label="活动类型" width="100"></el-table-column>
            <el-table-column prop="date" label="活动日期" width="120"></el-table-column>
            <el-table-column prop="time" label="活动时间" width="100"></el-table-column>
            <el-table-column prop="location" label="活动地点" width="120"></el-table-column>
            <el-table-column prop="participants" label="参与人数" width="100"></el-table-column>
            <el-table-column prop="description" label="活动描述" min-width="200"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
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
    </el-row>
    
    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择活动类型" style="width: 100%">
            <el-option label="文娱活动" value="文娱活动"></el-option>
            <el-option label="体育活动" value="体育活动"></el-option>
            <el-option label="节日庆典" value="节日庆典"></el-option>
            <el-option label="健康讲座" value="健康讲座"></el-option>
            <el-option label="社交聚会" value="社交聚会"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动日期" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="请选择活动日期" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动时间" prop="time">
          <el-time-picker v-model="form.time" placeholder="请选择活动时间" style="width: 100%"></el-time-picker>
        </el-form-item>
        <el-form-item label="活动地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入活动地点"></el-input>
        </el-form-item>
        <el-form-item label="预计人数" prop="participants">
          <el-input-number v-model="form.participants" :min="1" :max="200" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="活动描述" prop="description">
          <el-input type="textarea" v-model="form.description" placeholder="请输入活动描述"></el-input>
        </el-form-item>
        <el-form-item label="活动状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择活动状态" style="width: 100%">
            <el-option label="未开始" value="未开始"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="已结束" value="已结束"></el-option>
          </el-select>
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 活动数据
const tableData = ref([
  { id: 1, name: '春节联欢晚会', type: '节日庆典', date: '2024-02-09', time: '19:00', location: '活动中心大厅', participants: 80, description: '一年一度的春节联欢晚会，节目丰富多彩，欢迎各位老人参加', status: '已结束' },
  { id: 2, name: '健康养生讲座', type: '健康讲座', date: '2024-03-15', time: '14:00', location: '多功能厅', participants: 50, description: '邀请专业医生讲解春季养生知识，解答健康疑问', status: '未开始' },
  { id: 3, name: '乒乓球友谊赛', type: '体育活动', date: '2024-03-20', time: '09:00', location: '体育馆', participants: 30, description: '春季乒乓球友谊赛，增进友谊，锻炼身体', status: '未开始' },
  { id: 4, name: '书法作品展', type: '文娱活动', date: '2024-03-10', time: '10:00', location: '文化长廊', participants: 60, description: '展示老人书法作品，弘扬传统文化', status: '进行中' },
  { id: 5, name: '生日聚会', type: '社交聚会', date: '2024-03-25', time: '15:00', location: '餐厅', participants: 20, description: '三月生日老人集体生日会，共度美好时光', status: '未开始' },
  { id: 6, name: '端午节活动', type: '节日庆典', date: '2024-06-10', time: '10:00', location: '活动中心', participants: 100, description: '包粽子比赛、端午知识问答等活动', status: '未开始' },
  { id: 7, name: '广场舞大赛', type: '体育活动', date: '2024-04-01', time: '09:30', location: '广场', participants: 45, description: '春季广场舞比赛，展现活力风采', status: '未开始' },
  { id: 8, name: '电影放映会', type: '文娱活动', date: '2024-03-12', time: '19:00', location: '影视厅', participants: 70, description: '每周电影放映，经典影片回顾', status: '进行中' }
])

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
  type: '',
  status: ''
})

// 过滤后的表格数据
const filteredTableData = computed(() => {
  let data = tableData.value
  if (searchForm.name) {
    data = data.filter(item => item.name.includes(searchForm.name))
  }
  if (searchForm.type) {
    data = data.filter(item => item.type === searchForm.type)
  }
  if (searchForm.status) {
    data = data.filter(item => item.status === searchForm.status)
  }
  return data
})

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case '未开始':
      return 'info'
    case '进行中':
      return 'success'
    case '已结束':
      return 'warning'
    default:
      return 'default'
  }
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.status = ''
}

// 搜索操作
const handleSearch = () => {
  currentPage.value = 1
}

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加活动')
const formRef = ref(null)
const form = reactive({
  id: '',
  name: '',
  type: '',
  date: '',
  time: '',
  location: '',
  participants: 20,
  description: '',
  status: '未开始'
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  date: [{ required: true, message: '请选择活动日期', trigger: 'change' }],
  time: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  participants: [{ required: true, message: '请输入预计人数', trigger: 'blur' }],
  description: [{ required: true, message: '请输入活动描述', trigger: 'blur' }],
  status: [{ required: true, message: '请选择活动状态', trigger: 'change' }]
}

// 重置表单
const resetForm = () => {
  form.id = ''
  form.name = ''
  form.type = ''
  form.date = ''
  form.time = ''
  form.location = ''
  form.participants = 20
  form.description = ''
  form.status = '未开始'
}

// 添加操作
const handleAdd = () => {
  dialogTitle.value = '添加活动'
  resetForm()
  dialogVisible.value = true
}

// 编辑操作
const handleEdit = (row) => {
  dialogTitle.value = '编辑活动'
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
  dialogVisible.value = true
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该活动吗?', '提示', {
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
        const index = tableData.value.findIndex(item => item.id === form.id)
        if (index !== -1) {
          tableData.value[index] = { ...form }
          ElMessage.success('修改成功')
        }
      } else {
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
</script>

<style scoped>
.activity-container {
  padding: 20px;
}

.activity-card {
  margin-bottom: 20px;
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
</style>