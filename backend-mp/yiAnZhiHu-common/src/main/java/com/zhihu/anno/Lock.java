package com.zhihu.anno;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.concurrent.TimeUnit;

/**
 * @author : YiMing
 * @description :锁注解
 * @createDate : 2025/3/2 12:47
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Lock {

    /**
     * 锁标识
     */
    String lockKey();

    /**
     * 时间单位，默认秒
     */
    TimeUnit timeUnit() default TimeUnit.SECONDS;

    /**
     * 锁等待时间
     */
    int waitTime() default 1;

    /**
     * 锁超时时间 默认为看门狗
     */
    int leaseTime() default -1;

}
