package com.zhihu.query;

import lombok.Data;

import java.time.LocalDate;

/**
 * @author BangLin
 * @Date 2025/4/14 19:27
 */
@Data
public class ElderQuery extends PageQuery{

    private String childrenName;

    private String childrenPhone;

    private LocalDate applicationTime;
}
