package com.zhihu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.NursingHome;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface NursingHomeMapper extends BaseMapper<NursingHome> {
    List<NursingHome> findNursingHomeByPage(Map<String, Object> params);

    Long findNursingHomeCount();
}
