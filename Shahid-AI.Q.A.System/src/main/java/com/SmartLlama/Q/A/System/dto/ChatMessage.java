// src/main/java/com/Shahid-AI/Q/A/System/dto/ChatMessage.java
package com.shahid.aiqasystem.dto;

/**
 * Represents a single message in the chat history.
 * @param role The role of the sender (e.g., "user", "assistant").
 * @param content The text content of the message.
 */
public record ChatMessage(String role, String content) {}