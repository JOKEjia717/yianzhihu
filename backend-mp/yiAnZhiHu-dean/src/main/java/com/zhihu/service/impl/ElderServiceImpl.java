package com.zhihu.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mysql.cj.log.Log;
import com.zhihu.Dto.ElderDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.context.BaseContext;
import com.zhihu.exceptions.UpLoadFailedException;
import com.zhihu.mapper.ElderMapper;
import com.zhihu.po.Application;
import com.zhihu.po.Elder;
import com.zhihu.po.Health;
import com.zhihu.query.ElderQuery;
import com.zhihu.result.Result;
import com.zhihu.service.ElderService;
import com.zhihu.util.AliOssUtil;
import com.zhihu.vo.ElderVo;
import com.zhihu.vo.HealthVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * @author BangLin
 * @Date 2025/4/14 19:03
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ElderServiceImpl extends ServiceImpl<ElderMapper, Elder> implements ElderService {

    private final ElderMapper elderMapper;

    private final AliOssUtil aliOssUtil;

    @Override
    public void create(ElderDto elderDto, String deanId, MultipartFile photo) {
        String filePath;
        if (ObjectUtils.isEmpty(photo) || photo.getSize() <= 0) {
            filePath = "";
        }else {
            try {
                //原始文件名
                String originalFilename = photo.getOriginalFilename();
                String extention = originalFilename.substring(originalFilename.lastIndexOf("."));
                String objectname = UUID.randomUUID().toString() + extention;
                filePath = aliOssUtil.upload(photo.getBytes(), objectname);
            } catch (Exception e) {
                throw new UpLoadFailedException("文件上传失败！");

            }
        }

        Elder elder = new Elder();
        BeanUtil.copyProperties(elderDto, elder);
        elder.setApplicationTime(LocalDate.now());
        elder.setDeanId(Long.valueOf(deanId));
        elder.setPhoto(filePath);
        elder.setIsEnable(2);
        this.save(elder);
    }

    @Override
    public PageDTO<ElderVo> pageDtoResult(ElderQuery elderQuery) {
        //构建分页条件
        Page<Elder> page = Page.of(elderQuery.getPageNo(), elderQuery.getPageSize());
        //构建排序条件
        Page<Elder> elderPage = lambdaQuery()
                .like(!elderQuery.getChildrenName().isBlank() && !elderQuery.getChildrenName().isEmpty(), Elder::getChildrenName, elderQuery.getChildrenName())
                .like(!elderQuery.getChildrenPhone().isBlank() && !elderQuery.getChildrenPhone().isEmpty(), Elder::getChildrenPhone, elderQuery.getChildrenPhone())
                .eq(Elder::getIsEnable, 2)
                .eq(Elder::getDeanId, Long.valueOf(BaseContext.getCurrentId()))
                .page(page);
        PageDTO<ElderVo> elderVoPageDTO = new PageDTO<>();
        elderVoPageDTO.setTotal(elderPage.getTotal());
        elderVoPageDTO.setPages(elderPage.getPages());
        List<Elder> records = elderPage.getRecords();
        if (CollUtil.isNotEmpty(records)) {
            List<ElderVo> elderVos = new ArrayList<>();
            records.forEach(record -> {
                ElderVo elderVo = new ElderVo();
                BeanUtil.copyProperties(record, elderVo);
                elderVos.add(elderVo);
            });
            elderVoPageDTO.setList(elderVos);
        }
        return elderVoPageDTO;
    }

    @Override
    public void pass(Long elderId) {
        LambdaUpdateWrapper<Elder> updateWrapper = new LambdaUpdateWrapper<Elder>()
                .set(Elder::getIsEnable, 0)
                .set(Elder::getCreatedTime, LocalDate.now())
                .eq(Elder::getElderId, elderId);
        elderMapper.update(null, updateWrapper);
    }

    @Override
    public void caretaker(String elderId, String caretakerId) {
        LambdaUpdateWrapper<Elder> updateWrapper = new LambdaUpdateWrapper<Elder>()
                .set(Elder::getCaretakerId, caretakerId)
                .eq(Elder::getElderId, elderId);
        elderMapper.update(null, updateWrapper);
    }

    @Override
    public List<ElderVo> elders() {
        LambdaQueryWrapper<Elder> queryWrapper = new LambdaQueryWrapper<Elder>()
                .eq(Elder::getCaretakerId, Long.valueOf(BaseContext.getCurrentId()))
                .eq(Elder::getIsEnable, 0);
        List<Elder> elderList = this.list(queryWrapper);
        List<ElderVo> elderVoList = new ArrayList<>();
        elderList.forEach(elder -> {
            ElderVo elderVo = new ElderVo();
            BeanUtil.copyProperties(elder, elderVo);
            elderVo.setChildrenId(String.valueOf(elder.getChildrenId()));
            elderVoList.add(elderVo);
        });
        return elderVoList;
    }
    @Override
    public List<ElderVo> getByChildrenId() {
        String childrenId = BaseContext.getCurrentId();
        System.out.println(childrenId);
        LambdaUpdateWrapper<Elder> wrapper=new LambdaUpdateWrapper<Elder>()
                .eq(Elder::getChildrenId,Long.parseLong(childrenId));
        List<Elder> elders = elderMapper.selectList(wrapper);
        List<ElderVo> res=new ArrayList<>();
        for (Elder elder:elders){
            ElderVo elderVo=new ElderVo();
            BeanUtils.copyProperties(elder,elderVo);
            elderVo.setElderId(String.valueOf(elder.getElderId()));
            elderVo.setCaretakerId(String.valueOf(elder.getCaretakerId()));
            //查询子女id
            res.add(elderVo);
        }
        return res;
    }

    @Override
    public Integer isApplication(String deanId, String childrenId) {
        LambdaQueryWrapper<Elder> queryWrapper = new LambdaQueryWrapper<Elder>()
                .eq(Elder::getDeanId, Long.parseLong(deanId))
                .eq(Elder::getChildrenId, Long.parseLong(childrenId));
        Elder one = this.getOne(queryWrapper);
        if (ObjectUtils.isEmpty(one)){
            return 0;
        }
        return 1;
    }

    /**
     * 根据老人id查询老人全部信息
     * @param ElderId
     * @return
     */
    @Override
    public List<ElderVo> getElder(List<Long> ElderId) {
        log.info("{}",ElderId);
        List<Elder> elders = lambdaQuery()
                .in(Elder::getElderId, ElderId)
                .list();
        log.info("{}",elders);
        List<ElderVo> elderVo = new ArrayList<>();
        for (Elder elder : elders) {
            ElderVo elderV = new ElderVo();
            BeanUtils.copyProperties(elder, elderV);
            elderVo.add(elderV);
        }
        return elderVo;
    }

    /**
     * 查询正在申请中的老人
     * @return
     */
    @Override
    public List<ElderVo> getByElder() {
        List<Elder> elder = lambdaQuery().eq(Elder::getIsEnable, 2).list();
        ArrayList<ElderVo> elderVo = new ArrayList<>();
        for (Elder elder1 : elder) {
            ElderVo elderV = new ElderVo();
            BeanUtils.copyProperties(elder1, elderV);
            elderVo.add(elderV);
        }
        return elderVo;
    }

    /**
     * 查序已经注册入院的所有老人数据
     * @return ElderVo
     */
    @Override
    public List<ElderVo> getAllElder() {
        List<Elder> AllElder = lambdaQuery().eq(Elder::getIsEnable, 0).list();
        ArrayList<ElderVo> ElderVo = new ArrayList<>();
        for(Elder elder : AllElder){
            ElderVo elderV = new ElderVo();
            BeanUtils.copyProperties(elder, elderV);
            ElderVo.add(elderV);
        }
        return ElderVo;
    }


}
