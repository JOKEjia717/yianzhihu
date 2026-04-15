package com.zhihu.query;

import lombok.Data;

@Data
public class NursingHomeQuery extends PageQuery{

    private String name;

    private String address;
}
