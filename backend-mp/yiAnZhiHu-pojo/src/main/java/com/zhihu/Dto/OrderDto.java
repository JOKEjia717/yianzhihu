package com.zhihu.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class OrderDto {

    /**
     * 商品原价格
     */
    @JsonProperty("totalPrice")
    private Integer totalPrice;

    /**
     * 商品id
     */
    private String itemId;


    /**
     * 商品名称
     */
    private String name;

    /**
     * 商品图片
     */
    private String image;


    /**
     * 购买数量
     */
    private Integer num;


}
