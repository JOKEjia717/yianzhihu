package com.zhihu.service.impl;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.zhihu.config.AmapConfig;
import com.zhihu.service.NursingHomeService;
import lombok.RequiredArgsConstructor;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class NursingHomeServiceImpl implements NursingHomeService {

    private final AmapConfig amapConfig;
    @Override
    public JsonObject searchNearbyNursingHomes(String query, double lng, double lat, int radius) throws IOException {


        // 1. 编码关键词
        String encodedKeyword = URLEncoder.encode(query, StandardCharsets.UTF_8);

        // 2. 构建请求URL
        String location = lng + "," + lat;
        String url = String.format(
                "%s?key=%s&location=%s&radius=%d&keywords=%s&types=080000", // 080000为医疗保健分类
                amapConfig.getPoiurl(),
                amapConfig.getApiKey(),
                location,
                radius,
                encodedKeyword
        );

        // 3. 发送HTTP请求
        try (CloseableHttpClient httpClient = HttpClients.createDefault();
             CloseableHttpResponse response = httpClient.execute(new HttpGet(url))) {

            // 4. 处理响应
            String jsonResponse = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
            JsonObject jsonObject = JsonParser.parseString(jsonResponse).getAsJsonObject();

            // 5. 检查高德API业务状态码
            String status = jsonObject.get("status").getAsString();
            if (!"1".equals(status)) {
//                    String errorInfo = jsonObject.get("info").getAsString();
                throw new RuntimeException("附近五公里没有养老院，请换个地方 ");
            }

            return jsonObject;
        }
    }
}

