package com.skilltrack.dto;

public class CohortStatsDto {
    private int totalGraduates;
    private double cohortAvgTrainingPercentage;
    private double cohortAvgLabPercentage;
    private double cohortAvgOverallPercentage;
    private int completedCount;
    private int onTrackCount;
    private int behindCount;
    private int notStartedCount;
    private int totalEvidenceSubmitted;

    public CohortStatsDto() {
    }

    public int getTotalGraduates() {
        return totalGraduates;
    }

    public void setTotalGraduates(int totalGraduates) {
        this.totalGraduates = totalGraduates;
    }

    public double getCohortAvgTrainingPercentage() {
        return cohortAvgTrainingPercentage;
    }

    public void setCohortAvgTrainingPercentage(double cohortAvgTrainingPercentage) {
        this.cohortAvgTrainingPercentage = cohortAvgTrainingPercentage;
    }

    public double getCohortAvgLabPercentage() {
        return cohortAvgLabPercentage;
    }

    public void setCohortAvgLabPercentage(double cohortAvgLabPercentage) {
        this.cohortAvgLabPercentage = cohortAvgLabPercentage;
    }

    public double getCohortAvgOverallPercentage() {
        return cohortAvgOverallPercentage;
    }

    public void setCohortAvgOverallPercentage(double cohortAvgOverallPercentage) {
        this.cohortAvgOverallPercentage = cohortAvgOverallPercentage;
    }

    public int getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(int completedCount) {
        this.completedCount = completedCount;
    }

    public int getOnTrackCount() {
        return onTrackCount;
    }

    public void setOnTrackCount(int onTrackCount) {
        this.onTrackCount = onTrackCount;
    }

    public int getBehindCount() {
        return behindCount;
    }

    public void setBehindCount(int behindCount) {
        this.behindCount = behindCount;
    }

    public int getNotStartedCount() {
        return notStartedCount;
    }

    public void setNotStartedCount(int notStartedCount) {
        this.notStartedCount = notStartedCount;
    }

    public int getTotalEvidenceSubmitted() {
        return totalEvidenceSubmitted;
    }

    public void setTotalEvidenceSubmitted(int totalEvidenceSubmitted) {
        this.totalEvidenceSubmitted = totalEvidenceSubmitted;
    }
}
