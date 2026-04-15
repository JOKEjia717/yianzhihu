package com.zhihu.controller;

import com.zhihu.Dto.DeanLoginDto;
import com.zhihu.result.Result;
import com.zhihu.vo.DeanLoginVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import com.zhihu.client.adminDeanClient;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/dean/")
public class DeanController {

    private final adminDeanClient adminDeanClient;

    /**
     * 院长登陆
     * @param deanLoginDto
     * @return
     */
    @PostMapping("login")
    public Result<DeanLoginVo> login (@RequestBody DeanLoginDto deanLoginDto) {
        log.info("院长登陆：{}", deanLoginDto);
        DeanLoginVo deanLoginVo = adminDeanClient.login(deanLoginDto);
        return Result.success(deanLoginVo);
    }



}
