package com.zhihu.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.CaretakerDto;
import com.zhihu.Dto.CaretakerLoginDto;
import com.zhihu.Dto.CaretakerUpDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.constants.RedisConstants;
import com.zhihu.context.BaseContext;
import com.zhihu.exceptions.DataBaseException;
import com.zhihu.exceptions.LoginFailedException;
import com.zhihu.exceptions.UpLoadFailedException;
import com.zhihu.mapper.CaretakerMapper;
import com.zhihu.po.Caretaker;
import com.zhihu.query.CaretakerQuery;
import com.zhihu.result.Result;
import com.zhihu.service.CaretakerService;
import com.zhihu.util.AliOssUtil;
import com.zhihu.util.TokenUtils;
import com.zhihu.vo.CaretakerLoginVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

import static com.zhihu.constants.JWTConstants.*;

/**
 * @author BangLin
 * @Date 2025/4/14 16:05
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CaretakerServiceImpl extends ServiceImpl<CaretakerMapper, Caretaker> implements CaretakerService {

    private final StringRedisTemplate stringRedisTemplate;

    private final CaretakerMapper caretakerMapper;

    private  static final DefaultRedisScript<Long> USER_TOKEN_CACHE;
    static {
        //做初始化
        USER_TOKEN_CACHE = new DefaultRedisScript<>();
        //指定一个文件资源的地址脚本
        USER_TOKEN_CACHE.setLocation(new ClassPathResource("token.lua"));  //设置脚本的位置
        //配置一个返回值的类型
        USER_TOKEN_CACHE.setResultType(Long.class);
    }
    private final AliOssUtil aliOssUtil;
    /**
     * 注册 caretaker 用户并返回登录信息
     *
     * @param caretakerUpDto 包含 caretaker 用户信息的 DTO 对象
     * @param deanId         院长 ID
     * @return CaretakerLoginVo 对象，包含登录所需的信息
     * @throws DataBaseException 如果账号已存在，则抛出此异常
     */
    @Override
    public Result register(CaretakerUpDto caretakerUpDto, Long deanId) {
        //将里面的照片数据上传至阿里OSS
        MultipartFile image = caretakerUpDto.getAvatar();
        String filePath;
        //原始文件名
        try {
            String originalFilename = image.getOriginalFilename();
            String extention = originalFilename.substring(originalFilename.lastIndexOf("."));
            String objectname = UUID.randomUUID().toString() + extention;
            filePath = aliOssUtil.upload(image.getBytes(), objectname);
        } catch (Exception e) {
            log.error("文件上传失败：", e);
            throw new UpLoadFailedException("文件上传失败！");
        }
        Caretaker caretaker = new Caretaker();
        BeanUtil.copyProperties(caretakerUpDto, caretaker);
        caretaker.setAvatar(filePath);
        caretaker.setDeanId(deanId);
        caretaker.setCreatedTime(LocalDateTime.now());
        try{
            save(caretaker);
        }catch (Exception e){
            throw new DataBaseException("该账号已存在");
        }
        CaretakerLoginVo caretakerLoginVo = new CaretakerLoginVo();
        TokenUtils.createAndStoreToken(caretaker,
                Caretaker::getCaretakerId,
                caretakerLoginVo,
                new TokenUtils.TokenConfig(CARETAKER_SecretKey,
                        ACCESS_TOKEN_TIME,
                        REFRESH_TOKEN_TIME,
                        RedisConstants.CARETAKER_LOGIN_CACHE,
                        CARETAKER_ID,
                        caretakerUpDto.getAccount()),
                stringRedisTemplate,
                USER_TOKEN_CACHE);
        BeanUtils.copyProperties(caretaker,caretakerLoginVo);
        caretakerLoginVo.setDeanId(String.valueOf(caretaker.getDeanId()));
        caretakerLoginVo.setCaretakerId(String.valueOf(caretaker.getCaretakerId()));
        return Result.success();
    }

    /**
     * 登录 caretaker 用户并返回登录信息
     *
     * @param caretakerLoginDto 包含登录信息的 DTO 对象
     * @return CaretakerLoginVo 对象，包含登录所需的信息
     * @throws LoginFailedException 如果登录失败，则抛出此异常
     */
    @Override
    public CaretakerLoginVo login(CaretakerLoginDto caretakerLoginDto) {
        LambdaQueryWrapper<Caretaker> wrapper = new LambdaQueryWrapper<Caretaker>()
                .eq(Caretaker::getAccount, caretakerLoginDto.getAccount())
                .eq(Caretaker::getPassword, caretakerLoginDto.getPassword());
        Caretaker caretaker = caretakerMapper.selectOne(wrapper);
        //账户不存在或者已经注销
        if(caretaker == null) {
            throw new LoginFailedException("请检查账户名和密码!");
        }
        Set<String> keys = stringRedisTemplate.keys(RedisConstants.CARETAKER_LOGIN_CACHE +caretakerLoginDto.getAccount() + "*");
        if (keys != null) {
            stringRedisTemplate.delete(keys);
        }
        CaretakerLoginVo caretakerLoginVo = new CaretakerLoginVo();
        TokenUtils.createAndStoreToken(caretaker,
                Caretaker::getCaretakerId,
                caretakerLoginVo,
                new TokenUtils.TokenConfig(CARETAKER_SecretKey,
                        ACCESS_TOKEN_TIME,
                        REFRESH_TOKEN_TIME,
                        RedisConstants.CARETAKER_LOGIN_CACHE,
                        CARETAKER_ID,
                        caretakerLoginDto.getAccount()),
                stringRedisTemplate,
                USER_TOKEN_CACHE);
        BeanUtils.copyProperties(caretaker,caretakerLoginVo);
        caretakerLoginVo.setCaretakerId(String.valueOf(caretaker.getCaretakerId()));
        caretakerLoginVo.setDeanId(String.valueOf(caretaker.getDeanId()));
        return caretakerLoginVo;
    }

    /**
     * 更新 caretaker 用户信息
     *
     * @param  specialty DTO 对象
     * @return CaretakerLoginVo 对象，包含更新后的登录信息
     */
    @Override
    public CaretakerLoginVo iupdate(MultipartFile avatar, String phone, String specialty) {
        String filePath = "";
        System.out.println("avatar = " + avatar);
        System.out.println("phone = " + phone);
        System.out.println("specialty = " + specialty);
        if (ObjectUtils.isEmpty(avatar) || avatar.getSize() <= 0 ) {
            System.out.println("===");
        }
        else {
            try {
                String originalFilename = avatar.getOriginalFilename();
                String extention = originalFilename.substring(originalFilename.lastIndexOf("."));
                String objectname = UUID.randomUUID().toString() + extention;
                filePath = aliOssUtil.upload(avatar.getBytes(), objectname);
            } catch (Exception e) {
                log.error("文件上传失败：", e);
                throw new UpLoadFailedException("文件上传失败！");
            }
        }
        Long caretakerId = Long.valueOf(BaseContext.getCurrentId());
        caretakerMapper.updateCaretakerSelective(
                filePath,    // 自动处理空值
                phone,        // 自动处理空值
                specialty,    // 自动处理空值
                caretakerId   // 必须参数
        );
        Caretaker caretaker = this.getById(Long.valueOf(BaseContext.getCurrentId()));
        CaretakerLoginVo caretakerLoginVo = new CaretakerLoginVo();
        BeanUtil.copyProperties(caretaker,caretakerLoginVo);
        return caretakerLoginVo;
    }

    /**
     * 分页查询 caretaker 用户
     *
     * @param caretakerQuery 查询条件对象
     * @return PageDTO<CaretakerLoginVo> 分页查询结果
     */
    @Override
    public PageDTO<CaretakerLoginVo> ipage(CaretakerQuery caretakerQuery) {
        Map<String, Object> params = new HashMap<>();
        int pageNo = Integer.parseInt(caretakerQuery.getPageNo().toString());
        int pageSize = Integer.parseInt(caretakerQuery.getPageSize().toString());
        params.put("page", (pageNo- 1) * pageSize);;
        params.put("size", caretakerQuery.getPageSize());
        params.put("name", caretakerQuery.getName());
        params.put("phone", caretakerQuery.getPhone());
        params.put("specialty", caretakerQuery.getSpecialty());
        List<Caretaker> lists = caretakerMapper.findCaretakerByPage(params);
        System.out.println("lists = " + lists);
        Long count = caretakerMapper.findCaretakerCount();
        PageDTO<CaretakerLoginVo> caretakerLoginVoPageDTO = new PageDTO<>();
        caretakerLoginVoPageDTO.setTotal(count);
        caretakerLoginVoPageDTO.setPages((count + caretakerQuery.getPageSize() - 1) / caretakerQuery.getPageSize());
        if (CollUtil.isNotEmpty(lists)) {
            List<CaretakerLoginVo> caretakerLoginVos = new ArrayList<>();
            lists.forEach(list -> {
                CaretakerLoginVo caretakerLoginVo = new CaretakerLoginVo();
                BeanUtil.copyProperties(list, caretakerLoginVo);
                caretakerLoginVos.add(caretakerLoginVo);
            });
            caretakerLoginVoPageDTO.setList(caretakerLoginVos);
        }
        return caretakerLoginVoPageDTO;
    }

    /**
     * 更新 caretaker 用户的启用状态
     *
     * @param caretakerId caretaker 用户 ID
     * @param isEnable 启用状态
     */
    @Override
    public void enable(String caretakerId, int isEnable) {
        LambdaUpdateWrapper<Caretaker> updateWrapper = new LambdaUpdateWrapper<Caretaker>()
                .set(Caretaker::getIsEnable, isEnable)
                .eq(Caretaker::getCaretakerId, caretakerId);
        caretakerMapper.update(null, updateWrapper);
    }


}
