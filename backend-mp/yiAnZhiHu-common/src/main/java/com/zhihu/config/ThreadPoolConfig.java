package com.zhihu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * @description: 自定义线程池配置
 * @author: Campione
 * @date 2025/4/15
 */
@Configuration
@EnableAsync
public class ThreadPoolConfig {

    @Bean("taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // 核心线程数 = CPU核心数 * 2
        executor.setCorePoolSize(Runtime.getRuntime().availableProcessors() * 2);
        // 最大线程数 = CPU核心数 * 5
        executor.setMaxPoolSize(Runtime.getRuntime().availableProcessors() * 5);
        // 队列容量（根据业务调整）
        executor.setQueueCapacity(1000);
        // 线程名前缀（便于日志追踪）
        executor.setThreadNamePrefix("async-task-");
        // 拒绝策略：由调用线程处理任务（防止任务丢失）
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}
