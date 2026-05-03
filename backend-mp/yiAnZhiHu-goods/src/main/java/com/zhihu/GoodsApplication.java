package com.zhihu;

import com.zhihu.config.DefaultFeignConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * @author : YiMing
 * @description :
 * @createDate : 2025/3/3 16:08
 */

@SpringBootApplication
@Slf4j
@EnableFeignClients(basePackages = "com.zhihu.client",defaultConfiguration = DefaultFeignConfig.class)
@EnableRabbit
public class GoodsApplication {
    public static void main(String[] args) {
        SpringApplication.run(GoodsApplication.class,args);
        log.info("Goods started");
    }
}
