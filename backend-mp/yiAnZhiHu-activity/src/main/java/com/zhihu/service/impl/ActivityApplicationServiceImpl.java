package com.zhihu.service.impl;




import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.ActivityApplicationDTO;
import com.zhihu.Dto.ActivityApproveDTO;
import com.zhihu.client.DeanClient;
import com.zhihu.mapper.ActivityApplicationMapper;
import com.zhihu.po.Activity;
import com.zhihu.po.ActivityApplication;
import com.zhihu.po.ActivityNumber;
import com.zhihu.result.Result;
import com.zhihu.vo.ActivityApplicationVo;
import com.zhihu.service.IActivityApplicationService;
import com.zhihu.service.IActivityNumberService;
import com.zhihu.vo.ActivityChildrenVO;
import lombok.RequiredArgsConstructor;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static com.zhihu.constants.RedisConstants.ACTIVITY_APPROVE_CACHE_PREFIX;
import static com.zhihu.constants.RedisConstants.MAX_LOCK_WAIT_SECONDS;

/**
 * <p>
 * 活动申请表 服务实现类
 * </p>
 *
 * @author Campione
 * @since 2025-04-14
 */
@RequiredArgsConstructor
@Service
public class ActivityApplicationServiceImpl extends ServiceImpl<ActivityApplicationMapper, ActivityApplication> implements IActivityApplicationService {

    @Override
    public Result apply(ActivityApplicationDTO activityApplicationDTO) {
        ActivityApplication activityApplication = new ActivityApplication();
        BeanUtils.copyProperties(activityApplicationDTO,activityApplication);
        activityApplication.setIspass(0);
        //String转Long
        activityApplication.setActivityId(Long.valueOf(activityApplicationDTO.getActivityId()));
        activityApplication.setCaretakerId(Long.valueOf(activityApplicationDTO.getCaretakerId()));
        activityApplication.setElderId(Long.valueOf(activityApplicationDTO.getElderId()));
        activityApplication.setChildrenId(Long.valueOf(activityApplicationDTO.getChildrenId()));
        boolean success = save(activityApplication);
        if(!success){
            return Result.error("申请失败");
        }else {
            return Result.success();
        }
    }
    private final ActivityApplicationMapper activityApplicationMapper;
    private final RedissonClient redissonClient;
    @Override
    @Transactional
    public Result approve(ActivityApproveDTO activityApproveDTO) {
        // 生成唯一锁键：活动ID+用户ID
        String lockKey = ACTIVITY_APPROVE_CACHE_PREFIX
                + activityApproveDTO.getActivityId()
                + ":" + activityApproveDTO.getElderId();
        RLock lock = redissonClient.getLock(lockKey);
        try {
            //尝试获取锁
            boolean success = lock.tryLock(MAX_LOCK_WAIT_SECONDS, TimeUnit.SECONDS);
            if (!success) {
                    return Result.error("操作太频繁请售后重试");
            }
            int rows = activityApplicationMapper.updateByCondition(
                    Long.valueOf(activityApproveDTO.getActivityId()),
                    Long.valueOf(activityApproveDTO.getElderId()),
                    activityApproveDTO.getIspass(),
                    0 // 原 ispass=0 的筛选条件
            );
            if(rows>0){
                //执行非阻塞异步
               asyncAddActivityCount(
                       Long.valueOf(activityApproveDTO.getActivityId())
                       ,Long.valueOf(activityApproveDTO.getChildrenId()));
               return Result.success();
            }else {
               return Result.error("更新失败");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return Result.error("审批操作被中断");
        } finally {
            //释放锁
            lock.unlock();
        }

    }

    private final IActivityNumberService activityNumberService;
    @Async("taskExecutor")
    public void asyncAddActivityCount(Long activityId, Long childrenId) {
        try {
            // 新增活动人数表记录的逻辑
            boolean success = activityNumberService.insert(new ActivityNumber(activityId,childrenId));
            if(!success){
                log.error("异步新增活动人数增加失败");
            }
        } catch (Exception e) {
            // 异常处理（如日志记录、补偿机制）
            log.error("异步新增活动人数失败: {}");
        }
    }

    private final ActivityServiceImpl activityService;
    @Override
    public Result<List<ActivityChildrenVO>> children(String childernId) {
        //先获取申请表信息
        List<ActivityApplication> ApplicationList = lambdaQuery()
                .eq(ActivityApplication::getChildrenId, Long.valueOf(childernId))
                .list();
        //取出满足的活动id,查询活动表
        List<Long> activityIdList = ApplicationList.stream()
                .map(ActivityApplication::getActivityId)
                .collect(Collectors.toList());
        List<Activity> Activitylist = activityService.lambdaQuery()
                .in(Activity::getActivityId, activityIdList)
                .list();

        //Map高效转换-->你值得拥有
        Map<Long,Activity> ActivityMap = Activitylist.stream()
                .collect(Collectors
                        .toMap(Activity::getActivityId, activity -> activity));
        //根据id导入到vo中去
        List<ActivityChildrenVO> voList = ApplicationList.stream()
                .map(application -> {
                    Activity activity = ActivityMap.get(application.getActivityId());
                    ActivityChildrenVO vo = new ActivityChildrenVO();
                    vo.setActivityId(application.getActivityId());
                    vo.setElderId(application.getElderId());
                    vo.setIspass(application.getIspass());
                    // 从活动对象填充额外字段
                    if (activity != null) {
                        vo.setName(activity.getName());
                        vo.setStartTime(activity.getStartTime());
                        vo.setEndTime(activity.getEndTime());
                    }
                    return vo;
                })
                .collect(Collectors.toList());
        return Result.success(voList);
    }
    private final DeanClient deanClient;
    @Override
    public Result getElder(Long activityId) {
        List<ActivityApplication> Elderd = lambdaQuery()
                .eq(ActivityApplication::getActivityId,activityId)
                .eq(ActivityApplication::getIspass,1)
                .select(ActivityApplication::getElderId)
                .list();
        List<Long> ElderId = new ArrayList<Long>();
        for (ActivityApplication activityApplication : Elderd) {
            ElderId.add(activityApplication.getElderId());
        }
        //去查询老人数据返回
        return deanClient.getElder(ElderId);
    }

    @Override
    public Result<List<ActivityApplicationVo>> biElderId(String elderId) {
        List<ActivityApplicationVo> activityApplicationVos = new ArrayList<>();
        LambdaQueryWrapper<ActivityApplication> eq = new LambdaQueryWrapper<ActivityApplication>()
                .eq(ActivityApplication::getElderId, Long.parseLong(elderId));
        List<ActivityApplication> activityApplications = activityApplicationMapper.selectList(eq);
        activityApplications.forEach(activityApplication -> {
            ActivityApplicationVo activityApplicationVo = new ActivityApplicationVo();
            activityApplicationVo.setActivityApplicationId(String.valueOf(activityApplication.getActivityApplicationId()));
            activityApplicationVo.setActivityId(String.valueOf(activityApplication.getActivityId()));
            activityApplicationVo.setElderId(String.valueOf(activityApplication.getElderId()));
            activityApplicationVo.setCaretakerId(String.valueOf(activityApplication.getCaretakerId()));
            activityApplicationVo.setChildrenId(String.valueOf(activityApplication.getChildrenId()));
            activityApplicationVo.setIspass(activityApplication.getIspass());
            activityApplicationVos.add(activityApplicationVo);
        });
        return Result.success(activityApplicationVos);
    }

    //TODO 该接口待开发中 根据活动id查询活动申请表中的所有符合条件的老人id
    /*@Override
    public Result getElder(Long activityId) {
        lambdaQuery().eq(ActivityApplication::getActivityId,activityId).list();
        return null;
    }*/
}
