package com.zhihu.controller;

import com.zhihu.Dto.ChildrenInfoUpdateDTO;
import com.zhihu.Dto.ChildrenLoginDto;
import com.zhihu.Dto.ChildrenSaveDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.client.ActivityClient;
import com.zhihu.client.caretakerClient;
import com.zhihu.context.BaseContext;
import com.zhihu.query.NursingHomeQuery;
import com.zhihu.result.Result;
import com.zhihu.service.ChildrenService;
import com.zhihu.vo.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * @author : YiMing
 * @description :用户接口
 * @createDate : 2025/3/3 13:47
 */
@Slf4j
@RestController
@RequestMapping("/children/")
@RequiredArgsConstructor
public class ChildrenController {

    private final ChildrenService childrenService;
    private final ActivityClient activityClient;
    private final caretakerClient caretakerClient;
    /**
     * 账号密码登录
     * @param childrenloginDto
     * @return
     */
    @PostMapping("loginByUsername")
    public Result<ChildrenLoginVo> loginByUsernameAndPwd(@RequestBody ChildrenLoginDto childrenloginDto){
        //throw new LoginFailedException();
        log.info("用户登录：{}", childrenloginDto);
        ChildrenLoginVo loginVo= childrenService.loginByUsernameAndPwd(childrenloginDto);
        return Result.success(loginVo);
    }

    /**
     * 用户注册
     * @return
     */
    @PostMapping("register")
    public Result<ChildrenLoginVo>register(@RequestBody ChildrenSaveDto childrenSaveDto){
        ChildrenLoginVo loginVo= childrenService.save(childrenSaveDto);
        return Result.success(loginVo);
    }



//    @GetMapping("role")
//    public Result<LoginVo> role (@RequestParam Long userId) {
//        LoginVo loginVo = userService.role(userId);
//        return Result.success(loginVo);
//    }

    /**
     * 更新头像
     * @param image
     */
    @PostMapping("avatar")
    public Result avatar(@RequestParam MultipartFile image) {
        childrenService.avatar(image);
        return Result.success();
    }

    /**
     * 获取所有已上线养老院数据
     * @return
     */
    @GetMapping("nursingHomeList")
    public Result<PageDTO<NursingHomePageVo>> nursingHomeList(@RequestParam String pageNo, @RequestParam String pageSize, @RequestParam String name, @RequestParam String address) {
        NursingHomeQuery nursingHomeQuery = new NursingHomeQuery();
        nursingHomeQuery.setPageNo(Long.valueOf(pageNo));
        nursingHomeQuery.setPageSize(Long.valueOf(pageSize));
        nursingHomeQuery.setName(name);
        nursingHomeQuery.setAddress(address);
        log.info("分页查询：{}", nursingHomeQuery);
        PageDTO<NursingHomePageVo> nursingHomeVoList = childrenService.nursingHomeList(nursingHomeQuery);
        return Result.success(nursingHomeVoList);
    }


    /**
     * 子女同意活动id
     * @param activityId 活动id
     * @return
     */
    //TODO 待远程调用
    @PostMapping("/consentToActivity")
    public Result consentToActivity(String activityId){
        childrenService.consentToActivity(activityId);
        return Result.success();
    }
    /**
     * 获取活动申请信息
     * @param activityId
     * @return
     */
    @GetMapping("/getActivity/{activityId}")
    public Result<ActivityDetailVO> getActivity(@PathVariable String activityId){
        Result<ActivityDetailVO> result = activityClient.detail(activityId);
        return result;
    }


    /**
     * 修改子女消息
     */
    @PostMapping("update/info")
    public Result updateChildren(@RequestBody ChildrenInfoUpdateDTO childrenInfoUpdateDTO){
        childrenService.updateChildrenInfo(childrenInfoUpdateDTO);
        return Result.success();
    }
    @GetMapping("money")
    public Integer getMoney(){
        Integer res=childrenService.getMoney();
        return res;
    }
    @PostMapping("newmoney")
    void money(@RequestBody Integer newMoney){
        childrenService.newMoney(newMoney);
    }
}
