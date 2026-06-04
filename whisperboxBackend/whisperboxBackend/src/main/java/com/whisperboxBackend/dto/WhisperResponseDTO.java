package com.whisperboxBackend.dto;

import com.whisperboxBackend.enums.WhisperStatus;

import java.time.LocalDateTime;

public class WhisperResponseDTO {

    private Long id;
    private String title;
    private String content;
    private WhisperStatus status;
    private LocalDateTime createdAt;

    public WhisperResponseDTO() {}

    public WhisperResponseDTO(Long id, String title, String content,
                              WhisperStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public WhisperStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}