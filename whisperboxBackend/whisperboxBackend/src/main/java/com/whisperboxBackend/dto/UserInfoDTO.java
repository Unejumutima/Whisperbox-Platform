package com.whisperboxBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO returned by GET /api/auth/me
 *
 * anonymousName is nullable — admin users do not have one.
 * The frontend must handle null gracefully (show "Admin" as fallback).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {
    private Long   id;
    private String email;
    private String anonymousName;  // null for ADMIN, always set for STUDENT
    private String role;
}
