package com.zhihu.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.toolkit.ObjectUtils;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.ChildrenInfoUpdateDTO;
import com.zhihu.Dto.ChildrenLoginDto;
import com.zhihu.Dto.ChildrenSaveDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.context.BaseContext;
import com.zhihu.exceptions.*;
import com.zhihu.mapper.ChildrenMapper;
import com.zhihu.po.Children;
import com.zhihu.query.NursingHomeQuery;
import com.zhihu.result.Result;
import com.zhihu.service.ChildrenService;
import com.zhihu.util.AliOssUtil;
import com.zhihu.util.MD5Util;
import com.zhihu.util.TokenUtils;
import com.zhihu.vo.ChildrenLoginVo;
import com.zhihu.vo.NursingHomePageVo;
import com.zhihu.vo.NursingHomeVo;
import io.netty.util.internal.StringUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.multipart.MultipartFile;
import com.zhihu.client.DeanClient;

import java.time.LocalDateTime;
import java.util.*;

import static com.zhihu.constants.JWTConstants.*;
import static com.zhihu.constants.RedisConstants.CHILDREN_LOGIN_CACHE;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/3/3 14:22
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChildrenServiceImpl extends ServiceImpl<ChildrenMapper, Children>implements ChildrenService {
    private final StringRedisTemplate stringRedisTemplate;
    private final ChildrenMapper childrenMapper;
    private final AliOssUtil aliOssUtil;
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
    public ChildrenLoginVo loginByUsernameAndPwd(ChildrenLoginDto childrenLoginDto) {
        String password = MD5Util.md5(childrenLoginDto.getPassword());
        LambdaQueryWrapper<Children> wrapper = new LambdaQueryWrapper<Children>()
                .eq(Children::getAccount, childrenLoginDto.getAccount())
                .eq(Children::getPassword, password);
        Children children = childrenMapper.selectOne(wrapper);
        //账户不存在或者已经注销
        if(children == null){
            throw new LoginFailedException("请检查账户名和密码!");
        }
        if(children.getIsEnable() == 1){
            throw new RoleStatusException("用户状态异常");
        }
//        Map<String ,Object> claims=new HashMap<>();
//        claims.put(CHILDREN_ID,user.getUserId());
//        String accessToken = JwtUtil.createJWT(CHILDREN_SecretKey, ACCESS_TOKEN_TIME, claims);
//        String refreshToken = JwtUtil.createJWT(CHILDREN_SecretKey, REFRESH_TOKEN_TIME, claims);
//        // token存入redis使用lua脚本
//        // 准备键列表
//        List<String> keys = Arrays.asList(CHILDREN_LOGIN_CACHE + accessToken, CHILDREN_LOGIN_CACHE + refreshToken);
//        // 准备参数列表
//        List<String> args = Arrays.asList(user.getUserId().toString(), String.valueOf(ACCESS_TOKEN_TIME), String.valueOf(REFRESH_TOKEN_TIME));
//        Long result = stringRedisTemplate.execute(
//                USER_TOKEN_CACHE,
//                keys,
//                args.toArray()
//        );
//        if(result != 1 ){
//            log.info("token存入到Redis出现问题");
//        }
////        stringRedisTemplate.opsForValue().set(CHILDREN_LOGIN_CACHE+accessToken,user.getUserId().toString(),ACCESS_TOKEN_TIME,TimeUnit.MILLISECONDS);
////        stringRedisTemplate.opsForValue().set(CHILDREN_LOGIN_CACHE+refreshToken,user.getUserId().toString(),REFRESH_TOKEN_TIME,TimeUnit.MILLISECONDS);
//        LoginVo loginVo=new LoginVo();
//        BeanUtils.copyProperties(user,loginVo);
//        loginVo.setUserId(String.valueOf(user.getUserId()));
//        loginVo.setAccessToken(accessToken);
//        loginVo.setRefreshToken(refreshToken);
        Set<String> keys = stringRedisTemplate.keys(CHILDREN_LOGIN_CACHE +children.getAccount() + "*");
        if (keys != null) {
            stringRedisTemplate.delete(keys);
        }
        ChildrenLoginVo loginVo=new ChildrenLoginVo();
        //createToken(children,loginVo);
        TokenUtils.TokenConfig tokenConfig = new TokenUtils.TokenConfig(CHILDREN_SecretKey, ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME, CHILDREN_LOGIN_CACHE, CHILDREN_ID,childrenLoginDto.getAccount());
        TokenUtils.createAndStoreToken(children,Children::getChildrenId,loginVo,tokenConfig,stringRedisTemplate,USER_TOKEN_CACHE);
        loginVo.setChildrenId(String.valueOf(children.getChildrenId()));
        BeanUtils.copyProperties(children,loginVo);
        return loginVo;
    }

    @Override
    public ChildrenLoginVo save(ChildrenSaveDto childrenSaveDto) {
        String password = MD5Util.md5(childrenSaveDto.getPassword());
        Children children =new Children();
        BeanUtils.copyProperties(childrenSaveDto, children);
        children.setCreatedTime(LocalDateTime.now());
        children.setPassword(password);
        children.setMoney(1000000);
        try{
            this.save(children);
        }catch (Exception e){
            throw new DataBaseException("该账号已存在");
        }
        ChildrenLoginVo loginVo=new ChildrenLoginVo();
        //createToken(children,loginVo);
        TokenUtils.TokenConfig tokenConfig = new TokenUtils.TokenConfig(CHILDREN_SecretKey, ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME, CHILDREN_LOGIN_CACHE, CHILDREN_ID,childrenSaveDto.getAccount());
        TokenUtils.createAndStoreToken(children,Children::getChildrenId,loginVo,tokenConfig,stringRedisTemplate,USER_TOKEN_CACHE);
        BeanUtils.copyProperties(children,loginVo);
        loginVo.setChildrenId(String.valueOf(children.getChildrenId()));
        return loginVo;
    }

    /**
     * 更新头像
     * @param image
     */
    @Override
    public void avatar(MultipartFile image) {
        String currentId = BaseContext.getCurrentId();
        String role = BaseContext.getRole();
        System.out.println("role = " + role);
        log.info("用户上传头像用户id：{}", currentId);
        String filePath;
        try {
            //原始文件名
            String originalFilename = image.getOriginalFilename();
            String extention = originalFilename.substring(originalFilename.lastIndexOf("."));
            String objectname = UUID.randomUUID().toString() + extention;
            filePath = aliOssUtil.upload(image.getBytes(), objectname);
        }catch (Exception e){
            throw new UpLoadFailedException("文件上传失败！");
        }
        //存入数据库
        LambdaQueryWrapper<Children> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Children::getChildrenId, currentId);
        Children children = new Children();
        children.setAvatar(filePath);
        this.update(children, queryWrapper);
    }

    @Override
    public PageDTO<NursingHomePageVo> nursingHomeList(NursingHomeQuery nursingHomeQuery) {
        String pageNo = String.valueOf(nursingHomeQuery.getPageNo());
        String pageSize = String.valueOf(nursingHomeQuery.getPageSize());
        String name = nursingHomeQuery.getName();
        String address = nursingHomeQuery.getAddress();
        return deanClient.nursingHomeList(pageNo, pageSize, name, address).getData();
    }

//    @Override
//    public NursingHomeVo selectByNursingHomeId(Long nursingHomeId) {
//        //return deanClient.nursingHomeVo(nursingHomeId);
//    }

//    @Override
//    public LoginVo role(Long userId) {
//        User user = userMapper.selectById(userId);
//        LoginVo loginVo = new LoginVo();
//        BeanUtils.copyProperties(user,loginVo);
//        return loginVo;
//    }

//    public void createToken(Children children, LoginVo loginVo){
//        Map<String ,Object> claims=new HashMap<>();
//        claims.put(CHILDREN_ID, children.getChildrenId());
//        String accessToken = JwtUtil.createJWT(CHILDREN_SecretKey, ACCESS_TOKEN_TIME, claims);
//        String refreshToken = JwtUtil.createJWT(CHILDREN_SecretKey, REFRESH_TOKEN_TIME, claims);
//        // token存入redis使用lua脚本
//        // 准备键列表
//        List<String> keys = Arrays.asList(CHILDREN_LOGIN_CACHE + accessToken, CHILDREN_LOGIN_CACHE + refreshToken);
//        // 准备参数列表
//        List<String> args = Arrays.asList(children.getChildrenId().toString(), String.valueOf(ACCESS_TOKEN_TIME), String.valueOf(REFRESH_TOKEN_TIME));
//        Long result = stringRedisTemplate.execute(
//                USER_TOKEN_CACHE,
//                keys,
//                args.toArray()
//        );
//        if(result != 1 ){
//            log.info("token存入到Redis出现问题");
//        }
////        stringRedisTemplate.opsForValue().set(CHILDREN_LOGIN_CACHE+accessToken,user.getUserId().toString(),ACCESS_TOKEN_TIME,TimeUnit.MILLISECONDS);
////        stringRedisTemplate.opsForValue().set(CHILDREN_LOGIN_CACHE+refreshToken,user.getUserId().toString(),REFRESH_TOKEN_TIME,TimeUnit.MILLISECONDS);
//        BeanUtils.copyProperties(children,loginVo);
//        loginVo.setChildrenId(String.valueOf(children.getChildrenId()));
//        loginVo.setAccessToken(accessToken);
//        loginVo.setRefreshToken(refreshToken);
//        loginVo.setIsEnable(children.getIsEnable());
//    }

    @Override
    public void consentToActivity(String activityId) {

    }

    @Override
    public void money(Integer newMoney) {
        LambdaUpdateWrapper<Children> eq = new LambdaUpdateWrapper<Children>()
                .set(Children::getMoney, newMoney)
                .eq(Children::getChildrenId, Long.parseLong(BaseContext.getCurrentId()));
        childrenMapper.update(null, eq);
    }

   // @Override
//    public void updateChildrenInfo(ChildrenSaveDto childrenSaveDto) {
//        String currentId = BaseContext.getCurrentId();
//        //根据id查询子女信息
////        Children children = this.getById(currentId);
////        lambdaUpdate().eq(Children::getChildrenId,currentId).set(Children::getName,childrenSaveDto.getName())
////                .set(Children::getAccount,childrenSaveDto.getAccount());
//        //将要修改的子女信息copy到children
//        boolean success = lambdaUpdate()
//                .eq(Children::getChildrenId, currentId)
//                .set(Children::getName, childrenSaveDto.getName())
//                .set(Children::getAccount, childrenSaveDto.getAccount())
//                .set(Children::getPhone, childrenSaveDto.getPhone())
//                .update();
////        BeanUtils.copyProperties(childrenSaveDto,children);
////        //更改子女信息
////        this.updateById(children);
//        return success? Result.success():Result.error("修改失败");
//    }

    @Override
    public void updateChildrenInfo(ChildrenInfoUpdateDTO childrenInfoUpdateDTO) {
        String childrenId = BaseContext.getCurrentId();
        //填写了旧手机号
        if (!StringUtil.isNullOrEmpty(childrenInfoUpdateDTO.getOldPassword())){
            //先去查询用户看旧密码是否相同
            LambdaQueryWrapper<Children> wrapper=new LambdaQueryWrapper<Children>()
                    .eq(Children::getChildrenId,childrenId)
                    .eq(Children::getPassword,MD5Util.md5(childrenInfoUpdateDTO.getOldPassword()));
            Children children = childrenMapper.selectOne(wrapper);
            if(ObjectUtils.isNull(children)){
                throw  new BaseException("密码错误!");
            }
        }
        String newPassword="";
        if (!StringUtil.isNullOrEmpty(childrenInfoUpdateDTO.getNewPassword())){
             newPassword= MD5Util.md5(childrenInfoUpdateDTO.getNewPassword());
        }
        LambdaUpdateWrapper<Children> wrapper=new LambdaUpdateWrapper<Children>()
                .eq(Children::getChildrenId,childrenId)
                .set(!StringUtil.isNullOrEmpty(childrenInfoUpdateDTO.getName()),Children::getName,childrenInfoUpdateDTO.getName())
                .set(childrenInfoUpdateDTO.getNewPassword()!=null&& !childrenInfoUpdateDTO.getNewPassword().isEmpty(),Children::getPassword,newPassword)
                .set(!StringUtil.isNullOrEmpty(childrenInfoUpdateDTO.getPhone()),Children::getPhone,childrenInfoUpdateDTO.getPhone());
        childrenMapper.update(null,wrapper);
    }

    @Override
    public Integer getMoney() {
        String childrenId = BaseContext.getCurrentId();
        LambdaQueryWrapper<Children> wrapper = new LambdaQueryWrapper<Children>()
                .eq(Children::getChildrenId, childrenId);
        Children children = childrenMapper.selectOne(wrapper);
        Integer money=children.getMoney();
        log.info("money:{}",money);
        return money;
    }

    @Override
    public void newMoney(Integer newMoney) {
        String currentId = BaseContext.getCurrentId();
        childrenMapper.updateMoney(currentId,newMoney);
    }
}
