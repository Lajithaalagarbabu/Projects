package com.phc.monitoring.repository;

import com.phc.monitoring.entity.MedicineCompliance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicineComplianceRepository extends JpaRepository<MedicineCompliance, Long> {
    List<MedicineCompliance> findByPatientId(Long patientId);
    List<MedicineCompliance> findByPrescriptionId(Long prescriptionId);
}
