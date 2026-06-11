package com.whisperboxBackend.service;

import com.whisperboxBackend.dto.PendingUserDTO;
import com.whisperboxBackend.entity.User;
import com.whisperboxBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * UserAdminService — handles all admin operations on user accounts.
 *
 * Separated from other services to keep each class focused on one responsibility.
 * The controller stays thin; all logic lives here.
 */
@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository userRepository;

    /**
     * Returns all users whose approved field is false.
     * Maps each User entity to a PendingUserDTO so we never leak
     * sensitive fields like googleId to the API response.
     */
    public List<PendingUserDTO> getPendingUsers() {
        return userRepository.findPendingUsers()
                .stream()
                .map(user -> PendingUserDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .anonymousName(user.getAnonymousName())
                        .registeredAt(user.getRegisteredAt())
                        .build())
                .toList();
    }

    /**
     * Approves a user — sets approved = true and saves.
     * Throws RuntimeException if the user is not found (caught by GlobalExceptionHandler).
     */
    public void approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setApproved(true);
        userRepository.save(user);
    }

    /**
     * Rejects a user — permanently deletes their account.
     * They can re-register if they log in again (approval will be required again).
     */
    public void rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        userRepository.delete(user);
    }

    /**
     * Returns the number of users currently waiting for approval.
     * Useful for the admin dashboard badge/counter.
     */
    public Long countPendingUsers() {
        return userRepository.countPendingUsers();
    }
}
