package com.zhihu.client;

import com.zhihu.Dto.DeanLoginDto;
import com.zhihu.result.Result;
import com.zhihu.vo.DeanLoginVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("admin-service")
public interface adminDeanClient {

    @PostMapping("/admin/dean/login")
    DeanLoginVo login (@RequestBody DeanLoginDto loginDto);

    @GetMapping("/admin/dean/selectByName")
    DeanLoginVo selectByName(@RequestBody String name);
}
