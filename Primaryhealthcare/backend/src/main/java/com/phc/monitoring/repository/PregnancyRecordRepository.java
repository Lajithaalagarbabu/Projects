package com.phc.monitoring.repository;

import com.phc.monitoring.entity.PregnancyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PregnancyRecordRepository extends JpaRepository<PregnancyRecord, Long> {
    List<PregnancyRecord> findByPatientId(Long patientId);
    List<PregnancyRecord> findByHighRiskStatusTrue();
}
