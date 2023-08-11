/*
 Navicat Premium Data Transfer

 Source Server         : DecisionSupport
 Source Server Type    : MySQL
 Source Server Version : 80030
 Source Host           : localhost:3306
 Source Schema         : survey

 Target Server Type    : MySQL
 Target Server Version : 80030
 File Encoding         : 65001

 Date: 25/06/2023 00:00:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for university
-- ----------------------------
DROP TABLE IF EXISTS `university`;
CREATE TABLE `university`  (
  `university` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of university
-- ----------------------------
INSERT INTO `university` VALUES ('Học viện An ninh nhân dân', 'ANH', '3');
INSERT INTO `university` VALUES ('Đại học Bách khoa Hà Nội', 'BKA', '32');
INSERT INTO `university` VALUES ('Học viện Biên phòng', 'BPH', '5');
INSERT INTO `university` VALUES ('Đại học Anh quốc Việt Nam', 'BUV', '31');
INSERT INTO `university` VALUES ('Học viện Công nghệ Bưu chính Viễn thông', 'BVH', '9');
INSERT INTO `university` VALUES ('Đại học Công nghiệp Dệt may Hà Nội', 'CCM', '38');
INSERT INTO `university` VALUES ('Đại học CMC', 'CMC', '33');
INSERT INTO `university` VALUES ('Học viện Cảnh sát nhân dân', 'CSH', '6');
INSERT INTO `university` VALUES ('Trường Sĩ quan Đặc công', 'DCH', '30');
INSERT INTO `university` VALUES ('Đại học Công nghiệp Hà Nội', 'DCN', '39');
INSERT INTO `university` VALUES ('Đại học Công nghệ và Quản lý Hữu Nghị', 'DCQ', '36');
INSERT INTO `university` VALUES ('Đại học Công nghệ Đông Á', 'DDA', '37');
INSERT INTO `university` VALUES ('Đại học Đông Đô', 'DDD', '93');
INSERT INTO `university` VALUES ('Đại học Điện lực', 'DDL', '92');
INSERT INTO `university` VALUES ('Đại học Đại Nam', 'DDN', '91');
INSERT INTO `university` VALUES ('Đại học Dược Hà Nội', 'DKH', '41');
INSERT INTO `university` VALUES ('Đại học Kinh tế Kỹ thuật - Công nghiệp (Cơ sở Hà Nội)', 'DKK', '54');
INSERT INTO `university` VALUES ('Đại học Kiểm sát Hà Nội', 'DKS', '50');
INSERT INTO `university` VALUES ('Đại học Lao động Xã hội (Cơ sở Sơn Tây)', 'DLT', '58');
INSERT INTO `university` VALUES ('Đại học Lao động Xã hội (Cơ sở Hà Nội)', 'DLX', '57');
INSERT INTO `university` VALUES ('Đại học Tài nguyên và Môi trường Hà Nội', 'DMT.HN', '79');
INSERT INTO `university` VALUES ('Đại học Nội vụ Hà Nội', 'DNV.HN', '68');
INSERT INTO `university` VALUES ('Đại học Phương Đông', 'DPD', '71');
INSERT INTO `university` VALUES ('Đại học Kinh doanh và Công nghệ Hà Nội', 'DQK', '52');
INSERT INTO `university` VALUES ('Đại học Phenikaa', 'DTA', '69');
INSERT INTO `university` VALUES ('Đại học Thăng Long', 'DTL', '80');
INSERT INTO `university` VALUES ('Đại học Hòa Bình', 'ETU', '46');
INSERT INTO `university` VALUES ('Đại học Tài chính Ngân hàng Hà Nội', 'FBU', '78');
INSERT INTO `university` VALUES ('Đại học FPT (Cơ sở Hà Nội)', 'FPT', '42');
INSERT INTO `university` VALUES ('Đại học Giao thông Vận tải', 'GHA', '44');
INSERT INTO `university` VALUES ('Đại học Sư phạm Nghệ thuật Trung ương Hà Nội', 'GNT', '76');
INSERT INTO `university` VALUES ('Đại học Công nghệ Giao thông Vận tải (Cơ sở Hà Nội)', 'GTA', '35');
INSERT INTO `university` VALUES ('Học viện Báo chí và Tuyên truyền', 'HBT', '4');
INSERT INTO `university` VALUES ('Học viện Chính trị Công an nhân dân', 'HCA', '8');
INSERT INTO `university` VALUES ('Học viện Chính sách và Phát triển', 'HCP', '7');
INSERT INTO `university` VALUES ('Học viện Hậu cần', 'HEH', '11');
INSERT INTO `university` VALUES ('Trường Sĩ quan Phòng hóa', 'HGH', '29');
INSERT INTO `university` VALUES ('Đại học Thủ đô Hà Nội', 'HNM', '82');
INSERT INTO `university` VALUES ('Học viện Phụ nữ Việt Nam', 'HPN', '19');
INSERT INTO `university` VALUES ('Học viện Ngoại giao', 'HQT', '16');
INSERT INTO `university` VALUES ('Học viện Tòa án', 'HTA', '25');
INSERT INTO `university` VALUES ('Học viện Tài chính', 'HTC', '22');
INSERT INTO `university` VALUES ('Học viện Thanh thiếu niên Việt Nam', 'HTN', '23');
INSERT INTO `university` VALUES ('Học viện Nông nghiệp Việt Nam', 'HVN', '17');
INSERT INTO `university` VALUES ('Học viện Quản lý Giáo dục', 'HVQ', '20');
INSERT INTO `university` VALUES ('Học Viện Y Dược Học Cổ Truyền Việt Nam', 'HYD', '94');
INSERT INTO `university` VALUES ('Uni', 'ID_uni', 'ID');
INSERT INTO `university` VALUES ('Học viện Tư pháp', 'JA', '26');
INSERT INTO `university` VALUES ('Đại học Khoa học và Công nghệ Hà Nội', 'KCN', '48');
INSERT INTO `university` VALUES ('Đại học Kinh tế Quốc dân', 'KHA', '55');
INSERT INTO `university` VALUES ('Học viện Kỹ thuật Mật mã (cơ sở phía Bắc)', 'KMA', '13');
INSERT INTO `university` VALUES ('Học viện Kỹ thuật Quân sự', 'KQH', '14');
INSERT INTO `university` VALUES ('Đại học Kiến trúc Hà Nội', 'KTA', '51');
INSERT INTO `university` VALUES ('Đại học Trần Quốc Tuấn (Sĩ quan Lục quân 1)', 'LAH', '85');
INSERT INTO `university` VALUES ('Trường Sĩ quan Pháo binh', 'LBH', '28');
INSERT INTO `university` VALUES ('Học viện Thiết kế và Thời trang London', 'LCFS', '24');
INSERT INTO `university` VALUES ('Đại học Công Đoàn', 'LDA', '40');
INSERT INTO `university` VALUES ('Đại học Lâm nghiệp', 'LNH', '56');
INSERT INTO `university` VALUES ('Đại học Luật Hà Nội', 'LPH', '60');
INSERT INTO `university` VALUES ('Đại học Mỏ - Địa chất (Cơ sở Hà Nội)', 'MDA.HN', '61');
INSERT INTO `university` VALUES ('Đại học Mở Hà Nội', 'MHN', '62');
INSERT INTO `university` VALUES ('Đại học Mỹ thuật Công nghiệp', 'MTC', '63');
INSERT INTO `university` VALUES ('Đại học Mỹ thuật Việt Nam', 'MTH', '64');
INSERT INTO `university` VALUES ('Đại học Hà Nội', 'NHF', '45');
INSERT INTO `university` VALUES ('Học viện Ngân hàng', 'NHH', '15');
INSERT INTO `university` VALUES ('Học viện Khoa học Quân sự', 'NQH', '12');
INSERT INTO `university` VALUES ('Đại học Ngoại thương (Cơ sở Hà Nội)', 'NTH.HN', '66');
INSERT INTO `university` VALUES ('Đại học Nguyễn Trãi', 'NTU', '67');
INSERT INTO `university` VALUES ('Học viện Âm nhạc Quốc gia Việt Nam', 'NVH', '2');
INSERT INTO `university` VALUES ('Đại học Phòng cháy chữa cháy', 'PCH', '70');
INSERT INTO `university` VALUES ('Học viện Phòng không - Không quân', 'PKH', '18');
INSERT INTO `university` VALUES ('Đại học Kinh tế - Đại học Quốc gia Hà Nội', 'QHE', '53');
INSERT INTO `university` VALUES ('Đại học Ngoại ngữ - Đại học Quốc gia Hà Nội', 'QHF', '65');
INSERT INTO `university` VALUES ('Đại học Công nghệ - Đại học Quốc gia Hà Nội', 'QHI', '34');
INSERT INTO `university` VALUES ('Đại học Luật - Đại học Quốc gia Hà Nội', 'QHL', '59');
INSERT INTO `university` VALUES ('Trường Quốc tế - Đại học Quốc gia Hà Nội', 'QHQ', '27');
INSERT INTO `university` VALUES ('Đại học Giáo dục - ĐHQG Hà Nội', 'QHS', '43');
INSERT INTO `university` VALUES ('Đại học Khoa học Tự nhiên - Đại học Quốc gia Hà Nội', 'QHT', '47');
INSERT INTO `university` VALUES ('Đại học Khoa học Xã hội và Nhân văn - ĐHQG HN', 'QHX', '49');
INSERT INTO `university` VALUES ('Đại học Y Dược - Đại học Quốc gia Hà Nội', 'QHY', '88');
INSERT INTO `university` VALUES ('Đại học RMIT', 'RMU', '73');
INSERT INTO `university` VALUES ('Đại học Sân khấu - Điện ảnh Hà Nội', 'SKD', '74');
INSERT INTO `university` VALUES ('Đại học Sư phạm Hà Nội', 'SPH', '75');
INSERT INTO `university` VALUES ('Đại học Thành Đô', 'TDD', '81');
INSERT INTO `university` VALUES ('Đại học Sư phạm Thể dục thể thao Hà Nội', 'TDH', '77');
INSERT INTO `university` VALUES ('Đại học Thủy Lợi', 'TLA', '84');
INSERT INTO `university` VALUES ('Đại học Thương mại', 'TMA', '83');
INSERT INTO `university` VALUES ('Học viện Dân tộc', 'VAEM', '10');
INSERT INTO `university` VALUES ('Đại học Công nghiệp Việt Hung', 'VHD', '1');
INSERT INTO `university` VALUES ('Đại học Văn hóa Hà Nội', 'VHH', '86');
INSERT INTO `university` VALUES ('Đại học Quốc Gia Hà Nội', 'VNU', '72');
INSERT INTO `university` VALUES ('Đại học Xây dựng Hà Nội', 'XDA', '87');
INSERT INTO `university` VALUES ('Đại học Y Hà Nội', 'YHB', '89');
INSERT INTO `university` VALUES ('Học viện Quân y', 'YQH', '21');
INSERT INTO `university` VALUES ('Đại học Y tế Công cộng', 'YTC', '90');

SET FOREIGN_KEY_CHECKS = 1;
