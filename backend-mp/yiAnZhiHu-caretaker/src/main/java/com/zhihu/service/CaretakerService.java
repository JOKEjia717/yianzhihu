package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.CaretakerDto;
import com.zhihu.Dto.CaretakerLoginDto;
import com.zhihu.Dto.CaretakerUpDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.po.Caretaker;
import com.zhihu.query.CaretakerQuery;
import com.zhihu.result.Result;
import com.zhihu.vo.CaretakerLoginVo;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author BangLin
 * @Date 2025/4/14 16:04
 */
public interface CaretakerService extends IService<Caretaker> {
    Result register(CaretakerUpDto caretakerUpDto, Long deanId);

    CaretakerLoginVo login(CaretakerLoginDto caretakerLoginDto);

    CaretakerLoginVo iupdate(MultipartFile avatar, String phone, String specialty);

    PageDTO<CaretakerLoginVo> ipage(CaretakerQuery caretakerQuery);

    void enable(String caretakerId, int isEnable);


}
