package com.skilltrack.service;

import com.skilltrack.config.JwtUtil;
import com.skilltrack.dto.AuthRequest;
import com.skilltrack.dto.AuthResponse;
import com.skilltrack.dto.UserSummaryDto;
import com.skilltrack.exception.ResourceNotFoundException;
import com.skilltrack.exception.UnauthorizedException;
import com.skilltrack.model.Graduate;
import com.skilltrack.repository.GraduateRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final GraduateRepository graduateRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(GraduateRepository graduateRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.graduateRepository = graduateRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(AuthRequest request) {
        Graduate graduate = graduateRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), graduate.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(graduate);
        UserSummaryDto userSummary = new UserSummaryDto(
                graduate.getId(),
                graduate.getName(),
                graduate.getEmail(),
                graduate.getRole(),
                graduate.getMentorId()
        );

        return new AuthResponse(token, userSummary);
    }

    public UserSummaryDto getCurrentUser(Graduate currentGraduate) {
        if (currentGraduate == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        Graduate graduate = graduateRepository.findById(currentGraduate.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new UserSummaryDto(
                graduate.getId(),
                graduate.getName(),
                graduate.getEmail(),
                graduate.getRole(),
                graduate.getMentorId()
        );
    }
}
