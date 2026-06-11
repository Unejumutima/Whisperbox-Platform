package com.whisperboxBackend.controller;

import com.whisperboxBackend.dto.WhisperRequestDTO;
import com.whisperboxBackend.entity.Whisper;
import com.whisperboxBackend.security.CustomUserDetails;
import com.whisperboxBackend.service.WhisperService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/whispers")
@CrossOrigin(origins = "http://localhost:5173")
public class WhisperController {

    private final WhisperService service;

    public WhisperController(WhisperService service) {
        this.service = service;
    }

    // ── CREATE ────────────────────────────────────────────────────────────────
    // @AuthenticationPrincipal gives us the logged-in user from the JWT filter.
    // We pass the user ID to the service so it can link the whisper to its author.
    @PostMapping
    public Whisper create(
            @Valid @RequestBody WhisperRequestDTO dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return service.createWhisper(dto, userDetails.getUserId());
    }

    // ── GET ALL (admin / public feed) — paginated + sorted ────────────────────
    @GetMapping
    public Page<Whisper> getAll(
            @RequestParam(defaultValue = "0")    int    page,
            @RequestParam(defaultValue = "10")   int    size,
            @RequestParam(defaultValue = "id")   String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        return service.getAll(page, size, sortBy, direction);
    }

    // ── GET MY WHISPERS — only whispers belonging to the logged-in user ────────
    // Endpoint: GET /api/whispers/mine
    // Supports the same pagination/sorting params as getAll.
    @GetMapping("/mine")
    public Page<Whisper> getMyWhispers(
            @RequestParam(defaultValue = "0")         int    page,
            @RequestParam(defaultValue = "10")        int    size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc")      String direction,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return service.getMyWhispers(userDetails.getUserId(), page, size, sortBy, direction);
    }

    // ── GET BY ID ─────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public Whisper getById(@PathVariable Long id) {
        return service.getById(id)
                .orElseThrow(() -> new RuntimeException("Whisper not found"));
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public Whisper update(
            @PathVariable Long id,
            @Valid @RequestBody WhisperRequestDTO dto
    ) {
        return service.update(id, dto);
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    // Service throws RuntimeException if the whisper has already been SEEN.
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Whisper deleted successfully";
    }

    // ── MARK AS SEEN (admin action) ───────────────────────────────────────────
    @PutMapping("/{id}/seen")
    public Whisper markAsSeen(@PathVariable Long id) {
        return service.markAsSeen(id);
    }
}
