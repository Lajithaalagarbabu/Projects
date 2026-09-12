package com.pgmanagement.service;

import com.pgmanagement.entity.LateArrivalRequest;
import com.pgmanagement.entity.Resident;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.repository.LateArrivalRequestRepository;
import com.pgmanagement.repository.ResidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class LateArrivalService {

    @Autowired
    private LateArrivalRequestRepository lateArrivalRequestRepository;

    @Autowired
    private ResidentRepository residentRepository;

    public List<LateArrivalRequest> getAllRequests() {
        return lateArrivalRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<LateArrivalRequest> getRequestsByResident(Long residentId) {
        return lateArrivalRequestRepository.findByResidentId(residentId);
    }

    @Transactional
    public LateArrivalRequest createRequest(Long residentId, LocalDate date, String expectedArrivalTime, String reason, String message) {
        Resident resident = residentRepository.findById(residentId)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + residentId));

        LateArrivalRequest request = new LateArrivalRequest(resident, date, expectedArrivalTime, reason, message);
        return lateArrivalRequestRepository.save(request);
    }

    @Transactional
    public LateArrivalRequest updateStatus(Long requestId, String status) {
        LateArrivalRequest request = lateArrivalRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Late arrival request not found with id: " + requestId));

        request.setStatus(status);
        return lateArrivalRequestRepository.save(request);
    }
}
