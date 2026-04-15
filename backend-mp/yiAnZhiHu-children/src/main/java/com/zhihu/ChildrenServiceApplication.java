package com.zhihu;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients(basePackages = "com.zhihu.client")
@SpringBootApplication
@Slf4j
public class ChildrenServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChildrenServiceApplication.class,args);
        log.info("UserService started");
    }
}
