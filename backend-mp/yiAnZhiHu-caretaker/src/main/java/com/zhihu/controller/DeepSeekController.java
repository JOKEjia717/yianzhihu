package com.zhihu.controller;

import com.zhihu.Dto.AIImageQuestionDTO;
import com.zhihu.po.DeepSeek;
import com.zhihu.result.DeepSeekRequest;
import com.zhihu.result.Result;
import com.zhihu.service.DeepSeekService;
import com.zhihu.util.AIUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author BangLin
 * @Date 2025/4/26 18:41
 */
@RestController
@RequestMapping("/deepSeek/")
@RequiredArgsConstructor
@Slf4j
public class DeepSeekController {

    private final AIUtil aiUtil;
    private final DeepSeekService deepSeekService;


    @GetMapping(value = "generate", produces = "application/json;charset=UTF-8")
    public ResponseEntity<String> generate(DeepSeek deepSeek) {
        String result = deepSeekService.generateText(deepSeek.getContent());
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "generate-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> generateStream(@RequestParam String content, @RequestBody List<DeepSeekRequest.Message> history) {
        return deepSeekService.generateStream(content, history);
    }

    @GetMapping(value = "stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamAnswer(
            @RequestParam String content,
            @RequestParam String sessionId) { // 通过 sessionId 管理上下文

        // 获取历史上下文
        List<DeepSeekRequest.Message> history = deepSeekService.getConversationHistory(sessionId);
        if (history == null) {
            history = new ArrayList<>();
        }

        // 调用流式服务
        return deepSeekService.generateStream(content, history);
    }
    @PostMapping("imagesQuestion")
    public Result<String> getBaiduPictureImageAi(AIImageQuestionDTO aiImageQuestionDTO) throws IOException, InterruptedException {
        log.info("收到请求");
        String taskid = aiUtil.putPictureMessage(aiImageQuestionDTO.getFile(), aiImageQuestionDTO.getMsg());
        Thread.sleep(2000);
        return Result.success(taskid);
    }
    @GetMapping("getPictureAns")
    public Result<String>getPicturesAns(String taskId) throws IOException {
        String pictureAns = aiUtil.getPictureAns(taskId);
        if(pictureAns.isEmpty()||pictureAns.isBlank()){
            return Result.error("");
        }
        return Result.success(pictureAns);
    }

}
