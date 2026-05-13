package com.zhihu.Dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 老人登录DTO
 * 优先使用老人表中的 name 字段登录，account 作为兼容字段保留。
 */
@Data
public class ElderLoginDto implements Serializable {

    /**
     * 老人姓名，登录时优先使用该字段
     */
    private String name;

    /**
     * 兼容老版本登录请求的账号字段
     */
    private String account;

    private String password;
}
