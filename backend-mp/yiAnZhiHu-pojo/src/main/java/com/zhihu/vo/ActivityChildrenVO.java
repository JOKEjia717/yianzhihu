package com.zhihu.vo;


import lombok.Data;

import java.time.LocalDateTime;

/**
 * @description: 活动详情视图对象
 * @author: Campione
 * @date 2025/4/14
 */
@Data
//@ApiModel(value = "ActivityDetailVO", description = "活动详情视图对象")
public class ActivityChildrenVO {


//    @ApiModelProperty(value = "活动id")
    private Long activityId;

//    @ApiModelProperty(value = "活动名称")
    private String name;

//    @ApiModelProperty(value = "老人id")
    private Long elderId;

//    @ApiModelProperty(value = "0代表未同意（默认）/1代表同意/2代表拒绝")
    private int ispass;

//    @ApiModelProperty(value = "开始时间")
    private LocalDateTime startTime;

//    @ApiModelProperty(value = "结束时间")
    private LocalDateTime endTime;


}
