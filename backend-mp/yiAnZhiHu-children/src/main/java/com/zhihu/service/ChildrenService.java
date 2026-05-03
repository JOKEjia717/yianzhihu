package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.ChildrenInfoUpdateDTO;
import com.zhihu.Dto.ChildrenLoginDto;
import com.zhihu.Dto.ChildrenSaveDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.po.Children;
import com.zhihu.query.NursingHomeQuery;
import com.zhihu.result.Result;
import com.zhihu.vo.ChildrenLoginVo;

import com.zhihu.vo.NursingHomePageVo;
import com.zhihu.vo.NursingHomeVo;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/3/3 14:21
 */
public interface ChildrenService extends IService<Children> {
    ChildrenLoginVo loginByUsernameAndPwd(ChildrenLoginDto userloginDto);

    ChildrenLoginVo save(ChildrenSaveDto childrenSaveDto);

    void avatar(MultipartFile image);

    PageDTO<NursingHomePageVo> nursingHomeList(NursingHomeQuery nursingHomeQuery);

    //NursingHomeVo selectByNursingHomeId(Long nursingHomeId);

    void consentToActivity(String activityId);

    void money(Integer newMoney);

    void updateChildrenInfo(ChildrenInfoUpdateDTO childrenInfoUpdateDTO);

    Integer getMoney();

    void newMoney(Integer newMoney);


//    LoginVo role(Long userId);
}
