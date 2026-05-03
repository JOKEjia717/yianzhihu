package com.zhihu.vo;

import com.zhihu.vo.extend.LoginVo;
import lombok.Data;

import java.io.Serializable;

@Data
public class AdminLoginVo extends LoginVo implements Serializable {

    private String name;

    private String phone;

    private String accessToken;

    private String refreshToken;
}
