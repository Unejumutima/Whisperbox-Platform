package com.whisperboxBackend.repository;

import com.whisperboxBackend.entity.Whisper;
import com.whisperboxBackend.enums.WhisperStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface WhisperRepository extends JpaRepository<Whisper, Long> {

    // -------------------------------------------------------------------------
    // QUERY 1: Find all whispers by status
    // -------------------------------------------------------------------------
    // "w" is an alias for the Whisper entity (like a table alias in SQL).
    // We filter by the "status" field using the passed-in WhisperStatus value.
    // Example use: find all NOT_SEEN or SEEN whispers.
    // -------------------------------------------------------------------------
    @Query("SELECT w FROM Whisper w WHERE w.status = :status")
    List<Whisper> findByStatus(@Param("status") WhisperStatus status);


    // -------------------------------------------------------------------------
    // QUERY 2: Find whispers created today
    // -------------------------------------------------------------------------
    // We pass the start (midnight) and end (now) of today as parameters.
    // BETWEEN checks if createdAt falls within that range.
    // This is more reliable than comparing dates directly.
    // -------------------------------------------------------------------------
    @Query("SELECT w FROM Whisper w WHERE w.createdAt BETWEEN :startOfDay AND :endOfDay")
    List<Whisper> findWhispersCreatedToday(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );


    // -------------------------------------------------------------------------
    // QUERY 3: Search whispers by title (case-insensitive, partial match)
    // -------------------------------------------------------------------------
    // LOWER() converts both sides to lowercase so "hello" matches "Hello".
    // CONCAT('%', :keyword, '%') wraps the keyword with % wildcards,
    // so LIKE '%hello%' matches any title containing the word.
    // -------------------------------------------------------------------------
    @Query("SELECT w FROM Whisper w WHERE LOWER(w.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Whisper> searchByTitle(@Param("keyword") String keyword);


    // -------------------------------------------------------------------------
    // QUERY 4: Count all whispers
    // -------------------------------------------------------------------------
    // COUNT(w) counts every Whisper row in the table.
    // Returns a single Long value, not a list.
    // Useful for dashboards or analytics.
    // -------------------------------------------------------------------------
    @Query("SELECT COUNT(w) FROM Whisper w")
    Long countAllWhispers();

    // -------------------------------------------------------------------------
    // QUERY 4b: Count whispers by status
    // -------------------------------------------------------------------------
    // Same as above but filtered by status.
    // Used by the scheduler to count NOT_SEEN whispers without loading any data.
    // -------------------------------------------------------------------------
    @Query("SELECT COUNT(w) FROM Whisper w WHERE w.status = :status")
    Long countByStatus(@Param("status") WhisperStatus status);


    // -------------------------------------------------------------------------
    // QUERY 5: Find the latest whispers (most recent first)
    // -------------------------------------------------------------------------
    // ORDER BY w.createdAt DESC sorts newest whispers to the top.
    // LIMIT is not standard JPQL — we use Spring Data's Pageable instead,
    // but for simplicity here we use a fixed LIMIT via a native-style approach.
    // We set nativeQuery = false and rely on the database to honour LIMIT
    // through the query itself for demonstration purposes.
    // -------------------------------------------------------------------------
    @Query("SELECT w FROM Whisper w ORDER BY w.createdAt DESC LIMIT 10")
    List<Whisper> findLatestWhispers();

}