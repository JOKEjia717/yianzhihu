package com.zhihu.service;



import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.po.ActivityNumber;
import com.zhihu.result.Result;

/**
 * <p>
 * 活动参加人数表 服务类
 * </p>
 *
 * @author Campione
 * @since 2025-04-14
 */
public interface IActivityNumberService extends IService<ActivityNumber> {

    boolean insert(ActivityNumber activityNumber);


    Result count(Long activityId);

}
