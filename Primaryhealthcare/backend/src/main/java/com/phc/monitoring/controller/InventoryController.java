package com.phc.monitoring.controller;

import com.phc.monitoring.entity.MedicineInventory;
import com.phc.monitoring.entity.Vaccine;
import com.phc.monitoring.repository.MedicineInventoryRepository;
import com.phc.monitoring.repository.VaccineRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final MedicineInventoryRepository medicineRepository;
    private final VaccineRepository vaccineRepository;

    public InventoryController(
            MedicineInventoryRepository medicineRepository,
            VaccineRepository vaccineRepository
    ) {
        this.medicineRepository = medicineRepository;
        this.vaccineRepository = vaccineRepository;
    }

    // Helper to evaluate stock thresholds
    private String evaluateMedicineStatus(int qty) {
        if (qty <= 0) return "OUT_OF_STOCK";
        if (qty <= 100) return "LOW_STOCK";
        return "AVAILABLE";
    }

    private String evaluateVaccineStatus(int qty) {
        if (qty <= 0) return "OUT_OF_STOCK";
        if (qty <= 50) return "LIMITED_STOCK";
        return "AVAILABLE";
    }

    // --- MEDICINES ---
    @GetMapping("/medicines")
    public ResponseEntity<?> getMedicines() {
        return ResponseEntity.ok(medicineRepository.findAll());
    }

    @PostMapping("/medicines")
    public ResponseEntity<?> addMedicine(@RequestBody MedicineInventory medicine) {
        medicine.setStatus(evaluateMedicineStatus(medicine.getQuantity()));
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody MedicineInventory updated) {
        return medicineRepository.findById(id).map(medicine -> {
            medicine.setMedicineName(updated.getMedicineName());
            medicine.setQuantity(updated.getQuantity());
            medicine.setExpiryDate(updated.getExpiryDate());
            medicine.setStatus(evaluateMedicineStatus(updated.getQuantity()));
            return ResponseEntity.ok(medicineRepository.save(medicine));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        return medicineRepository.findById(id).map(medicine -> {
            medicineRepository.delete(medicine);
            return ResponseEntity.ok("Medicine deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- VACCINES ---
    @GetMapping("/vaccines")
    public ResponseEntity<?> getVaccines() {
        return ResponseEntity.ok(vaccineRepository.findAll());
    }

    @PutMapping("/vaccines/{id}")
    public ResponseEntity<?> updateVaccine(@PathVariable Long id, @RequestBody Vaccine updated) {
        return vaccineRepository.findById(id).map(vaccine -> {
            vaccine.setVaccineName(updated.getVaccineName());
            vaccine.setQuantity(updated.getQuantity());
            vaccine.setStatus(evaluateVaccineStatus(updated.getQuantity()));
            return ResponseEntity.ok(vaccineRepository.save(vaccine));
        }).orElse(ResponseEntity.notFound().build());
    }
}
