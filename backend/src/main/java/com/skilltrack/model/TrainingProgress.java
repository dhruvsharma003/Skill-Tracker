package com.skilltrack.model;

import com.skilltrack.model.enums.LabStatus;
import com.skilltrack.model.enums.TrainingStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "training_progress",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"graduate_id", "module_id"})
    }
)
public class TrainingProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graduate_id", nullable = false)
    private Graduate graduate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "module_id", nullable = false)
    private TrainingModule module;

    @Enumerated(EnumType.STRING)
    @Column(name = "training_status", nullable = false, length = 30)
    private TrainingStatus trainingStatus = TrainingStatus.NOT_STARTED;

    @Enumerated(EnumType.STRING)
    @Column(name = "lab_status", nullable = false, length = 30)
    private LabStatus labStatus = LabStatus.NOT_STARTED;

    @Column(name = "evidence_url", length = 500)
    private String evidenceUrl;

    @Column(name = "evidence_notes", length = 1000)
    private String evidenceNotes;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public TrainingProgress() {
    }

    public TrainingProgress(Graduate graduate, TrainingModule module, TrainingStatus trainingStatus, LabStatus labStatus, String evidenceUrl, String evidenceNotes) {
        this.graduate = graduate;
        this.module = module;
        this.trainingStatus = trainingStatus != null ? trainingStatus : TrainingStatus.NOT_STARTED;
        this.labStatus = labStatus != null ? labStatus : LabStatus.NOT_STARTED;
        this.evidenceUrl = evidenceUrl;
        this.evidenceNotes = evidenceNotes;
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Graduate getGraduate() {
        return graduate;
    }

    public void setGraduate(Graduate graduate) {
        this.graduate = graduate;
    }

    public TrainingModule getModule() {
        return module;
    }

    public void setModule(TrainingModule module) {
        this.module = module;
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
