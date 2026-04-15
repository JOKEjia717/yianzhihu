<template>
  <div class="children-container">
    <el-card class="children-card">
      <template #header>
        <div class="card-header">
          <span>子女信息管理</span>
          <el-button type="primary" @click="handleAdd">添加子女信息</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-container">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入子女姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="老人姓名">
            <el-input v-model="searchForm.elderlyName" placeholder="请输入老人姓名" clearable></el-input>
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
        <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
        <el-table-column prop="relation" label="亲属关系" width="100"></el-table-column>
        <el-table-column prop="elderlyName" label="老人姓名" width="100"></el-table-column>
        <el-table-column prop="visitFrequency" label="探访频率" width="100"></el-table-column>
        <el-table-column prop="lastVisit" label="最近探访日期" width="120"></el-table-column>
        <el-table-column prop="payment" label="缴费方式" width="80"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
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
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="亲属关系" prop="relation">
          <el-select v-model="form.relation" placeholder="请选择亲属关系" style="width: 100%">
            <el-option label="儿子" value="儿子"></el-option>
            <el-option label="女儿" value="女儿"></el-option>
            <el-option label="孙子" value="孙子"></el-option>
            <el-option label="孙女" value="孙女"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老人姓名" prop="elderlyName">
          <el-input v-model="form.elderlyName" placeholder="请输入老人姓名"></el-input>
        </el-form-item>
        <el-form-item label="探访频率" prop="visitFrequency">
          <el-select v-model="form.visitFrequency" placeholder="请选择探访频率" style="width: 100%">
            <el-option label="每周" value="每周"></el-option>
            <el-option label="每两周" value="每两周"></el-option>
            <el-option label="每月" value="每月"></el-option>
            <el-option label="每季度" value="每季度"></el-option>
            <el-option label="不固定" value="不固定"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最近探访" prop="lastVisit">
          <el-date-picker
            v-model="form.lastVisit"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="缴费方式" prop="payment">
          <el-select v-model="form.payment" placeholder="请选择缴费方式" style="width: 100%">
            <el-option label="按月" value="按月"></el-option>
            <el-option label="按季" value="按季"></el-option>
            <el-option label="按年" value="按年"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="form.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          ></el-input>
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
import { childrenData } from '../../api/mock'

// 表格数据
const tableData = ref([...childrenData])

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
  elderlyName: ''
})

// 过滤后的表格数据
const filteredTableData = computed(() => {
  let data = tableData.value
  if (searchForm.name) {
    data = data.filter(item => item.name.includes(searchForm.name))
  }
  if (searchForm.elderlyName) {
    data = data.filter(item => item.elderlyName.includes(searchForm.elderlyName))
  }
  return data
})

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.elderlyName = ''
}

// 搜索操作
const handleSearch = () => {
  currentPage.value = 1
}

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加子女信息')
const formRef = ref(null)
const form = reactive({
  id: '',
  name: '',
  gender: '',
  phone: '',
  relation: '',
  elderlyName: '',
  visitFrequency: '',
  lastVisit: '',
  payment: '',
  remarks: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  relation: [{ required: true, message: '请选择亲属关系', trigger: 'change' }],
  elderlyName: [{ required: true, message: '请输入老人姓名', trigger: 'blur' }],
  visitFrequency: [{ required: true, message: '请选择探访频率', trigger: 'change' }],
  payment: [{ required: true, message: '请选择缴费方式', trigger: 'change' }]
}

// 重置表单
const resetForm = () => {
  form.id = ''
  form.name = ''
  form.gender = ''
  form.phone = ''
  form.relation = ''
  form.elderlyName = ''
  form.visitFrequency = ''
  form.lastVisit = ''
  form.payment = ''
  form.remarks = ''
}

// 添加操作
const handleAdd = () => {
  dialogTitle.value = '添加子女信息'
  resetForm()
  dialogVisible.value = true
}

// 编辑操作
const handleEdit = (row) => {
  dialogTitle.value = '编辑子女信息'
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
</script>

<style scoped>
.children-container {
  padding: 20px;
}

.children-card {
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