package com.zhihu.vo;

import com.zhihu.vo.extend.LoginVo;
import lombok.Data;

/**
 * @author BangLin
 * @Date 2025/4/14 15:50
 */
@Data
public class CaretakerLoginVo extends LoginVo {

    private String caretakerId;

    private String deanId;

    private String name;

    private String avatar;

    private String phone;

    private String specialty;

    private int isEnable;
}
