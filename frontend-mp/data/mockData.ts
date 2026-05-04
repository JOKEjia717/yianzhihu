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
}

export interface LivingOption {
  roomPhoto: string
  livingRecords: Array<{ time: string; content: string }>
}

export interface LivingRecord {
  time: string
  content: string
}

// 不同日期的餐食数据
export const mealOptions: MealOption[] = [
  {
    breakfast: '小米粥一碗、鸡蛋一个',
    lunch: '米饭一碗、清蒸鱼、炒青菜',
    dinner: '豆腐汤、馒头一个',
    breakfastPhoto: '/static/images/breakfast.png', // 请填写早餐图片路径
    lunchPhoto: '/static/images/lunch.png',     // 请填写午餐图片路径
    dinnerPhoto: '/static/images/dinner.png',    // 请填写晚餐图片路径
    mealRecords: [
      { time: '08:00', content: '早餐：小米粥、鸡蛋、馒头' },
      { time: '12:00', content: '午餐：清蒸鱼、炒青菜、米饭' },
      { time: '18:00', content: '晚餐：豆腐汤、馒头' }
    ]
  },
  {
    breakfast: '豆浆一杯、油条两根',
    lunch: '牛肉面一碗、凉拌黄瓜',
    dinner: '南瓜粥一碗、小菜一份',
    breakfastPhoto: '/static/images/breakfast1.png', // 请填写早餐图片路径
    lunchPhoto: '/static/images/lunch1.png',     // 请填写午餐图片路径
    dinnerPhoto: '/static/images/dinner1.png',    // 请填写晚餐图片路径
    mealRecords: [
      { time: '08:00', content: '早餐：豆浆、油条' },
      { time: '12:00', content: '午餐：牛肉面、凉拌黄瓜' },
      { time: '18:00', content: '晚餐：南瓜粥、小菜' }
    ]
  },
  {
    breakfast: '牛奶一杯、面包一片',
    lunch: '宫保鸡丁、米饭一碗',
    dinner: '西红柿炒蛋、米饭一碗',
    breakfastPhoto: '/static/images/breakfast2.png', // 请填写早餐图片路径
    lunchPhoto: '/static/images/lunch2.png',     // 请填写午餐图片路径
    dinnerPhoto: '/static/images/dinner2.png',    // 请填写晚餐图片路径
    mealRecords: [
      { time: '08:00', content: '早餐：牛奶、面包' },
      { time: '12:00', content: '午餐：宫保鸡丁、米饭' },
      { time: '18:00', content: '晚餐：西红柿炒蛋、米饭' }
    ]
  },
  {
    breakfast: '燕麦粥一碗、鸡蛋一个',
    lunch: '红烧肉、清炒白菜、米饭',
    dinner: '排骨汤一碗、馒头一个',
    breakfastPhoto: '/static/images/breakfast3.png', // 请填写早餐图片路径
    lunchPhoto: '/static/images/lunch3.png',     // 请填写午餐图片路径
    dinnerPhoto: '/static/images/dinner3.png',    // 请填写晚餐图片路径
    mealRecords: [
      { time: '08:00', content: '早餐：燕麦粥、鸡蛋' },
      { time: '12:00', content: '午餐：红烧肉、清炒白菜、米饭' },
      { time: '18:00', content: '晚餐：排骨汤、馒头' }
    ]
  },
  {
    breakfast: '皮蛋瘦肉粥一碗',
    lunch: '鱼香肉丝、米饭一碗',
    dinner: '炒面一碗、汤一碗',
    breakfastPhoto: '/static/images/breakfast4.png', // 请填写早餐图片路径
    lunchPhoto: '/static/images/lunch4.png',     // 请填写午餐图片路径
    dinnerPhoto: '/static/images/dinner4.png',    // 请填写晚餐图片路径
    mealRecords: [
      { time: '08:00', content: '早餐：皮蛋瘦肉粥' },
      { time: '12:00', content: '午餐：鱼香肉丝、米饭' },
      { time: '18:00', content: '晚餐：炒面、汤' }
    ]
  },
  {
    breakfast: '杂粮粥一碗、鸡蛋一个',
    lunch: '清蒸排骨、炒西兰花、米饭',
    dinner: '馄饨一碗',
    breakfastPhoto: '/static/images/breakfast5.png', // 请填写早餐图片路径
    lunchPhoto: '/static/images/lunch5.png',     // 请填写午餐图片路径
    dinnerPhoto: '/static/images/dinner5.png',    // 请填写晚餐图片路径
    mealRecords: [
      { time: '08:00', content: '早餐：杂粮粥、鸡蛋' },
      { time: '12:00', content: '午餐：清蒸排骨、炒西兰花、米饭' },
      { time: '18:00', content: '晚餐：馄饨' }
    ]
  },
  {
    breakfast: '白粥一碗、小菜一份',
    lunch: '红烧鱼、炒土豆丝、米饭',
    dinner: '粥一碗、包子一个',
    breakfastPhoto: '/static/images/breakfast6.png', // 请填写早餐图片路径
    lunchPhoto: '/static/images/lunch6.png',     // 请填写午餐图片路径
    dinnerPhoto: '/static/images/dinner6.png',    // 请填写晚餐图片路径
    mealRecords: [
      { time: '08:00', content: '早餐：白粥、小菜' },
      { time: '12:00', content: '午餐：红烧鱼、炒土豆丝、米饭' },
      { time: '18:00', content: '晚餐：粥、包子' }
    ]
  }
]

// 不同日期的衣物穿戴数据
export const clothingOptions: ClothingOption[] = [
  {
    clothing: '长袖衬衫+长裤，外套一件',
    clothingPhoto: '/static/images/clothing.png', // 请填写穿搭图片路径
    clothingRecords: [
      { time: '07:30', content: '今日穿着：长袖衬衫+长裤，外套一件' }
    ]
  },
  {
    clothing: '短袖T恤+休闲裤',
    clothingPhoto: '/static/images/clothing1.png', // 请填写穿搭图片路径
    clothingRecords: [
      { time: '07:30', content: '今日穿着：短袖T恤+休闲裤' }
    ]
  },
  {
    clothing: '毛衣+牛仔裤，围巾一条',
    clothingPhoto: '/static/images/clothing2.png', // 请填写穿搭图片路径
    clothingRecords: [
      { time: '07:30', content: '今日穿着：毛衣+牛仔裤，围巾一条' }
    ]
  },
  {
    clothing: '风衣+长裤',
    clothingPhoto: '/static/images/clothing3.png', // 请填写穿搭图片路径
    clothingRecords: [
      { time: '07:30', content: '今日穿着：风衣+长裤' }
    ]
  },
  {
    clothing: '羽绒服+保暖裤',
    clothingPhoto: '/static/images/clothing4.png', // 请填写穿搭图片路径
    clothingRecords: [
      { time: '07:30', content: '今日穿着：羽绒服+保暖裤' }
    ]
  },
  {
    clothing: '薄外套+休闲裤',
    clothingPhoto: '/static/images/clothing5.png', // 请填写穿搭图片路径
    clothingRecords: [
      { time: '07:30', content: '今日穿着：薄外套+休闲裤' }
    ]
  },
  {
    clothing: '衬衫+西裤',
    clothingPhoto: '/static/images/clothing6.png', // 请填写穿搭图片路径
    clothingRecords: [
      { time: '07:30', content: '今日穿着：衬衫+西裤' }
    ]
  }
]

// 不同日期的住宿环境数据
export const livingOptions: LivingOption[] = [
  {
    roomPhoto: '', // 请填写房间图片路径
    livingRecords: [
      { time: '08:00', content: '房间温度：24°C，湿度：55%' },
      { time: '14:00', content: '通风换气：已完成，时长30分钟' },
      { time: '18:00', content: '房间清洁：已完成' }
    ]
  },
  {
    roomPhoto: '', // 请填写房间图片路径
    livingRecords: [
      { time: '08:00', content: '房间温度：25°C，湿度：60%' },
      { time: '14:00', content: '通风换气：已完成，时长25分钟' },
      { time: '18:00', content: '床单更换：已完成' }
    ]
  },
  {
    roomPhoto: '', // 请填写房间图片路径
    livingRecords: [
      { time: '08:00', content: '房间温度：23°C，湿度：50%' },
      { time: '14:00', content: '紫外线消毒：已完成' },
      { time: '18:00', content: '房间清洁：已完成' }
    ]
  },
  {
    roomPhoto: '', // 请填写房间图片路径
    livingRecords: [
      { time: '08:00', content: '房间温度：26°C，湿度：65%' },
      { time: '14:00', content: '通风换气：已完成，时长35分钟' },
      { time: '18:00', content: '垃圾清理：已完成' }
    ]
  },
  {
    roomPhoto: '', // 请填写房间图片路径
    livingRecords: [
      { time: '08:00', content: '房间温度：22°C，湿度：45%' },
      { time: '14:00', content: '空调滤网清洗：已完成' },
      { time: '18:00', content: '房间清洁：已完成' }
    ]
  },
  {
    roomPhoto: '', // 请填写房间图片路径
    livingRecords: [
      { time: '08:00', content: '房间温度：24°C，湿度：58%' },
      { time: '14:00', content: '通风换气：已完成，时长20分钟' },
      { time: '18:00', content: '被子晾晒：已完成' }
    ]
  },
  {
    roomPhoto: '', // 请填写房间图片路径
    livingRecords: [
      { time: '08:00', content: '房间温度：25°C，湿度：52%' },
      { time: '14:00', content: '全面清洁：已完成' },
      { time: '18:00', content: '空气净化：已完成' }
    ]
  }
]

// 根据日期获取索引
export function getDateIndex(date: string): number {
  const [year, month, day] = date.split('-').map(Number)
  return (year - 2024) * 365 + (month - 1) * 30 + day
}