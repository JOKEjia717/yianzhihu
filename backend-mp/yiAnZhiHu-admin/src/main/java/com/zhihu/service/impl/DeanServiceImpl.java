package com.zhihu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.DeanLoginDto;
import com.zhihu.Dto.DeanSaveDto;
import com.zhihu.Dto.NursingHomeDto;
import com.zhihu.constants.RedisConstants;
import com.zhihu.context.BaseContext;
import com.zhihu.exceptions.DataBaseException;
import com.zhihu.exceptions.LoginFailedException;
import com.zhihu.mapper.DeanMapper;
import com.zhihu.po.Dean;
import com.zhihu.service.DeanService;
import com.zhihu.util.TokenUtils;
import com.zhihu.client.DeanClient;
import com.zhihu.vo.DeanLoginVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.*;

import static com.zhihu.constants.JWTConstants.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class DeanServiceImpl extends ServiceImpl<DeanMapper, Dean> implements DeanService {

    private final DeanMapper deanMapper;

    private final StringRedisTemplate stringRedisTemplate;

    private final DeanClient deanClient;

    private  static final DefaultRedisScript<Long> USER_TOKEN_CACHE;
    static {
        //做初始化
        USER_TOKEN_CACHE = new DefaultRedisScript<>();
        //指定一个文件资源的地址脚本
        USER_TOKEN_CACHE.setLocation(new ClassPathResource("token.lua"));  //设置脚本的位置
        //配置一个返回值的类型
        USER_TOKEN_CACHE.setResultType(Long.class);
    }



    @Override
    public DeanLoginVo register(DeanSaveDto deanSaveDto) {
        Dean dean = new Dean();
        BeanUtils.copyProperties(deanSaveDto,dean);
        dean.setAdminId(Long.valueOf(BaseContext.getCurrentId()));
        dean.setCreatedTime(LocalDateTime.now());
        try{
            this.save(dean);
        }catch (Exception e){
            throw new DataBaseException("该账号已存在");
        }
        DeanLoginVo deanLoginVo = new DeanLoginVo();
        TokenUtils.createAndStoreToken(dean,
                Dean::getDeanId,
                deanLoginVo,
                new TokenUtils.TokenConfig(DEAN_SecretKey,
                        ACCESS_TOKEN_TIME,
                        REFRESH_TOKEN_TIME,
                        RedisConstants.DEAN_LOGIN_CACHE,
                        DEAN_ID,
                        deanSaveDto.getAccount()),
                stringRedisTemplate,
                USER_TOKEN_CACHE);
        BeanUtils.copyProperties(dean,deanLoginVo);
        deanLoginVo.setDeanId(String.valueOf(dean.getDeanId()));
        NursingHomeDto nursingHomeDto = new NursingHomeDto();
        nursingHomeDto.setDirector(deanSaveDto.getName());
        nursingHomeDto.setDeanId(String.valueOf(dean.getDeanId()));
        deanClient.createNursingHome(nursingHomeDto);
        return deanLoginVo;
    }

    @Override
    public DeanLoginVo login(DeanLoginDto loginDto) {
        LambdaQueryWrapper<Dean> wrapper = new LambdaQueryWrapper<Dean>()
                .eq(Dean::getAccount, loginDto.getAccount())
                .eq(Dean::getPassword, loginDto.getPassword());
        Dean dean = deanMapper.selectOne(wrapper);
        System.out.println("dean = " + dean);
        //账户不存在或者已经注销
        if(dean == null) {
            throw new LoginFailedException("请检查账户名和密码!");
        }
        Set<String> keys = stringRedisTemplate.keys(RedisConstants.DEAN_LOGIN_CACHE +loginDto.getAccount() + "*");
        if (keys != null) {
            stringRedisTemplate.delete(keys);
        }
        DeanLoginVo deanLoginVo = new DeanLoginVo();
        TokenUtils.createAndStoreToken(dean,
                Dean::getDeanId,
                deanLoginVo,
                new TokenUtils.TokenConfig(DEAN_SecretKey,
                        ACCESS_TOKEN_TIME,
                        REFRESH_TOKEN_TIME,
                        RedisConstants.DEAN_LOGIN_CACHE,
                        DEAN_ID,
                        loginDto.getAccount()),
                stringRedisTemplate,
                USER_TOKEN_CACHE);;
        BeanUtils.copyProperties(dean,deanLoginVo);
        deanLoginVo.setDeanId(String.valueOf(dean.getDeanId()));
        return deanLoginVo;
    }

    @Override
    public DeanLoginVo selectByName(@RequestParam String name) {
        LambdaQueryWrapper<Dean> eq = new LambdaQueryWrapper<Dean>()
                .eq(Dean::getName, name);
        Dean dean = deanMapper.selectOne(eq);
        DeanLoginVo deanLoginVo = new DeanLoginVo();
        BeanUtils.copyProperties(dean,deanLoginVo);
        return deanLoginVo;
    }


}
