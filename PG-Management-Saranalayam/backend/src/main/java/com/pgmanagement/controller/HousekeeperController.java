package com.pgmanagement.controller;

import com.pgmanagement.entity.Housekeeper;
import com.pgmanagement.entity.HousekeeperTask;
import com.pgmanagement.entity.Notice;
import com.pgmanagement.service.HousekeeperService;
import com.pgmanagement.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/housekeeper")
public class HousekeeperController {

    @Autowired
    private HousekeeperService housekeeperService;

    @Autowired
    private NoticeService noticeService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<Housekeeper> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(housekeeperService.getHousekeeperByUserId(userId));
    }

    @GetMapping("/tasks/{housekeeperId}")
    public ResponseEntity<List<HousekeeperTask>> getMyTasks(@PathVariable Long housekeeperId) {
        return ResponseEntity.ok(housekeeperService.getTasksByHousekeeper(housekeeperId));
    }

    @PutMapping("/tasks/{taskId}/status")
    public ResponseEntity<HousekeeperTask> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(housekeeperService.updateTaskStatus(taskId, body.get("status")));
    }

    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getNotices() {
        return ResponseEntity.ok(noticeService.getNoticesForRole("HOUSEKEEPER"));
    }
}
