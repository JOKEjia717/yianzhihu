package com.zhihu.Dto;

import lombok.Data;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/22 19:58
 */
@Data
public class ChildrenInfoUpdateDTO {
    private String name;
    private String phone;
    private String oldPassword;
    private String newPassword;
}
