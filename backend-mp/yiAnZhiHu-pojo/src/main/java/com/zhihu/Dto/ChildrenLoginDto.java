package com.zhihu.Dto;

import lombok.Data;

import java.io.Serializable;

/**
 * @author : YiMing
 * @description :用户登录Dto
 * @createDate : 2025/3/3 14:07
 */
@Data
public class ChildrenLoginDto implements Serializable {
    private String account;
    private String password;
}
