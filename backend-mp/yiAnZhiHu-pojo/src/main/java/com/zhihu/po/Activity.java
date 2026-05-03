package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * 活动管理表
 * </p>
 *
 * @author Campione
 * @since 2025-04-14
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("activity")
//@ApiModel(value="Activity对象", description="活动管理表")
public class Activity implements Serializable {

    private static final long serialVersionUID = 1L;

//    @ApiModelProperty(value = "活动ID")
    @TableId(value = "activity_id", type = IdType.ASSIGN_ID)
    private Long activityId;

//    @ApiModelProperty(value = "逻辑关联养老院ID")
    private Long nursingHomeId;

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
