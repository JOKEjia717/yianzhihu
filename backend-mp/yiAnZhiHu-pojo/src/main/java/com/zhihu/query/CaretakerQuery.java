package com.zhihu.query;

import lombok.Data;

import javax.management.Query;

/**
 * @author BangLin
 * @Date 2025/4/15 09:43
 */
@Data
public class CaretakerQuery extends PageQuery {

    private String name;

    private String phone;

    private String specialty;
}
