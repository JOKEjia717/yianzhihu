package com.zhihu.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.ActivityDTO;
import com.zhihu.Dto.ActivityFormDto;
import com.zhihu.po.Activity;
import com.zhihu.result.Result;
import com.zhihu.vo.ActivityDetailVO;
import com.zhihu.vo.PageResult;

/**
 * @description:
 * @author: Campione
 * @date 2025/4/14
 */
public interface IActivityService extends IService<Activity> {
    /**
     * 新增活动
     * @param activityDTO
     * @return
     */
    Result pulish(ActivityFormDto activityDTO);

    Result<ActivityDetailVO> detail(Long Id);

    Result<PageResult<ActivityDetailVO>> pageDetail(String page, String pageSize, String deanId);

}
