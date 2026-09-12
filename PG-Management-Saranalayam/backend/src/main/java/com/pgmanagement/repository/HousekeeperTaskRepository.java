package com.pgmanagement.repository;

import com.pgmanagement.entity.HousekeeperTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HousekeeperTaskRepository extends JpaRepository<HousekeeperTask, Long> {
    List<HousekeeperTask> findByHousekeeperId(Long housekeeperId);
    List<HousekeeperTask> findByHousekeeperIdAndStatus(Long housekeeperId, String status);
}
