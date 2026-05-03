package com.zhihu.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**百度ai配置文件
 * @param
 * @return
 */
@Component
@ConfigurationProperties(prefix = "zhihu.baiduai")
@Data
public class BaiduAiProperties {
    //应用的apikey
    private String clientId;
    //应用的Secret Key
    private String clientSecret;
}
