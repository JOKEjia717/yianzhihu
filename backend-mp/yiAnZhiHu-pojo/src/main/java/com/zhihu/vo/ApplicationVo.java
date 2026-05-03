package com.zhihu.vo;

import lombok.Data;

import java.time.LocalDate;

/**
 * @author BangLin
 * @Date 2025/4/14 18:59
 */
@Data
public class ApplicationVo {

    /**
     * 关联的子申请表ID
     * 用于建立申请表之间的关联关系
     */
    private Long childrenId;

    /**
     * 院长的ID
     * 用于标识负责审批的院长
     */
    private Long deanId;

    private String name;

    private String phone;

    /**
     * 审批状态标志
     * 用于表示申请是否已经通过审批，0表示未通过，1表示通过
     */
    private int ispass;

    private LocalDate createdTime;
}
