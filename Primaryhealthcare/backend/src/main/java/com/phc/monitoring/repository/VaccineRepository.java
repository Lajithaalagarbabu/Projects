package com.phc.monitoring.repository;

import com.phc.monitoring.entity.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Long> {
    Optional<Vaccine> findByVaccineNameIgnoreCase(String vaccineName);
}
