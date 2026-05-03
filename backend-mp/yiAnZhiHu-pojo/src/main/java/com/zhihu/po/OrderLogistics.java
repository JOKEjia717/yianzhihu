package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * 
 * </p>
 *
 *
 */
@Data
public class OrderLogistics {

    /**
     * 订单id，与订单表一对一
     */

    private Long orderId;

    /**
     * 物流单号
     */
    @TableId(type= IdType.ASSIGN_ID)
    private Long logisticsId;

    /**
     * 物流公司名称
     */
    private String logisticsCompany;

    /**
     * 收件人
     */
    private String contact;

    /**
     * 收件人手机号码
     */
    private String mobile;

    private String address;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    private Long childrenId;

    private Long elderId;


}
