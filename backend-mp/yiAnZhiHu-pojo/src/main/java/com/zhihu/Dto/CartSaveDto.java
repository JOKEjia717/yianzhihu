package com.zhihu.Dto;

import lombok.Data;

@Data
public class CartSaveDto {

    /**
     * sku商品id
     */
    private String itemId;


    /**
     * 购买数量
     */
    private Integer num;

    /**
     * 商品标题
     */
    private String name;


    /**
     * 价格,单位：分
     */
    private Double price;

    /**
     * 商品图片
     */
    private String image;
}
