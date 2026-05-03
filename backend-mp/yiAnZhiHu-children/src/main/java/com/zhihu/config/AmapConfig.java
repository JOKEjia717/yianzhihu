package com.zhihu.config;

import lombok.Data;
import lombok.Getter;
import lombok.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Data
@Configuration
@ConfigurationProperties(prefix = "amap.api")
public class AmapConfig {

    //高德提供的key
//    @Value("${amap.api.key}")
    private String apiKey;

    //api地址
    private String poiurl;
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}
