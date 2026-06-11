package com.whisperboxBackend.repository;

import com.whisperboxBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Used by OAuth2 login and JWT filter to look up a user by email
    Optional<User> findByEmail(String email);

    // ── JPQL queries for the approval feature ────────────────────────────────

    /**
     * Returns all users whose account has not been approved yet.
     * Used by the admin to review and approve new registrations.
     */
    @Query("SELECT u FROM User u WHERE u.approved = false ORDER BY u.registeredAt ASC")
    List<User> findPendingUsers();

    /**
     * Returns the total count of users still waiting for approval.
     * Useful for dashboard stats.
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.approved = false")
    Long countPendingUsers();
}
