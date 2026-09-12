package com.pgmanagement.controller;

import com.pgmanagement.entity.FoodMenu;
import com.pgmanagement.entity.Notice;
import com.pgmanagement.entity.Room;
import com.pgmanagement.service.FoodService;
import com.pgmanagement.service.NoticeService;
import com.pgmanagement.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private FoodService foodService;

    @Autowired
    private NoticeService noticeService;

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getHostelInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("title", "Om Sakthi Saranalayam Ladies Hostel Management System");
        info.put("maxResidents", 30);
        info.put("totalRooms", 5);
        info.put("housekeepers", 3);
        info.put("status", "ACTIVE");
        return ResponseEntity.ok(info);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/food/today")
    public ResponseEntity<List<FoodMenu>> getTodayFood() {
        return ResponseEntity.ok(foodService.getTodayFoodMenu());
    }

    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }
}
