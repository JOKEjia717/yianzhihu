package com.zhihu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.Health;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/20 15:57
 */
@Mapper
public interface HealthMapper extends BaseMapper<Health> {
    List<Health> selectByElderId(@Param("elderId") Long elderId);
}
