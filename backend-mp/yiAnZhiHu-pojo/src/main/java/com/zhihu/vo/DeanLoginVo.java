package com.zhihu.vo;

import com.zhihu.vo.extend.LoginVo;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class DeanLoginVo extends LoginVo implements Serializable {

    private String deanId;

    private String name;

    private String avatar;

    private String phone;

    private String description;

    private String accessToken;

    private String refreshToken;

    private LocalDateTime createdTime;

    private int isEnable;
}
