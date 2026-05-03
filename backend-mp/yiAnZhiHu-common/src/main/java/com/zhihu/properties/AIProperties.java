package com.zhihu.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**星火大模型ai配置文件
 * @param
 * @return
 */
@Component
@ConfigurationProperties(prefix = "zhihu.ai")
@Data
public class AIProperties {
    private String APISecret;
    private String APIKey;
    private String api;
}
