package com.whisperboxBackend.scheduler;

import com.whisperboxBackend.enums.WhisperStatus;
import com.whisperboxBackend.repository.WhisperRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Slf4j
@Component
@RequiredArgsConstructor
public class WhisperStatsScheduler {

    private final WhisperRepository whisperRepository;

    // ${scheduler.daily.cron} is resolved from application.properties at startup.
    // Spring reads the value and uses it as the cron expression for this task.
    @Scheduled(cron = "${scheduler.daily.cron}")
    public void logDailyWhisperSummary() {

        Long total  = whisperRepository.countAllWhispers();
        Long unseen = whisperRepository.countByStatus(WhisperStatus.NOT_SEEN);

        String now = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        log.info("========================================");
        log.info("  WHISPERBOX DAILY SUMMARY — {}", now);
        log.info("  Total Whispers  : {}", total);
        log.info("  Unseen Whispers : {}", unseen);
        log.info("========================================");
    }
}
