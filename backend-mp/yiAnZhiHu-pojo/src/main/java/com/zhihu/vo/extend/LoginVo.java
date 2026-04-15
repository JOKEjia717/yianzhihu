package com.zhihu.vo.extend;

import lombok.Data;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/9 09:07
 */
@Data
public class LoginVo {
    private String accessToken;
    private String refreshToken;
}
