package com.skilltrack.dto;

import java.util.List;

public class GraduateProgressResponseDto {
    private UserSummaryDto graduate;
    private List<ModuleProgressDto> modules;
    private int totalModules;
    private int trainingCompletedCount;
    private double trainingPercentage;
    private int labCompletedCount;
    private int labRequiredTotal;
    private double labPercentage;
    private double overallPercentage;

    public GraduateProgressResponseDto() {
    }

    public UserSummaryDto getGraduate() {
        return graduate;
    }

    public void setGraduate(UserSummaryDto graduate) {
        this.graduate = graduate;
    }

    public List<ModuleProgressDto> getModules() {
        return modules;
    }

    public void setModules(List<ModuleProgressDto> modules) {
        this.modules = modules;
    }

    public int getTotalModules() {
        return totalModules;
    }

    public void setTotalModules(int totalModules) {
        this.totalModules = totalModules;
    }

    public int getTrainingCompletedCount() {
        return trainingCompletedCount;
    }

    public void setTrainingCompletedCount(int trainingCompletedCount) {
        this.trainingCompletedCount = trainingCompletedCount;
    }

    public double getTrainingPercentage() {
        return trainingPercentage;
    }

    public void setTrainingPercentage(double trainingPercentage) {
        this.trainingPercentage = trainingPercentage;
    }

    public int getLabCompletedCount() {
        return labCompletedCount;
    }

    public void setLabCompletedCount(int labCompletedCount) {
        this.labCompletedCount = labCompletedCount;
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
}
