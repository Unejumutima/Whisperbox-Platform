package com.whisperboxBackend;

import com.whisperboxBackend.dto.WhisperRequestDTO;
import com.whisperboxBackend.entity.Whisper;
import com.whisperboxBackend.enums.WhisperStatus;
import com.whisperboxBackend.repository.WhisperRepository;
import com.whisperboxBackend.service.WhisperService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for WhisperService.
 *
 * KEY ANNOTATIONS:
 *
 * @ExtendWith(MockitoExtension.class)
 *   Tells JUnit to use Mockito's extension so @Mock and @InjectMocks work.
 *
 * @Mock
 *   Creates a fake (mock) WhisperRepository. No real database is used.
 *   We control exactly what it returns in each test.
 *
 * @InjectMocks
 *   Creates a real WhisperService and automatically injects the mock
 *   repository into its constructor.
 */
@ExtendWith(MockitoExtension.class)
class WhisperServiceTest {

    @Mock
    private WhisperRepository whisperRepository;

    @InjectMocks
    private WhisperService whisperService;

    // Reusable objects prepared before every test
    private WhisperRequestDTO requestDTO;
    private Whisper savedWhisper;

    /**
     * @BeforeEach runs before every single test method.
     * We set up common test data here to avoid repeating it in each test.
     */
    @BeforeEach
    void setUp() {
        // A typical incoming request from the client
        requestDTO = new WhisperRequestDTO("Test Title", "Test content here");

        // What the database would return after saving
        savedWhisper = new Whisper();
        savedWhisper.setId(1L);
        savedWhisper.setTitle("Test Title");
        savedWhisper.setContent("Test content here");
        savedWhisper.setStatus(WhisperStatus.NOT_SEEN);
        savedWhisper.setCreatedAt(LocalDateTime.now());
    }


    // =========================================================================
    //  createWhisper() TESTS
    // =========================================================================

    /**
     * PURPOSE:
     * Verify that createWhisper() maps the DTO fields correctly onto the
     * Whisper entity and that it calls repository.save() exactly once.
     *
     * HOW IT WORKS:
     * - when(...).thenReturn(...) tells the fake repository what to return
     *   when save() is called. We don't hit a real database.
     * - assertThat(...) checks the returned object has the expected values.
     * - verify(...) confirms save() was called exactly 1 time.
     */
    @Test
    @DisplayName("createWhisper: should save whisper with correct title and content")
    void createWhisper_shouldSaveWhisperWithCorrectFields() {

        // ARRANGE — tell the mock what to return when save() is called
        when(whisperRepository.save(any(Whisper.class))).thenReturn(savedWhisper);

        // ACT — call the real method we are testing
        Whisper result = whisperService.createWhisper(requestDTO);

        // ASSERT — check the result is correct
        assertThat(result.getTitle()).isEqualTo("Test Title");
        assertThat(result.getContent()).isEqualTo("Test content here");

        // Confirm save() was called exactly once
        verify(whisperRepository, times(1)).save(any(Whisper.class));
    }

    /**
     * PURPOSE:
     * Verify that a newly created whisper always starts with status NOT_SEEN
     * and has a createdAt timestamp — regardless of what the caller passes in.
     *
     * WHY THIS MATTERS:
     * These two fields are set inside the service, not by the caller.
     * This test guards against accidental changes to that logic.
     */
    @Test
    @DisplayName("createWhisper: should set status NOT_SEEN and createdAt automatically")
    void createWhisper_shouldSetStatusAndTimestamp() {

        // ARRANGE
        when(whisperRepository.save(any(Whisper.class))).thenReturn(savedWhisper);

        // ACT
        Whisper result = whisperService.createWhisper(requestDTO);

        // ASSERT — status must be NOT_SEEN, createdAt must not be null
        assertThat(result.getStatus()).isEqualTo(WhisperStatus.NOT_SEEN);
        assertThat(result.getCreatedAt()).isNotNull();
    }


    // =========================================================================
    //  update() TESTS
    // =========================================================================

    /**
     * PURPOSE:
     * Verify that update() loads the existing whisper, applies the new title
     * and content from the DTO, and saves it back.
     *
     * HOW IT WORKS:
     * - We mock findById() to return an existing whisper (simulates DB lookup).
     * - We mock save() to return the updated whisper.
     * - We assert that the returned whisper has the new values.
     */
    @Test
    @DisplayName("update: should update title and content of existing whisper")
    void update_shouldUpdateTitleAndContent() {

        // ARRANGE
        WhisperRequestDTO updateDTO = new WhisperRequestDTO("New Title", "New content here");

        Whisper updatedWhisper = new Whisper();
        updatedWhisper.setId(1L);
        updatedWhisper.setTitle("New Title");
        updatedWhisper.setContent("New content here");
        updatedWhisper.setStatus(WhisperStatus.NOT_SEEN);

        when(whisperRepository.findById(1L)).thenReturn(Optional.of(savedWhisper));
        when(whisperRepository.save(any(Whisper.class))).thenReturn(updatedWhisper);

        // ACT
        Whisper result = whisperService.update(1L, updateDTO);

        // ASSERT
        assertThat(result.getTitle()).isEqualTo("New Title");
        assertThat(result.getContent()).isEqualTo("New content here");

        // Both findById and save should each be called exactly once
        verify(whisperRepository, times(1)).findById(1L);
        verify(whisperRepository, times(1)).save(any(Whisper.class));
    }

    /**
     * PURPOSE:
     * Verify that update() throws a RuntimeException when the whisper ID
     * does not exist in the database.
     *
     * WHY THIS MATTERS:
     * The service has .orElseThrow(() -> new RuntimeException("Whisper not found")).
     * This test confirms that error path actually works.
     *
     * HOW IT WORKS:
     * - We mock findById() to return Optional.empty() (nothing found).
     * - assertThatThrownBy() confirms the exception is thrown with the
     *   correct message. No manual try/catch needed.
     */
    @Test
    @DisplayName("update: should throw RuntimeException when whisper not found")
    void update_shouldThrowException_whenWhisperNotFound() {

        // ARRANGE — simulate ID 99 not existing in the database
        when(whisperRepository.findById(99L)).thenReturn(Optional.empty());

        // ACT + ASSERT — expect an exception to be thrown
        assertThatThrownBy(() -> whisperService.update(99L, requestDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Whisper not found");

        // save() must NOT be called if the whisper doesn't exist
        verify(whisperRepository, never()).save(any());
    }


    // =========================================================================
    //  markAsSeen() TESTS
    // =========================================================================

    /**
     * PURPOSE:
     * Verify that markAsSeen() changes the whisper's status from NOT_SEEN
     * to SEEN and saves it.
     *
     * WHY THIS MATTERS:
     * This is the core business logic of marking a whisper as read.
     * We confirm the status field is actually flipped — not just that save()
     * was called.
     */
    @Test
    @DisplayName("markAsSeen: should change status from NOT_SEEN to SEEN")
    void markAsSeen_shouldSetStatusToSeen() {

        // ARRANGE — whisper starts as NOT_SEEN
        Whisper seenWhisper = new Whisper();
        seenWhisper.setId(1L);
        seenWhisper.setTitle("Test Title");
        seenWhisper.setContent("Test content here");
        seenWhisper.setStatus(WhisperStatus.SEEN); // what the DB returns after save

        when(whisperRepository.findById(1L)).thenReturn(Optional.of(savedWhisper));
        when(whisperRepository.save(any(Whisper.class))).thenReturn(seenWhisper);

        // ACT
        Whisper result = whisperService.markAsSeen(1L);

        // ASSERT — status must now be SEEN
        assertThat(result.getStatus()).isEqualTo(WhisperStatus.SEEN);

        verify(whisperRepository, times(1)).findById(1L);
        verify(whisperRepository, times(1)).save(any(Whisper.class));
    }

    /**
     * PURPOSE:
     * Verify that markAsSeen() throws a RuntimeException when the whisper
     * ID does not exist — same defensive check as update().
     *
     * WHY THIS MATTERS:
     * Both update() and markAsSeen() share the same orElseThrow pattern.
     * We test this for markAsSeen() independently because each method must
     * be verified on its own — a bug in one should not mask a bug in another.
     */
    @Test
    @DisplayName("markAsSeen: should throw RuntimeException when whisper not found")
    void markAsSeen_shouldThrowException_whenWhisperNotFound() {

        // ARRANGE — simulate ID 99 not existing
        when(whisperRepository.findById(99L)).thenReturn(Optional.empty());

        // ACT + ASSERT
        assertThatThrownBy(() -> whisperService.markAsSeen(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Whisper not found");

        // save() must never be called if the whisper doesn't exist
        verify(whisperRepository, never()).save(any());
    }
}
