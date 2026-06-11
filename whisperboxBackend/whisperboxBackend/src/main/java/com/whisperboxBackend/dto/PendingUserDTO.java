package com.whisperboxBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO returned by GET /api/admin/pending-users.
 * Only exposes the fields an admin needs to make an approval decision.
 * Real email is included here because only admins see this endpoint.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingUserDTO {
    private Long id;
    private String email;
    private String fullName;
    private String anonymousName;
    private LocalDateTime registeredAt;
}
