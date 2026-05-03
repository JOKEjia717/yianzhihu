package com.zhihu.mapper;



import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhihu.po.ActivityApplication;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 活动申请表 Mapper 接口
 * </p>
 *
 * @author Campione
 * @since 2025-04-14
 */
@Mapper
public interface ActivityApplicationMapper extends BaseMapper<ActivityApplication> {

        int updateByCondition(
                @Param("activityId") Long activityId,
                @Param("elderId") Long elderId,
                @Param("newIsPass") int ispass,  // 修改参数名为newIsPass
                @Param("oldIsPass") int oldIsPass
        );
}
