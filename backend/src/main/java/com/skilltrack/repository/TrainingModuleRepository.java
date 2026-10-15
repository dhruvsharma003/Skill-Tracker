package com.skilltrack.repository;

import com.skilltrack.model.TrainingModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingModuleRepository extends JpaRepository<TrainingModule, Long> {
    List<TrainingModule> findAllByOrderBySequenceNoAsc();
}
