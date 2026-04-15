package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * 
 * </p>
 *
 *
 */
@Data
public class Orders {


    /**
     * 订单id
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;


    /**
     * 实付总金额，单位为分
     */
    private Integer totalPrice;

    /**
     * 支付类型，1、支付宝，2、微信，3、扣减余额
     */
    private Integer paymentType;

    /**
     * 用户id
     */
    private Long childrenId;

    /**
     * 订单的状态，1、未付款 2、已付款,未发货 3、已发货,未确认 4、确认收货，交易成功 5、交易取消，订单关闭 6、交易结束，已评价
     */
    private Integer status;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 支付时间
     */
    private LocalDateTime payTime;

    /**
     * 发货时间
     */
    private LocalDateTime consignTime;

    /**
     * 交易完成时间
     */
    private LocalDateTime endTime;

    /**
     * 交易关闭时间
     */
    private LocalDateTime closeTime;


    /**
     * 更新时间
     */
    private LocalDateTime updateTime;


}
