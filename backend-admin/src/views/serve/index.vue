<template>
  <div class="serve-container">
    <el-row :gutter="20">
      <!-- 服务管理表格 -->
      <el-col :span="24">
        <el-card class="serve-card">
          <template #header>
            <div class="card-header">
              <span>服务管理</span>
              <el-button type="primary" @click="handleAdd">添加服务</el-button>
            </div>
          </template>
          
          <!-- 搜索区域 -->
          <div class="search-container">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="服务名称">
                <el-input v-model="searchForm.name" placeholder="请输入服务名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="服务类型">
                <el-select v-model="searchForm.type" placeholder="请选择服务类型" clearable style="width: 120px">
                  <el-option label="生活服务" value="生活服务"></el-option>
                  <el-option label="医疗护理" value="医疗护理"></el-option>
                  <el-option label="康复训练" value="康复训练"></el-option>
                  <el-option label="心理疏导" value="心理疏导"></el-option>
                  <el-option label="文娱活动" value="文娱活动"></el-option>
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
            <el-table-column prop="name" label="服务名称" width="150"></el-table-column>
            <el-table-column prop="type" label="服务类型" width="100"></el-table-column>
            <el-table-column prop="price" label="服务价格" width="100">
              <template #default="scope">
                <span>¥{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="服务时长" width="100"></el-table-column>
            <el-table-column prop="description" label="服务描述" min-width="200"></el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template #default="scope">
                <el-tag :type="scope.row.status === '启用' ? 'success' : 'warning'">
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
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入服务名称"></el-input>
        </el-form-item>
        <el-form-item label="服务类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择服务类型" style="width: 100%">
            <el-option label="生活服务" value="生活服务"></el-option>
            <el-option label="医疗护理" value="医疗护理"></el-option>
            <el-option label="康复训练" value="康复训练"></el-option>
            <el-option label="心理疏导" value="心理疏导"></el-option>
            <el-option label="文娱活动" value="文娱活动"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :max="9999" :step="10" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="服务时长" prop="duration">
          <el-input v-model="form.duration" placeholder="如：30分钟"></el-input>
        </el-form-item>
        <el-form-item label="服务描述" prop="description">
          <el-input type="textarea" v-model="form.description" placeholder="请输入服务描述"></el-input>
        </el-form-item>
        <el-form-item label="服务状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择服务状态" style="width: 100%">
            <el-option label="启用" value="启用"></el-option>
            <el-option label="停用" value="停用"></el-option>
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

// 服务数据
const tableData = ref([
  { id: 1, name: '日常护理', type: '生活服务', price: 150, duration: '2小时', description: '提供日常起居照料，包括洗漱、穿衣、饮食等基础护理服务', status: '启用' },
  { id: 2, name: '康复按摩', type: '康复训练', price: 200, duration: '1小时', description: '专业康复按摩，促进血液循环，缓解肌肉疲劳', status: '启用' },
  { id: 3, name: '健康监测', type: '医疗护理', price: 80, duration: '30分钟', description: '定期测量血压、血糖等健康指标，建立健康档案', status: '启用' },
  { id: 4, name: '心理咨询', type: '心理疏导', price: 300, duration: '1小时', description: '专业心理咨询服务，帮助缓解焦虑、抑郁等情绪问题', status: '启用' },
  { id: 5, name: '书法课程', type: '文娱活动', price: 50, duration: '1.5小时', description: '每周书法练习课程，丰富精神文化生活', status: '停用' },
  { id: 6, name: '营养餐配送', type: '生活服务', price: 30, duration: '每日', description: '根据老人健康状况定制营养餐食，按时配送', status: '启用' },
  { id: 7, name: '康复理疗', type: '康复训练', price: 260, duration: '1小时', description: '物理治疗、针灸等康复理疗服务', status: '启用' },
  { id: 8, name: '音乐疗法', type: '心理疏导', price: 120, duration: '45分钟', description: '通过音乐放松心情，改善睡眠质量', status: '启用' }
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
  type: ''
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
  return data
})

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.type = ''
}

// 搜索操作
const handleSearch = () => {
  currentPage.value = 1
}

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加服务')
const formRef = ref(null)
const form = reactive({
  id: '',
  name: '',
  type: '',
  price: 0,
  duration: '',
  description: '',
  status: '启用'
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
  price: [{ required: true, message: '请输入服务价格', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入服务时长', trigger: 'blur' }],
  description: [{ required: true, message: '请输入服务描述', trigger: 'blur' }],
  status: [{ required: true, message: '请选择服务状态', trigger: 'change' }]
}

// 重置表单
const resetForm = () => {
  form.id = ''
  form.name = ''
  form.type = ''
  form.price = 0
  form.duration = ''
  form.description = ''
  form.status = '启用'
}

// 添加操作
const handleAdd = () => {
  dialogTitle.value = '添加服务'
  resetForm()
  dialogVisible.value = true
}

// 编辑操作
const handleEdit = (row) => {
  dialogTitle.value = '编辑服务'
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
  dialogVisible.value = true
}

// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该服务吗?', '提示', {
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
.serve-container {
  padding: 20px;
}

.serve-card {
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