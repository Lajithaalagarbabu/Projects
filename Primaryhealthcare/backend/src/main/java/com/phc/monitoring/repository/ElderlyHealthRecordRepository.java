package com.phc.monitoring.repository;

import com.phc.monitoring.entity.ElderlyHealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ElderlyHealthRecordRepository extends JpaRepository<ElderlyHealthRecord, Long> {
    List<ElderlyHealthRecord> findByPatientIdOrderByRecordDateDesc(Long patientId);
}
