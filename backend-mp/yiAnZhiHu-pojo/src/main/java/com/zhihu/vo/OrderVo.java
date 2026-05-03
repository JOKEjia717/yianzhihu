package com.zhihu.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderVo {

    private String id;

    private Integer price;

    private LocalDateTime createTime;
}
