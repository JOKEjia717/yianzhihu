package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/3/3 13:29
 */
@Data
public class Children implements Serializable {
    /**
     *用户id,采取雪花算法
     */
    @TableId(type=IdType.ASSIGN_ID)
    private Long childrenId;
    /**
     * 用户昵称
     */
    private String name;
    /**
     * 用户账号
     */
    private String account;
    /**
     * 用户密码
     */
    private String password;
    /**
     * 用户电话
     */
    private String phone;
    /**
     * 头像
     */
    private String avatar;

    /**
     * 创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 账户状态
     */
    private int isEnable;

    private Integer money;

}
