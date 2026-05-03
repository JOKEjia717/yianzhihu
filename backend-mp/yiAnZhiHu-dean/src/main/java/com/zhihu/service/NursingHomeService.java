package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.NursingHomeDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.po.NursingHome;
import com.zhihu.query.NursingHomeQuery;
import com.zhihu.vo.NursingHomePageVo;
import com.zhihu.vo.NursingHomeVo;

import java.util.List;

public interface NursingHomeService extends IService<NursingHome> {
    void createNursingHome(NursingHomeDto nursingHomeDto);

    void enable(int isEnable);

    NursingHomeVo nursingHome();

    PageDTO<NursingHomePageVo> nursingHomeList(NursingHomeQuery nursingHomeQuery);
}
