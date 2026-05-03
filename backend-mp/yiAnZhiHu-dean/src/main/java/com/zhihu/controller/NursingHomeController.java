package com.zhihu.controller;

import cn.hutool.core.bean.BeanUtil;
import com.zhihu.Dto.NursingHomeDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.context.BaseContext;
import com.zhihu.po.NursingHome;
import com.zhihu.query.NursingHomeQuery;
import com.zhihu.result.Result;
import com.zhihu.service.NursingHomeService;
import com.zhihu.vo.NursingHomePageVo;
import com.zhihu.vo.NursingHomeVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/home/")
@RequiredArgsConstructor
public class NursingHomeController {

    private final NursingHomeService nursingHomeService;


    /**
     * 创建养老院初始介绍数据
     * @param nursingHomeDto
     * @return
     */
    @PostMapping("create")
    public void createNursingHome(@RequestBody NursingHomeDto nursingHomeDto) {
        log.info("创建养老院初始介绍数据：{}",nursingHomeDto);
        nursingHomeService.createNursingHome(nursingHomeDto);
    }

    /**
     * 更新养老院上线/下线
     * @param isEnable
     * @return
     */
    @PostMapping("enable")
    public Result<Void> enanble (@RequestParam int isEnable) {
        log.info("更新养老院上线/下线：{}", isEnable);
        nursingHomeService.enable(isEnable);
        return Result.success();
    }

    /**
     * 院长获取养老院介绍数据
     * @return
     */
    @GetMapping("nursingHome")
    public Result<NursingHomeVo> nursingHomeVoResult () {
        log.info("获取养老院介绍数据");
        NursingHomeVo nursingHomeVo = nursingHomeService.nursingHome();
        return Result.success(nursingHomeVo);
    }


    /**
     * 子女分页获取所有养老院数据
     * @return
     */
    @GetMapping("list")
    public Result<PageDTO<NursingHomePageVo>> nursingHomeList (@RequestParam String pageNo, @RequestParam String pageSize, @RequestParam String name, @RequestParam String address) {
        NursingHomeQuery nursingHomeQuery = new NursingHomeQuery();
        nursingHomeQuery.setPageNo(Long.valueOf(pageNo));
        nursingHomeQuery.setPageSize(Long.valueOf(pageSize));
        nursingHomeQuery.setName(name);
        nursingHomeQuery.setAddress(address);
        log.info("获取所有养老院数据,{}", nursingHomeQuery);
        return Result.success(nursingHomeService.nursingHomeList(nursingHomeQuery));
    }

    /**
     * 根据nursingHomeId获取养老院详细信息
     * @param nursingHomeId
     * @return
     */
    @GetMapping("selectById")
    public Result<NursingHomeVo> nursingHomeVo(@RequestParam Long nursingHomeId) {
        log.info("根据nursingHomeId获取养老院详细信息: {}", nursingHomeId);
        NursingHome nursingHome = nursingHomeService.getById(nursingHomeId);
        NursingHomeVo nursingHomeVo = new NursingHomeVo();
        BeanUtil.copyProperties(nursingHome,nursingHomeVo);
        return Result.success(nursingHomeVo);
    }
}
