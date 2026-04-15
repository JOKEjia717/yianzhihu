package com.zhihu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.AdminLoginDto;
import com.zhihu.exceptions.LoginFailedException;
import com.zhihu.mapper.AdminMapper;
import com.zhihu.po.Admin;
import com.zhihu.po.Children;
import com.zhihu.service.AdminService;
import com.zhihu.util.JwtUtil;
import com.zhihu.util.TokenUtils;
import com.zhihu.vo.AdminLoginVo;
import com.zhihu.vo.ChildrenLoginVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.zhihu.constants.JWTConstants.*;
import static com.zhihu.constants.RedisConstants.ADMIN_LOGIN_CACHE;
import static com.zhihu.constants.RedisConstants.CHILDREN_LOGIN_CACHE;


@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin> implements AdminService {

    private final AdminMapper adminMapper;

    private final StringRedisTemplate stringRedisTemplate;

    private  static final DefaultRedisScript<Long> ADMIN_TOKEN_CACHE;
    static {
        //做初始化
        ADMIN_TOKEN_CACHE = new DefaultRedisScript<>();
        //指定一个文件资源的地址脚本
        ADMIN_TOKEN_CACHE.setLocation(new ClassPathResource("token.lua"));  //设置脚本的位置
        //配置一个返回值的类型
        ADMIN_TOKEN_CACHE.setResultType(Long.class);
    }
    @Override
    public AdminLoginVo login(AdminLoginDto adminLoginDto) {
        LambdaQueryWrapper<Admin> wrapper = new LambdaQueryWrapper<Admin>()
                .eq(Admin::getAccount, adminLoginDto.getAccount())
                .eq(Admin::getPassword, adminLoginDto.getPassword());
        Admin admin = adminMapper.selectOne(wrapper);
        System.out.println("admin = " + admin);
        //账户不存在或者已经注销
        if(admin == null) {
            throw new LoginFailedException("请检查账户名和密码!");
        }
        Set<String> keys = stringRedisTemplate.keys(ADMIN_LOGIN_CACHE +admin.getAccount() + "*");
        if (keys != null) {
            stringRedisTemplate.delete(keys);
        }
        AdminLoginVo adminLoginVo = new AdminLoginVo();
        TokenUtils.TokenConfig tokenConfig=new TokenUtils.TokenConfig(ADMIN_SecretKey,ACCESS_TOKEN_TIME,REFRESH_TOKEN_TIME,ADMIN_LOGIN_CACHE,ADMIN_ID, admin.getAccount());
        TokenUtils.createAndStoreToken(admin,Admin::getAdminId,adminLoginVo,tokenConfig,stringRedisTemplate,ADMIN_TOKEN_CACHE);
//        createToken(admin, adminLoginVo);
        BeanUtils.copyProperties(admin,adminLoginVo);
        return adminLoginVo;
    }

    public void createToken(Admin admin, AdminLoginVo adminLoginVo){
        Map<String ,Object> claims=new HashMap<>();
        claims.put(ADMIN_ID, admin.getAdminId());
        String accessToken = JwtUtil.createJWT(ADMIN_SecretKey, ACCESS_TOKEN_TIME, claims);
        String refreshToken = JwtUtil.createJWT(ADMIN_SecretKey, REFRESH_TOKEN_TIME, claims);
        // token存入redis使用lua脚本
        // 准备键列表
        List<String> keys = Arrays.asList(ADMIN_LOGIN_CACHE + accessToken, ADMIN_LOGIN_CACHE + refreshToken);
        // 准备参数列表
        List<String> args = Arrays.asList(admin.getAdminId().toString(), String.valueOf(ACCESS_TOKEN_TIME), String.valueOf(REFRESH_TOKEN_TIME));
        Long result = stringRedisTemplate.execute(
                ADMIN_TOKEN_CACHE,
                keys,
                args.toArray()
        );
        if(result != 1 ){
            log.info("token存入到Redis出现问题");
        }
//        stringRedisTemplate.opsForValue().set(USER_LOGIN_CACHE+accessToken,user.getUserId().toString(),ACCESS_TOKEN_TIME,TimeUnit.MILLISECONDS);
//        stringRedisTemplate.opsForValue().set(USER_LOGIN_CACHE+refreshToken,user.getUserId().toString(),REFRESH_TOKEN_TIME,TimeUnit.MILLISECONDS);
        BeanUtils.copyProperties(admin, adminLoginVo);
        adminLoginVo.setAccessToken(accessToken);
        adminLoginVo.setRefreshToken(refreshToken);
    }
}
