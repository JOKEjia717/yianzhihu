package com.zhihu.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PayOrderVo {
    /**
     * id
     */
    private String id;

    /**
     * 订单号
     */
    private String bizOrderNo;


    /**
     * 支付金额，单位分
     */
    private Integer amount;

    /**
     * 支付状态
     */
    private Integer status;


    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime overTime;

    private List<PayOrderItemVo> payOrderItemVoList;


}
