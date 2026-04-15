package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.DeanLoginDto;
import com.zhihu.Dto.DeanSaveDto;
import com.zhihu.po.Dean;
import com.zhihu.vo.DeanLoginVo;

public interface DeanService extends IService<Dean> {
    DeanLoginVo register(DeanSaveDto deanSaveDto);

    DeanLoginVo login(DeanLoginDto loginDto);

    DeanLoginVo selectByName(String name);
}
