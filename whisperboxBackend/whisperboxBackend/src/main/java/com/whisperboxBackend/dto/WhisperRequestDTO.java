package com.whisperboxBackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class WhisperRequestDTO {


    @NotBlank(message = "Title cannot be empty")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @NotBlank(message = "Content cannot be empty")
    @Size(min = 5, max = 2000,
            message = "Content must be between 5 and 2000 characters")
    private String content;
    public WhisperRequestDTO() {}

    public WhisperRequestDTO(String title, String content) {
        this.title = title;
        this.content = content;
    }


}