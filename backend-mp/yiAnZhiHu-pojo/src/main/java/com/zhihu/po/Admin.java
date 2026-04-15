package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;

@Data
public class Admin implements Serializable {

    @TableId(type= IdType.ASSIGN_ID)
    private Long adminId;

    private String name;

    private String account;

    private String password;

    private String phone;
}
