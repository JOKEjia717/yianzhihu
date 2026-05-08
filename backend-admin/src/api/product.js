import request from '@/utils/request'

// 获取商品列表
export function getProductList(params) {
  return request({
    url: '/api/products',
    method: 'get',
    params
  })
}

// 上架商品
export function addProduct(data) {
  return request({
    url: '/api/products',
    method: 'post',
    data
  })
}

// 更新商品信息
export function updateProduct(id, data) {
  return request({
    url: `/api/products/${id}`,
    method: 'put',
    data
  })
}

// 下架商品
export function deleteProduct(id) {
  return request({
    url: `/api/products/${id}`,
    method: 'delete'
  })
} 