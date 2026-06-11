package com.whisperboxBackend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.whisperboxBackend.entity.User;
import com.whisperboxBackend.enums.Role;
import com.whisperboxBackend.repository.UserRepository;
import com.whisperboxBackend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

/**
 * JWT Authentication Filter
 * Intercepts requests and validates JWT tokens
 * If valid, sets authentication in Spring Security context
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Extract JWT token from Authorization header
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix

            try {
                // Extract email from token
                String email = jwtUtil.extractEmail(token);

                // If email exists and no authentication is set yet
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Find user from database
                    User user = userRepository.findByEmail(email).orElse(null);

                    // Validate token and authenticate user
                    if (user != null && jwtUtil.validateToken(token, email)) {

                        // Approval check — ADMIN accounts are always allowed through.
                        // STUDENT accounts must have approved = true.
                        if (user.getRole() != Role.ADMIN && !user.isApproved()) {
                            // Write a clear JSON error and stop the filter chain
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            String body = new ObjectMapper().writeValueAsString(
                                Map.of("error", "Your account is waiting for administrator approval.")
                            );
                            response.getWriter().write(body);
                            return; // do NOT continue the filter chain
                        }

                        CustomUserDetails userDetails = new CustomUserDetails(user);

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );

                        // Set authentication in security context
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (Exception e) {
                // Token is invalid, continue without authentication
                logger.error("JWT validation failed: " + e.getMessage());
            }
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }
}
