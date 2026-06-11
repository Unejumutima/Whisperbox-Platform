package com.whisperboxBackend.security;

import com.whisperboxBackend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Custom UserDetails implementation that wraps our User entity
 * This allows Spring Security to work with our custom User object
 */
@AllArgsConstructor
@Getter
public class CustomUserDetails implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convert user role to Spring Security authority
        return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
    }

    @Override
    public String getPassword() {
        // No password for OAuth2 users
        return null;
    }

    @Override
    public String getUsername() {
        // Use email as username
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // ADMIN accounts are always active regardless of approved flag.
        // STUDENT accounts require explicit admin approval.
        if (user.getRole() == com.whisperboxBackend.enums.Role.ADMIN) {
            return true;
        }
        return user.isApproved();
    }

    public Long getUserId() {
        return user.getId();
    }
}
