package com.pgmanagement.service;

import com.pgmanagement.dto.ResidentDTO;
import com.pgmanagement.entity.Resident;
import com.pgmanagement.entity.Role;
import com.pgmanagement.entity.Room;
import com.pgmanagement.entity.User;
import com.pgmanagement.exception.CapacityExceededException;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.repository.ResidentRepository;
import com.pgmanagement.repository.RoomRepository;
import com.pgmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResidentService {

    private static final int MAX_HOSTEL_CAPACITY = 30;

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<ResidentDTO> getAllResidents() {
        return residentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ResidentDTO getResidentById(Long id) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + id));
        return convertToDTO(resident);
    }

    public ResidentDTO getResidentByUserId(Long userId) {
        Resident resident = residentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resident profile not found for user: " + userId));
        return convertToDTO(resident);
    }

    public ResidentDTO getResidentByEmail(String email) {
        Resident resident = residentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with email: " + email));
        return convertToDTO(resident);
    }

    @Transactional
    public ResidentDTO addResident(ResidentDTO dto) {
        // Enforce maximum 30 active residents limit
        long activeCount = residentRepository.countByStatus("ACTIVE");
        if (activeCount >= MAX_HOSTEL_CAPACITY) {
            throw new CapacityExceededException(
                "Hostel maximum capacity of " + MAX_HOSTEL_CAPACITY + " active residents reached! Cannot add more residents."
            );
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email address already registered: " + dto.getEmail());
        }

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + dto.getRoomId()));

        if (room.getOccupiedBeds() >= room.getTotalCapacity()) {
            throw new CapacityExceededException("Room " + room.getRoomNumber() + " is already full!");
        }

        // Create User account for resident
        String rawPassword = dto.getPassword() != null && !dto.getPassword().isBlank() ? dto.getPassword() : "resident123";
        User user = new User(dto.getEmail(), passwordEncoder.encode(rawPassword), Role.ROLE_RESIDENT);
        user = userRepository.save(user);

        // Create Resident profile
        Resident resident = new Resident(
                user,
                dto.getFullName(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getEmergencyContact(),
                dto.getAddress(),
                dto.getJoiningDate(),
                room
        );

        // Increment room occupancy
        room.setOccupiedBeds(room.getOccupiedBeds() + 1);
        roomRepository.save(room);

        Resident saved = residentRepository.save(resident);
        return convertToDTO(saved);
    }

    @Transactional
    public ResidentDTO updateResident(Long id, ResidentDTO dto) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + id));

        resident.setFullName(dto.getFullName());
        resident.setPhone(dto.getPhone());
        resident.setEmergencyContact(dto.getEmergencyContact());
        resident.setAddress(dto.getAddress());

        // Room reassignment check
        if (dto.getRoomId() != null && (resident.getRoom() == null || !resident.getRoom().getId().equals(dto.getRoomId()))) {
            Room newRoom = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new ResourceNotFoundException("Target Room not found: " + dto.getRoomId()));

            if (newRoom.getOccupiedBeds() >= newRoom.getTotalCapacity()) {
                throw new CapacityExceededException("Room " + newRoom.getRoomNumber() + " is full!");
            }

            // Decrement old room bed count
            if (resident.getRoom() != null) {
                Room oldRoom = resident.getRoom();
                oldRoom.setOccupiedBeds(Math.max(0, oldRoom.getOccupiedBeds() - 1));
                roomRepository.save(oldRoom);
            }

            // Increment new room bed count
            newRoom.setOccupiedBeds(newRoom.getOccupiedBeds() + 1);
            roomRepository.save(newRoom);
            resident.setRoom(newRoom);
        }

        Resident updated = residentRepository.save(resident);
        return convertToDTO(updated);
    }

    @Transactional
    public ResidentDTO deactivateResident(Long id) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + id));

        if ("ACTIVE".equals(resident.getStatus())) {
            resident.setStatus("INACTIVE");
            if (resident.getUser() != null) {
                resident.getUser().setActive(false);
            }
            if (resident.getRoom() != null) {
                Room room = resident.getRoom();
                room.setOccupiedBeds(Math.max(0, room.getOccupiedBeds() - 1));
                roomRepository.save(room);
            }
        }
        return convertToDTO(residentRepository.save(resident));
    }

    @Transactional
    public ResidentDTO updateOutsideStatus(Long residentId, String outsideStatus, String expectedReturnTime) {
        Resident resident = residentRepository.findById(residentId)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + residentId));

        resident.setOutsideStatus(outsideStatus);
        resident.setExpectedReturnTime(expectedReturnTime);
        return convertToDTO(residentRepository.save(resident));
    }

    public ResidentDTO convertToDTO(Resident resident) {
        ResidentDTO dto = new ResidentDTO();
        dto.setId(resident.getId());
        dto.setFullName(resident.getFullName());
        dto.setEmail(resident.getEmail());
        dto.setPhone(resident.getPhone());
        dto.setEmergencyContact(resident.getEmergencyContact());
        dto.setAddress(resident.getAddress());
        dto.setJoiningDate(resident.getJoiningDate());
        if (resident.getRoom() != null) {
            dto.setRoomId(resident.getRoom().getId());
            dto.setRoomNumber(resident.getRoom().getRoomNumber());
            dto.setRoomType(resident.getRoom().isAc() ? "AC (" + resident.getRoom().getSharingType() + " Sharing)" : "Non-AC (" + resident.getRoom().getSharingType() + " Sharing)");
        }
        dto.setStatus(resident.getStatus());
        dto.setOutsideStatus(resident.getOutsideStatus());
        dto.setExpectedReturnTime(resident.getExpectedReturnTime());
        return dto;
    }
}
