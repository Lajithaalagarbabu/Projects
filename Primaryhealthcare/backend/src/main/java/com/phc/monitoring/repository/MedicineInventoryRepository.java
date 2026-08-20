package com.phc.monitoring.repository;

import com.phc.monitoring.entity.MedicineInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MedicineInventoryRepository extends JpaRepository<MedicineInventory, Long> {
    Optional<MedicineInventory> findByMedicineNameIgnoreCase(String medicineName);
}
