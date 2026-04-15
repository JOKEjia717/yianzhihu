package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * 支付订单
 * </p>
 */
@Data
public class PayOrder {


    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 订单号
     */
    private String bizOrderNo;


    /**
     * 支付用户id
     */
    private Long bizChildrenId;


    /**
     * 支付金额，单位分
     */
    private Integer amount;

    /**
     * 支付类型，1：h5,2:小程序，3：公众号，4：扫码，5：余额支付
     */
    private Integer payType;

    /**
     * 支付状态，1:待支付，2：支付超时或取消，3：支付成功
     */
    private Integer status;


    /**
     * 支付成功时间
     */
    private LocalDateTime paySuccessTime;

    /**
     * 支付超时时间
     */
    private LocalDateTime payOverTime;

    private LocalDateTime payCancelTime;


    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;



    /**
     * 逻辑删除
     */
    private Boolean isDelete;


}
