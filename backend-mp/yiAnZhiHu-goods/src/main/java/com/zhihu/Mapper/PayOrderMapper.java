package com.zhihu.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.PayOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface PayOrderMapper extends BaseMapper<PayOrder> {

}
