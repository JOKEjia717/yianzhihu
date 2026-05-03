package com.zhihu.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ItemVo implements Serializable {

//    @TableId(type= IdType.ASSIGN_ID)
    private String id;
    private String name;
    //商品价格
    private BigDecimal price;
    //商品库存
    private Integer stock;
    private String image;
    //商品销量
    private Integer sold;
    //商品状态，1-正常，2-下架，3-删除
    private Integer status;
//    private LocalDateTime createTime;

}
