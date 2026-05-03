package com.zhihu.vo;

import lombok.Data;

import java.util.List;

/**
 * @description: 分页查询Vo
 * @author: Campione
 * @date 2025/4/14
 */
@Data
public class PageResult<T> {
    // 分页元数据
    private Long total;        // 总记录数
    private Long pages;     // 总页数
    private Long current;   // 当前页码
    private Long size;      // 每页数据量
    // 业务数据
    private List<T> records;   // 当前页数据列表
}
