package com.skilltrack.controller;

import com.skilltrack.dto.GraduateProgressResponseDto;
import com.skilltrack.dto.ModuleProgressDto;
import com.skilltrack.dto.ProgressUpdateRequest;
import com.skilltrack.model.Graduate;
import com.skilltrack.service.GraduateService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/graduate")
public class GraduateController {

    private final GraduateService graduateService;

    public GraduateController(GraduateService graduateService) {
        this.graduateService = graduateService;
    }

    @GetMapping("/progress")
    public ResponseEntity<GraduateProgressResponseDto> getMyProgress(@AuthenticationPrincipal Graduate currentGraduate) {
        GraduateProgressResponseDto response = graduateService.getGraduateProgress(currentGraduate.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/progress/{moduleId}")
    public ResponseEntity<ModuleProgressDto> updateMyProgress(
            @PathVariable Long moduleId,
            @Valid @RequestBody ProgressUpdateRequest request,
            @AuthenticationPrincipal Graduate currentGraduate) {
        ModuleProgressDto response = graduateService.updateProgress(currentGraduate.getId(), moduleId, request);
        return ResponseEntity.ok(response);
    }
}
