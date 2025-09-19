package com.shahid.aiqasystem.controller;

import com.shahid.aiqasystem.dto.ChatRequest;
import com.shahid.aiqasystem.service.ChatService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/chat")
    public ResponseEntity<String> chat(@RequestParam(value = "q") String query) {
        String responseContent = chatService.getSimpleChatResponse(query);
        return ResponseEntity.ok(responseContent);
    }

    @GetMapping(value = "/chat-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(@RequestParam(value = "q") String query) {
        return chatService.getStreamingChatResponse(query);
    }

    @PostMapping("/chat-history")
    public ResponseEntity<String> chatWithHistory(@RequestBody ChatRequest chatRequest) {
        String responseContent = chatService.getChatResponseWithHistory(chatRequest);
        return ResponseEntity.ok(responseContent);
    }
}