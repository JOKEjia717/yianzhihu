package com.zhihu.aop;


import com.zhihu.anno.Lock;
import com.zhihu.context.BaseContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

/**
 * @author : YiMing
 * @description :  Redisson切面类
 * @createDate : 2025/3/2 12:50
 */
@Component
@Aspect
@Slf4j
@RequiredArgsConstructor
public class RedissonAspect {
    private final RedissonClient redissonClient;
    @Around("@annotation(com.zhihu.anno.Lock)")
    public Object around(ProceedingJoinPoint joinPoint) throws InterruptedException {
        //获取方法签名
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        //获取注解
        Lock redisLock = signature.getMethod().getAnnotation(Lock.class);
        String userId = BaseContext.getCurrentId();
        log.info("redissonUserId:{}",userId);
        String lockKey=redisLock.lockKey()+ userId;
        RLock lock = redissonClient.getLock(lockKey);
        boolean isLock = lock.tryLock(redisLock.waitTime(), redisLock.leaseTime(), redisLock.timeUnit());
        if (!isLock) {
            throw new RuntimeException("请等待"+lock.remainTimeToLive()/1000+"s后再试!");
        }
        try {
            return joinPoint.proceed();
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
        finally {
            if (isLock&&lock.isHeldByCurrentThread()) {
                lock.unlock();
            }

        }
    }
}
