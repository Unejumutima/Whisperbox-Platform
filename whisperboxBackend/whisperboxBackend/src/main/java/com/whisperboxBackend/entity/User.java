package com.whisperboxBackend.entity;

import com.whisperboxBackend.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email; // Real student email (stored internally)

    private String fullName; // Real name from Google

    private String googleId; // Google's unique identifier

    @Enumerated(EnumType.STRING)
    private Role role; // STUDENT or ADMIN

    private String anonymousName; // Random name for public display

    private LocalDateTime registeredAt;

    private LocalDateTime lastLoginAt;

}