package com.zhihu.Dto;


import lombok.Data;

/**
 * <p>
 * 活动申请表
 * </p>
 *
 * @author Campione
 * @since 2025-04-14
 */
@Data
//@ApiModel(description="活动申请表")
public class ActivityApproveDTO {

    private static final long serialVersionUID = 1L;

//    @ApiModelProperty(value = "活动id")
    private String activityId;

//    @ApiModelProperty(value = "护工id")
    private String caretakerId;

//    @ApiModelProperty(value = "子女id")
    private String childrenId;

//    @ApiModelProperty(value = "老人id")
    private String elderId;

//    @ApiModelProperty(value = "0代表未同意（默认）/1代表同意/2代表拒绝")
    private int ispass;

}
