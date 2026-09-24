package com.waterguard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class ChatDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatRequest {
        private String message;
        private List<Map<String, String>> history;
        private String apiKey;
        private String model;
        private Map<String, Object> clientContext;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatResponse {
        @Builder.Default
        private Boolean success = true;
        private String reply;
        private String modelUsed;
        private String userName;
        private String userRole;
    }
}

