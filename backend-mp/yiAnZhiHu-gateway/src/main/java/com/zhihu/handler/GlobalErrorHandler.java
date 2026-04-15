package com.zhihu.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zhihu.exceptions.LoginFailedException;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 处理网关手抛异常
 */
@Component
@Order(-2) // 优先级需高于默认的 DefaultErrorWebExceptionHandler（-1）
public class GlobalErrorHandler implements ErrorWebExceptionHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        ServerHttpResponse response = exchange.getResponse();
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> errorResponse = new LinkedHashMap<>();
        if(ex  instanceof LoginFailedException){
            // 自定义错误响应体
            errorResponse.put("code", HttpStatus.UNAUTHORIZED.value());
            errorResponse.put("msg", ex.getMessage());
            errorResponse.put("data",null);
        }else{
            // 自定义错误响应体
            errorResponse.put("code", HttpStatus.BAD_REQUEST.value()); // 第一个字段
            errorResponse.put("msg", ex.getMessage());
            errorResponse.put("data", null);
        }


        // 将 Map 转为 JSON 字节
        byte[] bytes;
        try {
            bytes = objectMapper.writeValueAsBytes(errorResponse);
        } catch (JsonProcessingException e) {
            bytes = "{\"code\":500,\"message\":\"Internal Server Error\"}".getBytes();
        }

        // 写入响应流
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }
}