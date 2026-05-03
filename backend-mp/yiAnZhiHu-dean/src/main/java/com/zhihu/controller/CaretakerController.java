package com.zhihu.controller;

import com.zhihu.Dto.CaretakerDto;
import com.zhihu.Dto.CaretakerUpDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.context.BaseContext;
import com.zhihu.result.Result;
import com.zhihu.vo.CaretakerLoginVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import com.zhihu.client.caretakerClient;

/**
 * @author BangLin
 * @Date 2025/4/14 20:54
 */
@RestController
@RequestMapping("/dean/caretaker/")
@RequiredArgsConstructor
@Slf4j
public class CaretakerController {

    private final caretakerClient caretakerClient;

//    @PostMapping("register")
//    public Result<CaretakerLoginVo> register(@ModelAttribute CaretakerUpDto caretakerUpDto) {
//        log.info("创建护工账户：{}", caretakerUpDto);
//        CaretakerLoginVo caretakerLoginVo = caretakerClient.register(caretakerUpDto, Long.valueOf(BaseContext.getCurrentId()));
//        return Result.success();
//    }

    @GetMapping("page")
    public Result<PageDTO<CaretakerLoginVo>> loginVoPageDTO(@RequestParam String pageNo,
                                                    @RequestParam String pageSize,
                                                    @RequestParam String name,
                                                    @RequestParam String phone,
                                                    @RequestParam String specialty) {
        PageDTO<CaretakerLoginVo> caretakerLoginVoPageDTO = caretakerClient.loginVoPageDTO(pageNo, pageSize, name, phone, specialty);
        return Result.success(caretakerLoginVoPageDTO);
    }


}
