/*
 Navicat Premium Dump SQL

 Source Server         : ali
 Source Server Type    : MySQL
 Source Server Version : 80027 (8.0.27)
 Source Host           : localhost:3306
 Source Schema         : zh-dean

 Target Server Type    : MySQL
 Target Server Version : 80027 (8.0.27)
 File Encoding         : 65001

 Date: 30/04/2025 22:22:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity`  (
  `activity_id` bigint NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `nursing_home_id` bigint NOT NULL COMMENT '逻辑关联养老院ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '活动名称',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '活动描述',
  `activity_data` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '活动期间数据（如照片、视频路径）',
  PRIMARY KEY (`activity_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 265 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '活动管理表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of activity
-- ----------------------------
INSERT INTO `activity` VALUES (1, 3, '羽毛球活动', '2025-04-15 09:00:00', '2025-04-15 12:00:00', '每周三下午举行，适合中老年人的健康运动', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/%E7%BE%BD%E6%AF%9B%E7%90%83%E6%B4%BB%E5%8A%A8.jpg');
INSERT INTO `activity` VALUES (5, 3, '太极拳学习', '2025-04-15 09:00:00', '2025-04-15 12:00:00', '每周一上午进行，提高身体协调性', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/%E5%A4%AA%E6%9E%81%E6%8B%B3%E6%B4%BB%E5%8A%A8.jpg');
INSERT INTO `activity` VALUES (6, 3, '棋牌娱乐', '2025-04-15 09:00:00', '2025-04-15 12:00:00', '每周五下午，老人们互相交流的好机会', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/%E6%A3%8B%E7%89%8C%E5%A8%B1%E4%B9%90.jpg');
INSERT INTO `activity` VALUES (21, 3, '剪纸活动', '2025-04-15 09:00:00', '2025-04-15 12:00:00', '以在创作中感受传统文化的魅力，提升动手能力和耐心。', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/%E5%89%AA%E7%BA%B8%E6%B4%BB%E5%8A%A8.jpg');

-- ----------------------------
-- Table structure for activity_application
-- ----------------------------
DROP TABLE IF EXISTS `activity_application`;
CREATE TABLE `activity_application`  (
  `activity_application_id` bigint NOT NULL,
  `activity_id` bigint NOT NULL COMMENT '活动id',
  `caretaker_id` bigint NOT NULL COMMENT '护工id',
  `children_id` bigint NOT NULL COMMENT '子女id',
  `elder_id` bigint NOT NULL COMMENT '老人id',
  `ispass` tinyint NOT NULL DEFAULT 0 COMMENT '0代表未同意（默认）/1代表同意/2代表拒绝',
  PRIMARY KEY (`activity_application_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '活动申请表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity_application
-- ----------------------------
INSERT INTO `activity_application` VALUES (1911757870253752321, 1, 1, 1, 1911778796378263553, 3);
INSERT INTO `activity_application` VALUES (1915579179399643138, 1, 1911952283172683780, 852, 1911778796378263554, 1);
INSERT INTO `activity_application` VALUES (1915579297737736123, 5, 1911952283172683780, 1909508696707174400, 1916372274099480577, 1);
INSERT INTO `activity_application` VALUES (1915579297737736193, 1, 1911952283172683780, 1909508696707174400, 1911778796378263555, 1);
INSERT INTO `activity_application` VALUES (1915584636482748417, 1, 1911952283172683780, 1909508696707174400, 1911778796378263556, 1);
INSERT INTO `activity_application` VALUES (1915585158015090690, 1, 1911952283172683780, 1909508696707174400, 1916326432389304322, 1);
INSERT INTO `activity_application` VALUES (1915589097959718914, 1, 1911952283172683780, 1909508696707174401, 1916326546419847170, 1);
INSERT INTO `activity_application` VALUES (1915631481122297857, 21, 1911952283172683780, 1909508696707174401, 1911778796378263556, 1);
INSERT INTO `activity_application` VALUES (1915631481124297857, 6, 1911952283172683780, 1909508696707174401, 1916373460536270849, 1);
INSERT INTO `activity_application` VALUES (1915631481154292857, 6, 1911952283172683780, 1909508696707174401, 1916379068878671873, 1);
INSERT INTO `activity_application` VALUES (1915631481154297857, 5, 1911952283172683780, 1909508696707174401, 1911778796378263556, 1);
INSERT INTO `activity_application` VALUES (1915632145737572354, 5, 1911952283172683780, 1909508696707174401, 1916373460536270849, 1);
INSERT INTO `activity_application` VALUES (1915632281154297857, 21, 1911952283172683780, 1909508696707174401, 1911778796378263554, 1);
INSERT INTO `activity_application` VALUES (1915693959997353986, 5, 1911952283172683780, 852, 1916358928598310913, 1);
INSERT INTO `activity_application` VALUES (1916480649821278209, 6, 1911952283172683780, 1909508696707174401, 1911778796378263553, 0);
INSERT INTO `activity_application` VALUES (1916480830297985026, 5, 1911952283172683780, 1914580218493431810, 1911778796378263554, 0);
INSERT INTO `activity_application` VALUES (1916697048871092226, 5, 1911952283172683780, 1909508696707174401, 1911778796378263553, 0);
INSERT INTO `activity_application` VALUES (1917490808471789569, 21, 1911952283172683780, 1909508696707174401, 1911778796378263553, 0);

-- ----------------------------
-- Table structure for activity_number
-- ----------------------------
DROP TABLE IF EXISTS `activity_number`;
CREATE TABLE `activity_number`  (
  `activity_number_id` bigint NOT NULL,
  `activity_id` bigint NOT NULL COMMENT '关联活动ID',
  `childern_id` bigint NOT NULL COMMENT '关联子女ID',
  PRIMARY KEY (`activity_number_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '活动参加人数表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity_number
-- ----------------------------
INSERT INTO `activity_number` VALUES (1912054321190092323, 1, 2);
INSERT INTO `activity_number` VALUES (1912054321190096897, 1, 1);
INSERT INTO `activity_number` VALUES (1914286769982529537, 1, 1);
INSERT INTO `activity_number` VALUES (1914304029841186818, 1, 1);
INSERT INTO `activity_number` VALUES (1914306778632839170, 1, 1);

-- ----------------------------
-- Table structure for elder
-- ----------------------------
DROP TABLE IF EXISTS `elder`;
CREATE TABLE `elder`  (
  `elder_id` bigint NOT NULL AUTO_INCREMENT COMMENT '老人唯一ID',
  `dean_id` bigint NOT NULL COMMENT '逻辑关联养老院ID',
  `caretaker_id` bigint NULL DEFAULT NULL COMMENT '逻辑关联护理工ID',
  `children_id` bigint NOT NULL COMMENT '逻辑关联子女ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '姓名',
  `gender` bigint NULL DEFAULT NULL COMMENT '性别(0代表女/1代表男)',
  `age` int NULL DEFAULT NULL COMMENT '年龄',
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '老人照片',
  `children_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '子女名字',
  `children_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '子女电话',
  `created_time` date NULL DEFAULT NULL COMMENT '申请同意时间',
  `application_time` date NULL DEFAULT NULL COMMENT '申请时间',
  `is_enable` bigint NOT NULL DEFAULT 2 COMMENT '0代表入院成功/1代表老人离院/2代表申请入院中/3代表入院申请拒绝',
  PRIMARY KEY (`elder_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1916379068878671874 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '老人档案表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of elder
-- ----------------------------
INSERT INTO `elder` VALUES (1911778796378263553, 5555, 1911952283172683780, 1909508696707174401, '李福全', 1, 55, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA6.jpg', '王婉清', '19834567890', '2025-04-29', '2025-04-14', 0);
INSERT INTO `elder` VALUES (1911778796378263554, 5555, 5, 1914580218493431810, '陈瑞祥', 1, 66, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA5.jpg', '张雅琪', '17756789012', '2025-04-15', '2025-04-23', 0);
INSERT INTO `elder` VALUES (1911778796378263555, 5555, 414, 1914580218493431810, '王逸飞', 1, 44, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA4.jpg', '李诗涵', '13098765432', '2025-04-23', '2025-04-23', 0);
INSERT INTO `elder` VALUES (1911778796378263556, 5555, 414, 1909508696707174401, '张寿安', 1, 99, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA3.jpg', '赵逸凡', '18912345678', '2025-04-02', '2025-04-23', 2);
INSERT INTO `elder` VALUES (1916326432389304322, 5555, 1911952283172683780, 91, '刘景安', 1, 55, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA2.jpg', '林浩阳', '15678901234', NULL, '2025-04-27', 0);
INSERT INTO `elder` VALUES (1916326546419847170, 5555, 4242, 91, '陈墨轩', 1, 55, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA1.jpg', '陈宇轩', '13865432109', NULL, '2025-04-27', 0);
INSERT INTO `elder` VALUES (1916357889350443010, 821486, 84181, 8214191161, '张素云', 0, 100, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA1.6.jpg', '徐若曦', '9252141166', NULL, '2025-04-27', 0);
INSERT INTO `elder` VALUES (1916358928598310913, 821486, 84181, 8214191161, '刘静宜', 0, 88, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA1.5.jpg', '刘梦婷', '9252141166', NULL, '2025-04-27', 0);
INSERT INTO `elder` VALUES (1916372274099480577, 1911374759677935617, 1911374759677935617, 1909796231132647425, '陈惠芳', 0, 101, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA1.4.jpg', '吴俊辉', '1234567898', NULL, '2025-04-27', 0);
INSERT INTO `elder` VALUES (1916372574099480577, 1911374759677935617, 1911374759677935617, 1909796231132647425, '张素忆', 0, 74, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA1.3.jpg', '周铭宇', '1234567898', NULL, '2025-04-27', 2);
INSERT INTO `elder` VALUES (1916373460536270849, 1, 1, 1909796231132647425, '王秀珍', 0, 87, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA1.2.jpg', '郑雨薇', '1234567898', NULL, '2025-04-27', 0);
INSERT INTO `elder` VALUES (1916379068878671873, 1000, 1000, 1909796231132647425, '李淑兰', 0, 71, 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E8%80%81%E4%BA%BA1.1.jpg', '孙嘉豪', '1234567898', NULL, '2025-04-27', 2);

-- ----------------------------
-- Table structure for elder_children_bind
-- ----------------------------
DROP TABLE IF EXISTS `elder_children_bind`;
CREATE TABLE `elder_children_bind`  (
  `elder_children_bind_id` bigint NOT NULL,
  `elder_id` bigint NOT NULL COMMENT '老人id',
  `children_id` bigint NOT NULL COMMENT '子女id',
  `created_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '绑定时间',
  PRIMARY KEY (`elder_children_bind_id`) USING BTREE,
  UNIQUE INDEX `uk_elder_children`(`elder_id` ASC, `children_id` ASC) USING BTREE,
  INDEX `idx_children_id`(`children_id` ASC) USING BTREE,
  INDEX `idx_elder_id`(`elder_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '老人子女绑定关系表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for nursing_home
-- ----------------------------
DROP TABLE IF EXISTS `nursing_home`;
CREATE TABLE `nursing_home`  (
  `nursing_home_id` bigint NOT NULL AUTO_INCREMENT COMMENT '养老院唯一ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '养老院名称',
  `address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '详细地址',
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '照片',
  `director` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '院长姓名',
  `honors` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '所获荣誉',
  `dean_id` bigint NOT NULL COMMENT '创建人ID（逻辑关联用户表）',
  `created_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `is_enable` bigint NOT NULL DEFAULT 0 COMMENT '0代表下线（默认）/1代表上线',
  PRIMARY KEY (`nursing_home_id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '养老院基本信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of nursing_home
-- ----------------------------
INSERT INTO `nursing_home` VALUES (3, '龙州湾养老院', '巴南区龙洲湾团结村与盘龙村', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/20250425200416.jpg', '胡永龙', '龙洲湾敬老院位于巴南区龙洲湾团结村与盘龙村之间，地处铜锣湾山脉腹地，距鱼洞城区6公里。敬老院占地160余亩，设有生活区、绿色养殖区、蔬菜种植区、果园区和观光休闲区。敬老院提供3100余平米的养老公寓和3000余平米的绿化配套面积，房间配备独立卫生间、空调、电视、热水器等设施。敬老院以“为政府分忧、替儿女尽孝、给家庭解难”为宗旨，提供24小时全方位的照顾服务，收费标准为全自理老人每月1800元起。', 1911374759677935617, '2025-04-13 19:03:51', 1);
INSERT INTO `nursing_home` VALUES (4, '老顽童养老院', '重庆市綦江区', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/R-C.jpg', '魏强', '生活管家服务模式集托养、家庭照料、精神慰藉、康复护理、日常消费管理、娱乐活动安排于一体，实现为入住老人提供医养结合、全过程个性化定制的精细化服务模式。对入住期间老人的需求进行全过程地跟进，针对不同需求做好各项服务工作，使老人既可以得到完整的家庭式照料，也可以享受充实的精神文化生活。特别突出打造“6S精细化护理服务”模式，为老年人提供个性化护理服务计划，以“关注随时随地，满意无处不在”为服务理念，通过“smiling(微笑)、sincere(诚挚)、speciality (专业)、speedy(快速)、satisfied(满意)和super(卓越)”诠释了“6S服务”的内涵，以达到老人及其家属的满意，给老人一份安心、给家属一份放心!', 1, '2025-04-13 19:33:02', 1);
INSERT INTO `nursing_home` VALUES (5, '新城健康养老院', '重庆市合川区', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/R-C%20%282%29.jpg', '李一鸣', '总建筑面积近6万平方米，设有长友雅苑（失能照料中心）、长友颐苑（健康活力社区）、长友慧苑（失智照料中心）三个分院。拥有床位近千张，整体采用适老化设计理念。院内配套建有生活超市、活动中心、医疗服务中心等。', 1000, '2025-04-16 19:33:31', 1);
INSERT INTO `nursing_home` VALUES (6, '爱颐养老院', '重庆市丰都县', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/R-C%20%281%29.jpg', '罗欢', '爱颐养老院所有护理员均持有养老协会颁发的上岗资格证，受过专业的护理理论知识培训和日常生活、医疗护理技能培训，秉承“奉若父母，情同亲身”的宗旨，为每位老人高品质的护理服务，在东湖新城健康养护中心他们不仅是护理人员，更是您的家人。', 65, '2025-04-02 19:33:44', 1);

SET FOREIGN_KEY_CHECKS = 1;
