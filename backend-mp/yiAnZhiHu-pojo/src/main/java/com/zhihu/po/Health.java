package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/20 15:51
 */
@Data
public class Health implements Serializable {
    @TableId(type= IdType.ASSIGN_ID)
    private Long healthId;
    //老人id
    private Long elderId;
    //评估日期
    private LocalDateTime assessDate;
    //评估报告
    private String report;
    //护理工备注
    private String caretakerComment;
    //第几次检查
    private int number;
}
