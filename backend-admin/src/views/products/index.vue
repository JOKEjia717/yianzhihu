<template>
  <div class="product-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>商品管理</span>
          <el-button type="primary" @click="handleAdd">新增商品</el-button>
        </div>
      </template>
      
      <el-table :data="productList" style="width: 100%">
        <el-table-column label="商品图片" width="120">
          <template #default="scope">
            <el-image 
              style="width: 80px; height: 80px"
              :src="scope.row.image"
              fit="cover"
              :preview-src-list="[scope.row.image]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="120"></el-table-column>
        <el-table-column prop="sales" label="销量" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'on' ? 'success' : 'info'">
              {{ scope.row.status === 'on' ? '在售' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="50%"
    >
      <el-form
        :model="productForm"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="商品图片" prop="image">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :http-request="handleImageUpload"
          >
            <img v-if="productForm.image" :src="productForm.image" class="avatar">
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="productForm.price" :min="0" :precision="2"></el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="productForm.stock" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="销量" prop="sales">
          <el-input-number v-model="productForm.sales" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input type="textarea" v-model="productForm.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'ProductManagement',
  components: {
    Plus
  },
  data() {
    return {
      productList: [
        {
          id: 1,
          name: '按摩椅',
          price: 2999,
          stock: 50,
          sales: 120,
          image: '/images/products/massage_chair.png',
          description: '多功能按摩椅，缓解疲劳，促进血液循环',
          status: 'on'
        },
        {
          id: 2,
          name: '拐杖',
          price: 99,
          stock: 30,
          sales: 85,
          image: '/images/products/crutch.png',
          description: '轻便耐用，防滑设计，老年人出行好帮手',
          status: 'on'
        },
        {
          id: 3,
          name: '放大镜',
          price: 19,
          stock: 100,
          sales: 200,
          image: '/images/products/magnifier.png',
          description: '便携式放大镜，阅读看报更轻松',
          status: 'on'
        },
        {
          id: 4,
          name: '收音机',
          price: 599,
          stock: 20,
          sales: 45,
          image: '/images/products/radio.png',
          description: '多功能收音机，支持蓝牙连接，操作简单',
          status: 'off'
        }
      ],
      dialogVisible: false,
      dialogTitle: '新增商品',
      productForm: {
        name: '',
        price: 0,
        stock: 0,
        sales: 0,
        image: '',
        description: '',
        status: 'on'
      },
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
        sales: [{ required: true, message: '请输入商品销量', trigger: 'blur' }],
        image: [{ required: true, message: '请上传商品图片', trigger: 'change' }]
      }
    }
  },
  methods: {
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleImageUpload({ file }) {
      // 创建本地图片URL
      const reader = new FileReader()
      reader.onload = (e) => {
        this.productForm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    handleAdd() {
      this.dialogTitle = '新增商品'
      this.productForm = {
        name: '',
        price: 0,
        stock: 0,
        sales: 0,
        image: '',
        description: '',
        status: 'on'
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑商品'
      this.productForm = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确认下架该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.productList.findIndex(item => item.id === row.id)
        if (index !== -1) {
          this.productList[index].status = 'off'
        }
        this.$message.success('下架成功')
      }).catch(() => {})
    },
    submitForm() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          if (this.productForm.id) {
            // 编辑商品
            const index = this.productList.findIndex(item => item.id === this.productForm.id)
            if (index !== -1) {
              this.productList[index] = { ...this.productForm }
            }
            this.$message.success('更新成功')
          } else {
            // 新增商品
            const newId = Math.max(...this.productList.map(item => item.id)) + 1
            this.productList.push({
              ...this.productForm,
              id: newId
            })
            this.$message.success('添加成功')
          }
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style scoped>
.product-management {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 