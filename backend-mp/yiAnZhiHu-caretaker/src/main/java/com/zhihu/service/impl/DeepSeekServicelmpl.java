package com.zhihu.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhihu.constants.RedisConstants;
import com.zhihu.mapper.DeepSeekMapper;
import com.zhihu.po.DeepSeek;
import com.zhihu.result.DeepSeekRequest;
import com.zhihu.service.DeepSeekService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeepSeekServicelmpl extends ServiceImpl<DeepSeekMapper, DeepSeek> implements DeepSeekService {

    private final WebClient webClient; // 注入 WebClient
    private final RedisTemplate<String, Object> redisTemplate; // 注入 Redis 用于存储上下文

    @Override
    public String generateText(String content) {
        return "";
    }

    // 流式问答实现
    @Override
    public Flux<String> generateStream(String userPrompt, List<DeepSeekRequest.Message> history) {
        // 1. 构建包含上下文的请求体
        DeepSeekRequest request = new DeepSeekRequest();
        request.setModel("deepseek-chat");
        request.setStream(true);

        // 添加历史消息 + 当前问题
        List<DeepSeekRequest.Message> messages = new ArrayList<>(history);
        messages.add(new DeepSeekRequest.Message("user", userPrompt));
        request.setMessages(messages);

        // 2. 发送流式请求并处理响应
        return webClient.post()
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.TEXT_EVENT_STREAM) // 关键：声明接受流式响应
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> status.isError(), response ->
                        response.bodyToMono(String.class) // 错误处理返回 Mono
                                .flatMap(error -> Mono.error(new RuntimeException("API Error: " + error)))
                )
                .bodyToFlux(String.class) // 正确：从 ClientResponse 转换为 Flux<String>
                .map(this::parseChunk)
                .doOnComplete(() -> saveConversationHistory("session_123", messages));
    }

    // 解析流式响应分块（示例）
    private String parseChunk(String chunk) {
        // 假设响应格式为纯文本或特定 JSON 结构
        // 这里需要根据实际 API 响应格式解析内容
        return chunk;
    }

    // 上下文存储方法
    @Override
    public void saveConversationHistory(String sessionId, List<DeepSeekRequest.Message> history) {
        redisTemplate.opsForValue().set("chat:history:" + sessionId, history);
    }

    // 获取上下文方法
    @Override
    public List<DeepSeekRequest.Message> getConversationHistory(String sessionId) {
        return (List<DeepSeekRequest.Message>) redisTemplate.opsForValue().get("chat:history:" + sessionId);
    }
}