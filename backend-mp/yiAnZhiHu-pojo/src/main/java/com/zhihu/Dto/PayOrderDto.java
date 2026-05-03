package com.zhihu.Dto;

import lombok.Data;

import java.util.List;

@Data
public class PayOrderDto {


    /**
     * 支付金额，单位分
     */
    private Integer amount;

    /**
     * 支付类型，1：h5,2:小程序，3：公众号，4：扫码，5：余额支付
     */
    private Integer payType;

    private List<Long> orderIds;
}
