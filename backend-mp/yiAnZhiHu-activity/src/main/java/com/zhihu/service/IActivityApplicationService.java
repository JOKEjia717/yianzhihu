package com.zhihu.service;



import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.ActivityApplicationDTO;
import com.zhihu.Dto.ActivityApproveDTO;
import com.zhihu.po.ActivityApplication;
import com.zhihu.result.Result;

/**
 * <p>
 * 活动申请表 服务类
 * </p>
 *
 * @author Campione
 * @since 2025-04-14
 */
public interface IActivityApplicationService extends IService<ActivityApplication> {

    Result apply(ActivityApplicationDTO activityApplicationDTO);

    Result approve(ActivityApproveDTO activityApplicationDTO);

    Result children(String childernId);
    Result getElder(Long activityId);

    Result biElderId(String elderId);
}
