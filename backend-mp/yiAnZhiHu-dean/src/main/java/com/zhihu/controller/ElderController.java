package com.zhihu.controller;

import com.zhihu.Dto.ElderDto;
import com.zhihu.Dto.ElderLoginDto;
import com.zhihu.Dto.ElderSaveDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.context.BaseContext;
import com.zhihu.po.Elder;
import com.zhihu.po.Health;
import com.zhihu.query.ElderQuery;
import com.zhihu.result.Result;
import com.zhihu.service.ElderService;
import com.zhihu.vo.ElderLoginVo;
import com.zhihu.vo.ElderVo;
import com.zhihu.vo.HealthVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

/**
 * @author BangLin
 * @Date 2025/4/14 19:00
 */
@RestController
@RequestMapping("/elder/")
@RequiredArgsConstructor
@Slf4j
public class ElderController {

    private final ElderService elderService;

    @PostMapping({"login", "loginByUsername"})
    public Result<ElderLoginVo> login(@RequestBody ElderLoginDto elderLoginDto) {
        log.info("老人登录：{}", elderLoginDto);
        ElderLoginVo loginVo = elderService.loginByUsernameAndPwd(elderLoginDto);
        return Result.success(loginVo);
    }

    @PostMapping("register")
    public Result<ElderLoginVo> register(@RequestBody ElderSaveDto elderSaveDto) {
        log.info("老人注册：{}", elderSaveDto);
        ElderLoginVo loginVo = elderService.save(elderSaveDto);
        return Result.success(loginVo);
    }

    @PostMapping("bind")
    public Result bind(@RequestParam("elderId") String elderId) {
        log.info("绑定当前子女和老人: elderId={}", elderId);
        elderService.bindElder(elderId);
        return Result.success();
    }

    @PostMapping("create")
    public Result create(@RequestParam String deanId,
                         @RequestParam String caretakerId,
                         @RequestParam String name,
                         @RequestParam int gender,
                         @RequestParam int age,
                         @RequestParam(required = false) String childrenName,
                         @RequestParam(required = false) String childrenPhone,
                         @RequestParam MultipartFile photo,
                         @RequestParam String childrenId) {
        ElderDto elderDto = new ElderDto();
        elderDto.setAge(age);
        elderDto.setName(name);
        elderDto.setGender(gender);
        elderDto.setChildrenId(childrenId);
        elderDto.setCaretakerId(caretakerId);
        elderDto.setChildrenName(childrenName);
        elderDto.setChildrenPhone(childrenPhone);
        log.info("子女提交入院申请:{}",elderDto);
        elderService.create(elderDto, deanId, photo);
        return Result.success();
    }

    @GetMapping("page")
    public Result<PageDTO<ElderVo>> pageDTOResult(ElderQuery elderQuery) {
        log.info("分页查询申请入院(老人)信息：{}", elderQuery);
        PageDTO<ElderVo> pageDTO = elderService.pageDtoResult(elderQuery);
        return Result.success(pageDTO);
    }

    @PostMapping("pass")
    public Result pass(String elderId) {
        log.info("根据入院申请id同意申请:{}", elderId);
        elderService.pass(Long.valueOf(elderId));
        return Result.success();
    }

    @PostMapping("caretaker")
    public Result caretaker(@RequestParam String elderId, @RequestParam String caretakerId) {
        log.info("为老人{}分配护工{}：",elderId, caretakerId);
        elderService.caretaker(elderId,caretakerId);
        return Result.success();
    }

    @GetMapping("elders")
    public Result<List<ElderVo>> elders() {
        log.info("查询护工{}所负责的老人数据：", BaseContext.getCurrentId());
        List<ElderVo> elderVoList = elderService.elders();
        return Result.success(elderVoList);
    }

    @GetMapping("list")
    public List<Elder> list() {
        log.info("查询所有老人：");

        return elderService.list();
    }
    /**
     * 根据子女Id获取所有老人id
     * @param
     * @return
     */
    @GetMapping("getByChildrenId")
    public Result<List<ElderVo>>getByChildrenId(){
        List<ElderVo> res=elderService.getByChildrenId();
        return Result.success(res);
    }

    /**
     *
     *
     * 查询当前子女是否申请了入住该养老院
     * @param deanId
     * @param childrenId
     * @return
     */
    @GetMapping("isApplication")
    public Result<Integer> isApplication(@RequestParam String deanId, @RequestParam String childrenId) {
        Integer i = elderService.isApplication(deanId, childrenId);
        return Result.success(i);
    }
    /**
     * 根据id查询老人数据
     * @param ElderId
     * @return
     */
    @PostMapping("getElder")
    public Result<List<ElderVo>> getElder(@RequestParam("elderId") List<Long> ElderId){
        List<ElderVo> res=elderService.getElder(ElderId);
        log.info("{}",res);
        return Result.success(res);
    }

    /**
     * 查询正在申请中的老人的信息
     * @return
     */
    @GetMapping("getByElder")
    public Result<List<ElderVo>> getByElder(){
        List<ElderVo> res=elderService.getByElder();
        return Result.success(res);
    }

    /**
     * 获取所有老人信息
     * @return
     */
    @GetMapping("getAllElder")
    public Result<List<ElderVo>> getAllElder(){
        List<ElderVo> res=elderService.getAllElder();
        return Result.success(res);
    }
}
