package com.zhihu.service.impl;



import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.client.DeanClient;
import com.zhihu.mapper.ActivityNumberMapper;
import com.zhihu.po.ActivityApplication;
import com.zhihu.po.ActivityNumber;
import com.zhihu.result.Result;
import com.zhihu.service.IActivityNumberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 活动参加人数表 服务实现类
 * </p>
 *
 * @author Campione
 * @since 2025-04-14
 */
@Service
@RequiredArgsConstructor
public class ActivityNumberServiceImpl extends ServiceImpl<ActivityNumberMapper, ActivityNumber> implements IActivityNumberService {


    @Override
    public boolean insert(ActivityNumber activityNumber) {
        return save(activityNumber);
    }

    @Override
    public Result count(Long activityId) {
        String count = String.valueOf(lambdaQuery()
                .eq(ActivityNumber::getActivityId, activityId)
                .count());
        if(Long.parseLong(count)>0){
            return Result.success(count);
        }else {
            return Result.error("总数=0，或查询失败");
        }

    }


}
