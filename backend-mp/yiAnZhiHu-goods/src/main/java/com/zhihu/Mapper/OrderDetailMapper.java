package com.zhihu.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.OrderDetail;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderDetailMapper extends BaseMapper<OrderDetail> {
}
