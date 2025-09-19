package com.shahid.aiqasystem.dto;

import java.util.List;

/**
 * Represents a request to the chat endpoint that includes conversation history.
 * @param history A list of previous messages in the conversation.
 * @param query The new user question to be answered.
 */
public record ChatRequest(List<com.shahid.aiqasystem.dto.ChatMessage> history, String query) {}