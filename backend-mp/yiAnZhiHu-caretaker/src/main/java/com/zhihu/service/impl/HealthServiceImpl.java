package com.zhihu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.HealthDto;
import com.zhihu.client.DeanClient;
import com.zhihu.context.BaseContext;
import com.zhihu.mapper.HealthMapper;
import com.zhihu.po.Elder;
import com.zhihu.po.Health;
import com.zhihu.result.Result;
import com.zhihu.service.HealthService;
import com.zhihu.vo.ElderVo;
import com.zhihu.vo.HealthIdVo;
import com.zhihu.vo.HealthVo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/20 15:57
 */

@RequiredArgsConstructor
@Service
public class HealthServiceImpl extends ServiceImpl<HealthMapper, Health> implements HealthService {
    private final DeanClient deanClient;
    private final HealthMapper healthMapper;
    @Override
    public List<HealthIdVo>getAllHealthId() {
        System.out.println(BaseContext.getCurrentId());
        Long userId = Long.valueOf(BaseContext.getCurrentId());
        List<HealthIdVo> res=new ArrayList<>();

        //先查elder表的老人id
        Result<List<ElderVo>> byChildrenId = deanClient.getByChildrenId();
        List<ElderVo> data = byChildrenId.getData();
        for(ElderVo elderVo:data){
            String elderId = elderVo.getElderId();
            //根据老人id去查询
            LambdaQueryWrapper<Health>wrapper=new LambdaQueryWrapper<Health>()
                    .eq(Health::getElderId,elderId);
            List<String> list = healthMapper.selectList(wrapper).stream().map(Health -> String.valueOf(Health.getHealthId())).collect(Collectors.toList());
            HealthIdVo healthIdVo=new HealthIdVo();
            healthIdVo.setHealthId(list);
            healthIdVo.setElderId(String.valueOf(elderId));
            res.add(healthIdVo);
        }
        return res;
    }
    /**
     * 根据number查询健康数据
     * @param elderId
     * @param number
     * @return
     */
    @Override
    public HealthVo geHealthByNumner(String elderId, String number) {
        LambdaQueryWrapper<Health> wrapper=new LambdaQueryWrapper<Health>()
                .eq(Health::getElderId,elderId)
                .eq(Health::getNumber,number);
        Health health = healthMapper.selectOne(wrapper);
        HealthVo res=new HealthVo();
        BeanUtils.copyProperties(health,res);
        return res;
    }

    @Override
    public HealthIdVo getHealthIds(String elderId) {
        LambdaQueryWrapper<Health> eq = new LambdaQueryWrapper<Health>()
                .eq(Health::getElderId, Long.parseLong(elderId));
        List<Health> list = this.list(eq);
        List<String> healthId = new ArrayList<>();
        list.forEach(l -> {
            healthId.add(String.valueOf(l.getNumber()));
        });
        HealthIdVo healthIdVo = new HealthIdVo();
        healthIdVo.setHealthId(healthId);
        System.out.println("healthIdVo = " + healthIdVo);
        return healthIdVo;
    }

    /**
     * 护工添加健康信息
     * @param healthDto
     * @return
     */
    @Override
    public void addHealthInfo(HealthDto healthDto) {
        Health health = new Health();
        BeanUtils.copyProperties(healthDto,health);
        health.setAssessDate(LocalDateTime.now());
        health.setElderId(Long.parseLong(healthDto.getElderId()));
        this.save(health);

    }


}
