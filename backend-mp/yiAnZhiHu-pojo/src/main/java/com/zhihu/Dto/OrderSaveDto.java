package com.zhihu.Dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderSaveDto {

    private String elderId;

    private String elderName;

    private String childrenPhone;

    private List<OrderDto> orderDtolist;
}
