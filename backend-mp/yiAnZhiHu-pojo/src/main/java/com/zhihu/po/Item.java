package com.zhihu.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class Item implements Serializable {

    @TableId(type= IdType.ASSIGN_ID)
    private Long id;

    private String name;

    private BigDecimal price;

    private Integer stock;

    private String image;

    private Integer sold;

    private Integer status;

    private LocalDateTime createTime;


}
