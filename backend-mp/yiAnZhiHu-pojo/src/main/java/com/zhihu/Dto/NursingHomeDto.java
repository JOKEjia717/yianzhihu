package com.zhihu.Dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class NursingHomeDto implements Serializable {

    // 养老院名称
    private String name;

    // 养老院地址
    private String address;

    // 养老院照片
    private String photo;

    // 养老院负责人
    private String director;

    private String deanId;

    // 养老院荣誉
    private String honors;
}
