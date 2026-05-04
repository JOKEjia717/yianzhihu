export interface MealOption {
  breakfast: string
  lunch: string
  dinner: string
  breakfastPhoto: string
  lunchPhoto: string
  dinnerPhoto: string
  mealRecords: Array<{ time: string; content: string }>
}

export interface ClothingOption {
  clothing: string
  clothingPhoto: string
  clothingRecords: Array<{ time: string; content: string }>
  monthRange: number[]
}

export interface LivingOption {
  livingRecords: Array<{ time: string; content: string }>
}

export interface LivingRecord {
  time: string
  content: string
}

export interface HealthReport {
  assessDate: string
  report: string
  healthSuggestion: string
  nursingRecords: string[]
}

export interface ElderData {
  elderName: string
  mealOptions: MealOption[]
  clothingOptions: ClothingOption[]
  livingOptions: LivingOption[]
  healthReports: HealthReport[]
}



// 根据日期获取索引
export function getDateIndex(date: string): number {
  const [year, month, day] = date.split('-').map(Number)
  return (year - 2024) * 365 + (month - 1) * 30 + day
}

// 根据日期获取对应的穿搭数据
export function getClothingByDate(date: string, clothingOptions: ClothingOption[]): ClothingOption {
  const [, month] = date.split('-').map(Number)
  const matchedClothing = clothingOptions.find(clothing => clothing.monthRange.includes(month))
  return matchedClothing || clothingOptions[0]
}

// 共享餐食菜单（所有老人共用）
export const sharedMealOptions: MealOption[] = [
  {
    breakfast: '小米粥一碗、鸡蛋一个',
    lunch: '米饭一碗、清蒸鱼、炒青菜',
    dinner: '豆腐汤、馒头一个',
    breakfastPhoto: '/static/images/breakfast.png',
    lunchPhoto: '/static/images/lunch.png',
    dinnerPhoto: '/static/images/dinner.png',
    mealRecords: [
      { time: '08:00', content: '早餐：小米粥一碗、鸡蛋一个' },
      { time: '12:00', content: '午餐：米饭一碗、清蒸鱼、炒青菜' },
      { time: '18:00', content: '晚餐：豆腐汤、馒头一个' }
    ]
  },
  {
    breakfast: '燕麦粥一碗、鸡蛋一个',
    lunch: '红烧肉、清炒白菜、米饭',
    dinner: '排骨汤一碗、馒头一个',
    breakfastPhoto: '/static/images/breakfast3.png',
    lunchPhoto: '/static/images/lunch3.png',
    dinnerPhoto: '/static/images/dinner3.png',
    mealRecords: [
      { time: '08:00', content: '早餐：燕麦粥一碗、鸡蛋一个' },
      { time: '12:00', content: '午餐：红烧肉、清炒白菜、米饭' },
      { time: '18:00', content: '晚餐：排骨汤一碗、馒头一个' }
    ]
  },
  {
    breakfast: '皮蛋瘦肉粥一碗',
    lunch: '鱼香肉丝、米饭一碗',
    dinner: '炒面一碗、汤一碗',
    breakfastPhoto: '/static/images/breakfast4.png',
    lunchPhoto: '/static/images/lunch4.png',
    dinnerPhoto: '/static/images/dinner4.png',
    mealRecords: [
      { time: '08:00', content: '早餐：皮蛋瘦肉粥一碗' },
      { time: '12:00', content: '午餐：鱼香肉丝、米饭一碗' },
      { time: '18:00', content: '晚餐：炒面一碗、汤一碗' }
    ]
  },
  {
    breakfast: '豆浆一杯、油条两根',
    lunch: '牛肉面一碗、凉拌黄瓜',
    dinner: '南瓜粥一碗、小菜一份',
    breakfastPhoto: '/static/images/breakfast1.png',
    lunchPhoto: '/static/images/lunch1.png',
    dinnerPhoto: '/static/images/dinner1.png',
    mealRecords: [
      { time: '08:00', content: '早餐：豆浆一杯、油条两根' },
      { time: '12:00', content: '午餐：牛肉面一碗、凉拌黄瓜' },
      { time: '18:00', content: '晚餐：南瓜粥一碗、小菜一份' }
    ]
  },
  {
    breakfast: '牛奶一杯、面包一片',
    lunch: '宫保鸡丁、米饭一碗',
    dinner: '西红柿炒蛋、米饭一碗',
    breakfastPhoto: '/static/images/breakfast2.png',
    lunchPhoto: '/static/images/lunch2.png',
    dinnerPhoto: '/static/images/dinner2.png',
    mealRecords: [
      { time: '08:00', content: '早餐：牛奶一杯、面包一片' },
      { time: '12:00', content: '午餐：宫保鸡丁、米饭一碗' },
      { time: '18:00', content: '晚餐：西红柿炒蛋、米饭一碗' }
    ]
  },
  {
    breakfast: '杂粮粥一碗、鸡蛋一个',
    lunch: '清蒸排骨、炒西兰花、米饭',
    dinner: '馄饨一碗',
    breakfastPhoto: '/static/images/breakfast5.png',
    lunchPhoto: '/static/images/lunch5.png',
    dinnerPhoto: '/static/images/dinner5.png',
    mealRecords: [
      { time: '08:00', content: '早餐：杂粮粥一碗、鸡蛋一个' },
      { time: '12:00', content: '午餐：清蒸排骨、炒西兰花、米饭' },
      { time: '18:00', content: '晚餐：馄饨一碗' }
    ]
  }
]

// 张爷爷的专属数据
export const zhangGrandpaData: ElderData = {
  elderName: '张爷爷',
  mealOptions: sharedMealOptions,
  clothingOptions: [
    {
      clothing: '羽绒服+保暖裤',
      clothingPhoto: '/static/images/zhang/clothing.png', // 张爷爷1月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：羽绒服+保暖裤' }
      ],
      monthRange: [1]
    },
    {
      clothing: '羽绒服+棉裤',
      clothingPhoto: '/static/images/zhang/clothing1.png', // 张爷爷2月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：羽绒服+棉裤' }
      ],
      monthRange: [2]
    },
    {
      clothing: '厚毛衣+长裤',
      clothingPhoto: '/static/images/zhang/clothing2.png', // 张爷爷3月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：厚毛衣+长裤' }
      ],
      monthRange: [3]
    },
    {
      clothing: '薄外套+休闲裤',
      clothingPhoto: '/static/images/zhang/clothing3.png', // 张爷爷4月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：薄外套+休闲裤' }
      ],
      monthRange: [4]
    },
    {
      clothing: '长袖衬衫+长裤',
      clothingPhoto: '/static/images/zhang/clothing4.png', // 张爷爷5月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：长袖衬衫+长裤' }
      ],
      monthRange: [5]
    },
    {
      clothing: '短袖T恤+长裤',
      clothingPhoto: '/static/images/zhang/clothing5.png', // 张爷爷6月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：短袖T恤+长裤' }
      ],
      monthRange: [6]
    },
    {
      clothing: '短袖T恤+短裤',
      clothingPhoto: '/static/images/zhang/clothing6.png', // 张爷爷7月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：短袖T恤+短裤' }
      ],
      monthRange: [7]
    },
    {
      clothing: '短袖T恤+短裤',
      clothingPhoto: '/static/images/zhang/clothing7.png', // 张爷爷8月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：短袖T恤+短裤' }
      ],
      monthRange: [8]
    },
    {
      clothing: '长袖衬衫+长裤',
      clothingPhoto: '/static/images/zhang/clothing8.png', // 张爷爷9月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：长袖衬衫+长裤' }
      ],
      monthRange: [9]
    },
    {
      clothing: '薄毛衣+牛仔裤',
      clothingPhoto: '/static/images/zhang/clothing9.png', // 张爷爷10月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：薄毛衣+牛仔裤' }
      ],
      monthRange: [10]
    },
    {
      clothing: '厚毛衣+外套',
      clothingPhoto: '/static/images/zhang/clothing10.png', // 张爷爷11月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：厚毛衣+外套' }
      ],
      monthRange: [11]
    },
    {
      clothing: '羽绒服+保暖裤',
      clothingPhoto: '/static/images/zhang/clothing11.png', // 张爷爷12月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：羽绒服+保暖裤' }
      ],
      monthRange: [12]
    }
  ],
  livingOptions: [
    {
      livingRecords: [
        { time: '08:00', content: '房间温度：24°C，湿度：55%' },
        { time: '14:00', content: '通风换气：已完成，时长30分钟' },
        { time: '18:00', content: '房间清洁：已完成' }
      ]
    },
    {
      livingRecords: [
        { time: '08:00', content: '房间温度：23°C，湿度：50%' },
        { time: '14:00', content: '紫外线消毒：已完成' },
        { time: '18:00', content: '房间清洁：已完成' }
      ]
    },
    {
      livingRecords: [
        { time: '08:00', content: '房间温度：25°C，湿度：52%' },
        { time: '14:00', content: '全面清洁：已完成' },
        { time: '18:00', content: '空气净化：已完成' }
      ]
    }
  ],
  healthReports: [
    {
      assessDate: '',
      report: '一、基本指标\n• 身高：172cm\n• 体重：65kg\n• 体质指数(BMI)：22.0（正常范围）\n\n二、血压测量\n• 收缩压：125mmHg\n• 舒张压：80mmHg\n• 血压状态：正常\n\n三、心率监测\n• 静息心率：72次/分钟\n• 心率状态：正常\n\n四、血糖检测\n• 空腹血糖：5.2mmol/L\n• 餐后2小时血糖：7.8mmol/L\n• 血糖状态：正常\n\n五、血脂分析\n• 总胆固醇：4.8mmol/L\n• 甘油三酯：1.5mmol/L\n• 血脂状态：正常\n\n六、健康建议\n1. 饮食：建议低盐低脂饮食，多吃蔬菜水果\n2. 运动：每日保持30分钟以上适度运动\n3. 作息：保持规律作息，避免熬夜\n4. 监测：建议每月测量一次血压和血糖',
      healthSuggestion: '老人今日精神状态良好，饮食正常，无异常情况。',
      nursingRecords: [
        '晨起血压测量：120/78mmHg',
        '早餐：小米粥一碗、鸡蛋一个',
        '上午活动：花园散步30分钟',
        '午餐：米饭一碗、清蒸鱼、炒青菜',
        '下午活动：棋牌室活动1小时',
        '晚餐：豆腐汤、馒头一个',
        '晚间血压测量：125/80mmHg',
        '睡眠情况：良好'
      ]
    },
    {
      assessDate: '',
      report: '一、基本指标\n• 身高：172cm\n• 体重：64kg\n• 体质指数(BMI)：21.8（正常范围）\n\n二、血压测量\n• 收缩压：128mmHg\n• 舒张压：82mmHg\n• 血压状态：正常\n\n三、心率监测\n• 静息心率：70次/分钟\n• 心率状态：正常\n\n四、血糖检测\n• 空腹血糖：5.1mmol/L\n• 餐后2小时血糖：7.5mmol/L\n• 血糖状态：正常',
      healthSuggestion: '老人今日精神状态良好，食欲佳，睡眠充足。',
      nursingRecords: [
        '晨起血压测量：125/80mmHg',
        '早餐：燕麦粥一碗、鸡蛋一个',
        '上午活动：太极拳练习20分钟',
        '午餐：红烧肉、清炒白菜、米饭',
        '下午活动：阅读报纸',
        '晚餐：排骨汤一碗、馒头一个',
        '晚间血压测量：128/82mmHg',
        '睡眠情况：良好'
      ]
    },
    {
      assessDate: '',
      report: '一、基本指标\n• 身高：172cm\n• 体重：65kg\n• 体质指数(BMI)：22.0（正常范围）\n\n二、血压测量\n• 收缩压：123mmHg\n• 舒张压：78mmHg\n• 血压状态：正常\n\n三、心率监测\n• 静息心率：75次/分钟\n• 心率状态：正常\n\n四、血糖检测\n• 空腹血糖：5.3mmol/L\n• 餐后2小时血糖：8.0mmol/L\n• 血糖状态：正常',
      healthSuggestion: '老人今日精神状态良好，各项指标稳定。',
      nursingRecords: [
        '晨起血压测量：120/76mmHg',
        '早餐：皮蛋瘦肉粥一碗',
        '上午活动：户外散步30分钟',
        '午餐：鱼香肉丝、米饭一碗',
        '下午活动：与家人视频通话',
        '晚餐：炒面一碗、汤一碗',
        '晚间血压测量：123/78mmHg',
        '睡眠情况：良好'
      ]
    }
  ]
}

// 李奶奶的专属数据
export const liGrandmaData: ElderData = {
  elderName: '李奶奶',
  mealOptions: sharedMealOptions,
  clothingOptions: [
    {
      clothing: '羽绒服+棉裤',
      clothingPhoto: '/static/images/li/clothing_1.png', // 李奶奶1月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：羽绒服+棉裤' }
      ],
      monthRange: [1]
    },
    {
      clothing: '羽绒服+保暖裤',
      clothingPhoto: '/static/images/li/clothing_2.png', // 李奶奶2月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：羽绒服+保暖裤' }
      ],
      monthRange: [2]
    },
    {
      clothing: '厚毛衣+长裙',
      clothingPhoto: '/static/images/li/clothing_3.png', // 李奶奶3月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：厚毛衣+长裙' }
      ],
      monthRange: [3]
    },
    {
      clothing: '薄外套+休闲裤',
      clothingPhoto: '/static/images/li/clothing_4.png', // 李奶奶4月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：薄外套+休闲裤' }
      ],
      monthRange: [4]
    },
    {
      clothing: '针织开衫+长裤',
      clothingPhoto: '/static/images/li/clothing_5.png', // 李奶奶5月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：针织开衫+长裤' }
      ],
      monthRange: [5]
    },
    {
      clothing: '短袖连衣裙',
      clothingPhoto: '/static/images/li/clothing_6.png', // 李奶奶6月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：短袖连衣裙' }
      ],
      monthRange: [6]
    },
    {
      clothing: '短袖连衣裙',
      clothingPhoto: '/static/images/li/clothing_7.png', // 李奶奶7月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：短袖连衣裙' }
      ],
      monthRange: [7]
    },
    {
      clothing: '短袖T恤+短裙',
      clothingPhoto: '/static/images/li/clothing_8.png', // 李奶奶8月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：短袖T恤+短裙' }
      ],
      monthRange: [8]
    },
    {
      clothing: '长袖连衣裙',
      clothingPhoto: '/static/images/li/clothing_9.png', // 李奶奶9月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：长袖连衣裙' }
      ],
      monthRange: [9]
    },
    {
      clothing: '针织衫+长裙',
      clothingPhoto: '/static/images/li/clothing_10.png', // 李奶奶10月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：针织衫+长裙' }
      ],
      monthRange: [10]
    },
    {
      clothing: '厚外套+棉裤',
      clothingPhoto: '/static/images/li/clothing_11.png', // 李奶奶11月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：厚外套+棉裤' }
      ],
      monthRange: [11]
    },
    {
      clothing: '羽绒服+棉裤',
      clothingPhoto: '/static/images/li/clothing_12.png', // 李奶奶12月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：羽绒服+棉裤' }
      ],
      monthRange: [12]
    }
  ],
  livingOptions: [
    {
      livingRecords: [
        { time: '08:00', content: '房间温度：25°C，湿度：60%' },
        { time: '14:00', content: '通风换气：已完成，时长25分钟' },
        { time: '18:00', content: '床单更换：已完成' }
      ]
    },
    {
      livingRecords: [
        { time: '08:00', content: '房间温度：26°C，湿度：65%' },
        { time: '14:00', content: '通风换气：已完成，时长35分钟' },
        { time: '18:00', content: '垃圾清理：已完成' }
      ]
    },
    {
      livingRecords: [
        { time: '08:00', content: '房间温度：22°C，湿度：45%' },
        { time: '14:00', content: '空调滤网清洗：已完成' },
        { time: '18:00', content: '房间清洁：已完成' }
      ]
    }
  ],
  healthReports: [
    {
      assessDate: '',
      report: '一、基本指标\n• 身高：160cm\n• 体重：55kg\n• 体质指数(BMI)：21.5（正常范围）\n\n二、血压测量\n• 收缩压：120mmHg\n• 舒张压：75mmHg\n• 血压状态：正常\n\n三、心率监测\n• 静息心率：75次/分钟\n• 心率状态：正常\n\n四、血糖检测\n• 空腹血糖：5.0mmol/L\n• 餐后2小时血糖：7.6mmol/L\n• 血糖状态：正常',
      healthSuggestion: '老人今日精神状态良好，食欲佳，睡眠充足。',
      nursingRecords: [
        '晨起血压测量：118/75mmHg',
        '早餐：小米粥一碗、鸡蛋一个',
        '上午活动：广场舞练习30分钟',
        '午餐：米饭一碗、清蒸鱼、炒青菜',
        '下午活动：与朋友聊天',
        '晚餐：豆腐汤、馒头一个',
        '晚间血压测量：120/76mmHg',
        '睡眠情况：良好'
      ]
    },
    {
      assessDate: '',
      report: '一、基本指标\n• 身高：160cm\n• 体重：54kg\n• 体质指数(BMI)：21.1（正常范围）\n\n二、血压测量\n• 收缩压：122mmHg\n• 舒张压：78mmHg\n• 血压状态：正常\n\n三、心率监测\n• 静息心率：73次/分钟\n• 心率状态：正常\n\n四、血糖检测\n• 空腹血糖：4.9mmol/L\n• 餐后2小时血糖：7.4mmol/L\n• 血糖状态：正常',
      healthSuggestion: '老人今日精神状态良好，各项指标稳定。',
      nursingRecords: [
        '晨起血压测量：120/76mmHg',
        '早餐：燕麦粥一碗、鸡蛋一个',
        '上午活动：瑜伽练习25分钟',
        '午餐：红烧肉、清炒白菜、米饭',
        '下午活动：看电视节目',
        '晚餐：排骨汤一碗、馒头一个',
        '晚间血压测量：122/78mmHg',
        '睡眠情况：良好'
      ]
    },
    {
      assessDate: '',
      report: '一、基本指标\n• 身高：160cm\n• 体重：55kg\n• 体质指数(BMI)：21.5（正常范围）\n\n二、血压测量\n• 收缩压：118mmHg\n• 舒张压：74mmHg\n• 血压状态：正常\n\n三、心率监测\n• 静息心率：76次/分钟\n• 心率状态：正常\n\n四、血糖检测\n• 空腹血糖：5.1mmol/L\n• 餐后2小时血糖：7.7mmol/L\n• 血糖状态：正常',
      healthSuggestion: '老人今日精神状态良好。',
      nursingRecords: [
        '晨起血压测量：116/72mmHg',
        '早餐：皮蛋瘦肉粥一碗',
        '上午活动：公园散步30分钟',
        '午餐：鱼香肉丝、米饭一碗',
        '下午活动：阅读书籍',
        '晚餐：炒面一碗、汤一碗',
        '晚间血压测量：118/74mmHg',
        '睡眠情况：良好'
      ]
    }
  ]
}

// 王爷爷的专属数据
export const wangGrandpaData: ElderData = {
  elderName: '王爷爷',
  mealOptions: sharedMealOptions,
  clothingOptions: [
    {
      clothing: '羽绒服+保暖裤',
      clothingPhoto: '/static/images/wang/clothing_1.png', // 王爷爷1月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：羽绒服+保暖裤' }
      ],
      monthRange: [1]
    },
    {
      clothing: '羽绒服+棉裤',
      clothingPhoto: '/static/images/wang/clothing_2.png', // 王爷爷2月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：羽绒服+棉裤' }
      ],
      monthRange: [2]
    },
    {
      clothing: '厚毛衣+西裤',
      clothingPhoto: '/static/images/wang/clothing_3.png', // 王爷爷3月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：厚毛衣+西裤' }
      ],
      monthRange: [3]
    },
    {
      clothing: '薄风衣+休闲裤',
      clothingPhoto: '/static/images/wang/clothing_4.png', // 王爷爷4月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：薄风衣+休闲裤' }
      ],
      monthRange: [4]
    },
    {
      clothing: '长袖衬衫+西裤',
      clothingPhoto: '/static/images/wang/clothing_5.png', // 王爷爷5月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：长袖衬衫+西裤' }
      ],
      monthRange: [5]
    },
    {
      clothing: '短袖衬衫+长裤',
      clothingPhoto: '/static/images/wang/clothing_6.png', // 王爷爷6月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：短袖衬衫+长裤' }
      ],
      monthRange: [6]
    },
    {
      clothing: '短袖衬衫+短裤',
      clothingPhoto: '/static/images/wang/clothing_7.png', // 王爷爷7月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：短袖衬衫+短裤' }
      ],
      monthRange: [7]
    },
    {
      clothing: '短袖T恤+短裤',
      clothingPhoto: '/static/images/wang/clothing_8.png', // 王爷爷8月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：短袖T恤+短裤' }
      ],
      monthRange: [8]
    },
    {
      clothing: '长袖衬衫+西裤',
      clothingPhoto: '/static/images/wang/clothing_9.png', // 王爷爷9月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：长袖衬衫+西裤' }
      ],
      monthRange: [9]
    },
    {
      clothing: '薄毛衣+西裤',
      clothingPhoto: '/static/images/wang/clothing_10.png', // 王爷爷10月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：薄毛衣+西裤' }
      ],
      monthRange: [10]
    },
    {
      clothing: '厚毛衣+外套',
      clothingPhoto: '/static/images/wang/clothing_11.png', // 王爷爷11月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：厚毛衣+外套' }
      ],
      monthRange: [11]
    },
    {
      clothing: '羽绒服+保暖裤',
      clothingPhoto: '/static/images/wang/clothing_12.png', // 王爷爷12月穿搭
      clothingRecords: [
        { time: '07:30', content: '今日穿着：羽绒服+保暖裤' }
      ],
      monthRange: [12]
    }
  ],
  livingOptions: [
    {
      livingRecords: [
        { time: '08:00', content: '房间温度：24°C，湿度：58%' },
        { time: '14:00', content: '通风换气：已完成，时长20分钟' },
        { time: '18:00', content: '被子晾晒：已完成' }
      ]
    },
    {
      livingRecords: [
        { time: '08:00', content: '房间温度：23°C，湿度：55%' },
        { time: '14:00', content: '通风换气：已完成，时长30分钟' },
        { time: '18:00', content: '房间清洁：已完成' }
      ]
    },
    {
      livingRecords: [
        { time: '08:00', content: '房间温度：25°C，湿度：60%' },
        { time: '14:00', content: '紫外线消毒：已完成' },
        { time: '18:00', content: '房间清洁：已完成' }
      ]
    }
  ],
  healthReports: [
    {
      assessDate: '',
      report: '一、基本指标\n• 身高：168cm\n• 体重：62kg\n• 体质指数(BMI)：22.0（正常范围）\n\n二、血压测量\n• 收缩压：124mmHg\n• 舒张压：79mmHg\n• 血压状态：正常\n\n三、心率监测\n• 静息心率：71次/分钟\n• 心率状态：正常\n\n四、血糖检测\n• 空腹血糖：5.2mmol/L\n• 餐后2小时血糖：7.8mmol/L\n• 血糖状态：正常',
      healthSuggestion: '老人今日精神状态良好，饮食正常，无异常情况。',
      nursingRecords: [
        '晨起血压测量：120/78mmHg',
        '早餐：小米粥一碗、鸡蛋一个',
        '上午活动：书法练习30分钟',
        '午餐：米饭一碗、清蒸鱼、炒青菜',
        '下午活动：下棋',
        '晚餐：豆腐汤、馒头一个',
        '晚间血压测量：124/79mmHg',
        '睡眠情况：良好'
      ]
    },
    {
      assessDate: '',
      report: '一、基本指标\n• 身高：168cm\n• 体重：61kg\n• 体质指数(BMI)：21.6（正常范围）\n\n二、血压测量\n• 收缩压：126mmHg\n• 舒张压：80mmHg\n• 血压状态：正常\n\n三、心率监测\n• 静息心率：70次/分钟\n• 心率状态：正常\n\n四、血糖检测\n• 空腹血糖：5.1mmol/L\n• 餐后2小时血糖：7.6mmol/L\n• 血糖状态：正常',
      healthSuggestion: '老人今日精神状态良好，食欲佳，睡眠充足。',
      nursingRecords: [
        '晨起血压测量：122/78mmHg',
        '早餐：燕麦粥一碗、鸡蛋一个',
        '上午活动：太极拳练习25分钟',
        '午餐：红烧肉、清炒白菜、米饭',
        '下午活动：阅读报纸',
        '晚餐：排骨汤一碗、馒头一个',
        '晚间血压测量：126/80mmHg',
        '睡眠情况：良好'
      ]
    },
    {
      assessDate: '',
      report: '一、基本指标\n• 身高：168cm\n• 体重：62kg\n• 体质指数(BMI)：22.0（正常范围）\n\n二、血压测量\n• 收缩压：123mmHg\n• 舒张压：78mmHg\n• 血压状态：正常\n\n三、心率监测\n• 静息心率：72次/分钟\n• 心率状态：正常\n\n四、血糖检测\n• 空腹血糖：5.3mmol/L\n• 餐后2小时血糖：7.9mmol/L\n• 血糖状态：正常',
      healthSuggestion: '老人今日精神状态良好，各项指标稳定。',
      nursingRecords: [
        '晨起血压测量：120/76mmHg',
        '早餐：皮蛋瘦肉粥一碗',
        '上午活动：户外散步30分钟',
        '午餐：鱼香肉丝、米饭一碗',
        '下午活动：与家人视频通话',
        '晚餐：炒面一碗、汤一碗',
        '晚间血压测量：123/78mmHg',
        '睡眠情况：良好'
      ]
    }
  ]
}

// 根据老人索引获取对应数据
export const elderDataList = [zhangGrandpaData, liGrandmaData, wangGrandpaData]

export function getElderData(elderIndex: number): ElderData {
  return elderDataList[elderIndex % elderDataList.length]
}