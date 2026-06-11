package com.whisperboxBackend.service;

import com.whisperboxBackend.dto.WhisperRequestDTO;
import com.whisperboxBackend.entity.User;
import com.whisperboxBackend.entity.Whisper;
import com.whisperboxBackend.enums.WhisperStatus;
import com.whisperboxBackend.repository.UserRepository;
import com.whisperboxBackend.repository.WhisperRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WhisperService {

    private final WhisperRepository repository;
    private final UserRepository    userRepository;

    // ── CREATE ────────────────────────────────────────────────────────────────
    // Saves createdBy (the user) and anonymousName on the whisper.
    // This is what allows "My Whispers" to work correctly.
    public Whisper createWhisper(WhisperRequestDTO dto, Long userId) {

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Whisper whisper = new Whisper();
        whisper.setTitle(dto.getTitle());
        whisper.setContent(dto.getContent());
        whisper.setCreatedBy(author);
        whisper.setAnonymousName(author.getAnonymousName()); // copy at creation time
        whisper.setCreatedAt(LocalDateTime.now());
        whisper.setStatus(WhisperStatus.NOT_SEEN);

        return repository.save(whisper);
    }

    // ── GET ALL (admin / feed) — pagination + sorting ─────────────────────────
    public Page<Whisper> getAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return repository.findAll(PageRequest.of(page, size, sort));
    }

    // ── GET MY WHISPERS — whispers belonging to one user, paginated ───────────
    public Page<Whisper> getMyWhispers(Long userId, int page, int size,
                                       String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return repository.findByCreatedById(userId, PageRequest.of(page, size, sort));
    }

    // ── GET BY ID ─────────────────────────────────────────────────────────────
    public Optional<Whisper> getById(Long id) {
        return repository.findById(id);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    public Whisper update(Long id, WhisperRequestDTO dto) {
        Whisper existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Whisper not found"));
        existing.setTitle(dto.getTitle());
        existing.setContent(dto.getContent());
        return repository.save(existing);
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    // A SEEN whisper cannot be deleted — admin has already reviewed it.
    public void delete(Long id) {
        Whisper whisper = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Whisper not found"));

        if (whisper.getStatus() == WhisperStatus.SEEN) {
            throw new RuntimeException(
                "This whisper has already been seen by an admin and cannot be deleted."
            );
        }

        repository.delete(whisper);
    }

    // ── MARK AS SEEN ──────────────────────────────────────────────────────────
    public Whisper markAsSeen(Long id) {
        Whisper whisper = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Whisper not found"));
        whisper.setStatus(WhisperStatus.SEEN);
        return repository.save(whisper);
    }
}
