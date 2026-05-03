package com.zhihu.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/21 11:12
 */
@Data
public class HealthVo {
    @TableId(type= IdType.ASSIGN_ID)
    private String healthId;
    //评估日期
    private LocalDateTime assessDate;
    //评估报告
    private String report;
    //护理工备注
    private String caretakerComment;
    //第几次检查
    private String number;
}
