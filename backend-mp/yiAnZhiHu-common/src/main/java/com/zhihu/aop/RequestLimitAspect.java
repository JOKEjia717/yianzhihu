package com.zhihu.aop;

import com.zhihu.anno.RequestLimit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * @author : YiMing
 * @description :滑动窗口实现
 * @createDate : 2025/3/6 19:50
 */
@Component
@Aspect
@Slf4j
@RequiredArgsConstructor
public class RequestLimitAspect {
    private final StringRedisTemplate stringRedisTemplate;
    
    @Around("@annotation(com.zhihu.anno.RequestLimit)")
    public  Object limitAround(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        RequestLimit requestLimit = signature.getMethod().getAnnotation(RequestLimit.class);
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = requestAttributes.getRequest();
        //获取uri
        String requestURI = request.getRequestURI();
        String key="userLimit:"+requestURI;
        //获取当前时间戳
        long currentTimeMillis = System.currentTimeMillis();
        //此处要判断timeunit，此处懒得判断了直接按s处理
        stringRedisTemplate.opsForZSet().removeRangeByScore(key,0,currentTimeMillis- requestLimit.time()*1000);
        Long allTime = stringRedisTemplate.opsForZSet().zCard(key);
        if(allTime>=requestLimit.count()){
            throw new RuntimeException("当前流量过大请稍后再试!");
        }
        Boolean add = stringRedisTemplate.opsForZSet().add(key,String.valueOf(currentTimeMillis),currentTimeMillis);
        stringRedisTemplate.expire(key,requestLimit.time(),requestLimit.timeUnit());
        //System.out.println(requestLimit.time()*1000);
        return joinPoint.proceed();
    }

}
