package com.zhihu;

import com.zhihu.config.DefaultFeignConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableFeignClients(basePackages = "com.zhihu.client")
@SpringBootApplication
@Slf4j
@EnableScheduling // 开启定时任务支持
public class CaretakerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CaretakerServiceApplication.class,args);
        log.info("CaretakerService started");
    }
}
