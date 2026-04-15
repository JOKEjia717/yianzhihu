/*
 Navicat Premium Dump SQL

 Source Server         : ali
 Source Server Type    : MySQL
 Source Server Version : 80027 (8.0.27)
 Source Host           : 8.152.200.33:3307
 Source Schema         : zh-caretaker

 Target Server Type    : MySQL
 Target Server Version : 80027 (8.0.27)
 File Encoding         : 65001

 Date: 30/04/2025 22:21:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for caretaker
-- ----------------------------
DROP TABLE IF EXISTS `caretaker`;
CREATE TABLE `caretaker`  (
  `caretaker_id` bigint NOT NULL AUTO_INCREMENT COMMENT '护理工唯一ID',
  `dean_id` bigint NOT NULL COMMENT '逻辑关联所属养老院ID',
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '姓名',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '联系方式',
  `specialty` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '护理专长（如失能护理、康复训练）',
  `is_enable` bigint NOT NULL DEFAULT 0 COMMENT '0代表账户正常/1代表账户下线',
  `created_time` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`caretaker_id`) USING BTREE,
  UNIQUE INDEX `account`(`account` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1915750089902116867 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '护理工信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of caretaker
-- ----------------------------
INSERT INTO `caretaker` VALUES (1911952283172683779, 1911374759677935617, 'brf11', '123456', '王秀英', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/%E5%91%98%E5%B7%A51.jpg', '13812345678', '护理员', 0, NULL);
INSERT INTO `caretaker` VALUES (1911952283172683780, 1911374759677935617, 'brf', '123456', '李建军', 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E5%91%98%E5%B7%A52.1.jpg', '123456789787', '洗衣', 0, NULL);
INSERT INTO `caretaker` VALUES (1915697507250753538, 1911374759677935617, 'brf111123123', '1234561', '张志强', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/%E5%91%98%E5%B7%A53.jpg', '13698745210', '营养师', 0, '2025-04-25 17:20:52.329411');
INSERT INTO `caretaker` VALUES (1915697656018587649, 1911374759677935617, 'acdc', '1234561', '刘淑芳', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/c50e33ed-65af-4f05-bf26-a1500fb7bf86.jpg', '18765432109', '医生', 0, '2025-04-25 17:21:27.770965');
INSERT INTO `caretaker` VALUES (1915698840502620161, 1911374759677935617, 'brf1212', '123456', '陈建国', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/%E5%91%98%E5%B7%A54.jpg', '15012345678', '康复治疗师', 0, '2025-04-25 17:26:10.209022');
INSERT INTO `caretaker` VALUES (1915750063431864321, 1911374759677935617, 'acdc11', '1234561', '杨晓敏', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/%E5%91%98%E5%B7%A58.jpg', '17898765432', '护士', 0, '2025-04-25 20:49:42.679917');
INSERT INTO `caretaker` VALUES (1915750078455861250, 1911374759677935617, 'acdc11121', '1234561', '赵冬梅', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/%E5%91%98%E5%B7%A56.jpg', '14785236901', '行政专员', 0, '2025-04-25 20:49:46.288739');
INSERT INTO `caretaker` VALUES (1915750089902116866, 1911374759677935617, 'acdc111211', '1234561', '吴明辉	', 'https://ncp--1.oss-cn-chengdu.aliyuncs.com/%E5%91%98%E5%B7%A54.jpg', '19965478901', '心理咨询师	', 0, '2025-04-25 20:49:49.005845');

-- ----------------------------
-- Table structure for daily
-- ----------------------------
DROP TABLE IF EXISTS `daily`;
CREATE TABLE `daily`  (
  `daily_id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `elder_id` bigint NOT NULL COMMENT '逻辑关联老人ID',
  `caretaker_id` bigint NOT NULL COMMENT '护工id',
  `date` date NOT NULL COMMENT '记录日期',
  `breakfast_photos` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '早餐照片（存储URL列表）',
  `lunch_photos` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '午餐照片（存储URL列表）',
  `dinner_photos` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '晚餐照片（存储URL列表）',
  `lodging_photos` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '住宿环境照片',
  `clothing_photos` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '穿戴照片（存储URL列表）',
  `ai_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT 'AI生成建议（如饮食调整）',
  `children_id` bigint NOT NULL COMMENT '子女id',
  `dean_id` bigint NOT NULL COMMENT '院长id',
  PRIMARY KEY (`daily_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1915797956980678660 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '老人日常数据及AI建议表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of daily
-- ----------------------------
INSERT INTO `daily` VALUES (1, 1911778796378263553, 1911952283172683779, '2025-04-21', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/5258f414-6371-4160-a5d0-55292585f2c0.jpg', '', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/259a66a1-0ca5-4307-b0e1-3be1bedb864c.jpg', '', '', 'sss', 1909508696707174401, 0);
INSERT INTO `daily` VALUES (1911778796378263554, 1911778796378263554, 1911778796378263554, '2025-04-23', '222', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/1c743054-f8fc-46f8-9d8a-532d02cafc01.jpg', '22222', '222222', '2222', '222222', 1909508696707174401, 0);
INSERT INTO `daily` VALUES (1913842063804231682, 1916372274099480577, 3, '2025-04-23', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/965f401f-7c5f-4e8d-bd6f-1a6c262b1c00.webp', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/2a92ca28-7995-481d-9498-2b980b86466a.jpg', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/04a05120-aa79-4f2e-b997-aabf01f19e09.webp', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/d71b1e8a-2477-442a-998d-5420911390c4.webp', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/9de13218-2983-4881-b9f4-b6689512de1d.webp', 'sss', 1909508696707174401, 5555);
INSERT INTO `daily` VALUES (1915797954015305729, 1911778796378263553, 1911952283172683780, '2025-04-26', NULL, NULL, NULL, NULL, NULL, NULL, 1909508696707174401, 5555);
INSERT INTO `daily` VALUES (1915797956104069122, 1911778796378263554, 1911952283172683780, '2025-04-26', NULL, NULL, NULL, NULL, NULL, NULL, 1914580218493431810, 5555);
INSERT INTO `daily` VALUES (1915797956980678657, 1911778796378263555, 414, '2025-04-26', NULL, NULL, NULL, NULL, NULL, NULL, 1914580218493431810, 5555);
INSERT INTO `daily` VALUES (1915797956980678658, 1911778796378263553, 1911952283172683779, '2025-04-30', 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/wanc.jpg', 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/wuc.png', 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/wanc.jpg', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/R-C%20%281%29.jpg', 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/yiwu.jpg', NULL, 1909508696707174401, 11);
INSERT INTO `daily` VALUES (1915797956980678659, 1911778796378263553, 1911952283172683779, '2025-04-29', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/868e42b9-1f52-49cc-8471-2259c15e58b8.jpg', 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/wuc.png', 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/wanc.jpg', 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/R-C%20%281%29.jpg', 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/yiwu.jpg', 'sss', 1909508696707174401, 2);

-- ----------------------------
-- Table structure for health
-- ----------------------------
DROP TABLE IF EXISTS `health`;
CREATE TABLE `health`  (
  `health_id` bigint NOT NULL AUTO_INCREMENT COMMENT '评估ID',
  `elder_id` bigint NOT NULL COMMENT '逻辑关联老人ID',
  `assess_date` date NOT NULL COMMENT '评估日期',
  `report` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评估报告',
  `caretaker_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '护理工备注',
  `number` int NOT NULL COMMENT '第几次检查',
  PRIMARY KEY (`health_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1917107415624040451 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '定期健康评估表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of health
-- ----------------------------
INSERT INTO `health` VALUES (11, 1911778796378263553, '2025-04-20', 'dd', '检测项目检测值正常参考范围结果分析\n血压 148/92 mmHg 90-139/60-89 mmHg 偏高（1级高血压） \n静息心率 58次/分 60-100次/分 偏低（建议排查原因） \n血氧饱和度 96% ≥95% 正常 \n体温 36.7℃ 36.0-37.2℃ 正常 \n', 3);
INSERT INTO `health` VALUES (1914230178084106242, 1911778796378263553, '2025-04-21', '健康', '检测项目检测值正常参考范围结果分析\n血压 150/92 mmHg 90-145/60-88 mmHg 偏高（1级高血压） \n静息心率 60次/分 60-100次/分 偏低（建议排查原因） \n血氧饱和度 96% ≥95% 正常 \n体温 36.7℃ 36.0-37.3℃ 正常 \n', 1);
INSERT INTO `health` VALUES (1914230178084106243, 1911778796378263553, '2025-04-08', '健康', '检测项目检测值正常参考范围结果分析\n血压 153/92 mmHg 88-150/58-88 mmHg 偏高（1级高血压） \n静息心率 59次/分 70-100次/分 偏低（建议排查原因） \n血氧饱和度 96% ≥95% 正常 \n体温 36.7℃ 36.0-37.8℃ 正常', 2);
INSERT INTO `health` VALUES (1914230178084106244, 1911778796378263554, '2025-04-10', '健康状态良好', '检测项目检测值正常参考范围结果分析\n血压 149/91 mmHg 89-150/61-88 mmHg 偏高（1级高血压） \n静息心率 59次/分 65-100次/分 偏低（建议排查原因） \n血氧饱和度 96% ≥95% 正常 \n体温 37.0℃ 36.0-37.7℃ 正常', 2);
INSERT INTO `health` VALUES (1914230178084106245, 1911778796378263554, '2025-04-17', '健康', '检测项目检测值正常参考范围结果分析\n血压 149/91 mmHg 89-150/61-88 mmHg 偏高（1级高血压） \n静息心率 65次/分 65-100次/分 偏低（建议排查原因） \n血氧饱和度 95% ≥95% 正常 \n体温 37.1℃ 36.0-37.5℃ 正常', 1);
INSERT INTO `health` VALUES (1914230178084106246, 1911778796378263554, '2025-04-24', '健康', '检测项目检测值正常参考范围结果分析\n血压 149/92 mmHg 89-160/61-88 mmHg 偏高（1级高血压） \n静息心率 57次/分 65-100次/分 偏低（建议排查原因） \n血氧饱和度 96% ≥95% 正常 \n体温 36.9℃ 36.0-37.7℃ 正常', 3);
INSERT INTO `health` VALUES (1915786914930106369, 1911778796378263553, '2025-04-25', '健康良好', '检测项目检测值正常参考范围结果分析\n血压 146/92 mmHg 89-160/61-88 mmHg 偏高（1级高血压） \n静息心率 58次/分 65-100次/分 偏低（建议排查原因） \n血氧饱和度 96% ≥95% 正常 \n体温 36.9℃ 36.0-37.5℃ 正常', 4);
INSERT INTO `health` VALUES (1915788427169636353, 1911778796378263554, '2025-04-25', '健康', '检测项目检测值正常参考范围结果分析\n血压 147/92 mmHg 89-150/61-88 mmHg 偏高（1级高血压） \n静息心率 58次/分 65-100次/分 偏低（建议排查原因） \n血氧饱和度 96% ≥95% 正常 \n体温 36.8℃ 36.0-37.5℃ 正常', 4);
INSERT INTO `health` VALUES (1915788577103421441, 1911778796378263554, '2025-04-25', '健康', '检测项目检测值正常参考范围结果分析\n血压 156/92 mmHg 89-160/61-88 mmHg 偏高（1级高血压） \n静息心率 58次/分 65-100次/分 偏低（建议排查原因） \n血氧饱和度 96% ≥95% 正常 \n体温 36.9℃ 36.0-37.5℃ 正常', 5);
INSERT INTO `health` VALUES (1916025675001737217, 1911778796378263553, '2025-04-26', '健康', '检测项目检测值正常参考范围结果分析\n血压 146/92 mmHg 89-160/61-88 mmHg 偏高（1级高血压） \n静息心率 58次/分 65-100次/分 偏低（建议排查原因） \n血氧饱和度 96% ≥95% 正常 \n体温 36.5℃ 36.0-37.5℃ 正常', 5);
INSERT INTO `health` VALUES (1916481076671397890, 1911778796378263553, '2025-04-27', '健康状态良好', '检测项目检测值正常参考范围结果分析\n血压 146/92 mmHg 90-160/61-90 mmHg 偏高（1级高血压） \n静息心率 60次/分 65-100次/分 偏低（建议排查原因） \n血氧饱和度 96% ≥95% 正常 \n体温 36.9℃ 36.0-37.5℃ 正常', 6);

-- ----------------------------
-- Table structure for personal_item
-- ----------------------------
DROP TABLE IF EXISTS `personal_item`;
CREATE TABLE `personal_item`  (
  `personal_item_id` bigint NOT NULL AUTO_INCREMENT COMMENT '物品ID',
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '物品照片',
  `elder_id` bigint NOT NULL COMMENT '逻辑关联老人ID',
  `item_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '物品名称',
  `status` tinyint NOT NULL COMMENT '使用状态(0代表正常/1代表损坏/2代表丢失)',
  `last_check` date NULL DEFAULT NULL COMMENT '最近检查日期',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '损坏或丢失说明',
  PRIMARY KEY (`personal_item_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '老人私人物品管理表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of personal_item
-- ----------------------------
INSERT INTO `personal_item` VALUES (1, 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/65f3cca40419d1a73d06bf6d2ea78a7.png', 1911778796378263553, '按摩椅', 0, '2025-04-10', '正常');
INSERT INTO `personal_item` VALUES (2, 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/5b494ad7b5fa94a745b09cfa4965c19.png', 1911778796378263553, '拐杖', 2, '2025-04-25', '丢失');
INSERT INTO `personal_item` VALUES (3, 'https://hubangling-web-framework.oss-cn-beijing.aliyuncs.com/5524b7f9afba0cf6a8965e1fe8b0275.png', 1911778796378263553, '收音机', 0, '2025-04-25', '正常');

SET FOREIGN_KEY_CHECKS = 1;
