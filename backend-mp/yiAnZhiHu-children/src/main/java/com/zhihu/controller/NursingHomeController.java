package com.zhihu.controller;

import com.google.gson.JsonObject;
import com.zhihu.config.AmapConfig;
import com.zhihu.result.Result;
import com.zhihu.service.NursingHomeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;


@Slf4j
@RestController
@RequestMapping("/nursing-homes")
@RequiredArgsConstructor
public class NursingHomeController {

    private final NursingHomeService nursingHomeService;

    @GetMapping("/search")
    public Result intelligentSearch(
            @RequestParam String query,
            @RequestParam double lng, // 参数名必须为 lng
            @RequestParam double lat,
            @RequestParam(defaultValue = "5000") int radius//距离，默认为5000（它只让我调5000）
            ) throws IOException {
        JsonObject jsonObject = nursingHomeService.searchNearbyNursingHomes(query, lng, lat, radius);

        //返回json数据
        return Result.success(jsonObject);


    }
}