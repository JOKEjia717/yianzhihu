package com.zhihu.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NursingHomeVo {

    private String nursingHomeId;

    // 养老院名称
    private String name;

    // 养老院地址
    private String address;

    // 养老院照片
    private String photo;

    // 养老院联系电话
    private String phone;

    // 养老院负责人
    private String director;

    // 养老院荣誉
    private String honors;

    // 创建用户的ID
    private String deanId;

    // 创建时间
    private LocalDateTime createdTime;



    private int isEnable;
}
