package com.pgmanagement.service;

import com.pgmanagement.dto.ResidentDTO;
import com.pgmanagement.entity.Room;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.repository.ResidentRepository;
import com.pgmanagement.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private ResidentService residentService;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }

    public Map<String, Object> getRoomDetailsWithOccupants(Long roomId) {
        Room room = getRoomById(roomId);
        List<ResidentDTO> occupants = residentRepository.findByRoomId(roomId).stream()
                .filter(r -> "ACTIVE".equals(r.getStatus()))
                .map(residentService::convertToDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("room", room);
        response.put("occupants", occupants);
        return response;
    }
}
