package com.zhihu.Dto;

import lombok.Data;
    @Data
    public class ItemQueryDto {
//        // 模糊查询关键字
//        private String keyword;
//        private Integer current ; // 当前页，默认第1页
//        private Integer size ;   // 每页条数，默认10条
        private String name;

        private Integer minPrice;

        private Integer maxPrice;

        private String category;

        private String soldNums;

        private Long userId;
    }

