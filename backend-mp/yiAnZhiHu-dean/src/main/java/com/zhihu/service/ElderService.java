package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.ApplicationDto;
import com.zhihu.Dto.ElderDto;
import com.zhihu.Dto.ElderLoginDto;
import com.zhihu.Dto.ElderSaveDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.po.Application;
import com.zhihu.po.Elder;
import com.zhihu.query.ElderQuery;
import com.zhihu.vo.ApplicationVo;
import com.zhihu.vo.ElderContactChildVo;
import com.zhihu.vo.ElderLoginVo;
import com.zhihu.vo.ElderVo;
import com.zhihu.vo.HealthVo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author BangLin
 * @Date 2025/4/14 19:02
 */
public interface ElderService extends IService<Elder> {
    ElderLoginVo loginByUsernameAndPwd(ElderLoginDto elderLoginDto);

    ElderLoginVo save(ElderSaveDto elderSaveDto);

    void create(ElderDto elderDto, String deanId, MultipartFile photo);

    PageDTO<ElderVo> pageDtoResult(ElderQuery elderQuery);

    void pass(Long elderId);

    void caretaker(String elderId, String caretakerId);

    void bindElder(String elderId);

    List<ElderVo> elders();
    List<ElderVo> getByChildrenId();
    ElderContactChildVo contactChild();

    Integer isApplication(String deanId, String childrenId);
    List<ElderVo> getElder(List<Long> ElderId);

    List<ElderVo> getByElder();

    List<ElderVo> getAllElder();
}
