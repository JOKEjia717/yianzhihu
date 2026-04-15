package com.zhihu.Dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class HealthDto implements Serializable {

    //老人id
    private String elderId;

    //评估报告
    private String report;
    //护理工备注
    private String caretakerComment;
    //第几次检查
    private int number;
}
