package com.whisperboxBackend.entity;

import com.whisperboxBackend.enums.WhisperStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "whispers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Whisper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 5000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User createdBy;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private WhisperStatus status;

    private String anonymousName;
}