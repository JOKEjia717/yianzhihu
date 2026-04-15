package com.zhihu.client;

import com.zhihu.Dto.CaretakerDto;
import com.zhihu.Dto.CaretakerUpDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.vo.CaretakerLoginVo;
import com.zhihu.vo.DailyVo;
import com.zhihu.vo.HealthVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

/**
 * @author BangLin
 * @Date 2025/4/14 20:58
 */
@FeignClient("caretaker-service")
public interface caretakerClient {

//    @PostMapping("/caretaker/register")
//    CaretakerLoginVo register(@ModelAttribute CaretakerUpDto caretakerUpDto, @RequestParam Long deanId);

    @GetMapping("/caretaker/page")
    PageDTO<CaretakerLoginVo> loginVoPageDTO(@RequestParam String pageNo,
                                                    @RequestParam String pageSize,
                                                    @RequestParam String name,
                                                    @RequestParam String phone,
                                                    @RequestParam String specialty);
//    /**
//     * 子女跨服务查询老人健康信息
//     */
//    @GetMapping("/daily/getByDate")
//    PageDTO<DailyVo> getHealthByDay(@RequestParam String pageNo, @RequestParam String pageSize, String beginDate, String endDate);

    /**
     * 跨服务根据老人id查询健康数据信息
     */
    @GetMapping("health/select/{elderId}")
    HealthVo getHealthById(@PathVariable("elderId") String elderId);
}
