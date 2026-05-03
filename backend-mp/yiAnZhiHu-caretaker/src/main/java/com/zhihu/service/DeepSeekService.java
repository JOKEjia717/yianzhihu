package com.zhihu.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhihu.po.DeepSeek;
import com.zhihu.result.DeepSeekRequest;
import reactor.core.publisher.Flux;

import java.util.List;

public interface DeepSeekService extends IService<DeepSeek> {


    String generateText(String content);

    // 新增流式问答方法（返回 Flux 流）
    Flux<String> generateStream(String userPrompt, List<DeepSeekRequest.Message> history);

    // 新增上下文管理方法（可选，用于获取/更新历史）
    void saveConversationHistory(String sessionId, List<DeepSeekRequest.Message> history);
    List<DeepSeekRequest.Message> getConversationHistory(String sessionId);


}