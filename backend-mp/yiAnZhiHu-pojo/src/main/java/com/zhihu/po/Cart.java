package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * 订单详情表
 * </p>
 *
 *
 */
@Data
public class Cart {

    private static final long serialVersionUID = 1L;

    /**
     * 购物车条目id 
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户id
     */
    private Long childrenId;

    /**
     * sku商品id
     */
    private Long itemId;


    /**
     * 购买数量
     */
    private Double num;

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

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;


}
