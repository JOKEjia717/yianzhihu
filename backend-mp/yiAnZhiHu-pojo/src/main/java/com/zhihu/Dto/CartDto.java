package com.zhihu.Dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class CartDto implements Serializable {
    /**
     * 商品id
     */
    private String itemId;
    /**
     * 商品名字
     */
    private String name;
    /**
     * 商品价格
     */
    private Integer price;
    /**
     * 图片
     */
    private String image;
}
