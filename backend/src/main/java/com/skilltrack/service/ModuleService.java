package com.skilltrack.service;

import com.skilltrack.dto.ModuleDto;
import com.skilltrack.model.TrainingModule;
import com.skilltrack.repository.TrainingModuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModuleService {

    private final TrainingModuleRepository moduleRepository;

    public ModuleService(TrainingModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    public List<ModuleDto> getAllModules() {
        return moduleRepository.findAllByOrderBySequenceNoAsc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ModuleDto mapToDto(TrainingModule module) {
        return new ModuleDto(
                module.getId(),
                module.getTitle(),
                module.getTopic(),
                module.getSequenceNo(),
                module.getLabRequired(),
                module.getDescription(),
                module.getEstimatedHours()
        );
    }
}
