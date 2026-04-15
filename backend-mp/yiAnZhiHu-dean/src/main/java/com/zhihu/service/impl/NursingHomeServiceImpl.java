package com.zhihu.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.NursingHomeDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.client.adminDeanClient;
import com.zhihu.context.BaseContext;
import com.zhihu.mapper.NursingHomeMapper;
import com.zhihu.po.NursingHome;
import com.zhihu.query.NursingHomeQuery;
import com.zhihu.service.NursingHomeService;
import com.zhihu.vo.DeanLoginVo;
import com.zhihu.vo.NursingHomePageVo;
import com.zhihu.vo.NursingHomeVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NursingHomeServiceImpl extends ServiceImpl<NursingHomeMapper, NursingHome> implements NursingHomeService {

    private final NursingHomeMapper nursingHomeMapper;

    private final adminDeanClient adminDeanClient;

    @Override
    public void createNursingHome(NursingHomeDto nursingHomeDto) {
        NursingHome nursingHome = new NursingHome();
        BeanUtil.copyProperties(nursingHomeDto, nursingHome);
        System.out.println("nursingHome = " + nursingHome);
        nursingHome.setCreatedTime(LocalDateTime.now());
        nursingHomeMapper.insert(nursingHome);
    }

    @Override
    public void enable(int isEnable) {
        LambdaUpdateWrapper<NursingHome> nursingHomeLambdaUpdateWrapper = new LambdaUpdateWrapper<NursingHome>()
                .set(NursingHome::getIsEnable, isEnable)
                .eq(NursingHome::getDeanId, Long.valueOf(BaseContext.getCurrentId()));
        nursingHomeMapper.update(null, nursingHomeLambdaUpdateWrapper);
    }

    @Override
    public NursingHomeVo nursingHome() {
        LambdaQueryWrapper<NursingHome> eq = new LambdaQueryWrapper<NursingHome>()
                .eq(NursingHome::getDeanId, Long.valueOf(BaseContext.getCurrentId()));
        NursingHome nursingHome = nursingHomeMapper.selectOne(eq);
        NursingHomeVo nursingHomeVo = new NursingHomeVo();
        BeanUtil.copyProperties(nursingHome, nursingHomeVo);
        return nursingHomeVo;
    }

    @Override
    public PageDTO<NursingHomePageVo> nursingHomeList(NursingHomeQuery nursingHomeQuery) {
        Map<String, Object> params = new HashMap<>();
        params.put("page", nursingHomeQuery.getPageNo() - 1);
        params.put("size", nursingHomeQuery.getPageSize());
        params.put("name", nursingHomeQuery.getName());
        params.put("address", nursingHomeQuery.getAddress());
        List<NursingHome> lists = nursingHomeMapper.findNursingHomeByPage(params);
        Long count = nursingHomeMapper.findNursingHomeCount();
        PageDTO<NursingHomePageVo> nursingHomeVoPageDTO = new PageDTO<>();
        nursingHomeVoPageDTO.setTotal(count);
        nursingHomeVoPageDTO.setPages((count + nursingHomeQuery.getPageSize() - 1) / nursingHomeQuery.getPageSize());
        if (CollUtil.isNotEmpty(lists)) {
            List<NursingHomePageVo> nursingHomeVoList = new ArrayList<>();
            lists.forEach(list -> {
                NursingHomePageVo nursingHomePageVo = new NursingHomePageVo();
                BeanUtil.copyProperties(list, nursingHomePageVo);
                nursingHomeVoList.add(nursingHomePageVo);
            });
            nursingHomeVoPageDTO.setList(nursingHomeVoList);
        }
        return nursingHomeVoPageDTO;
    }
}
