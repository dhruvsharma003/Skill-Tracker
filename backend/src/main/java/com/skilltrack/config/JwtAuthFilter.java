package com.skilltrack.config;

import com.skilltrack.model.Graduate;
import com.skilltrack.repository.GraduateRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final GraduateRepository graduateRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, GraduateRepository graduateRepository) {
        this.jwtUtil = jwtUtil;
        this.graduateRepository = graduateRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        try {
            final String userEmail = jwtUtil.extractEmail(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Optional<Graduate> graduateOpt = graduateRepository.findByEmail(userEmail);

                if (graduateOpt.isPresent() && jwtUtil.isTokenValid(jwt, userEmail)) {
                    Graduate graduate = graduateOpt.get();
                    String roleName = "ROLE_" + graduate.getRole().name();
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleName);

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            graduate,
                            null,
                            Collections.singletonList(authority)
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ex) {
            // Invalid / expired token - SecurityContext remains null and chain continues
            logger.debug("Failed to authenticate JWT token: " + ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
