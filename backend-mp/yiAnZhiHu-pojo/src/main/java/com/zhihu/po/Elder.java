package com.zhihu.po;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDate;

/**
 * @author BangLin
 * @Date 2025/4/14 17:35
 */
@Data
public class Elder {

    /**
     * 老人ID，使用 ASSIGN_ID 类型生成唯一标识符
     * 这里使用了TableId注解来指定该字段为数据库表的主键，并且指定了主键的生成策略为ASSIGN_ID
     */
    @TableId(type= IdType.ASSIGN_ID)
    private Long elderId;

    /**
     * 院长ID，用于关联到院长的相关信息
     * 这个字段存储了与老人相关联的院长的ID，便于追踪和管理
     */
    private Long deanId;

    /**
     * 看护者ID，用于关联到看护者的信息
     * 这个字段存储了负责照顾老人的看护者的ID，确保责任到人
     */
    private Long caretakerId;

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

    /**
     * 账号，老人端登录使用
     */
    private String account;

    /**
     * 密码，使用 MD5 加密后存储
     */
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    /**
     * 电话，老人端注册/联系使用
     */
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
    private Long childrenId;

    /**
     * 是否启用，通常用0表示禁用，1表示启用
     * 这个字段表示老人账户或信息是否处于启用状态，用于控制数据的有效性和访问权限
     */
    private int isEnable;
}
