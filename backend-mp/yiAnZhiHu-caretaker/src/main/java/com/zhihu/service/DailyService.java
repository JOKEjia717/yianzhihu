package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.Dto.PageDTO;
import com.zhihu.po.Daily;
import com.zhihu.result.Result;
import com.zhihu.vo.DailyVo;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/4/19 18:54
 */
public interface DailyService extends IService<Daily> {
    PageDTO<DailyVo> getHeallthByDate(String pageNo, String pageSize, String beginDate, String endDate);
    DailyVo day(LocalDate today, String elderId);

    void insert();

    void iupdate(MultipartFile breakfastPhotos,
                 MultipartFile lunchPhotos,
                 MultipartFile dinnerPhotos,
                 MultipartFile clothingPhotos,
                 MultipartFile lodgingPhotos,
                 String dailyId);

    Result<List<DailyVo>> getElders(Long aLong);
}
