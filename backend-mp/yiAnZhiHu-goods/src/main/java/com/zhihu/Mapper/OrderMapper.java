package com.zhihu.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.Orders;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper extends BaseMapper<Orders> {
}
