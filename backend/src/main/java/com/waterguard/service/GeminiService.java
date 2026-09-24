package com.waterguard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    @Value("${gemini.api-key:}")
    private String configuredApiKey;

    @Value("${gemini.model:gemini-3.5-flash}")
    private String defaultModel;

    private static final String GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";

    public String generateAnswer(
            String systemPrompt,
            List<Map<String, String>> history,
            String userMessage,
            String apiKeyOverride,
            String modelOverride
    ) {
        String apiKey = (apiKeyOverride != null && !apiKeyOverride.isBlank())
                ? apiKeyOverride.trim()
                : configuredApiKey;

        if (apiKey == null || apiKey.isBlank()) {
            return "⚠️ **Gemini API Key Required**\n\n"
                    + "Please click the **⚙️ Settings** icon at the top right of this chat window to paste your Gemini API key, "
                    + "or set `GEMINI_API_KEY` in the server environment.";
        }

        String primaryModel = (modelOverride != null && !modelOverride.isBlank())
                ? modelOverride.trim()
                : defaultModel;

        try {
            return callGemini(primaryModel, apiKey, systemPrompt, history, userMessage);
        } catch (Exception e) {
            log.warn("Gemini API call failed with model '{}': {}", primaryModel, e.getMessage());

            // Auto-fallback to gemini-3.5-flash or gemini-3.6-flash if another model failed
            if (!"gemini-3.5-flash".equalsIgnoreCase(primaryModel)) {
                log.info("Attempting automatic fallback to gemini-3.5-flash...");
                try {
                    return callGemini("gemini-3.5-flash", apiKey, systemPrompt, history, userMessage);
                } catch (Exception fallbackErr) {
                    log.warn("Gemini-3.5-flash fallback failed, trying gemini-3.6-flash...");
                    try {
                        return callGemini("gemini-3.6-flash", apiKey, systemPrompt, history, userMessage);
                    } catch (Exception err36) {
                        log.error("All Gemini fallbacks failed: {}", err36.getMessage());
                    }
                }
            }

            return "I apologize, but I encountered an error connecting to Google Gemini: " 
                    + e.getMessage() 
                    + "\n\nPlease verify your API key and network connection.";
        }
    }

    private String callGemini(
            String model,
            String apiKey,
            String systemPrompt,
            List<Map<String, String>> history,
            String userMessage
    ) throws Exception {
        String endpoint = GEMINI_API_BASE + model + ":generateContent?key=" + apiKey;

        // Build Payload
        Map<String, Object> requestBody = new HashMap<>();

        // 1. System Instruction
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            requestBody.put("systemInstruction", Map.of(
                    "parts", List.of(Map.of("text", systemPrompt))
            ));
        }

        // 2. Contents (History + Current message)
        List<Map<String, Object>> contents = new ArrayList<>();

        if (history != null) {
            for (Map<String, String> item : history) {
                String sender = item.get("sender");
                String text = item.get("text");
                if (text == null || text.isBlank()) continue;

                // Gemini expects 'user' or 'model'
                String role = "user";
                if ("bot".equalsIgnoreCase(sender) || "model".equalsIgnoreCase(sender) || "assistant".equalsIgnoreCase(sender)) {
                    role = "model";
                }

                contents.add(Map.of(
                        "role", role,
                        "parts", List.of(Map.of("text", text))
                ));
            }
        }

        // Append current user message
        contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", userMessage))
        ));

        requestBody.put("contents", contents);

        // 3. Generation Config
        requestBody.put("generationConfig", Map.of(
                "temperature", 0.4,
                "maxOutputTokens", 1200
        ));

        String jsonPayload = objectMapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .timeout(Duration.ofSeconds(25))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            String errorBody = response.body();
            log.error("Gemini API Error [{}] for model {}: {}", response.statusCode(), model, errorBody);
            try {
                JsonNode root = objectMapper.readTree(errorBody);
                if (root.has("error") && root.get("error").has("message")) {
                    throw new RuntimeException(root.get("error").get("message").asText());
                }
            } catch (Exception parseErr) {
                // Ignore parse err
            }
            throw new RuntimeException("HTTP " + response.statusCode() + ": " + errorBody);
        }

        // Parse 200 response
        JsonNode root = objectMapper.readTree(response.body());
        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && !candidates.isEmpty()) {
            JsonNode firstCandidate = candidates.get(0);
            JsonNode parts = firstCandidate.path("content").path("parts");
            if (parts.isArray() && !parts.isEmpty()) {
                return parts.get(0).path("text").asText();
            }
        }

        return "I received an empty response from Gemini. Please try rephrasing your question.";
    }
}

