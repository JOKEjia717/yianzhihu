package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class NursingHome implements Serializable {

    // 养老院ID，使用自动增长策略作为主键
    @TableId(type= IdType.AUTO)
    private Long nursingHomeId;

    // 养老院名称
    private String name;

    // 养老院地址
    private String address;

    // 养老院照片
    private String photo;

    // 养老院联系电话
    private String phone;

    // 养老院负责人
    private String director;

    // 养老院荣誉
    private String honors;

    // 创建用户的ID
    private Long deanId;

    // 创建时间
    private LocalDateTime createdTime;

    private  int isEnable;
}
