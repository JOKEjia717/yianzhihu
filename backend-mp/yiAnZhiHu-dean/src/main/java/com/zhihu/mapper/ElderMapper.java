package com.zhihu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.Application;
import com.zhihu.po.Elder;
import org.apache.ibatis.annotations.Mapper;

/**
 * @author BangLin
 * @Date 2025/4/14 19:01
 */
@Mapper
public interface ElderMapper extends BaseMapper<Elder> {
}
