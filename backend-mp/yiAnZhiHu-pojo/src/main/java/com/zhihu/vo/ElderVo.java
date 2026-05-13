package com.zhihu.vo;

import lombok.Data;

import java.time.LocalDate;

/**
 * @author BangLin
 * @Date 2025/4/14 18:53
 */
@Data
public class ElderVo {

    private String elderId;
    /**
     * 看护者ID，用于关联到看护者的信息
     * 这个字段存储了负责照顾老人的看护者的ID，确保责任到人
     */
    private String caretakerId;

    /**
     * 老人的姓名
     * 这个字段存储了老人的姓名信息，便于识别和查询
     */
    private String name;

    /**
     * 性别，使用整数表示性别，例如0可能代表男性，1代表女性
     * 这个字段存储了老人的性别信息，采用整数类型可能是为了简化数据库设计和查询
     */
    private int gender;

    /**
     * 年龄，表示老人的年龄
     * 这个字段存储了老人的年龄信息，是评估老人健康状况和护理需求的重要指标
     */
    private int age;

    private String account;

    private String phone;

    private String childrenName;

    private String childrenPhone;

    private LocalDate applicationTime;

    private LocalDate createdTime;

    /**
     * 照片路径或URL
     * 这个字段存储了老人的照片的路径或URL，便于在系统中显示老人的照片
     */
    private String photo;

    /**
     * 子女ID，用于关联到老人的子女信息
     * 这个字段存储了与老人相关联的子女的ID，便于家庭信息的管理和联系
     */
    private String childrenId;

    private int isEnable;
}
