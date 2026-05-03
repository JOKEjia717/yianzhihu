package com.zhihu.Dto;


import lombok.Data;

import java.time.LocalDateTime;

/**
 * @description:
 * @author: Campione
 * @date 2025/4/14
 */
@Data
//@ApiModel(description="活动管理表")
public class ActivityDTO {

    private static final long serialVersionUID = 1L;

//    @ApiModelProperty(value = "活动ID")
    private String activityId;

//    @ApiModelProperty(value = "逻辑关联养老院ID")
    private String nursingHomeId;

//    @ApiModelProperty(value = "活动名称")
    private String name;

//    @ApiModelProperty(value = "开始时间")
    private LocalDateTime startTime;

//    @ApiModelProperty(value = "结束时间")
    private LocalDateTime endTime;

//    @ApiModelProperty(value = "活动描述")
    private String description;

//    @ApiModelProperty(value = "活动期间数据（如照片、视频路径）")
    private String activityData;

}
