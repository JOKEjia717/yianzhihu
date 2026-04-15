package com.zhihu.anno;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.concurrent.TimeUnit;

/**
 * @author : YiMing
 * @description :限流器注解
 * @createDate : 2025/3/6 19:40
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface RequestLimit {
    /**
     * 窗口宽度
     * @return
     */
    long time() default 30;

    /**
     * 允许请求数
     * @return
     */
    long count() default 2;

    /**
     * 时间单位，默认为秒
     * @return
     */
    TimeUnit timeUnit() default TimeUnit.SECONDS;
}
