package com.skilltrack.dto;

import com.skilltrack.model.enums.LabStatus;
import com.skilltrack.model.enums.TrainingStatus;
import java.time.LocalDateTime;

public class ModuleProgressDto {
    private Long moduleId;
    private String title;
    private String topic;
    private Integer sequenceNo;
    private Boolean labRequired;
    private String description;
    private Integer estimatedHours;
    private TrainingStatus trainingStatus;
    private LabStatus labStatus;
    private String evidenceUrl;
    private String evidenceNotes;
    private LocalDateTime updatedAt;

    public ModuleProgressDto() {
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Integer getSequenceNo() {
        return sequenceNo;
    }

    public void setSequenceNo(Integer sequenceNo) {
        this.sequenceNo = sequenceNo;
    }

    public Boolean getLabRequired() {
        return labRequired;
    }

    public void setLabRequired(Boolean labRequired) {
        this.labRequired = labRequired;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Integer estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public TrainingStatus getTrainingStatus() {
        return trainingStatus;
    }

    public void setTrainingStatus(TrainingStatus trainingStatus) {
        this.trainingStatus = trainingStatus;
    }

    public LabStatus getLabStatus() {
        return labStatus;
    }

    public void setLabStatus(LabStatus labStatus) {
        this.labStatus = labStatus;
    }

    public String getEvidenceUrl() {
        return evidenceUrl;
    }

    public void setEvidenceUrl(String evidenceUrl) {
        this.evidenceUrl = evidenceUrl;
    }

    public String getEvidenceNotes() {
        return evidenceNotes;
    }

    public void setEvidenceNotes(String evidenceNotes) {
        this.evidenceNotes = evidenceNotes;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
