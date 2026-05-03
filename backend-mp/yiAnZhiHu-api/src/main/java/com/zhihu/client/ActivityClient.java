package com.zhihu.client;

import com.zhihu.result.Result;
import com.zhihu.vo.ActivityDetailVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/14 16:43
 */
@FeignClient("activity-service")
public interface ActivityClient {
    @GetMapping("/activity/detail")
    Result<ActivityDetailVO> detail(@RequestParam String activityId);
}
