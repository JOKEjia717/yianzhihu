package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * <p>
 * 活动参加人数表
 * </p>
 *
 * @author Campione
 * @since 2025-04-14
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("activity_number")
//@ApiModel(value="ActivityNumber对象", description="活动参加人数表")
public class ActivityNumber implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "activity_number_id", type = IdType.ASSIGN_ID)
    private Long activityNumberId;

//    @ApiModelProperty(value = "关联活动ID")
    private Long activityId;

//    @ApiModelProperty(value = "关联子女ID")
    private Long childernId;


    public ActivityNumber(Long activityId, Long childernId) {
        this.activityId = activityId;
        this.childernId = childernId;
    }
}
