package com.whisperboxBackend.service;

import com.whisperboxBackend.entity.User;
import com.whisperboxBackend.enums.Role;
import com.whisperboxBackend.repository.UserRepository;
import com.whisperboxBackend.util.AnonymousNameGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Custom OAuth2 User Service
 * Handles user authentication and registration through Google OAuth2
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final AnonymousNameGenerator anonymousNameGenerator;

    @Value("${app.allowed.domain}")
    private String allowedDomain;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Get user info from Google
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extract user details
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");

        // Validate email domain (school restriction)
        if (email == null || !email.endsWith(allowedDomain)) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("invalid_domain"),
                    "Only students from " + allowedDomain + " can access this platform"
            );
        }

        // Check if user already exists, otherwise create new user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(email, name, googleId));

        // Update last login time
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return oAuth2User;
    }

    /**
     * Create a new user with anonymous identity.
     * approved = false by default — admin must approve before they can use the platform.
     */
    private User createNewUser(String email, String name, String googleId) {
        User user = User.builder()
                .email(email)
                .fullName(name)
                .googleId(googleId)
                .role(Role.STUDENT)
                .anonymousName(anonymousNameGenerator.generate())
                .approved(false)   // requires admin approval before access is granted
                .registeredAt(LocalDateTime.now())
                .lastLoginAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }
}
