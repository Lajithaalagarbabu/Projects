package com.pgmanagement.service;

import com.pgmanagement.entity.Housekeeper;
import com.pgmanagement.entity.HousekeeperTask;
import com.pgmanagement.entity.Role;
import com.pgmanagement.entity.User;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.repository.HousekeeperRepository;
import com.pgmanagement.repository.HousekeeperTaskRepository;
import com.pgmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HousekeeperService {

    @Autowired
    private HousekeeperRepository housekeeperRepository;

    @Autowired
    private HousekeeperTaskRepository housekeeperTaskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Housekeeper> getAllHousekeepers() {
        return housekeeperRepository.findAll();
    }

    public Housekeeper getHousekeeperById(Long id) {
        return housekeeperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Housekeeper not found with id: " + id));
    }

    public Housekeeper getHousekeeperByUserId(Long userId) {
        return housekeeperRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Housekeeper profile not found for user: " + userId));
    }

    @Transactional
    public Housekeeper addHousekeeper(String name, String phone, String assignedResponsibility, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email address already registered: " + email);
        }

        User user = new User(email, passwordEncoder.encode(password != null ? password : "hk123"), Role.ROLE_HOUSEKEEPER);
        user = userRepository.save(user);

        Housekeeper housekeeper = new Housekeeper(user, name, phone, assignedResponsibility);
        return housekeeperRepository.save(housekeeper);
    }

    @Transactional
    public Housekeeper updateHousekeeper(Long id, String name, String phone, String assignedResponsibility, String workingStatus) {
        Housekeeper hk = getHousekeeperById(id);
        if (name != null) hk.setName(name);
        if (phone != null) hk.setPhone(phone);
        if (assignedResponsibility != null) hk.setAssignedResponsibility(assignedResponsibility);
        if (workingStatus != null) hk.setWorkingStatus(workingStatus);
        return housekeeperRepository.save(hk);
    }

    // Task Management
    public List<HousekeeperTask> getTasksByHousekeeper(Long housekeeperId) {
        return housekeeperTaskRepository.findByHousekeeperId(housekeeperId);
    }

    @Transactional
    public HousekeeperTask assignTask(Long housekeeperId, String taskDescription, String roomNumber) {
        Housekeeper hk = getHousekeeperById(housekeeperId);
        HousekeeperTask task = new HousekeeperTask(hk, taskDescription, roomNumber);
        return housekeeperTaskRepository.save(task);
    }

    @Transactional
    public HousekeeperTask updateTaskStatus(Long taskId, String status) {
        HousekeeperTask task = housekeeperTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        task.setStatus(status);
        return housekeeperTaskRepository.save(task);
    }
}
