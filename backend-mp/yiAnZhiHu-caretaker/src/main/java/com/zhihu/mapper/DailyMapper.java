package com.zhihu.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.Dto.DailyDto;
import com.zhihu.po.Daily;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.Map;

/**
 * @author BangLin
 * @Date 2025/4/14 17:26
 */
@Mapper
public interface DailyMapper extends BaseMapper<Daily> {
    void updateDailySelective(@Param("dto") DailyDto dailyDto,  // 需要更新的数据对象
                              @Param("dailyId") Long dailyId );
    List<Daily> getHealthByDate(Map<String, Object> params);

    List<Daily> getdaily(Long caretakerId);



}
