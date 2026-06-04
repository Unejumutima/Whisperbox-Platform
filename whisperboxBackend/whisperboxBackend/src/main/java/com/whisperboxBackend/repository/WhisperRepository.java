package com.whisperboxBackend.repository;

import com.whisperboxBackend.entity.Whisper;
import org.springframework.data.jpa.repository.JpaRepository;


public interface WhisperRepository extends JpaRepository<Whisper, Long> {

}