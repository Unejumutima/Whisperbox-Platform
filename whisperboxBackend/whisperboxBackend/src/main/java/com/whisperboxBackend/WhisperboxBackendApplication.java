package com.whisperboxBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

// @EnableScheduling activates Spring's scheduling engine.
// Without this, @Scheduled annotations are ignored entirely.
@SpringBootApplication
@EnableScheduling
public class WhisperboxBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(WhisperboxBackendApplication.class, args);
	}

}
