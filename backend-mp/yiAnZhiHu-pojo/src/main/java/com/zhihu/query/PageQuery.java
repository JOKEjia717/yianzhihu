package com.zhihu.query;

import lombok.Data;

@Data

public class PageQuery {
    private Long pageNo;
    private Long pageSize;
    private String sortBy;
    private Boolean isAsc = false;
}