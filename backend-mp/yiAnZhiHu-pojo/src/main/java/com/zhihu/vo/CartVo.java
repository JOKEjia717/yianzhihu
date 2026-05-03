package com.zhihu.vo;

import lombok.Data;

@Data
public class CartVo {

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
    private Integer price;

    /**
     * 商品图片
     */
    private String image;

}
