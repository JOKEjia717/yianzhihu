package com.zhihu.controller;

import com.zhihu.Dto.HealthDto;
import com.zhihu.result.Result;
import com.zhihu.service.HealthService;
import com.zhihu.vo.HealthIdVo;
import com.zhihu.vo.HealthVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/19 21:10
 */
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/health/")
@RestController
public class HealthController {
    private final HealthService healthService;
    /**
     * 查询老人所有健康数据的id
     * @return
     */
    @GetMapping("getAllHealthId")
    public  Result<List<HealthIdVo>>getAllHealthId(){
        List<HealthIdVo> res=healthService.getAllHealthId();
        return Result.success(res);
    }
    @GetMapping("getHealthByNumber")
    public Result<HealthVo> getHealthByNumber(@RequestParam String elderId, @RequestParam String number){
        HealthVo res=healthService.geHealthByNumner(elderId,number);
        return Result.success(res);
    }

    /**
     * 护工添加健康信息
     */
    @PostMapping("addHealthInfo")
    public Result postHealth(@RequestBody HealthDto healthDto){
        healthService.addHealthInfo(healthDto);
        return Result.success();
    }

    @GetMapping("getHealthIds")
    public Result<HealthIdVo> getHealthIds(@RequestParam String elderId) {
        log.info("{}", elderId);
        HealthIdVo healthIdVo = healthService.getHealthIds(elderId);
        return Result.success(healthIdVo);
    }
}
