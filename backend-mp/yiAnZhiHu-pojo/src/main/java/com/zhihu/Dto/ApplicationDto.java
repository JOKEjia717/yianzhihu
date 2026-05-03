package com.zhihu.Dto;

import lombok.Data;

import java.time.LocalDate;

/**
 * @author BangLin
 * @Date 2025/4/14 18:58
 */
@Data
public class ApplicationDto {

    /**
     * 院长的ID
     * 用于标识负责审批的院长
     */
    private Long deanId;

    private String name;

    private String phone;

    private LocalDate createdTime;
}
