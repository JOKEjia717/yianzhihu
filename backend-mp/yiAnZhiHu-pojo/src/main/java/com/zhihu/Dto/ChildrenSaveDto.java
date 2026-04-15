package com.zhihu.Dto;

import lombok.Data;

import java.io.Serializable;

/**
 * @author : YiMing
 * @description :用户注册dto
 * @createDate : 2025/4/7 16:08
 */
@Data
public class ChildrenSaveDto implements Serializable {

    private String name;

    private String account;

    private String password;

    private String phone;
}
