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
 * CustomOAuth2UserService
 *
 * Called by Spring Security after Google successfully authenticates a user.
 * Responsibilities:
 *   1. Validate the email domain (school restriction)
 *   2. Detect the hardcoded admin email → assign ADMIN role, auto-approve
 *   3. Create new student accounts with anonymousName and approved = false
 *   4. Update lastLoginAt for returning users
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final AnonymousNameGenerator anonymousNameGenerator;

    @Value("${app.allowed.domain}")
    private String allowedDomain;

    // The one hardcoded admin — identified purely by email address.
    // Simple and easy to explain during an academic presentation.
    @Value("${app.admin.email}")
    private String adminEmail;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // 1. Let Google do its job and return the authenticated user's info
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2. Extract fields from Google's response
        String email    = oAuth2User.getAttribute("email");
        String fullName = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");

        // 3. Validate email is not null and belongs to the allowed domain
        if (email == null || !email.endsWith(allowedDomain)) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("invalid_domain"),
                    "Only accounts from " + allowedDomain + " can access this platform."
            );
        }

        // 4. Find existing user or create a new one
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(email, fullName, googleId));

        // 5. Always refresh the last login timestamp
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return oAuth2User;
    }

    /**
     * Creates a brand-new user on their very first login.
     *
     * Admin rule:   email matches adminEmail → ADMIN role, approved = true, no anonymousName needed
     * Student rule: all others → STUDENT role, approved = false, anonymousName generated
     */
    private User createNewUser(String email, String fullName, String googleId) {

        boolean isAdmin = email.equalsIgnoreCase(adminEmail);

        User user = User.builder()
                .email(email)
                .fullName(fullName)
                .googleId(googleId)
                .role(isAdmin ? Role.ADMIN : Role.STUDENT)
                .approved(isAdmin)  // admin is auto-approved; students need manual approval
                .anonymousName(isAdmin ? null : anonymousNameGenerator.generate())
                .registeredAt(LocalDateTime.now())
                .lastLoginAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }
}
