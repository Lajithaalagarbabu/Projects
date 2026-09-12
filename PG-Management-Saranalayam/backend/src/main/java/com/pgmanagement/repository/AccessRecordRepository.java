package com.pgmanagement.repository;

import com.pgmanagement.entity.AccessRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccessRecordRepository extends JpaRepository<AccessRecord, Long> {
    List<AccessRecord> findByResidentId(Long residentId);
    List<AccessRecord> findTop20ByOrderByIdDesc();
}
