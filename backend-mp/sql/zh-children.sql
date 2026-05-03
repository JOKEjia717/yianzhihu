/*
 Navicat Premium Dump SQL

 Source Server         : ali
 Source Server Type    : MySQL
 Source Server Version : 80027 (8.0.27)
 Source Host           : localhost:3306
 Source Schema         : zh-children

 Target Server Type    : MySQL
 Target Server Version : 80027 (8.0.27)
 File Encoding         : 65001

 Date: 30/04/2025 22:21:52
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for children
-- ----------------------------
DROP TABLE IF EXISTS `children`;
CREATE TABLE `children`  (
  `children_id` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '真实名字',
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `money` bigint NULL DEFAULT 10000 COMMENT '默认有10000',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '电话',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `is_enable` bigint NOT NULL DEFAULT 0 COMMENT '0代表账户正常/1代表账户下线',
  `created_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`children_id`) USING BTREE,
  UNIQUE INDEX `account`(`account` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '子女用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of children
-- ----------------------------
INSERT INTO `children` VALUES (1909508696707174401, 'lisi', 'brf', 'e10adc3949ba59abbe56e057f20f883e', 21905, '1234567898', 'https://gujiji.oss-cn-beijing.aliyuncs.com/28fe688f-b2ff-46db-85ce-0621236ee134.jpg', 0, '2025-04-08 15:28:45');
INSERT INTO `children` VALUES (1909796231132647425, '白若凡', 'f', 'e10adc3949ba59abbe56e057f20f883e', 86194, '1234567898', NULL, 0, '2025-04-09 10:31:18');
INSERT INTO `children` VALUES (1909944654146265089, 'lisi', 'bf', 'e10adc3949ba59abbe56e057f20f883e', 10000, '1234567898', NULL, 0, '2025-04-09 20:21:05');
INSERT INTO `children` VALUES (1914580218493431810, 'shiki', 'shiki', 'e10adc3949ba59abbe56e057f20f883e', 952426, '11454124411', 'https://yianzhihu-1.oss-cn-beijing.aliyuncs.com/28ead28c-5a77-4bf0-8f69-3dbac4e2750b.jpg', 0, '2025-04-22 15:21:10');

SET FOREIGN_KEY_CHECKS = 1;
