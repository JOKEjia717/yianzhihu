/*
 Navicat Premium Dump SQL

 Source Server         : ali
 Source Server Type    : MySQL
 Source Server Version : 80027 (8.0.27)
 Source Host           : localhost:3306
 Source Schema         : zh-admin

 Target Server Type    : MySQL
 Target Server Version : 80027 (8.0.27)
 File Encoding         : 65001

 Date: 30/04/2025 22:22:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `admin_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '名字',
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账户',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '123456' COMMENT '密码',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '联系电话',
  PRIMARY KEY (`admin_id`) USING BTREE,
  UNIQUE INDEX `account`(`account` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '管理员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin', 'admin', '123456', '17323423511');

-- ----------------------------
-- Table structure for dean
-- ----------------------------
DROP TABLE IF EXISTS `dean`;
CREATE TABLE `dean`  (
  `dean_id` bigint NOT NULL,
  `admin_id` bigint NOT NULL COMMENT '创建人id',
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名字',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '电话',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '详细描述',
  `created_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `is_enable` bigint NOT NULL DEFAULT 0 COMMENT '0代表账户正常/1代表账户下线',
  PRIMARY KEY (`dean_id`) USING BTREE,
  UNIQUE INDEX `account`(`account` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '院长表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dean
-- ----------------------------
INSERT INTO `dean` VALUES (1911374759677935611, 2, 'brf1', '12345', '白若凡11', NULL, '12345678988', NULL, '2025-04-13 19:03:49', 0);
INSERT INTO `dean` VALUES (1911374759677935617, 1, 'brf', '123456', '胡永龙', 'https://yianzhihu.oss-cn-beijing.aliyuncs.com/%E6%A0%A1%E9%95%BF1.jpg', '12345678998', NULL, '2025-04-13 19:03:49', 0);

SET FOREIGN_KEY_CHECKS = 1;
