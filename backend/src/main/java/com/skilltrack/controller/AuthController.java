package com.skilltrack.controller;

import com.skilltrack.dto.AuthRequest;
import com.skilltrack.dto.AuthResponse;
import com.skilltrack.dto.UserSummaryDto;
import com.skilltrack.model.Graduate;
import com.skilltrack.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserSummaryDto> getCurrentUser(@AuthenticationPrincipal Graduate currentGraduate) {
        UserSummaryDto response = authService.getCurrentUser(currentGraduate);
        return ResponseEntity.ok(response);
    }
}
