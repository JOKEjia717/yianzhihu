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
 * 活动申请表
 * </p>
 *
 * @author Campione
 * @since 2025-04-14
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("activity_application")
//@ApiModel(value="ActivityApplication对象", description="活动申请表")
public class ActivityApplication implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "activity_application_id", type = IdType.ASSIGN_ID)
    private Long activityApplicationId;

//    @ApiModelProperty(value = "活动id")
    private Long activityId;

//    @ApiModelProperty(value = "护工id")
    private Long caretakerId;

//    @ApiModelProperty(value = "子女id")
    private Long childrenId;

//    @ApiModelProperty(value = "老人id")
    private Long elderId;

//    @ApiModelProperty(value = "0代表未同意（默认）/1代表同意/2代表拒绝")
    private int ispass;


}
