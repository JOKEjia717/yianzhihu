package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.HealthDto;
import com.zhihu.po.Health;
import com.zhihu.vo.HealthIdVo;
import com.zhihu.vo.HealthVo;

import java.util.List;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/20 15:50
 */
public interface HealthService extends IService<Health> {
    List<HealthIdVo> getAllHealthId();

    HealthVo geHealthByNumner(String elderId, String number);

    void addHealthInfo(HealthDto healthDto);

    HealthIdVo getHealthIds(String elderId);
}
