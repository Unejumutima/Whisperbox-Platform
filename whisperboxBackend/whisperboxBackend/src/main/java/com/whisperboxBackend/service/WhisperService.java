package com.whisperboxBackend.service;

import com.whisperboxBackend.dto.WhisperRequestDTO;
import com.whisperboxBackend.entity.Whisper;
import com.whisperboxBackend.enums.WhisperStatus;
import com.whisperboxBackend.repository.WhisperRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class WhisperService {

    private final WhisperRepository repository;

    public WhisperService(WhisperRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Whisper createWhisper(WhisperRequestDTO dto) {

        Whisper whisper = new Whisper();
        whisper.setTitle(dto.getTitle());
        whisper.setContent(dto.getContent());

        whisper.setCreatedAt(LocalDateTime.now());
        whisper.setStatus(WhisperStatus.NOT_SEEN);

        return repository.save(whisper);
    }

    // GET ALL (pagination + sorting)
    public Page<Whisper> getAll(int page, int size, String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return repository.findAll(pageable);
    }

    // GET BY ID
    public Optional<Whisper> getById(Long id) {
        return repository.findById(id);
    }

    // UPDATE
    public Whisper update(Long id, WhisperRequestDTO dto) {

        Whisper existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Whisper not found"));

        existing.setTitle(dto.getTitle());
        existing.setContent(dto.getContent());

        return repository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // MARK AS SEEN
    public Whisper markAsSeen(Long id) {

        Whisper whisper = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Whisper not found"));

        whisper.setStatus(WhisperStatus.SEEN);

        return repository.save(whisper);
    }
}