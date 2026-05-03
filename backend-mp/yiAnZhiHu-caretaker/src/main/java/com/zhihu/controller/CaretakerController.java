package com.zhihu.controller;

import com.zhihu.Dto.CaretakerDto;
import com.zhihu.Dto.CaretakerLoginDto;
import com.zhihu.Dto.CaretakerUpDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.context.BaseContext;
import com.zhihu.query.CaretakerQuery;
import com.zhihu.result.Result;
import com.zhihu.service.CaretakerService;
import com.zhihu.vo.CaretakerLoginVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


/**
 * @author BangLin
 * @Date 2025/4/14 16:01
 */
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/caretaker/")
public class CaretakerController {

    private final CaretakerService caretakerService;

    /**
     * 创建护工账户
     * @param caretakerUpDto
     * @return
     */
    @PostMapping("register")
    public Result register(@ModelAttribute CaretakerUpDto caretakerUpDto) {
        Long deanId = Long.valueOf(BaseContext.getCurrentId());
        log.info("创建护工账户：{}", caretakerUpDto);
        return caretakerService.register(caretakerUpDto,deanId);
    }

    // 护工登录接口
    @PostMapping("login")
    public Result<CaretakerLoginVo> login (@RequestBody CaretakerLoginDto caretakerLoginDto) {
        // 记录护工登录信息日志
        log.info("护工登陆：{}", caretakerLoginDto);
        // 调用服务层登录方法，获取登录结果
        CaretakerLoginVo caretakerLoginVo = caretakerService.login(caretakerLoginDto);
        // 返回登录成功结果
        return Result.success(caretakerLoginVo);
    }

    // 更新护工数据接口
    @PostMapping("update")
    public Result<CaretakerLoginVo> update(@RequestParam(required = false) MultipartFile avatar,
                                           @RequestParam(required = false) String phone,
                                           @RequestParam(required = false) String specialty) {
        // 记录更新护工数据信息日志
        log.info("更新护工数据");
        // 调用服务层更新方法，获取更新后的护工数据
        CaretakerLoginVo caretakerLoginVo = caretakerService.iupdate(avatar, phone ,specialty);
        // 返回更新成功结果
        return Result.success(caretakerLoginVo);
    }

    // 分页查询护工数据接口
    @GetMapping("page")
    public PageDTO<CaretakerLoginVo> loginVoPageDTO(@RequestParam String pageNo,
                                                    @RequestParam String pageSize,
                                                    @RequestParam String name,
                                                    @RequestParam String phone,
                                                    @RequestParam String specialty) {
        // 记录分页查询护工数据日志
        log.info("分页查询护工数据");
        // 构建查询条件对象
        CaretakerQuery caretakerQuery = new CaretakerQuery();
        caretakerQuery.setPageNo(Long.valueOf(pageNo));
        caretakerQuery.setPageSize(Long.valueOf(pageSize));
        caretakerQuery.setName(name);
        caretakerQuery.setPhone(phone);
        caretakerQuery.setSpecialty(specialty);
        // 调用服务层分页查询方法，返回查询结果
        return caretakerService.ipage(caretakerQuery);
    }

    // 更新护工账户状态（上/下线）接口
    @PostMapping("enable")
    public Result enable(@RequestParam String caretakerId, @RequestParam int isEnable) {
        // 记录更新护工账户状态日志
        log.info("更新护工账户上/下线");
        // 调用服务层方法更新护工账户状态
        caretakerService.enable(caretakerId, isEnable);
        // 返回更新成功结果
        return Result.success();
    }


}
