package com.zhihu.controller;

import com.zhihu.Dto.AdminLoginDto;
import com.zhihu.Dto.DeanSaveDto;
import com.zhihu.context.BaseContext;
import com.zhihu.result.Result;
import com.zhihu.service.AdminService;
import com.zhihu.vo.AdminLoginVo;
import com.zhihu.vo.DeanLoginVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/admin/")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    /**
     * 管理员上线
     * @param adminLoginDto
     * @return
     */
    @PostMapping("login")
    public Result<AdminLoginVo> login (@RequestBody AdminLoginDto adminLoginDto) {
        log.info("管理员上线：{}",adminLoginDto);
        AdminLoginVo adminLoginVo = adminService.login(adminLoginDto);
        return Result.success(adminLoginVo);
    }


}
