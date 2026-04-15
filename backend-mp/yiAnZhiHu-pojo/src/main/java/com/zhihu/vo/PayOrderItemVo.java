package com.zhihu.vo;

import lombok.Data;

import java.util.List;


@Data
public class PayOrderItemVo {

    /**
     * 用户id
     */
    private String childrenId;

    /**
     * 商品id
     */
    private String itemId;
    /**
     * SKU名称
     */
    private String name;

    /**
     * 商品原价格
     */
    private Integer Price;

    /**
     * 价格（分）
     */
    private Integer price;

    /**
     * 商品图片
     */
    private String image;



}
