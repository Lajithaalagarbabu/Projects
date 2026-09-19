package com.busfinder.busai;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class OllamaService {

    private final RestClient restClient;

    public OllamaService() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:11434")
                .build();
    }

    public String askOllama(String userMessage) {

        String prompt = """
                You are a bus search assistant.

                Extract bus search information from the user's request.

                Return ONLY valid JSON.
                Do not give explanations.
                Do not add extra fields.

                JSON format:
                {
                  "source": "",
                  "destination": "",
                  "startTime": "",
                  "endTime": "",
                  "busType": ""
                }

                Rules:
                - Extract source city.
                - Extract destination city.
                - Convert PM time to 24-hour format.
                - If the user says "6 PM to 11 PM", return "18:00" and "23:00".
                - If bus type is not mentioned, keep busType empty.
                - Do not invent information.

                User request:
                %s
                """.formatted(userMessage);

        String safePrompt = prompt
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n");

        String requestBody = """
                {
                  "model": "qwen2.5:3b",
                  "prompt": "%s",
                  "format": "json",
                  "stream": false
                }
                """.formatted(safePrompt);

        return restClient.post()
                .uri("/api/generate")
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(String.class);
    }
}