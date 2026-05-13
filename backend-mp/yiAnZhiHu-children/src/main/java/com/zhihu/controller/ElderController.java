package com.zhihu.controller;

import com.zhihu.Dto.ElderDto;
import com.zhihu.client.DeanClient;
import com.zhihu.client.caretakerClient;
import com.zhihu.context.BaseContext;
import com.zhihu.result.Result;
import com.zhihu.vo.HealthVo;
import com.zhihu.vo.ElderVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author BangLin
 * @Date 2025/4/14 19:19
 */
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/children/elder/")
public class ElderController {

    private final DeanClient deanClient;

    private final com.zhihu.client.caretakerClient caretakerClient;
    @PostMapping("create")
    public Result create(@RequestParam String deanId,@RequestBody ElderDto elderDto) {
        log.info("子女提交入院申请:{}",elderDto);
        elderDto.setChildrenId(BaseContext.getCurrentId());
        deanClient.create(elderDto, deanId);
        return Result.success();
    }

    @PostMapping("bind")
    public Result bind(@RequestParam String elderId) {
        log.info("子女绑定老人: elderId={}", elderId);
        deanClient.bindElder(elderId);
        return Result.success();
    }

    @GetMapping("bound")
    public Result<List<ElderVo>> bound() {
        log.info("查询当前子女绑定的老人列表");
        return deanClient.getByChildrenId();
    }
    /**
     * 前端传老人id在子女模块查询老人健康信息
     */
    @GetMapping("getHealth/{elderId}")
    public Result getElderHealth(@PathVariable String elderId){

        HealthVo healthById = caretakerClient.getHealthById(elderId);
        return Result.success(healthById);
    }
}
