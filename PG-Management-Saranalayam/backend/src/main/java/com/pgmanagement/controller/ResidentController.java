package com.pgmanagement.controller;

import com.pgmanagement.dto.ResidentDTO;
import com.pgmanagement.entity.*;
import com.pgmanagement.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resident")
public class ResidentController {

    @Autowired
    private ResidentService residentService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private FoodService foodService;

    @Autowired
    private LateArrivalService lateArrivalService;

    @Autowired
    private AccessService accessService;

    @Autowired
    private BillService billService;

    @Autowired
    private NoticeService noticeService;

    // Profile & Room
    @GetMapping("/profile/{userId}")
    public ResponseEntity<ResidentDTO> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(residentService.getResidentByUserId(userId));
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<ResidentDTO> updateProfile(@PathVariable Long id, @RequestBody ResidentDTO dto) {
        return ResponseEntity.ok(residentService.updateResident(id, dto));
    }

    @GetMapping("/room-details/{roomId}")
    public ResponseEntity<Map<String, Object>> getRoomDetails(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getRoomDetailsWithOccupants(roomId));
    }

    // Food Menu
    @GetMapping("/food/today")
    public ResponseEntity<List<FoodMenu>> getTodayFoodMenu() {
        return ResponseEntity.ok(foodService.getTodayFoodMenu());
    }

    // Late Arrival Requests
    @PostMapping("/late-arrival/{residentId}")
    public ResponseEntity<LateArrivalRequest> submitLateArrival(
            @PathVariable Long residentId,
            @RequestBody Map<String, String> body) {
        LocalDate date = body.get("date") != null ? LocalDate.parse(body.get("date")) : LocalDate.now();
        return ResponseEntity.ok(lateArrivalService.createRequest(
                residentId,
                date,
                body.get("expectedArrivalTime"),
                body.get("reason"),
                body.get("message")
        ));
    }

    @GetMapping("/late-arrival/{residentId}")
    public ResponseEntity<List<LateArrivalRequest>> getMyLateArrivals(@PathVariable Long residentId) {
        return ResponseEntity.ok(lateArrivalService.getRequestsByResident(residentId));
    }

    // Outside / Return Status
    @PutMapping("/outside-status/{residentId}")
    public ResponseEntity<ResidentDTO> updateOutsideStatus(
            @PathVariable Long residentId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(residentService.updateOutsideStatus(
                residentId,
                body.get("outsideStatus"),
                body.get("expectedReturnTime")
        ));
    }

    // Bills & Payments
    @GetMapping("/bill/{residentId}")
    public ResponseEntity<Map<String, Object>> getMyBill(
            @PathVariable Long residentId,
            @RequestParam(required = false) Long billId) {
        Map<String, Object> resp = new HashMap<>();
        ElectricityBill latestBill = billService.getLatestBill();
        resp.put("latestBill", latestBill);

        billService.getResidentCurrentPayment(residentId, billId).ifPresent(p -> {
            resp.put("payment", p);
        });

        List<Payment> paymentHistory = billService.getPaymentsByResident(residentId);
        resp.put("history", paymentHistory);

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/pay/{paymentId}")
    public ResponseEntity<Payment> payBill(
            @PathVariable Long paymentId,
            @RequestBody(required = false) Map<String, String> body) {
        String txRef = body != null && body.containsKey("transactionRef") ? body.get("transactionRef") : "TXN-" + System.currentTimeMillis();
        return ResponseEntity.ok(billService.processPayment(paymentId, txRef));
    }

    // Strict Private Door Access History (Only own logs)
    @GetMapping("/access-history/{residentId}")
    public ResponseEntity<List<AccessRecord>> getMyAccessHistory(@PathVariable Long residentId) {
        return ResponseEntity.ok(accessService.getAccessRecordsByResident(residentId));
    }

    // Notices
    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getNotices() {
        return ResponseEntity.ok(noticeService.getNoticesForRole("RESIDENT"));
    }
}
