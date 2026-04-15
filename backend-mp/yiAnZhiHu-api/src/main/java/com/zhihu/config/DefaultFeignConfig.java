package com.zhihu.config;


import com.zhihu.context.BaseContext;
import feign.Logger;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import io.netty.util.internal.StringUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @param
 * @return
 */
@Configuration
public class DefaultFeignConfig {
    @Bean
    public Logger.Level feignLoggerLevel(){
        return  Logger.Level.FULL;
    }

    @Bean
    public RequestInterceptor userInfoRequestInterceptor(){
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                // 获取登录用户
                String userId = BaseContext.getCurrentId();
                String userRole=BaseContext.getRole();
                String user=userId+":"+userRole;
                if(StringUtil.isNullOrEmpty(userId)) {
                    // 如果为空则直接跳过
                    return;
                }
                // 如果不为空则放入请求头中，传递给下游微服务
                template.header("user-info", user);
            }
        };
    }

}
