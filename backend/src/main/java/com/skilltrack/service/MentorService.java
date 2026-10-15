package com.skilltrack.service;

import com.skilltrack.dto.*;
import com.skilltrack.model.Graduate;
import com.skilltrack.model.TrainingModule;
import com.skilltrack.model.TrainingProgress;
import com.skilltrack.model.enums.LabStatus;
import com.skilltrack.model.enums.Role;
import com.skilltrack.model.enums.TrainingStatus;
import com.skilltrack.repository.GraduateRepository;
import com.skilltrack.repository.TrainingModuleRepository;
import com.skilltrack.repository.TrainingProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MentorService {

    private final GraduateRepository graduateRepository;
    private final TrainingModuleRepository moduleRepository;
    private final TrainingProgressRepository progressRepository;
    private final GraduateService graduateService;

    public MentorService(GraduateRepository graduateRepository,
                         TrainingModuleRepository moduleRepository,
                         TrainingProgressRepository progressRepository,
                         GraduateService graduateService) {
        this.graduateRepository = graduateRepository;
        this.moduleRepository = moduleRepository;
        this.progressRepository = progressRepository;
        this.graduateService = graduateService;
    }

    @Transactional(readOnly = true)
    public List<GraduateSummaryDto> getAllGraduatesSummary() {
        List<Graduate> graduates = graduateRepository.findByRole(Role.GRADUATE);
        List<Graduate> mentors = graduateRepository.findByRole(Role.MENTOR);
        Map<Long, String> mentorMap = mentors.stream()
                .collect(Collectors.toMap(Graduate::getId, Graduate::getName, (a, b) -> a));

        List<TrainingModule> modules = moduleRepository.findAllByOrderBySequenceNoAsc();
        int totalModules = modules.size();
        int totalLabRequired = (int) modules.stream().filter(m -> Boolean.TRUE.equals(m.getLabRequired())).count();

        List<Long> gradIds = graduates.stream().map(Graduate::getId).collect(Collectors.toList());
        List<TrainingProgress> allProgress = gradIds.isEmpty() ? Collections.emptyList() : progressRepository.findByGraduateIdIn(gradIds);

        Map<Long, List<TrainingProgress>> progressByGrad = allProgress.stream()
                .collect(Collectors.groupingBy(p -> p.getGraduate().getId()));

        List<GraduateSummaryDto> result = new ArrayList<>();

        for (Graduate grad : graduates) {
            List<TrainingProgress> gradProgressList = progressByGrad.getOrDefault(grad.getId(), Collections.emptyList());

            int trainingCompleted = 0;
            int labCompleted = 0;
            LocalDateTime latestUpdated = grad.getCreatedAt();

            for (TrainingProgress tp : gradProgressList) {
                if (tp.getTrainingStatus() == TrainingStatus.COMPLETED) {
                    trainingCompleted++;
                }
                if (tp.getLabStatus() == LabStatus.COMPLETED || tp.getLabStatus() == LabStatus.WAIVED) {
                    labCompleted++;
                }
                if (tp.getUpdatedAt() != null && (latestUpdated == null || tp.getUpdatedAt().isAfter(latestUpdated))) {
                    latestUpdated = tp.getUpdatedAt();
                }
            }

            double trainingPct = totalModules > 0 ? Math.round(((double) trainingCompleted / totalModules * 100.0) * 10.0) / 10.0 : 0.0;
            double labPct = totalLabRequired > 0 ? Math.round(((double) labCompleted / totalLabRequired * 100.0) * 10.0) / 10.0 : 0.0;
            double overallPct = totalLabRequired > 0 ? Math.round(((trainingPct * 0.5) + (labPct * 0.5)) * 10.0) / 10.0 : trainingPct;

            String status;
            if (overallPct >= 100.0) {
                status = "Completed";
            } else if (overallPct >= 50.0) {
                status = "On Track";
            } else if (overallPct > 0.0) {
                status = "Behind";
            } else {
                status = "Not Started";
            }

            GraduateSummaryDto dto = new GraduateSummaryDto();
            dto.setId(grad.getId());
            dto.setName(grad.getName());
            dto.setEmail(grad.getEmail());
            dto.setMentorId(grad.getMentorId());
            dto.setMentorName(grad.getMentorId() != null ? mentorMap.getOrDefault(grad.getMentorId(), "Unassigned") : "Unassigned");
            dto.setTrainingCompleted(trainingCompleted);
            dto.setTotalModules(totalModules);
            dto.setTrainingPercentage(trainingPct);
            dto.setLabCompleted(labCompleted);
            dto.setLabRequiredTotal(totalLabRequired);
            dto.setLabPercentage(labPct);
            dto.setOverallPercentage(overallPct);
            dto.setStatus(status);
            dto.setLastUpdated(latestUpdated);

            result.add(dto);
        }

        // Sort by name by default
        result.sort(Comparator.comparing(GraduateSummaryDto::getName));
        return result;
    }

    @Transactional(readOnly = true)
    public CohortStatsDto getCohortStats() {
        List<GraduateSummaryDto> summaries = getAllGraduatesSummary();
        int total = summaries.size();

        double totalTrainingPct = 0;
        double totalLabPct = 0;
        double totalOverallPct = 0;
        int completed = 0;
        int onTrack = 0;
        int behind = 0;
        int notStarted = 0;

        for (GraduateSummaryDto s : summaries) {
            totalTrainingPct += s.getTrainingPercentage();
            totalLabPct += s.getLabPercentage();
            totalOverallPct += s.getOverallPercentage();

            switch (s.getStatus()) {
                case "Completed" -> completed++;
                case "On Track" -> onTrack++;
                case "Behind" -> behind++;
                default -> notStarted++;
            }
        }

        List<Graduate> gradEntities = graduateRepository.findByRole(Role.GRADUATE);
        List<Long> gradIds = gradEntities.stream().map(Graduate::getId).collect(Collectors.toList());
        List<TrainingProgress> progressList = gradIds.isEmpty() ? Collections.emptyList() : progressRepository.findByGraduateIdIn(gradIds);
        int evidenceCount = (int) progressList.stream()
                .filter(p -> p.getEvidenceUrl() != null && !p.getEvidenceUrl().isBlank())
                .count();

        CohortStatsDto stats = new CohortStatsDto();
        stats.setTotalGraduates(total);
        stats.setCohortAvgTrainingPercentage(total > 0 ? Math.round((totalTrainingPct / total) * 10.0) / 10.0 : 0.0);
        stats.setCohortAvgLabPercentage(total > 0 ? Math.round((totalLabPct / total) * 10.0) / 10.0 : 0.0);
        stats.setCohortAvgOverallPercentage(total > 0 ? Math.round((totalOverallPct / total) * 10.0) / 10.0 : 0.0);
        stats.setCompletedCount(completed);
        stats.setOnTrackCount(onTrack);
        stats.setBehindCount(behind);
        stats.setNotStartedCount(notStarted);
        stats.setTotalEvidenceSubmitted(evidenceCount);

        return stats;
    }

    @Transactional(readOnly = true)
    public GraduateProgressResponseDto getGraduateDetails(Long graduateId) {
        return graduateService.getGraduateProgress(graduateId);
    }

    @Transactional(readOnly = true)
    public byte[] generateCsvExport() {
        List<GraduateSummaryDto> summaries = getAllGraduatesSummary();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            writer.println("Graduate ID,Name,Email,Assigned Mentor,Training Completed,Total Modules,Training %,Labs Completed,Total Labs,Lab %,Overall Progress %,Status,Last Updated");

            for (GraduateSummaryDto g : summaries) {
                String row = String.format("%d,\"%s\",\"%s\",\"%s\",%d,%d,%.1f%%,%d,%d,%.1f%%,%.1f%%,\"%s\",\"%s\"",
                        g.getId(),
                        escapeCsv(g.getName()),
                        escapeCsv(g.getEmail()),
                        escapeCsv(g.getMentorName()),
                        g.getTrainingCompleted(),
                        g.getTotalModules(),
                        g.getTrainingPercentage(),
                        g.getLabCompleted(),
                        g.getLabRequiredTotal(),
                        g.getLabPercentage(),
                        g.getOverallPercentage(),
                        g.getStatus(),
                        g.getLastUpdated() != null ? g.getLastUpdated().toString() : "N/A"
                );
                writer.println(row);
            }
        }
        return out.toByteArray();
    }

    private String escapeCsv(String input) {
        if (input == null) return "";
        return input.replace("\"", "\"\"");
    }
}
