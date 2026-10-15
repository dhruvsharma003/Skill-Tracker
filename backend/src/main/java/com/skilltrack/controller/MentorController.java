package com.skilltrack.controller;

import com.skilltrack.dto.CohortStatsDto;
import com.skilltrack.dto.GraduateProgressResponseDto;
import com.skilltrack.dto.GraduateSummaryDto;
import com.skilltrack.service.MentorService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor")
public class MentorController {

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }

    @GetMapping("/graduates")
    public ResponseEntity<List<GraduateSummaryDto>> getAllGraduates() {
        List<GraduateSummaryDto> graduates = mentorService.getAllGraduatesSummary();
        return ResponseEntity.ok(graduates);
    }

    @GetMapping("/graduates/{graduateId}/progress")
    public ResponseEntity<GraduateProgressResponseDto> getGraduateProgressDetails(@PathVariable Long graduateId) {
        GraduateProgressResponseDto details = mentorService.getGraduateDetails(graduateId);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/stats")
    public ResponseEntity<CohortStatsDto> getCohortStats() {
        CohortStatsDto stats = mentorService.getCohortStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCohortToCsv() {
        byte[] csvData = mentorService.generateCsvExport();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"skilltrack_cohort_progress.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvData);
    }
}
