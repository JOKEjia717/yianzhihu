package com.zhihu.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author : YiMing
 * @description :redisson配置类
 * @createDate : 2025/3/2 12:43
 */
@Configuration
public class RedissonConfig {
    @Bean
    public RedissonClient redissonClient(){
        //配置
        Config config=new Config();
        // 改成你自己的redis地址
        config.useSingleServer().setAddress("redis://localhost:6379")
//                .setPassword("null")
               ;
        //创建redisson对象
        return Redisson.create(config);
    }
}
