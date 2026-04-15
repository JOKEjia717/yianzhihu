package com.zhihu.Dto;


import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

/**
 * @description:
 * @author: Campione
 * @date 2025/4/14
 */
@Data
//@ApiModel(description="活动管理表")
public class ActivityFormDto {

    private static final long serialVersionUID = 1L;

//    @ApiModelProperty(value = "活动ID")
    private String activityId;

//    @ApiModelProperty(value = "逻辑关联养老院ID")
    private String nursingHomeId;

//    @ApiModelProperty(value = "活动名称")
    private String name;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
//    @ApiModelProperty(value = "开始时间")
    private LocalDateTime startTime;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
//    @ApiModelProperty(value = "结束时间")
    private LocalDateTime endTime;

//    @ApiModelProperty(value = "活动描述")
    private String description;

//    @ApiModelProperty(value = "活动期间数据（如照片、视频路径）")
    private MultipartFile activityData;

}
