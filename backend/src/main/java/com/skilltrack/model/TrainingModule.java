package com.skilltrack.model;

import jakarta.persistence.*;

@Entity
@Table(name = "training_modules")
public class TrainingModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "module_id")
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 100)
    private String topic;

    @Column(name = "sequence_no", nullable = false)
    private Integer sequenceNo;

    @Column(name = "lab_required", nullable = false)
    private Boolean labRequired;

    @Column(length = 500)
    private String description;

    @Column(name = "estimated_hours")
    private Integer estimatedHours;

    public TrainingModule() {
    }

    public TrainingModule(String title, String topic, Integer sequenceNo, Boolean labRequired, String description, Integer estimatedHours) {
        this.title = title;
        this.topic = topic;
        this.sequenceNo = sequenceNo;
        this.labRequired = labRequired;
        this.description = description;
        this.estimatedHours = estimatedHours;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
