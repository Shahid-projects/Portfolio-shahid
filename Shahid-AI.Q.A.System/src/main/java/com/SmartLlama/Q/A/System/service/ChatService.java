package com.shahid.aiqasystem.service;

import com.shahid.aiqasystem.dto.ChatRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    /**
     * Generates a simple, single-turn response.
     *
     * @param query The user's question.
     * @return The AI's response as a String.
     */
    public String getSimpleChatResponse(String query) {
        return this.chatClient.prompt()
                .user(query)
                .call()
                .content();
    }

    /**
     * Generates a response by streaming tokens.
     *
     * @param query The user's question.
     * @return A Flux of Strings, where each string is a token of the response.
     */
    public Flux<String> getStreamingChatResponse(String query) {
        return this.chatClient.prompt()
                .user(query)
                .stream()
                .content();
    }

    /**
     * Generates a response considering the conversation history.
     *
     * @param chatRequest The request containing the history and new query.
     * @return The AI's response as a String.
     */
    public String getChatResponseWithHistory(ChatRequest chatRequest) {
        List<Message> messageHistory = chatRequest.history().stream()
                .map(m -> {
                    switch (m.role().toLowerCase()) {
                        case "user":
                            return new UserMessage(m.content());
                        case "assistant":
                            return new AssistantMessage(m.content());
                        default:
                            throw new IllegalArgumentException("Unsupported message role: " + m.role());
                    }
                })
                .collect(Collectors.toList());

        messageHistory.add(new UserMessage(chatRequest.query()));

        return chatClient.prompt()
                .messages(messageHistory.toArray(new Message[0]))
                .call()
                .content();
    }
}