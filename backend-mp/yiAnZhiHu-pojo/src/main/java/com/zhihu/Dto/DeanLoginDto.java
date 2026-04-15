package com.zhihu.Dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class DeanLoginDto implements Serializable {

    private String account;

    private String password;
}
