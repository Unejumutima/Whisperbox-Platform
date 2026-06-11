package com.whisperboxBackend;

import com.whisperboxBackend.dto.WhisperRequestDTO;
import com.whisperboxBackend.entity.User;
import com.whisperboxBackend.entity.Whisper;
import com.whisperboxBackend.enums.Role;
import com.whisperboxBackend.enums.WhisperStatus;
import com.whisperboxBackend.repository.UserRepository;
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
 * Uses JUnit 5 + Mockito.
 * No real database is involved — repositories are mocked.
 *
 * WhisperService now requires both WhisperRepository and UserRepository,
 * so both are mocked here.
 */
@ExtendWith(MockitoExtension.class)
class WhisperServiceTest {

    @Mock
    private WhisperRepository whisperRepository;

    @Mock
    private UserRepository userRepository;   // needed after createWhisper(dto, userId)

    @InjectMocks
    private WhisperService whisperService;

    // Reusable test data
    private WhisperRequestDTO requestDTO;
    private Whisper            savedWhisper;
    private User               testUser;

    @BeforeEach
    void setUp() {
        // A typical student user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("student@test.com");
        testUser.setAnonymousName("Silent Panda");
        testUser.setRole(Role.STUDENT);
        testUser.setApproved(true);

        // A typical request from the client
        requestDTO = new WhisperRequestDTO("Test Title", "Test content here");

        // What the database returns after saving a whisper
        savedWhisper = new Whisper();
        savedWhisper.setId(1L);
        savedWhisper.setTitle("Test Title");
        savedWhisper.setContent("Test content here");
        savedWhisper.setStatus(WhisperStatus.NOT_SEEN);
        savedWhisper.setCreatedAt(LocalDateTime.now());
        savedWhisper.setCreatedBy(testUser);
        savedWhisper.setAnonymousName("Silent Panda");
    }


    // =========================================================================
    //  createWhisper() TESTS
    // =========================================================================

    /**
     * PURPOSE: Verify that createWhisper() maps DTO fields onto the entity,
     * links the author, and calls repository.save() exactly once.
     */
    @Test
    @DisplayName("createWhisper: should save whisper with correct title and content")
    void createWhisper_shouldSaveWhisperWithCorrectFields() {

        // ARRANGE
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(whisperRepository.save(any(Whisper.class))).thenReturn(savedWhisper);

        // ACT — note: createWhisper now requires (dto, userId)
        Whisper result = whisperService.createWhisper(requestDTO, 1L);

        // ASSERT
        assertThat(result.getTitle()).isEqualTo("Test Title");
        assertThat(result.getContent()).isEqualTo("Test content here");

        verify(userRepository,    times(1)).findById(1L);
        verify(whisperRepository, times(1)).save(any(Whisper.class));
    }

    /**
     * PURPOSE: Verify that createWhisper() sets status = NOT_SEEN
     * and createdAt automatically — the caller cannot control these.
     */
    @Test
    @DisplayName("createWhisper: should set status NOT_SEEN and createdAt automatically")
    void createWhisper_shouldSetStatusAndTimestamp() {

        // ARRANGE
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(whisperRepository.save(any(Whisper.class))).thenReturn(savedWhisper);

        // ACT
        Whisper result = whisperService.createWhisper(requestDTO, 1L);

        // ASSERT
        assertThat(result.getStatus()).isEqualTo(WhisperStatus.NOT_SEEN);
        assertThat(result.getCreatedAt()).isNotNull();
    }


    // =========================================================================
    //  update() TESTS
    // =========================================================================

    /**
     * PURPOSE: Verify that update() applies new title/content and saves.
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

        verify(whisperRepository, times(1)).findById(1L);
        verify(whisperRepository, times(1)).save(any(Whisper.class));
    }

    /**
     * PURPOSE: Verify that update() throws RuntimeException when the ID
     * does not exist in the database.
     */
    @Test
    @DisplayName("update: should throw RuntimeException when whisper not found")
    void update_shouldThrowException_whenWhisperNotFound() {

        // ARRANGE
        when(whisperRepository.findById(99L)).thenReturn(Optional.empty());

        // ACT + ASSERT
        assertThatThrownBy(() -> whisperService.update(99L, requestDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Whisper not found");

        verify(whisperRepository, never()).save(any());
    }


    // =========================================================================
    //  delete() TESTS
    // =========================================================================

    /**
     * PURPOSE: Verify that a NOT_SEEN whisper can be deleted successfully.
     */
    @Test
    @DisplayName("delete: should delete a NOT_SEEN whisper")
    void delete_shouldDeleteNotSeenWhisper() {

        // ARRANGE — whisper is NOT_SEEN (deletable)
        when(whisperRepository.findById(1L)).thenReturn(Optional.of(savedWhisper));
        doNothing().when(whisperRepository).delete(savedWhisper);

        // ACT — should not throw
        whisperService.delete(1L);

        // ASSERT
        verify(whisperRepository, times(1)).delete(savedWhisper);
    }

    /**
     * PURPOSE: Verify that a SEEN whisper CANNOT be deleted.
     * Once admin has seen it, the student can no longer remove it.
     */
    @Test
    @DisplayName("delete: should throw RuntimeException when whisper is already SEEN")
    void delete_shouldThrowException_whenWhisperIsSeen() {

        // ARRANGE — whisper has been seen by admin
        Whisper seenWhisper = new Whisper();
        seenWhisper.setId(2L);
        seenWhisper.setStatus(WhisperStatus.SEEN);

        when(whisperRepository.findById(2L)).thenReturn(Optional.of(seenWhisper));

        // ACT + ASSERT
        assertThatThrownBy(() -> whisperService.delete(2L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("already been seen");

        // delete() must never be called on a SEEN whisper
        verify(whisperRepository, never()).delete(any());
    }


    // =========================================================================
    //  markAsSeen() TESTS
    // =========================================================================

    /**
     * PURPOSE: Verify that markAsSeen() flips status to SEEN and saves.
     */
    @Test
    @DisplayName("markAsSeen: should change status from NOT_SEEN to SEEN")
    void markAsSeen_shouldSetStatusToSeen() {

        // ARRANGE
        Whisper seenWhisper = new Whisper();
        seenWhisper.setId(1L);
        seenWhisper.setStatus(WhisperStatus.SEEN);

        when(whisperRepository.findById(1L)).thenReturn(Optional.of(savedWhisper));
        when(whisperRepository.save(any(Whisper.class))).thenReturn(seenWhisper);

        // ACT
        Whisper result = whisperService.markAsSeen(1L);

        // ASSERT
        assertThat(result.getStatus()).isEqualTo(WhisperStatus.SEEN);

        verify(whisperRepository, times(1)).findById(1L);
        verify(whisperRepository, times(1)).save(any(Whisper.class));
    }

    /**
     * PURPOSE: Verify that markAsSeen() throws when the whisper ID is missing.
     */
    @Test
    @DisplayName("markAsSeen: should throw RuntimeException when whisper not found")
    void markAsSeen_shouldThrowException_whenWhisperNotFound() {

        // ARRANGE
        when(whisperRepository.findById(99L)).thenReturn(Optional.empty());

        // ACT + ASSERT
        assertThatThrownBy(() -> whisperService.markAsSeen(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Whisper not found");

        verify(whisperRepository, never()).save(any());
    }
}
