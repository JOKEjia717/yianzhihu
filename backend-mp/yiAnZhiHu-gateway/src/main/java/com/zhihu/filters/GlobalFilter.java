package com.zhihu.filters;

import com.zhihu.exceptions.LoginFailedException;
import com.zhihu.config.AuthProperties;
import com.zhihu.util.JwtUtil;
import io.netty.util.internal.StringUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static com.zhihu.constants.JWTConstants.*;
import static com.zhihu.constants.RedisConstants.CHILDREN_LOGIN_CACHE;


/**
 * @author       : YiMing
 * @description  : 网关拦截器
 * @createDate   : 2025/3/3 16:35
 */
@RequiredArgsConstructor
@Slf4j
@Component
@RestController
public class GlobalFilter implements org.springframework.cloud.gateway.filter.GlobalFilter, Ordered {
    private final StringRedisTemplate stringRedisTemplate;
    private final AuthProperties authProperties;
    private final AntPathMatcher antPathMatcher = new AntPathMatcher();
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        //响应
        ServerHttpResponse response = exchange.getResponse();
        //请求
        ServerHttpRequest request = exchange.getRequest();
        //检测预检请求
        if(isExclude(request.getPath().toString())|| HttpMethod.OPTIONS.equals(request.getMethod())){
            // 无需拦截，直接放行
            return chain.filter(exchange);
        }
        String accessToken="";
        String refreshToken="";
        try{
             accessToken = request.getHeaders().get("accessToken").get(0);
             refreshToken = request.getHeaders().get("refreshToken").get(0);
        }catch (Exception e){
             return Mono.error(new LoginFailedException("缺少必要token!"));
        }
        //解析短token
        String roleId;
        String role;
        String userId = stringRedisTemplate.opsForValue().get(accessToken);
        if (StringUtil.isNullOrEmpty(userId)) {
            //短token过期检测长token
            userId=stringRedisTemplate.opsForValue().get(refreshToken);
            if(StringUtil.isNullOrEmpty(userId)){
                return Mono.error(new LoginFailedException("token已过期!请重新登录")) ;
            }else {
                //未过期刷新长短token
                //删除原始长token避免被复用
                stringRedisTemplate.delete(refreshToken);
                int index = refreshToken.indexOf(":");
                int index2 = refreshToken.indexOf(":", index + 1);
                String s1 = refreshToken.substring(0,index2);
                String s2 = s1;
                roleId = s1.substring(0,index);
                role = s2.substring(index+1);
                Map<String ,Object> claims=new HashMap<>();
                claims.put(roleId + "_id",userId);
                String newAccessToken = JwtUtil.createJWT(role, ACCESS_TOKEN_TIME, claims);
                String newRefreshToken = JwtUtil.createJWT(role, REFRESH_TOKEN_TIME, claims);
                refreshToken = newRefreshToken;
                stringRedisTemplate.opsForValue().set(roleId+":" + role+":" + newAccessToken,userId,ACCESS_TOKEN_TIME, TimeUnit.MILLISECONDS);
                stringRedisTemplate.opsForValue().set(roleId+":" + role+":" + newRefreshToken,userId,REFRESH_TOKEN_TIME,TimeUnit.MILLISECONDS);
                response.getHeaders().add("accessToken",newAccessToken);
                response.getHeaders().add("refreshToken",newRefreshToken);
            }

        }
        role = refreshToken.substring(0,accessToken.indexOf(":"));
            String finalUserId=userId + ":" + role;
        ServerWebExchange serverWebExchange = exchange.mutate().request(builder -> builder.header("user-info", finalUserId))
                .build();
        return chain.filter(serverWebExchange);
    }

    @Override
    public int getOrder() {
        return 0;
    }
    private boolean isExclude(String antPath) {
        for (String pathPattern : authProperties.getExcludePaths()) {

            if(antPathMatcher.match(pathPattern, antPath)){
                return true;
            }
        }
        return false;
    }
}
