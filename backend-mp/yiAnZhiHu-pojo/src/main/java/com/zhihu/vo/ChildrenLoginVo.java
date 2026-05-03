package com.zhihu.vo;

import com.zhihu.vo.extend.LoginVo;
import lombok.Data;

/**
 * @author : YiMing
 * @description :用户登录VO
 * @createDate : 2025/3/3 13:57
 */
@Data
public class ChildrenLoginVo extends LoginVo {
    private String childrenId;
    private String avatar;
    private String name;
    private String phone;
    private int isEnable;
}
