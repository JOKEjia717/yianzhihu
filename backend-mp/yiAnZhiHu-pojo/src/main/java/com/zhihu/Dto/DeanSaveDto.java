package com.zhihu.Dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class DeanSaveDto implements Serializable {

    private String account;

    private String password;

    private String name;

    private String avatar;

    private String phone;

    private String description;

}
