package com.pgmanagement.repository;

import com.pgmanagement.entity.Housekeeper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HousekeeperRepository extends JpaRepository<Housekeeper, Long> {
    Optional<Housekeeper> findByUserId(Long userId);
    Optional<Housekeeper> findByUserEmail(String email);
    long countByWorkingStatus(String workingStatus);
}
