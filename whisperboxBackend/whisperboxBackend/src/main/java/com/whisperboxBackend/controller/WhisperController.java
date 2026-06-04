package com.whisperboxBackend.controller;

import com.whisperboxBackend.dto.WhisperRequestDTO;
import com.whisperboxBackend.entity.Whisper;
import com.whisperboxBackend.service.WhisperService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/whispers")
@CrossOrigin(origins = "http://localhost:5173")
public class WhisperController {

    private final WhisperService service;

    public WhisperController(WhisperService service) {
        this.service = service;
    }

    @PostMapping
    public Whisper create(@Valid @RequestBody WhisperRequestDTO dto) {
        return service.createWhisper(dto);
    }

    @GetMapping
    public Page<Whisper> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        return service.getAll(page, size, sortBy, direction);
    }

    @GetMapping("/{id}")
    public Whisper getById(@PathVariable Long id) {
        return service.getById(id)
                .orElseThrow(() -> new RuntimeException("Whisper not found"));
    }

    @PutMapping("/{id}")
    public Whisper update(
            @PathVariable Long id,
            @Valid @RequestBody WhisperRequestDTO dto
    ) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Whisper deleted successfully";
    }

    @PutMapping("/{id}/seen")
    public Whisper markAsSeen(@PathVariable Long id) {
        return service.markAsSeen(id);
    }
}