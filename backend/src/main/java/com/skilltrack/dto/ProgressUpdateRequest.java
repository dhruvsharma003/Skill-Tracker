package com.skilltrack.dto;

import com.skilltrack.model.enums.LabStatus;
import com.skilltrack.model.enums.TrainingStatus;
import jakarta.validation.constraints.NotNull;

public class ProgressUpdateRequest {

    @NotNull(message = "Training status is required")
    private TrainingStatus trainingStatus;

    private LabStatus labStatus;

    private String evidenceUrl;

    private String evidenceNotes;

    public ProgressUpdateRequest() {
    }

    public ProgressUpdateRequest(TrainingStatus trainingStatus, LabStatus labStatus, String evidenceUrl, String evidenceNotes) {
        this.trainingStatus = trainingStatus;
        this.labStatus = labStatus;
        this.evidenceUrl = evidenceUrl;
        this.evidenceNotes = evidenceNotes;
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
}
