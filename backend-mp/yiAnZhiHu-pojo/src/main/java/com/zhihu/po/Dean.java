package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class Dean implements Serializable {

    @TableId(type= IdType.ASSIGN_ID)
    private Long deanId;

    private Long adminId;

    private String account;

    private String password;

    private String name;

    private String avatar;

    private String phone;

    private String description;

    private LocalDateTime createdTime;

    private int isEnable;
}
