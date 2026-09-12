package com.pgmanagement.controller;

import com.pgmanagement.dto.DashboardStatsDTO;
import com.pgmanagement.dto.ResidentDTO;
import com.pgmanagement.entity.*;
import com.pgmanagement.repository.HousekeeperRepository;
import com.pgmanagement.repository.LateArrivalRequestRepository;
import com.pgmanagement.repository.PaymentRepository;
import com.pgmanagement.repository.ResidentRepository;
import com.pgmanagement.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ResidentService residentService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private HousekeeperService housekeeperService;

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

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private HousekeeperRepository housekeeperRepository;

    @Autowired
    private LateArrivalRequestRepository lateArrivalRequestRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // Dashboard Overview Stats
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        long activeResidents = residentRepository.countByStatus("ACTIVE");
        stats.setTotalResidents(activeResidents);

        List<Room> rooms = roomService.getAllRooms();
        int occupiedBeds = rooms.stream().mapToInt(Room::getOccupiedBeds).sum();
        stats.setOccupiedBeds(occupiedBeds);
        stats.setAvailableBeds(Math.max(0, 30 - occupiedBeds));

        long pendingLateArrivals = lateArrivalRequestRepository.findByStatus("PENDING").size();
        stats.setPendingLateArrivals(pendingLateArrivals);

        long housekeeperCount = housekeeperRepository.count();
        stats.setTotalHousekeepers(housekeeperCount);

        ElectricityBill latestBill = billService.getLatestBill();
        if (latestBill != null) {
            stats.setCurrentMonthBillTotal(latestBill.getTotalAmount());
            stats.setPaidBillsCount(paymentRepository.countByElectricityBillIdAndPaymentStatus(latestBill.getId(), "PAID"));
            stats.setUnpaidBillsCount(paymentRepository.countByElectricityBillIdAndPaymentStatus(latestBill.getId(), "UNPAID"));
        }

        return ResponseEntity.ok(stats);
    }

    // Resident Management
    @GetMapping("/residents")
    public ResponseEntity<List<ResidentDTO>> getAllResidents() {
        return ResponseEntity.ok(residentService.getAllResidents());
    }

    @PostMapping("/residents")
    public ResponseEntity<ResidentDTO> addResident(@RequestBody ResidentDTO dto) {
        return ResponseEntity.ok(residentService.addResident(dto));
    }

    @PutMapping("/residents/{id}")
    public ResponseEntity<ResidentDTO> updateResident(@PathVariable Long id, @RequestBody ResidentDTO dto) {
        return ResponseEntity.ok(residentService.updateResident(id, dto));
    }

    @DeleteMapping("/residents/{id}")
    public ResponseEntity<ResidentDTO> deactivateResident(@PathVariable Long id) {
        return ResponseEntity.ok(residentService.deactivateResident(id));
    }

    // Room Management
    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/rooms/{id}/details")
    public ResponseEntity<Map<String, Object>> getRoomDetails(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomDetailsWithOccupants(id));
    }

    // Food Management
    @GetMapping("/food")
    public ResponseEntity<List<FoodMenu>> getFoodMenu(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(foodService.getFoodMenuByDate(date));
    }

    @PostMapping("/food")
    public ResponseEntity<FoodMenu> addOrUpdateFoodMenu(@RequestBody Map<String, String> body) {
        LocalDate date = body.get("date") != null ? LocalDate.parse(body.get("date")) : LocalDate.now();
        String mealType = body.get("mealType");
        String foodItems = body.get("foodItems");
        String timing = body.get("timing");
        return ResponseEntity.ok(foodService.addOrUpdateFoodMenu(date, mealType, foodItems, timing));
    }

    // Housekeeper Management
    @GetMapping("/housekeepers")
    public ResponseEntity<List<Housekeeper>> getAllHousekeepers() {
        return ResponseEntity.ok(housekeeperService.getAllHousekeepers());
    }

    @PostMapping("/housekeepers")
    public ResponseEntity<Housekeeper> addHousekeeper(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(housekeeperService.addHousekeeper(
                body.get("name"),
                body.get("phone"),
                body.get("assignedResponsibility"),
                body.get("email"),
                body.get("password")
        ));
    }

    @PutMapping("/housekeepers/{id}")
    public ResponseEntity<Housekeeper> updateHousekeeper(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(housekeeperService.updateHousekeeper(
                id,
                body.get("name"),
                body.get("phone"),
                body.get("assignedResponsibility"),
                body.get("workingStatus")
        ));
    }

    @PostMapping("/housekeepers/{id}/tasks")
    public ResponseEntity<HousekeeperTask> assignTask(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(housekeeperService.assignTask(id, body.get("taskDescription"), body.get("roomNumber")));
    }

    // Late Arrival Requests Queue
    @GetMapping("/late-arrivals")
    public ResponseEntity<List<LateArrivalRequest>> getLateArrivals() {
        return ResponseEntity.ok(lateArrivalService.getAllRequests());
    }

    @PutMapping("/late-arrivals/{id}/status")
    public ResponseEntity<LateArrivalRequest> updateLateArrivalStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(lateArrivalService.updateStatus(id, body.get("status")));
    }

    // Door Access Records & Fingerprint Simulation
    @GetMapping("/access-records")
    public ResponseEntity<List<AccessRecord>> getAccessRecords() {
        return ResponseEntity.ok(accessService.getAllAccessRecords());
    }

    @PostMapping("/access-records/log")
    public ResponseEntity<AccessRecord> logAccess(@RequestBody Map<String, String> body) {
        Long residentId = Long.parseLong(body.get("residentId"));
        LocalDate date = body.get("date") != null ? LocalDate.parse(body.get("date")) : LocalDate.now();
        return ResponseEntity.ok(accessService.logAccess(
                residentId,
                date,
                body.get("entryTime"),
                body.get("exitTime"),
                body.get("accessType"),
                body.get("status")
        ));
    }

    // Electricity Bills & Payments
    @PostMapping("/bills")
    public ResponseEntity<ElectricityBill> createElectricityBill(@RequestBody Map<String, Object> body) {
        String billingMonth = (String) body.get("billingMonth");
        double totalAmount = Double.parseDouble(body.get("totalAmount").toString());
        return ResponseEntity.ok(billService.createMonthlyBill(billingMonth, totalAmount));
    }

    @GetMapping("/bills")
    public ResponseEntity<List<ElectricityBill>> getBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    @GetMapping("/bills/{id}/payments")
    public ResponseEntity<List<Payment>> getBillPayments(@PathVariable Long id) {
        return ResponseEntity.ok(billService.getPaymentsByBill(id));
    }

    // Notices
    @PostMapping("/notices")
    public ResponseEntity<Notice> createNotice(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(noticeService.createNotice(
                body.get("title"),
                body.get("content"),
                body.get("targetRole"),
                "Admin"
        ));
    }

    @DeleteMapping("/notices/{id}")
    public ResponseEntity<Map<String, String>> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Notice deleted successfully");
        return ResponseEntity.ok(resp);
    }
}
