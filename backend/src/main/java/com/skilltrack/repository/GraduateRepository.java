package com.skilltrack.repository;

import com.skilltrack.model.Graduate;
import com.skilltrack.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GraduateRepository extends JpaRepository<Graduate, Long> {
    Optional<Graduate> findByEmail(String email);
    List<Graduate> findByRole(Role role);
    List<Graduate> findByMentorId(Long mentorId);
    boolean existsByEmail(String email);
}
