package com.zhihu.controller;



import com.zhihu.Dto.ActivityApplicationDTO;
import com.zhihu.Dto.ActivityApproveDTO;
import com.zhihu.Dto.ActivityDTO;
import com.zhihu.Dto.ActivityFormDto;
import com.zhihu.result.Result;
import com.zhihu.service.IActivityApplicationService;
import com.zhihu.service.IActivityNumberService;
import com.zhihu.service.IActivityService;
import com.zhihu.vo.ActivityDetailVO;
import com.zhihu.vo.PageResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @description: 活动接口
 * @author: Campione
 * @date 2025/4/14
 */

@Slf4j
@RestController
@RequestMapping("/activity/")
@RequiredArgsConstructor
public class ActivityController {
    private final IActivityService ActivityService;
    private final IActivityApplicationService ActivityApplicationService;
    private final IActivityNumberService activityNumberService;
    /**
     * 新增活动
     * @param activityDTO
     * @return
     */
    @PostMapping("publish")
    public Result publish(@ModelAttribute ActivityFormDto activityDTO){
        return ActivityService.pulish(activityDTO);
    }

    /**
     * 根据活动id申请
     * @param activityApplicationDTO
     * @return
     */
    @PostMapping("apply")
    public Result apply(@RequestBody ActivityApplicationDTO activityApplicationDTO){
        return ActivityApplicationService.apply(activityApplicationDTO);
    }

    /**
     * 根据id查询活动详情
     * @param activityId
     * @return
     */
    @GetMapping("detail")
    public Result<ActivityDetailVO> detail(@RequestParam String activityId){
        return ActivityService.detail(Long.valueOf(activityId));
    }

    /**
     * 分页查询
     * @param page
     * @param pageSize
     * @return
     */
    @GetMapping("pageDetail")
    public Result<PageResult<ActivityDetailVO>> pageDetail(@RequestParam String page, @RequestParam String pageSize, @RequestParam(required = false) String deanId){
        return ActivityService.pageDetail(page,pageSize, deanId);
    }

    /**
     * 子女同意活动
     * @param activityApproveDTO
     * @return
     */
    @PostMapping("approve")
    public Result approve(@RequestBody ActivityApproveDTO activityApproveDTO){
        return ActivityApplicationService.approve(activityApproveDTO);
    }

    /**
     * 子女根据id查询活动申请信息
     *
     * @param childernId
     * @return
     */
    @GetMapping("childernId")
    public Result children(@RequestParam String childernId){
        return ActivityApplicationService.children(childernId);
    }

    @GetMapping("count")
    public Result count(@RequestParam String activityId){
        return activityNumberService.count(Long.valueOf(activityId));
    }

    @GetMapping("byElderId")
    public Result byElderId(@RequestParam String elderId) {
        return ActivityApplicationService.biElderId(elderId);
    }

    /**
     * 根据活动id查询当前活动的老人全部数据
     * @param activityId
     * @return
     */
    @GetMapping("getElder")
    public Result getElder(@RequestParam String activityId){
        return ActivityApplicationService.getElder(Long.valueOf(activityId));
    }


}
