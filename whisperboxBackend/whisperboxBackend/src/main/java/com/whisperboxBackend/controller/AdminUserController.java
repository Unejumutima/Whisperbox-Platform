package com.whisperboxBackend.controller;

import com.whisperboxBackend.dto.PendingUserDTO;
import com.whisperboxBackend.service.UserAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AdminUserController — manages user approval from the admin side.
 *
 * All endpoints are protected by @PreAuthorize("hasRole('ADMIN')").
 * Spring Security checks the role from the JWT before the method runs.
 * A STUDENT calling these endpoints receives 403 Forbidden automatically.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserAdminService userAdminService;

    /**
     * GET /api/admin/pending-users
     * Returns all users waiting for approval.
     * Only ADMIN can call this.
     */
    @GetMapping("/pending-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PendingUserDTO>> getPendingUsers() {
        return ResponseEntity.ok(userAdminService.getPendingUsers());
    }

    /**
     * GET /api/admin/pending-users/count
     * Returns the number of users currently pending approval.
     * Useful for the admin dashboard counter.
     */
    @GetMapping("/pending-users/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getPendingCount() {
        return ResponseEntity.ok(Map.of("pending", userAdminService.countPendingUsers()));
    }

    /**
     * PUT /api/admin/users/{id}/approve
     * Approves a user — sets approved = true.
     * The user can now log in and use the platform normally.
     */
    @PutMapping("/users/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> approveUser(@PathVariable Long id) {
        userAdminService.approveUser(id);
        return ResponseEntity.ok(Map.of("message", "User approved successfully."));
    }

    /**
     * PUT /api/admin/users/{id}/reject
     * Rejects a user — deletes their account permanently.
     * If they log in with Google again, a new pending account is created.
     */
    @PutMapping("/users/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> rejectUser(@PathVariable Long id) {
        userAdminService.rejectUser(id);
        return ResponseEntity.ok(Map.of("message", "User rejected and removed."));
    }
}
