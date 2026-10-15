package com.skilltrack.repository;

import com.skilltrack.model.Graduate;
import com.skilltrack.model.TrainingModule;
import com.skilltrack.model.TrainingProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingProgressRepository extends JpaRepository<TrainingProgress, Long> {
    
    List<TrainingProgress> findByGraduateId(Long graduateId);
    
    Optional<TrainingProgress> findByGraduateIdAndModuleId(Long graduateId, Long moduleId);
    
    Optional<TrainingProgress> findByGraduateAndModule(Graduate graduate, TrainingModule module);
    
    @Query("SELECT tp FROM TrainingProgress tp WHERE tp.graduate.id IN :graduateIds")
    List<TrainingProgress> findByGraduateIdIn(@Param("graduateIds") List<Long> graduateIds);
    
    void deleteByGraduateId(Long graduateId);
}
