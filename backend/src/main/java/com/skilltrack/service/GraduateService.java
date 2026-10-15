package com.skilltrack.service;

import com.skilltrack.dto.*;
import com.skilltrack.exception.ResourceNotFoundException;
import com.skilltrack.model.Graduate;
import com.skilltrack.model.TrainingModule;
import com.skilltrack.model.TrainingProgress;
import com.skilltrack.model.enums.LabStatus;
import com.skilltrack.model.enums.TrainingStatus;
import com.skilltrack.repository.GraduateRepository;
import com.skilltrack.repository.TrainingModuleRepository;
import com.skilltrack.repository.TrainingProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GraduateService {

    private final GraduateRepository graduateRepository;
    private final TrainingModuleRepository moduleRepository;
    private final TrainingProgressRepository progressRepository;

    public GraduateService(GraduateRepository graduateRepository,
                           TrainingModuleRepository moduleRepository,
                           TrainingProgressRepository progressRepository) {
        this.graduateRepository = graduateRepository;
        this.moduleRepository = moduleRepository;
        this.progressRepository = progressRepository;
    }

    @Transactional(readOnly = true)
    public GraduateProgressResponseDto getGraduateProgress(Long graduateId) {
        Graduate graduate = graduateRepository.findById(graduateId)
                .orElseThrow(() -> new ResourceNotFoundException("Graduate not found with ID: " + graduateId));

        List<TrainingModule> modules = moduleRepository.findAllByOrderBySequenceNoAsc();
        List<TrainingProgress> progressList = progressRepository.findByGraduateId(graduateId);

        Map<Long, TrainingProgress> progressMap = progressList.stream()
                .collect(Collectors.toMap(p -> p.getModule().getId(), p -> p, (a, b) -> a));

        List<ModuleProgressDto> moduleProgressDtos = new ArrayList<>();
        int trainingCompletedCount = 0;
        int labCompletedCount = 0;
        int labRequiredCount = 0;

        for (TrainingModule module : modules) {
            ModuleProgressDto dto = new ModuleProgressDto();
            dto.setModuleId(module.getId());
            dto.setTitle(module.getTitle());
            dto.setTopic(module.getTopic());
            dto.setSequenceNo(module.getSequenceNo());
            dto.setLabRequired(module.getLabRequired());
            dto.setDescription(module.getDescription());
            dto.setEstimatedHours(module.getEstimatedHours());

            if (Boolean.TRUE.equals(module.getLabRequired())) {
                labRequiredCount++;
            }

            TrainingProgress progress = progressMap.get(module.getId());
            if (progress != null) {
                dto.setTrainingStatus(progress.getTrainingStatus());
                dto.setLabStatus(progress.getLabStatus());
                dto.setEvidenceUrl(progress.getEvidenceUrl());
                dto.setEvidenceNotes(progress.getEvidenceNotes());
                dto.setUpdatedAt(progress.getUpdatedAt());

                if (progress.getTrainingStatus() == TrainingStatus.COMPLETED) {
                    trainingCompletedCount++;
                }

                if (Boolean.TRUE.equals(module.getLabRequired()) &&
                        (progress.getLabStatus() == LabStatus.COMPLETED || progress.getLabStatus() == LabStatus.WAIVED)) {
                    labCompletedCount++;
                }
            } else {
                dto.setTrainingStatus(TrainingStatus.NOT_STARTED);
                dto.setLabStatus(LabStatus.NOT_STARTED);
                dto.setEvidenceUrl(null);
                dto.setEvidenceNotes(null);
                dto.setUpdatedAt(null);
            }

            moduleProgressDtos.add(dto);
        }

        int totalModules = modules.size();
        double trainingPercentage = totalModules > 0 ? Math.round(((double) trainingCompletedCount / totalModules * 100.0) * 10.0) / 10.0 : 0.0;
        double labPercentage = labRequiredCount > 0 ? Math.round(((double) labCompletedCount / labRequiredCount * 100.0) * 10.0) / 10.0 : 0.0;

        // Overall progress weighted calculation (50% training + 50% labs)
        double overallPercentage = (labRequiredCount > 0)
                ? Math.round(((trainingPercentage * 0.5) + (labPercentage * 0.5)) * 10.0) / 10.0
                : trainingPercentage;

        GraduateProgressResponseDto response = new GraduateProgressResponseDto();
        response.setGraduate(new UserSummaryDto(
                graduate.getId(),
                graduate.getName(),
                graduate.getEmail(),
                graduate.getRole(),
                graduate.getMentorId()
        ));
        response.setModules(moduleProgressDtos);
        response.setTotalModules(totalModules);
        response.setTrainingCompletedCount(trainingCompletedCount);
        response.setTrainingPercentage(trainingPercentage);
        response.setLabCompletedCount(labCompletedCount);
        response.setLabRequiredTotal(labRequiredCount);
        response.setLabPercentage(labPercentage);
        response.setOverallPercentage(overallPercentage);

        return response;
    }

    @Transactional
    public ModuleProgressDto updateProgress(Long graduateId, Long moduleId, ProgressUpdateRequest request) {
        Graduate graduate = graduateRepository.findById(graduateId)
                .orElseThrow(() -> new ResourceNotFoundException("Graduate not found with ID: " + graduateId));

        TrainingModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module not found with ID: " + moduleId));

        TrainingProgress progress = progressRepository.findByGraduateIdAndModuleId(graduateId, moduleId)
                .orElseGet(() -> {
                    TrainingProgress tp = new TrainingProgress();
                    tp.setGraduate(graduate);
                    tp.setModule(module);
                    return tp;
                });

        if (request.getTrainingStatus() != null) {
            progress.setTrainingStatus(request.getTrainingStatus());
        }

        if (Boolean.TRUE.equals(module.getLabRequired())) {
            if (request.getLabStatus() != null) {
                progress.setLabStatus(request.getLabStatus());
            }
        } else {
            progress.setLabStatus(LabStatus.WAIVED);
        }

        progress.setEvidenceUrl(request.getEvidenceUrl());
        progress.setEvidenceNotes(request.getEvidenceNotes());
        progress.setUpdatedAt(LocalDateTime.now());

        TrainingProgress saved = progressRepository.save(progress);

        ModuleProgressDto dto = new ModuleProgressDto();
        dto.setModuleId(module.getId());
        dto.setTitle(module.getTitle());
        dto.setTopic(module.getTopic());
        dto.setSequenceNo(module.getSequenceNo());
        dto.setLabRequired(module.getLabRequired());
        dto.setDescription(module.getDescription());
        dto.setEstimatedHours(module.getEstimatedHours());
        dto.setTrainingStatus(saved.getTrainingStatus());
        dto.setLabStatus(saved.getLabStatus());
        dto.setEvidenceUrl(saved.getEvidenceUrl());
        dto.setEvidenceNotes(saved.getEvidenceNotes());
        dto.setUpdatedAt(saved.getUpdatedAt());

        return dto;
    }
}
