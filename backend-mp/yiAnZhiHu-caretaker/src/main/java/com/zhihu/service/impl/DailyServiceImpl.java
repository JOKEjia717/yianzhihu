package com.zhihu.service.impl;

import cn.hutool.core.bean.BeanUtil;

import cn.hutool.core.collection.CollUtil;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.DailyDto;
import com.zhihu.client.DeanClient;
import com.zhihu.exceptions.UpLoadFailedException;
import com.zhihu.Dto.PageDTO;
import com.zhihu.context.BaseContext;
import com.zhihu.exceptions.BaseException;
import com.zhihu.mapper.DailyMapper;
import com.zhihu.po.Daily;
import com.zhihu.po.Elder;
import com.zhihu.result.Result;
import com.zhihu.util.AliOssUtil;
import com.zhihu.service.DailyService;
import com.zhihu.vo.DailyVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.Map;

/**
 * @author BangLin
 * @Date 2025/4/15 15:00
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DailyServiceImpl extends ServiceImpl<DailyMapper, Daily> implements DailyService {

    private final DailyMapper dailyMapper;

    private final DeanClient deanClient;

    private final AliOssUtil aliOssUtil;

    @Override
    public DailyVo day(LocalDate today, String elderId) {
        LambdaQueryWrapper<Daily> queryWrapper = new LambdaQueryWrapper<Daily>()
                .eq(Daily::getDate, today)
                .eq(Daily::getElderId, elderId);
        Daily daily = this.getOne(queryWrapper);
        DailyVo dailyVo = new DailyVo();
        BeanUtil.copyProperties(daily, dailyVo);
        dailyVo.setCaretakerId(String.valueOf(daily.getCaretakerId()));
        dailyVo.setElderId(String.valueOf(daily.getElderId()));
        return dailyVo;
    }


    @Override
    public void insert() {
        List<Elder> lists = deanClient.list();
        for (Elder list : lists) {
            if (list.getCaretakerId() == null) {
                continue;
            }
            Daily daily = new Daily();
            BeanUtil.copyProperties(list, daily);
            daily.setDate(LocalDate.now());
            this.save(daily);
        }

    }

    @Override
    public void iupdate(MultipartFile breakfastPhotos,
                        MultipartFile lunchPhotos,
                        MultipartFile dinnerPhotos,
                        MultipartFile clothingPhotos,
                        MultipartFile lodgingPhotos,
                        String dailyId) {
        DailyDto dailyDto = new DailyDto();
        dailyDto.setBreakfastPhotos(newPath(breakfastPhotos));
        dailyDto.setLunchPhotos(newPath(lunchPhotos));
        dailyDto.setDinnerPhotos(newPath(dinnerPhotos));
        dailyDto.setClothingPhotos(newPath(clothingPhotos));
        dailyDto.setLodgingPhotos(newPath(lodgingPhotos));
        System.out.println(dailyDto);
        // 将 dailyId 转换为 Long 类型
        Long id = Long.parseLong(dailyId);
        // 调用 XML 映射的更新方法
        dailyMapper.updateDailySelective(dailyDto, id);
    }

    /**
     * 根据护工id查询所有老人的信息
     * @param caretakerId
     */
    @Override
    public Result<List<DailyVo>> getElders(Long caretakerId) {
        //拿出所有老人的最新的日期的数据
        List<Daily> dailys = dailyMapper.getdaily(caretakerId);
        List<DailyVo> dailyVo = new ArrayList<>();
        //转换所有的数据
        for (Daily daily : dailys) {
            DailyVo dailyVos = new DailyVo();
            BeanUtils.copyProperties(daily, dailyVos);  // 单个对象复制（源 → 目标）
            dailyVo.add(dailyVos);
        }
        return Result.success(dailyVo);
    }

    private String newPath(MultipartFile Photos) {
        if (ObjectUtils.isEmpty(Photos) || Photos.getSize() <= 0) {
            return null;
        }
        String filePath;
        try {
            //原始文件名
            String originalFilename = Photos.getOriginalFilename();
            String extention = originalFilename.substring(originalFilename.lastIndexOf("."));
            String objectname = UUID.randomUUID().toString() + extention;
            filePath = aliOssUtil.upload(Photos.getBytes(), objectname);
            return filePath;
        } catch (Exception e) {
            throw new UpLoadFailedException("文件上传失败！");

        }
    }

    /**
     * 根据日期查询健康信息
     * @param pageNo
     * @param pageSize
     * @param beginDate
     * @param endDate
     * @return
     */
    @Override
    //TODO 用户查老人
    public PageDTO<DailyVo> getHeallthByDate(String pageNo, String pageSize, String beginDate, String endDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("page", Long.valueOf(pageNo)- 1);
        params.put("size", Long.valueOf(pageSize));
        params.put("beginDate", beginDate);
        params.put("endDate", endDate);
        params.put("children_id", BaseContext.getCurrentId());
        PageDTO<DailyVo> res = new PageDTO<DailyVo>();
        List<Daily>daily;
        try{
            daily =dailyMapper.getHealthByDate(params);
        }catch (Exception e){
            throw new BaseException("数据库操作异常!");
        }
        log.info("日期:{}",daily);

        res.setTotal((long) daily.size());
        res.setPages((Long.valueOf(pageNo)- 1) / daily.size());
        if (CollUtil.isNotEmpty(daily)){
            List<DailyVo> dailyVo = new ArrayList<>();
            for(Daily daily1:daily){
                DailyVo dailyVo2=new DailyVo();
                BeanUtils.copyProperties(daily1,dailyVo2);
                dailyVo.add(dailyVo2);
            }
            res.setList(dailyVo);
        }
        return res;
    }
}