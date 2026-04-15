package com.zhihu.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.ActivityDTO;
import com.zhihu.Dto.ActivityFormDto;
import com.zhihu.client.DeanClient;
import com.zhihu.client.caretakerClient;
import com.zhihu.context.BaseContext;
import com.zhihu.exceptions.UpLoadFailedException;
import com.zhihu.mapper.ActivityMapper;
import com.zhihu.po.Activity;
import com.zhihu.po.Caretaker;
import com.zhihu.result.Result;
import com.zhihu.service.IActivityService;
import com.zhihu.util.AliOssUtil;
import com.zhihu.vo.ActivityDetailVO;
import com.zhihu.vo.NursingHomeVo;
import com.zhihu.vo.PageResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * @description: 活动接口
 * @author: Campione
 * @date 2025/4/14
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityServiceImpl extends ServiceImpl<ActivityMapper, Activity> implements IActivityService {
    private final AliOssUtil aliOssUtil;
    @Override
    public Result pulish(ActivityFormDto activityFormDto) {
        //将里面的照片数据上传至阿里OSS
        MultipartFile image = activityFormDto.getActivityData();
        String filePath;
        //原始文件名
        try {
            String originalFilename = image.getOriginalFilename();
            String extention = originalFilename.substring(originalFilename.lastIndexOf("."));
            String objectname = UUID.randomUUID().toString() + extention;
            filePath = aliOssUtil.upload(image.getBytes(), objectname);
        } catch (Exception e) {
            log.error("文件上传失败：", e);
            throw new UpLoadFailedException("文件上传失败！");
        }
        Activity activity = new Activity();
        BeanUtils.copyProperties(activityFormDto,activity);
        activity.setActivityData(filePath);
        activity.setActivityId(Long.valueOf(activityFormDto.getActivityId()));
        activity.setNursingHomeId(Long.valueOf(activityFormDto.getNursingHomeId()));
        boolean success = save(activity);
        if(!success){
            return Result.error("新增失败");
        }else {
            return Result.success();
        }
    }

    @Override
    public Result<ActivityDetailVO> detail(Long Id) {
        Activity activity = lambdaQuery().eq(Activity::getActivityId, Id).one();
        ActivityDetailVO activityDetailVO = new ActivityDetailVO();
        BeanUtils.copyProperties(activity,activityDetailVO);
        activityDetailVO.setActivityId(String.valueOf(activity.getActivityId()));
        activityDetailVO.setNursingHomeId(String.valueOf(activity.getNursingHomeId()));
        return Result.success(activityDetailVO);
    }
    private final ActivityMapper activityMapper;

    private final DeanClient deanClient;
    @Override
    public Result<PageResult<ActivityDetailVO>> pageDetail(String page, String pageSize, String deanId) {
        try {
            //根据院长id去查询养老院的唯一id然后再找当前养老院下的活动
            String currentId = BaseContext.getCurrentId();
            if (currentId == null) {
                return Result.error("未查找到院长id");
            }
            if (deanId.isEmpty() && deanId.isBlank()){
                BaseContext.setCurrentId(currentId);
            }else {
                BaseContext.setCurrentId(deanId);
            }

            String nursingHomeId = deanClient.GetNursingHomeId().getData().getNursingHomeId();

            // 查询参数是否合法
            int current = Integer.parseInt(page);
            int size = Integer.parseInt(pageSize);
            if (current < 1 || size < 1) {
                return Result.error("分页参数不合法");
            }
            // 构建 MP 分页对象
            Page<Activity> pageInfo = new Page<>(current, size);
            // 构建查询条件-->默认按日期倒序
            LambdaQueryWrapper<Activity> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Activity::getNursingHomeId,nursingHomeId).orderByDesc(Activity::getStartTime);
            // 执行分页查询
            Page<Activity> activityPage = activityMapper.selectPage(pageInfo, wrapper);
            // 转换 VO 对象
            List<ActivityDetailVO> voList = activityPage.getRecords().stream()
                    .map(activity -> {
                        ActivityDetailVO vo = new ActivityDetailVO();
                        BeanUtils.copyProperties(activity, vo);
                        vo.setActivityId(activity.getActivityId().toString());
                        vo.setNursingHomeId(activity.getNursingHomeId().toString());
                        return vo;
                    }).collect(Collectors.toList());
            // 封装自定义分页结果
            PageResult<ActivityDetailVO> result = new PageResult<>();
            result.setTotal(activityPage.getTotal());
            result.setPages( activityPage.getPages());
            result.setCurrent(activityPage.getCurrent());
            result.setSize(activityPage.getSize());
            result.setRecords(voList);
            return Result.success(result);
        } catch (NumberFormatException e) {
            log.error("分页参数类型错误: page={}, pageSize={}", page, pageSize, e);
            return Result.error("页码参数必须是数字");
        } catch (Exception e) {
            log.error("分页查询异常", e);
            return Result.error("系统繁忙，请稍后重试");
        }
    }

}
