package com.skilltrack.dto;

public class ModuleDto {
    private Long id;
    private String title;
    private String topic;
    private Integer sequenceNo;
    private Boolean labRequired;
    private String description;
    private Integer estimatedHours;

    public ModuleDto() {
    }

    public ModuleDto(Long id, String title, String topic, Integer sequenceNo, Boolean labRequired, String description, Integer estimatedHours) {
        this.id = id;
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
