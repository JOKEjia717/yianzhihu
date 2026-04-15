package com.zhihu.util;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zhihu.contants.Messages;
import com.zhihu.exceptions.AIException;
import com.zhihu.properties.AIProperties;
import com.zhihu.properties.BaiduAiProperties;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.apache.http.Header;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * @param
 * @return
 */
@Data
@Component
@RequiredArgsConstructor
@Slf4j
public class AIUtil {
    private final AIProperties aiProperties;
    private final BaiduAiProperties baiduAiProperties;
    OkHttpClient HTTP_CLIENT = new OkHttpClient().newBuilder().connectTimeout(100, TimeUnit.SECONDS).build();
    /**
     * 星火ai交谈
     * @param msg
     * @param model
     * @return
     * @throws IOException
     */
    public String aiTalk(String msg,String model) throws IOException {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        String APISecret= aiProperties.getAPISecret();
        String APIKey= aiProperties.getAPIKey();
        String api=aiProperties.getApi();
        String BaseUrl="https://spark-api-open.xf-yun.com/v1/chat/completions";
        System.out.println(api);
        //httppost设置请求头
        HttpPost httpPost=new HttpPost(BaseUrl);
        httpPost.addHeader("Authorization",api);
        httpPost.addHeader("Content-Type","application/json");
        //打印请求头
        Header[] allHeaders = httpPost.getAllHeaders();
        for (Header header:allHeaders){
            System.out.println(header);
        }
        //设置请求体
        Messages message = new Messages();

        message.setContent(msg);
        com.zhihu.contants.Data data=new com.zhihu.contants.Data();
        data.setModel(model);
        List<Messages> messages=new ArrayList<>();
        messages.add(message);
        data.setMessages(messages);
//        Mess mess = new Mess();
//        mess.setData(data);
        String s = com.alibaba.fastjson.JSON.toJSONString(data);
        //打印请求体
        System.out.println(s);
        StringEntity requestEntity = new StringEntity(s, ContentType.APPLICATION_JSON);
        httpPost.setEntity(requestEntity);
        //发送请求
        CloseableHttpResponse response = null;
        try {
            response = httpClient.execute(httpPost);
        } catch (IOException e) {
            throw new AIException("请求超时请稍后重试");
        }
        System.out.println(response.getStatusLine().getStatusCode());
        String responseBody = EntityUtils.toString(response.getEntity());
        System.out.println(responseBody);
        //获取回复信息
        JSONObject jsonObj = com.alibaba.fastjson.JSON.parseObject(responseBody);
        //获取他所在大类
        JSONArray choices = jsonObj.getJSONArray("choices");
        //获取所在数组
        JSONObject firstChoice = choices.getJSONObject(0);
        JSONObject responsemsg= firstChoice.getJSONObject("message");
        String content = responsemsg.getString("content");

        return content;
    }

    /**
     * 百度url鉴权
     * @return
     */
    public String getBaiduAuthUrl(){

        String clientSecret = baiduAiProperties.getClientSecret();
        String clientId = baiduAiProperties.getClientId();
        final OkHttpClient HTTP_CLIENT = new OkHttpClient().newBuilder().build();
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, "");
        Request request = new Request.Builder()
                .url("https://aip.baidubce.com/oauth/2.0/token?client_id="+clientId+"&client_secret="+clientSecret+"&grant_type=client_credentials")
                .method("POST", body)
                .addHeader("Content-Type", "application/json")
                .addHeader("Accept", "application/json")
                .build();
        Response response = null;
        try {
            response = HTTP_CLIENT.newCall(request).execute();
        } catch (Exception e) {
            throw new AIException("网络不佳请稍后重试！");
        }
        String string = null;
        try {
            string = response.body().string();
        } catch (IOException e) {
            e.printStackTrace();
        }
        // Parse the JSON string
        JSONObject jsonObject = JSONObject.parseObject(string);

        // Extract the access_token
        String accessToken = jsonObject.getString("access_token");
        System.out.println(accessToken);
        return accessToken;
    }

    /**
     * 发送图片信息和问题并且返回taskid
     * @param file
     * @param msg
     * @return
     * @throws IOException
     */
    public String putPictureMessage(MultipartFile file,String msg) throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        //OkHttpClient HTTP_CLIENT = new OkHttpClient().newBuilder().connectTimeout(100, TimeUnit.SECONDS).build();

        String path = Base64.getEncoder().encodeToString(file.getBytes());
        Map<String,String> map=new HashMap<>();
        map.put("image",path);
        map.put("question",msg);
        String jsonString = com.alibaba.fastjson.JSON.toJSONString(map);
        JSONObject jsonObject1 = JSON.parseObject(jsonString);
        jsonObject1.put("output_CHN",true);
        jsonString=jsonObject1.toJSONString();
        RequestBody body = RequestBody.create(mediaType, jsonString);
        Request request = new Request.Builder()
                .url("https://aip.baidubce.com/rest/2.0/image-classify/v1/image-understanding/request?access_token=" + getBaiduAuthUrl())
                .method("POST", body)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Accept", "application/json")
                .build();
        Response response = HTTP_CLIENT.newCall(request).execute();
        String jsonstring1 = response.body().string();
        JSONObject jsonObject = JSON.parseObject(jsonstring1);
        // 获取 task_id
        String taskId = jsonObject.getJSONObject("result").getString("task_id");
        return taskId;
    }


    public String getPictureAns(String taskid) throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        Map<String,String>map1=new HashMap<>();
        map1.put("task_id", taskid);
        String json = JSON.toJSONString(map1);
        RequestBody body1 = RequestBody.create(mediaType, json);
        Request request1 = new Request.Builder()
                .url("https://aip.baidubce.com/rest/2.0/image-classify/v1/image-understanding/get-result?access_token=" +getBaiduAuthUrl())
                .method("POST", body1)
                .addHeader("Content-Type", "application/json")
                .build();
        Response response1 = null;
        try {
            response1 = HTTP_CLIENT.newCall(request1).execute();
        } catch (IOException e) {
            throw new AIException("获取结果异常!");
        }
        String res = response1.body().string();
        JSONObject jsons= JSON.parseObject(res);

        // 获取 description
        String description = jsons.getJSONObject("result").getString("description");
        return description;
    }

}
