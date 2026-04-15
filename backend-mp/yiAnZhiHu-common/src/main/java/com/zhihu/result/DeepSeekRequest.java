package com.zhihu.result;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
public class DeepSeekRequest {
    private String model;
    private List<Message> messages;
    private double temperature;
    private boolean stream;

    @Data
    public static class Message {
        private String role;
        private String content;
        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }
}

