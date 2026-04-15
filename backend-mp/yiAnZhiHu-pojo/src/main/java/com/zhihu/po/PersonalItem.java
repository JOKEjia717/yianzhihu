package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * <p>
 * 老人私人物品管理表
 * </p>
 *
 * @author Campione
 * @since 2025-04-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("personal_item")
public class PersonalItem implements Serializable {

    private static final long serialVersionUID = 1L;

//    @ApiModelProperty(value = "物品ID")
    @TableId(value = "personal_item_id", type = IdType.ASSIGN_ID)
    private Long personalItemId;

//    @ApiModelProperty(value = "物品照片")
    @TableField("photo")
    private String photo;

//    @ApiModelProperty(value = "逻辑关联老人ID")
    @TableField("elder_id")
    private Long elderId;

//    @ApiModelProperty(value = "物品名称")
    @TableField("item_name")
    private String itemName;

//    @ApiModelProperty(value = "使用状态(0代表正常/1代表损坏/2代表丢失)")
    @TableField("status")
    private Integer status;

//    @ApiModelProperty(value = "最近检查日期")
    @TableField("last_check")
    private LocalDate lastCheck;

//    @ApiModelProperty(value = "损坏或丢失说明")
    @TableField("notes")
    private String notes;


}
