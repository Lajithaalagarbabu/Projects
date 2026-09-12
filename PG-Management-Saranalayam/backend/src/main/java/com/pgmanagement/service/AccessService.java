package com.pgmanagement.service;

import com.pgmanagement.entity.AccessRecord;
import com.pgmanagement.entity.Resident;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.repository.AccessRecordRepository;
import com.pgmanagement.repository.ResidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AccessService {

    @Autowired
    private AccessRecordRepository accessRecordRepository;

    @Autowired
    private ResidentRepository residentRepository;

    public List<AccessRecord> getAllAccessRecords() {
        return accessRecordRepository.findTop20ByOrderByIdDesc();
    }

    public List<AccessRecord> getAccessRecordsByResident(Long residentId) {
        return accessRecordRepository.findByResidentId(residentId);
    }

    @Transactional
    public AccessRecord logAccess(Long residentId, LocalDate date, String entryTime, String exitTime, String accessType, String status) {
        Resident resident = residentRepository.findById(residentId)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + residentId));

        AccessRecord record = new AccessRecord(
                resident,
                date != null ? date : LocalDate.now(),
                entryTime,
                exitTime,
                accessType != null ? accessType : "FINGERPRINT_DOOR_SCAN",
                status != null ? status : "GRANTED"
        );

        // Auto update resident outside status based on exit/entry
        if (exitTime != null && entryTime == null) {
            resident.setOutsideStatus("OUTSIDE");
            residentRepository.save(resident);
        } else if (entryTime != null) {
            resident.setOutsideStatus("INSIDE");
            residentRepository.save(resident);
        }

        return accessRecordRepository.save(record);
    }
}
