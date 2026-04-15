package com.zhihu.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * @description: 活动详情视图对象
 * @author: Campione
 * @date 2025/4/14
 */
@Data
public class ActivityDetailVO {

    @TableId(type = IdType.ASSIGN_ID)
    private String activityId;


    private String nursingHomeId;


    private String name;

    private LocalDateTime startTime;


    private LocalDateTime endTime;


    private String description;

    private String activityData;
}
