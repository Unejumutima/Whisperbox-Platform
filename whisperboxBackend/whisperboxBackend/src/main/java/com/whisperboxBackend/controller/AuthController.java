package com.whisperboxBackend.controller;

import com.whisperboxBackend.dto.AuthResponseDTO;
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
 * Authentication Controller
 * Provides endpoints for authentication-related operations
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    /**
     * Get current authenticated user's information
     * Requires JWT token in Authorization header
     * 
     * Example: GET /api/auth/me
     * Header: Authorization: Bearer <jwt-token>
     */
    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userDetails.getUser();

        UserInfoDTO userInfo = UserInfoDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .anonymousName(user.getAnonymousName())
                .role(user.getRole().name())
                .build();

        return ResponseEntity.ok(userInfo);
    }

    /**
     * Check authentication status
     * Returns 200 if authenticated, 401 if not
     */
    @GetMapping("/status")
    public ResponseEntity<String> checkStatus() {
        return ResponseEntity.ok("Authenticated");
    }
}
