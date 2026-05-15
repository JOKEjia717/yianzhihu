package com.zhihu.vo;

import lombok.Data;

/**
 * @author BangLin
 * @Date 2025/4/13 15:30
 */
@Data
public class NursingHomePageVo {

    private String nursingHomeId;

    // 养老院名称
    private String name;

    // 养老院地址
    private String address;

    private String photo;

    private String phone;
}
