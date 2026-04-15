package com.zhihu.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;

/**
 * @author BangLin
 * @Date 2025/4/25 11:10
 */
@Data
public class ActivityApplicationVo implements Serializable {

    private String activityApplicationId;

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
