package com.zhihu.controller;

import com.zhihu.Dto.DeanLoginDto;
import com.zhihu.Dto.DeanSaveDto;
import com.zhihu.anno.RoleCheck;
import com.zhihu.context.BaseContext;
import com.zhihu.exceptions.RoleException;
import com.zhihu.result.Result;
import com.zhihu.service.DeanService;
import com.zhihu.vo.DeanLoginVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import static com.zhihu.constants.JWTConstants.ADMIN_SecretKey;
import static com.zhihu.constants.RoleConstants.ADMIN;

@Slf4j
@RestController
@RequestMapping("/admin/dean/")
@RequiredArgsConstructor
//@RoleCheck(role = ADMIN)
public class DeanController {

    private final DeanService deanService;

    /**
     * 管理员创建院长账户
     * @param deanSaveDto
     * @return
     */
    @PostMapping("register")
    @RoleCheck(role = ADMIN)
    public Result<DeanLoginVo> register (@RequestBody DeanSaveDto deanSaveDto) {
//        String role = BaseContext.getRole();
//        if (!role.equals(ADMIN_SecretKey)) {
//            throw new RoleException("当前用户无足够权限！");
//        }
        String currentId = BaseContext.getCurrentId();
        log.info("管理员:{} 创建院长账户：{}",currentId,deanSaveDto);
        DeanLoginVo deanLoginVo = deanService.register(deanSaveDto);
        return Result.success(deanLoginVo);
    }

    /**
     * 院长登陆
     * @param loginDto
     * @return
     */
    @PostMapping("login")
    public Result<DeanLoginVo> login (@RequestBody DeanLoginDto loginDto) {
        System.out.println(BaseContext.getCurrentId());
        log.info("院长登陆：{}", loginDto);
        DeanLoginVo deanLoginVo = deanService.login(loginDto);
        return Result.success(deanLoginVo);
    }

    @GetMapping("selectByName")
    public DeanLoginVo selectByName(@RequestBody String name) {
        log.info("根据院长名字查询院长数据：{}", name);
        DeanLoginVo deanLoginVo = deanService.selectByName(name);
        return deanLoginVo;
    }
}
