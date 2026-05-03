package com.zhihu.Dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class AdminLoginDto implements Serializable {

    private String account;
    private String password;
}
