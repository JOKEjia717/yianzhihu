package com.zhihu.Dto;

import lombok.Data;

@Data
public class OrderAddDto {

    /**
     * 单品id
     */
    private Long id;

    /**
     * 单品价格（分）
     */
    private Integer price;


}
