package com.zhihu.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.Dto.ElderDto;
import com.zhihu.Dto.ElderLoginDto;
import com.zhihu.Dto.ElderSaveDto;
import com.zhihu.Dto.PageDTO;
import com.zhihu.context.BaseContext;
import com.zhihu.client.ChildrenClient;
import com.zhihu.constants.JWTConstants;
import com.zhihu.constants.RedisConstants;
import com.zhihu.exceptions.BaseException;
import com.zhihu.exceptions.DataBaseException;
import com.zhihu.exceptions.LoginFailedException;
import com.zhihu.exceptions.RoleStatusException;
import com.zhihu.exceptions.UpLoadFailedException;
import com.zhihu.mapper.ElderChildrenBindMapper;
import com.zhihu.mapper.ElderMapper;
import com.zhihu.po.Application;
import com.zhihu.po.Elder;
import com.zhihu.po.ElderChildrenBind;
import com.zhihu.po.Health;
import com.zhihu.query.ElderQuery;
import com.zhihu.result.Result;
import com.zhihu.service.ElderService;
import com.zhihu.util.AliOssUtil;
import com.zhihu.util.MD5Util;
import com.zhihu.util.TokenUtils;
import com.zhihu.vo.ChildrenLoginVo;
import com.zhihu.vo.ElderLoginVo;
import com.zhihu.vo.ElderVo;
import com.zhihu.vo.HealthVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static com.zhihu.constants.JWTConstants.ACCESS_TOKEN_TIME;
import static com.zhihu.constants.JWTConstants.ELDER_ID;
import static com.zhihu.constants.JWTConstants.ELDER_SecretKey;
import static com.zhihu.constants.JWTConstants.REFRESH_TOKEN_TIME;
import static com.zhihu.constants.RedisConstants.ELDER_LOGIN_CACHE;

/**
 * @author BangLin
 * @Date 2025/4/14 19:03
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ElderServiceImpl extends ServiceImpl<ElderMapper, Elder> implements ElderService {

    private final ElderMapper elderMapper;

    private final ElderChildrenBindMapper elderChildrenBindMapper;

    private final StringRedisTemplate stringRedisTemplate;

    private final AliOssUtil aliOssUtil;

    private final ChildrenClient childrenClient;

    private static final DefaultRedisScript<Long> USER_TOKEN_CACHE;

    static {
        USER_TOKEN_CACHE = new DefaultRedisScript<>();
        USER_TOKEN_CACHE.setLocation(new ClassPathResource("token.lua"));
        USER_TOKEN_CACHE.setResultType(Long.class);
    }

    private boolean hasText(String value) {
        return StringUtils.hasText(value);
    }

    private ElderLoginVo buildLoginVo(Elder elder) {
        ElderLoginVo loginVo = new ElderLoginVo();
        BeanUtil.copyProperties(elder, loginVo);
        if (elder.getElderId() != null) {
            loginVo.setElderId(String.valueOf(elder.getElderId()));
        }
        if (elder.getCaretakerId() != null) {
            loginVo.setCaretakerId(String.valueOf(elder.getCaretakerId()));
        }
        if (elder.getChildrenId() != null && elder.getChildrenId() != 0L) {
            loginVo.setChildrenId(String.valueOf(elder.getChildrenId()));
        }
        return loginVo;
    }

    private ElderLoginVo buildTokenVo(Elder elder) {
        String tokenKey = hasText(elder.getAccount())
                ? elder.getAccount()
                : String.valueOf(elder.getElderId());
        Set<String> keys = stringRedisTemplate.keys(ELDER_LOGIN_CACHE + tokenKey + "*");
        if (keys != null) {
            stringRedisTemplate.delete(keys);
        }
        ElderLoginVo loginVo = buildLoginVo(elder);
        TokenUtils.TokenConfig tokenConfig = new TokenUtils.TokenConfig(
                ELDER_SecretKey,
                ACCESS_TOKEN_TIME,
                REFRESH_TOKEN_TIME,
                ELDER_LOGIN_CACHE,
                ELDER_ID,
                tokenKey
        );
        TokenUtils.createAndStoreToken(elder, Elder::getElderId, loginVo, tokenConfig, stringRedisTemplate, USER_TOKEN_CACHE);
        return loginVo;
    }

    @Override
    public ElderLoginVo loginByUsernameAndPwd(ElderLoginDto elderLoginDto) {
        String loginName = hasText(elderLoginDto.getName()) ? elderLoginDto.getName() : elderLoginDto.getAccount();
        if (!hasText(loginName) || !hasText(elderLoginDto.getPassword())) {
            throw new LoginFailedException("请检查姓名和密码!");
        }
        String password = MD5Util.md5(elderLoginDto.getPassword());
        Elder elder = elderMapper.selectOne(new LambdaQueryWrapper<Elder>()
                .eq(Elder::getName, loginName)
                .eq(Elder::getPassword, password));
        if (elder == null && hasText(elderLoginDto.getAccount()) && !elderLoginDto.getAccount().equals(loginName)) {
            elder = elderMapper.selectOne(new LambdaQueryWrapper<Elder>()
                    .eq(Elder::getAccount, elderLoginDto.getAccount())
                    .eq(Elder::getPassword, password));
        }
        if (elder == null) {
            throw new LoginFailedException("请检查姓名和密码!");
        }
        if (elder.getIsEnable() == 1) {
            throw new RoleStatusException("用户状态异常");
        }
        return buildTokenVo(elder);
    }

    @Override
    public ElderLoginVo save(ElderSaveDto elderSaveDto) {
        String name = hasText(elderSaveDto.getName()) ? elderSaveDto.getName() : elderSaveDto.getAccount();
        String account = hasText(elderSaveDto.getAccount()) ? elderSaveDto.getAccount() : name;
        if (!hasText(name) || !hasText(elderSaveDto.getPassword()) || !hasText(elderSaveDto.getPhone())) {
            throw new BaseException("姓名、密码和电话不能为空");
        }
        LambdaQueryWrapper<Elder> existsWrapper = new LambdaQueryWrapper<Elder>()
                .eq(Elder::getAccount, account);
        if (elderMapper.selectCount(existsWrapper) > 0) {
            throw new DataBaseException("该账号已存在");
        }

        Elder elder = new Elder();
        BeanUtil.copyProperties(elderSaveDto, elder);
        elder.setName(name);
        elder.setAccount(account);
        elder.setPassword(MD5Util.md5(elderSaveDto.getPassword()));
        elder.setPhone(elderSaveDto.getPhone());
        elder.setChildrenName(name);
        elder.setChildrenPhone(elderSaveDto.getPhone());
        elder.setDeanId(0L);
        elder.setChildrenId(0L);
        elder.setApplicationTime(LocalDate.now());
        elder.setCreatedTime(LocalDate.now());
        elder.setGender(0);
        elder.setAge(0);
        elder.setPhoto("");
        elder.setIsEnable(0);
        this.save(elder);
        return buildTokenVo(elder);
    }

    private ChildrenLoginVo loadChildrenInfo(String childrenId) {
        if (!hasText(childrenId) || "0".equals(childrenId)) {
            return null;
        }
        try {
            Result<ChildrenLoginVo> result = childrenClient.getChildrenInfo(childrenId);
            if (result != null && result.getCode() != null && result.getCode() == 1) {
                return result.getData();
            }
            if (result != null && hasText(result.getMsg())) {
                log.warn("查询子女信息失败: childrenId={}, msg={}", childrenId, result.getMsg());
            }
        } catch (Exception e) {
            log.warn("查询子女信息异常: childrenId={}", childrenId, e);
        }
        return null;
    }

    private void syncChildrenInfo(ElderDto elderDto) {
        ChildrenLoginVo childrenInfo = loadChildrenInfo(elderDto.getChildrenId());
        if (childrenInfo == null) {
            return;
        }
        if (hasText(childrenInfo.getName())) {
            elderDto.setChildrenName(childrenInfo.getName());
        }
        if (hasText(childrenInfo.getPhone())) {
            elderDto.setChildrenPhone(childrenInfo.getPhone());
        }
    }

    private ElderVo buildElderVo(Elder elder) {
        ElderVo elderVo = new ElderVo();
        BeanUtil.copyProperties(elder, elderVo);
        if (elder.getElderId() != null) {
            elderVo.setElderId(String.valueOf(elder.getElderId()));
        }
        if (elder.getCaretakerId() != null) {
            elderVo.setCaretakerId(String.valueOf(elder.getCaretakerId()));
        }
        if (elder.getChildrenId() != null && elder.getChildrenId() != 0L) {
            elderVo.setChildrenId(String.valueOf(elder.getChildrenId()));
        }
        ChildrenLoginVo childrenInfo = loadChildrenInfo(elderVo.getChildrenId());
        if (childrenInfo != null) {
            if (hasText(childrenInfo.getName())) {
                elderVo.setChildrenName(childrenInfo.getName());
            }
            if (hasText(childrenInfo.getPhone())) {
                elderVo.setChildrenPhone(childrenInfo.getPhone());
            }
        }
        return elderVo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
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

        if (!hasText(elderDto.getChildrenId())) {
            throw new BaseException("子女ID不能为空");
        }
        syncChildrenInfo(elderDto);
        if (!hasText(elderDto.getChildrenName()) || !hasText(elderDto.getChildrenPhone())) {
            throw new BaseException("子女信息不完整，请确认childrenId是否正确");
        }

        Elder elder = new Elder();
        BeanUtil.copyProperties(elderDto, elder);
        if (hasText(elderDto.getPassword())) {
            elder.setPassword(MD5Util.md5(elderDto.getPassword()));
        }
        if (hasText(elderDto.getCaretakerId())) {
            elder.setCaretakerId(Long.valueOf(elderDto.getCaretakerId()));
        }
        elder.setChildrenId(Long.valueOf(elderDto.getChildrenId()));
        elder.setApplicationTime(LocalDate.now());
        elder.setDeanId(Long.valueOf(deanId));
        elder.setPhoto(filePath);
        elder.setIsEnable(2);
        this.save(elder);
        bindChildrenToElder(elder.getElderId(), Long.valueOf(elderDto.getChildrenId()));
    }

    private Long getCurrentChildrenId() {
        String currentId = BaseContext.getCurrentId();
        if (!hasText(currentId)) {
            throw new LoginFailedException("请先登录");
        }
        return Long.valueOf(currentId);
    }

    private void bindChildrenToElder(Long elderId, Long childrenId) {
        if (elderId == null || childrenId == null) {
            return;
        }
        LambdaQueryWrapper<ElderChildrenBind> queryWrapper = new LambdaQueryWrapper<ElderChildrenBind>()
                .eq(ElderChildrenBind::getElderId, elderId)
                .eq(ElderChildrenBind::getChildrenId, childrenId);
        if (elderChildrenBindMapper.selectCount(queryWrapper) > 0) {
            return;
        }
        ElderChildrenBind elderChildrenBind = new ElderChildrenBind();
        elderChildrenBind.setElderId(elderId);
        elderChildrenBind.setChildrenId(childrenId);
        elderChildrenBind.setCreatedTime(LocalDateTime.now());
        elderChildrenBindMapper.insert(elderChildrenBind);
    }

    private void addElders(List<Elder> target, Set<Long> seen, List<Elder> source) {
        if (CollUtil.isEmpty(source)) {
            return;
        }
        for (Elder elder : source) {
            if (elder == null || elder.getElderId() == null) {
                continue;
            }
            if (seen.add(elder.getElderId())) {
                target.add(elder);
            }
        }
    }

    @Override
    public PageDTO<ElderVo> pageDtoResult(ElderQuery elderQuery) {
        //构建分页条件
        Page<Elder> page = Page.of(elderQuery.getPageNo(), elderQuery.getPageSize());
        String elderName = hasText(elderQuery.getElderName()) ? elderQuery.getElderName() : elderQuery.getName();
        //构建排序条件
        Page<Elder> elderPage = lambdaQuery()
                .like(hasText(elderName), Elder::getName, elderName)
                .like(hasText(elderQuery.getChildrenName()), Elder::getChildrenName, elderQuery.getChildrenName())
                .like(hasText(elderQuery.getChildrenPhone()), Elder::getChildrenPhone, elderQuery.getChildrenPhone())
                .eq(elderQuery.getApplicationTime() != null, Elder::getApplicationTime, elderQuery.getApplicationTime())
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
                elderVos.add(buildElderVo(record));
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
            elderVoList.add(buildElderVo(elder));
        });
        return elderVoList;
    }
    @Override
    public List<ElderVo> getByChildrenId() {
        Long childrenId = getCurrentChildrenId();
        List<Elder> elders = new ArrayList<>();
        Set<Long> seen = new LinkedHashSet<>();

        List<ElderChildrenBind> binds = elderChildrenBindMapper.selectList(new LambdaQueryWrapper<ElderChildrenBind>()
                .eq(ElderChildrenBind::getChildrenId, childrenId));
        if (CollUtil.isNotEmpty(binds)) {
            Set<Long> elderIds = new LinkedHashSet<>();
            for (ElderChildrenBind bind : binds) {
                if (bind != null && bind.getElderId() != null) {
                    elderIds.add(bind.getElderId());
                }
            }
            if (CollUtil.isNotEmpty(elderIds)) {
                List<Elder> bindElders = lambdaQuery()
                        .in(Elder::getElderId, elderIds)
                        .list();
                addElders(elders, seen, bindElders);
            }
        }

        List<Elder> legacyElders = lambdaQuery()
                .eq(Elder::getChildrenId, childrenId)
                .list();
        addElders(elders, seen, legacyElders);

        List<ElderVo> res = new ArrayList<>();
        for (Elder elder : elders) {
            res.add(buildElderVo(elder));
        }
        return res;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void bindElder(String elderId) {
        if (!hasText(elderId)) {
            throw new BaseException("老人编号不能为空");
        }
        Long currentChildrenId = getCurrentChildrenId();
        Long currentElderId = Long.valueOf(elderId);
        Elder elder = this.getById(currentElderId);
        if (elder == null) {
            throw new BaseException("老人不存在");
        }
        bindChildrenToElder(currentElderId, currentChildrenId);
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
            elderVo.add(buildElderVo(elder));
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
            elderVo.add(buildElderVo(elder1));
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
            ElderVo.add(buildElderVo(elder));
        }
        return ElderVo;
    }


}
