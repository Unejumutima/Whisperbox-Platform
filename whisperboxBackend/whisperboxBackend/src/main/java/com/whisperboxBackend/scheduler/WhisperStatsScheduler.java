package com.whisperboxBackend.scheduler;

import com.whisperboxBackend.enums.WhisperStatus;
import com.whisperboxBackend.repository.WhisperRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * WhisperStatsScheduler
 *
 * Runs automatically on a schedule and logs a daily summary of whispers.
 * Uses @Scheduled to define when the task runs — no manual trigger needed.
 *
 * @Slf4j provides a ready-to-use "log" variable (from Lombok).
 * @Component registers this class as a Spring bean so scheduling works.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WhisperStatsScheduler {

    private final WhisperRepository whisperRepository;

    @Scheduled(cron = "0 0 8 * * *")
    // @Scheduled(fixedRate = 10000)  // ← uncomment this line for quick testing
    public void logDailyWhisperSummary() {

        // Count every whisper in the database
        Long total = whisperRepository.countAllWhispers();

        // Count only whispers with status NOT_SEEN
        Long unseen = whisperRepository.countByStatus(WhisperStatus.NOT_SEEN);

        // Format current time for a readable log line
        String now = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        // Log the summary — visible in the Spring Boot console
        log.info("========================================");
        log.info("  WHISPERBOX DAILY SUMMARY — {}", now);
        log.info("  Total Whispers  : {}", total);
        log.info("  Unseen Whispers : {}", unseen);
        log.info("========================================");
    }
}
