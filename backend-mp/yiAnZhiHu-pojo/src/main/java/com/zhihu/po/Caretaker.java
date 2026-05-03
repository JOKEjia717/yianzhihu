package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * @author BangLin
 * @Date 2025/4/14 15:45
 */
@Data
public class Caretaker {

    @TableId(type= IdType.ASSIGN_ID)
    private Long caretakerId;

    private Long deanId;

    private String account;

    private String password;

    private String name;

    private String avatar;

    private String phone;

    private String specialty;

    private int isEnable;

    private LocalDateTime createdTime;
}
