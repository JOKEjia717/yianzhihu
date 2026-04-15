package com.zhihu.controller;

import com.zhihu.Dto.PageDTO;
import com.zhihu.result.Result;
import com.zhihu.service.DailyService;
import com.zhihu.vo.DailyVo;
import com.zhihu.Dto.DailyDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @author BangLin
 * @Date 2025/4/14 17:25
 */
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/daily/")
@RestController
public class DailyController {

    private final DailyService dailyService;

    @PostMapping("day")
    public Result<DailyVo> today(@RequestBody DailyDto dailyDto) {
        if (dailyDto.getDate() == null) {
            dailyDto.setDate(LocalDate.now());
        }
        log.info("查询{}日的老人{}数据", dailyDto.getDate(), dailyDto.getElderId());
        DailyVo dailyVo = dailyService.day(dailyDto.getDate(), dailyDto.getElderId());
        return Result.success(dailyVo);
    }

    /**
     * 每天零点为所有老人生成最初数据
     */
    @Scheduled(cron = "0 0 0 * * * ", zone = "Asia/Shanghai")
    public void insert(){
        try {
            log.info("定时任务开始执行: {}", LocalDateTime.now());
            dailyService.insert();
            log.info("定时任务执行完成");
        } catch (Exception e) {
            log.error("定时任务执行失败", e);
        }
    }

    @PostMapping("update")
    public Result update(@RequestParam(required = false) MultipartFile breakfastPhotos,
                         @RequestParam(required = false) MultipartFile lunchPhotos,
                         @RequestParam(required = false) MultipartFile dinnerPhotos,
                         @RequestParam(required = false) MultipartFile clothingPhotos,
                         @RequestParam(required = false) MultipartFile lodgingPhotos,
                         @RequestParam String dailyId) {
        log.info("更新老人每日数据：");
        dailyService.iupdate(breakfastPhotos, lunchPhotos, dinnerPhotos, clothingPhotos, lodgingPhotos, dailyId);
        return Result.success();
    }
    /**
     * 根据日期获取老人信息
     * @param pageNo
     * @param pageSize
     * @param beginDate
     * @param endDate
     * @return
     */
    @GetMapping("getByDate")
    public Result<PageDTO<DailyVo>> getHealthByDate(@RequestParam String pageNo, @RequestParam String pageSize, String beginDate, String endDate){
        PageDTO<DailyVo> res=dailyService.getHeallthByDate(pageNo,pageSize,beginDate,endDate);
        return Result.success(res);
    }

    @GetMapping("elders")
    public Result<List<DailyVo>> getElders(@RequestParam String caretakerId){
        return dailyService.getElders(Long.valueOf(caretakerId));
    }
}
