package com.zhihu.query;

import lombok.Data;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/23 10:53
 */
@Data
public class ItemQuery extends PageQuery{
    private String itemName;

    private Integer minPrice;

    private Integer maxPrice;

}
