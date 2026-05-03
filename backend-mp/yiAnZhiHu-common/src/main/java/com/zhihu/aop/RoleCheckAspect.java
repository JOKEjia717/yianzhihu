package com.zhihu.aop;

import com.zhihu.anno.Lock;
import com.zhihu.anno.RoleCheck;
import com.zhihu.context.BaseContext;
import com.zhihu.exceptions.RoleException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.redisson.api.RLock;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * @author : YiMing
 * @description :身份鉴权
 * @createDate : 2025/4/14 10:38
 */
@Component
@Aspect
@Slf4j
@RequiredArgsConstructor
public class RoleCheckAspect {
    @Around("@annotation(com.zhihu.anno.RoleCheck)||@within(com.zhihu.anno.RoleCheck)")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        // 获取方法签名和当前方法/类
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Class<?> targetClass = joinPoint.getTarget().getClass();
        // 优先取方法注解，没有则取类上的注解
        RoleCheck roleCheck = method.getAnnotation(RoleCheck.class);
        if (roleCheck == null) {
            roleCheck = targetClass.getAnnotation(RoleCheck.class);
        }
        if (!roleCheck.role().equals(BaseContext.getRole())) {
            throw new RoleException("您无权访问!");
        }
        return joinPoint.proceed();
    }
}
