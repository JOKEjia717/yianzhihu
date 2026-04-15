// 模拟数据

// 老人数据
export const elderlyData = {
  total: 124,
  male: 67,
  female: 57,
  ageGroups: [
    { age: '60-70岁', count: 32 },
    { age: '71-80岁', count: 48 },
    { age: '81-90岁', count: 36 },
    { age: '90岁以上', count: 8 }
  ],
  careNeeds: [
    { level: '低度护理', count: 45 },
    { level: '中度护理', count: 56 },
    { level: '高度护理', count: 23 }
  ]
}

// 子女数据
export const childrenData = [
  { id: 1, name: '张明', gender: '男', phone: '13812345678', relation: '儿子', elderlyName: '张老太', visitFrequency: '每周', lastVisit: '2023-05-15', payment: '按月', remarks: '经常带水果来看望' },
  { id: 2, name: '李丽', gender: '女', phone: '13987654321', relation: '女儿', elderlyName: '李大爷', visitFrequency: '每两周', lastVisit: '2023-05-10', payment: '按季', remarks: '希望增加康复训练' },
  { id: 3, name: '王强', gender: '男', phone: '13756789012', relation: '儿子', elderlyName: '王奶奶', visitFrequency: '每月', lastVisit: '2023-04-28', payment: '按年', remarks: '要求单人间' },
  { id: 4, name: '赵芳', gender: '女', phone: '13567890123', relation: '女儿', elderlyName: '赵老先生', visitFrequency: '每周', lastVisit: '2023-05-16', payment: '按月', remarks: '需要特殊饮食' },
  { id: 5, name: '刘伟', gender: '男', phone: '13678901234', relation: '儿子', elderlyName: '刘婆婆', visitFrequency: '每两周', lastVisit: '2023-05-05', payment: '按季', remarks: '有高血压病史' }
]

// 护工数据
export const caregiversData = [
  { id: 1, name: '王护工', gender: '女', age: 35, phone: '13512345678', position: '高级护理员', experience: '8年', certification: '高级养老护理师', elderlyCount: 5, rating: 4.8, salary: 5500 },
  { id: 2, name: '李护工', gender: '女', age: 42, phone: '13587654321', position: '主管护理员', experience: '12年', certification: '养老护理师', elderlyCount: 4, rating: 4.9, salary: 6200 },
  { id: 3, name: '张护工', gender: '男', age: 28, phone: '13656789012', position: '护理员', experience: '3年', certification: '初级养老护理师', elderlyCount: 6, rating: 4.5, salary: 4800 },
  { id: 4, name: '陈护工', gender: '女', age: 39, phone: '13767890123', position: '高级护理员', experience: '10年', certification: '高级养老护理师', elderlyCount: 5, rating: 4.7, salary: 5800 },
  { id: 5, name: '刘护工', gender: '男', age: 32, phone: '13878901234', position: '护理员', experience: '5年', certification: '养老护理师', elderlyCount: 7, rating: 4.6, salary: 5000 }
]

// 院长数据
export const directorsData = [
  { id: 1, name: '张院长', gender: '男', age: 52, phone: '13912345678', education: '硕士', major: '医学管理', experience: '15年', certification: '高级养老机构管理师', department: '综合管理', performance: 92 },
  { id: 2, name: '李副院长', gender: '女', age: 48, phone: '13987654321', education: '本科', major: '护理学', experience: '12年', certification: '养老机构管理师', department: '医疗护理', performance: 88 },
  { id: 3, name: '王副院长', gender: '男', age: 55, phone: '13856789012', education: '硕士', major: '公共管理', experience: '18年', certification: '高级养老机构管理师', department: '行政事务', performance: 90 },
  { id: 4, name: '赵主任', gender: '女', age: 45, phone: '13767890123', education: '本科', major: '社会工作', experience: '10年', certification: '养老机构管理师', department: '生活服务', performance: 85 },
  { id: 5, name: '刘主任', gender: '男', age: 50, phone: '13878901234', education: '硕士', major: '老年医学', experience: '14年', certification: '高级养老机构管理师', department: '健康管理', performance: 89 }
] 