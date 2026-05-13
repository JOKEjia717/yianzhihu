package com.zhihu.vo;

import com.zhihu.vo.extend.LoginVo;
import lombok.Data;

import java.time.LocalDate;

/**
 * 老人登录返回VO
 */
@Data
public class ElderLoginVo extends LoginVo {

    private String elderId;

    private String caretakerId;

    private String name;

    private int gender;

    private int age;

    private String account;

    private String phone;

    private String childrenName;

    private String childrenPhone;

    private LocalDate applicationTime;

    private LocalDate createdTime;

    private String photo;

    private String childrenId;

    private int isEnable;
}
