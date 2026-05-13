package com.zhihu.Dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 老人注册DTO
 */
@Data
public class ElderSaveDto implements Serializable {

    /**
     * 老人姓名，若前端不传，可由后端兜底处理
     */
    private String name;

    private String account;

    private String password;

    private String phone;

    /**
     * 子女姓名。老年人自助注册时可不填，后端会兜底为空字符串。
     */
    private String childrenName;

    /**
     * 子女电话。老年人自助注册时可不填，后端会兜底为空字符串。
     */
    private String childrenPhone;
}
