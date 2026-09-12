package com.pgmanagement.repository;

import com.pgmanagement.entity.LateArrivalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LateArrivalRequestRepository extends JpaRepository<LateArrivalRequest, Long> {
    List<LateArrivalRequest> findByResidentId(Long residentId);
    List<LateArrivalRequest> findByStatus(String status);
    List<LateArrivalRequest> findAllByOrderByCreatedAtDesc();
}
