package com.zhihu.client;

import com.zhihu.Dto.ElderDto;
import com.zhihu.Dto.NursingHomeDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.po.Elder;
import com.zhihu.result.Result;
import com.zhihu.vo.ElderVo;
import com.zhihu.vo.NursingHomePageVo;
import com.zhihu.vo.NursingHomeVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * @author BangLin
 * @Date 2025/4/13 14:34
 */
@FeignClient("dean-service")
public interface DeanClient {

    @PostMapping("/home/create")
    void createNursingHome(@RequestBody NursingHomeDto nursingHomeDto);

    @GetMapping("/home/list")
    Result<PageDTO<NursingHomePageVo>> nursingHomeList (@RequestParam String pageNo, @RequestParam String pageSize, @RequestParam String name, @RequestParam String address);

    /*@GetMapping("/home/selectById")
    NursingHomeVo nursingHomeVo(@RequestParam Long nursingHomeId);*/

    @PostMapping("/elder/create")
    void create(@RequestBody ElderDto elderDto, @RequestParam String deanId);

    @GetMapping("/elder/list")
    List<Elder> list();

    @GetMapping("/elder/getByChildrenId")
    Result<List<ElderVo>> getByChildrenId();

    /**
     * 获取养老院唯一标识
     * @param
     */
    @GetMapping("/home/nursingHome")
    Result<NursingHomeVo> GetNursingHomeId();

    @PostMapping("/elder/getElder")
    Result<List<ElderVo>> getElder(@RequestParam("elderId") List<Long> ElderId);
    /**
     * 远程获取老人id
     */
//    @GetMapping("/elder/getElderId")
//    Long getId(Long childrenId);
}
