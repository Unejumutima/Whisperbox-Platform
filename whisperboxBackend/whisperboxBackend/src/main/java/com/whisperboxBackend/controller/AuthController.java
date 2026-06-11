package com.whisperboxBackend.controller;

import com.whisperboxBackend.dto.UserInfoDTO;
import com.whisperboxBackend.entity.User;
import com.whisperboxBackend.repository.UserRepository;
import com.whisperboxBackend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AuthController — provides user identity endpoints.
 *
 * GET /api/auth/me     → returns the logged-in user's profile (safe for admin + student)
 * GET /api/auth/status → simple heartbeat to check JWT validity
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    /**
     * Returns the current user's profile.
     * anonymousName will be null for ADMIN — the frontend handles this gracefully.
     */
    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userDetails.getUser();

        UserInfoDTO dto = UserInfoDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .anonymousName(user.getAnonymousName())  // null for ADMIN — that's fine
                .role(user.getRole().name())
                .build();

        return ResponseEntity.ok(dto);
    }

    /** Simple ping — returns 200 if JWT is valid, 401 if not. */
    @GetMapping("/status")
    public ResponseEntity<String> checkStatus() {
        return ResponseEntity.ok("Authenticated");
    }
}
