package com.zhihu.config;

import com.zhihu.constants.RedisConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
public class DeepSeekConfig {

    //@Value("${deepseek.api.key}")


    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        // 获取原有转换器列表（包含 MappingJackson2HttpMessageConverter）
        List<HttpMessageConverter<?>> converters = restTemplate.getMessageConverters();

        // 添加 UTF-8 编码的 StringHttpMessageConverter
        StringHttpMessageConverter stringConverter = new StringHttpMessageConverter(StandardCharsets.UTF_8);
        converters.add(0, stringConverter); // 添加到列表开头，优先处理字符串
        restTemplate.setMessageConverters(converters);
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().add("Authorization", "Bearer " + RedisConstants.DEEPSEEK_API_KEY);
            request.getHeaders().setContentType(MediaType.APPLICATION_JSON);
            return execution.execute(request, body);
        });
        return restTemplate;
    }

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(RedisConstants.DEEPSEEK_URL)
                .defaultHeader("Authorization", "Bearer " + RedisConstants.DEEPSEEK_API_KEY)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

}