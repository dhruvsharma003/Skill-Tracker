package com.skilltrack.dto;

import java.time.LocalDateTime;

public class GraduateSummaryDto {
    private Long id;
    private String name;
    private String email;
    private Long mentorId;
    private String mentorName;
    private int trainingCompleted;
    private int totalModules;
    private double trainingPercentage;
    private int labCompleted;
    private int labRequiredTotal;
    private double labPercentage;
    private double overallPercentage;
    private String status; // "Completed", "On Track", "Behind", "Not Started"
    private LocalDateTime lastUpdated;

    public GraduateSummaryDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getMentorId() {
        return mentorId;
    }

    public void setMentorId(Long mentorId) {
        this.mentorId = mentorId;
    }

    public String getMentorName() {
        return mentorName;
    }

    public void setMentorName(String mentorName) {
        this.mentorName = mentorName;
    }

    public int getTrainingCompleted() {
        return trainingCompleted;
    }

    public void setTrainingCompleted(int trainingCompleted) {
        this.trainingCompleted = trainingCompleted;
    }

    public int getTotalModules() {
        return totalModules;
    }

    public void setTotalModules(int totalModules) {
        this.totalModules = totalModules;
    }

    public double getTrainingPercentage() {
        return trainingPercentage;
    }

    public void setTrainingPercentage(double trainingPercentage) {
        this.trainingPercentage = trainingPercentage;
    }

    public int getLabCompleted() {
        return labCompleted;
    }

    public void setLabCompleted(int labCompleted) {
        this.labCompleted = labCompleted;
    }

    public int getLabRequiredTotal() {
        return labRequiredTotal;
    }

    public void setLabRequiredTotal(int labRequiredTotal) {
        this.labRequiredTotal = labRequiredTotal;
    }

    public double getLabPercentage() {
        return labPercentage;
    }

    public void setLabPercentage(double labPercentage) {
        this.labPercentage = labPercentage;
    }

    public double getOverallPercentage() {
        return overallPercentage;
    }

    public void setOverallPercentage(double overallPercentage) {
        this.overallPercentage = overallPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
