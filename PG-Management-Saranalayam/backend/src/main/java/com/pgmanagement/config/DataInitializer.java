package com.pgmanagement.config;

import com.pgmanagement.entity.*;
import com.pgmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private HousekeeperRepository housekeeperRepository;

    @Autowired
    private HousekeeperTaskRepository housekeeperTaskRepository;

    @Autowired
    private FoodMenuRepository foodMenuRepository;

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private ElectricityBillRepository electricityBillRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AccessRecordRepository accessRecordRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Seed Admin User
        User admin = new User("admin@ladieshostel.com", passwordEncoder.encode("admin123"), Role.ROLE_ADMIN);
        userRepository.save(admin);

        // 2. Seed 5 Rooms with Exact Capacity Breakdown (Total = 30)
        Room room1 = roomRepository.save(new Room("101", true, 8, 8, 8500.0));  // 8 sharing AC
        Room room2 = roomRepository.save(new Room("102", false, 8, 8, 7000.0)); // 8 sharing Non-AC
        Room room3 = roomRepository.save(new Room("201", false, 5, 5, 7500.0)); // 5 sharing
        Room room4 = roomRepository.save(new Room("202", false, 5, 5, 7500.0)); // 5 sharing
        Room room5 = roomRepository.save(new Room("301", false, 4, 4, 8000.0)); // 4 sharing

        // 3. Seed 3 Housekeepers
        User hkUser1 = userRepository.save(new User("lakshmi@ladieshostel.com", passwordEncoder.encode("hk123"), Role.ROLE_HOUSEKEEPER));
        Housekeeper hk1 = housekeeperRepository.save(new Housekeeper(hkUser1, "Lakshmi Devi", "9876543210", "Ground Floor & Room 101/102 Cleaning"));

        User hkUser2 = userRepository.save(new User("anitha@ladieshostel.com", passwordEncoder.encode("hk123"), Role.ROLE_HOUSEKEEPER));
        Housekeeper hk2 = housekeeperRepository.save(new Housekeeper(hkUser2, "Anitha Kumari", "9876543211", "First Floor & Common Area Maintenance"));

        User hkUser3 = userRepository.save(new User("sunitha@ladieshostel.com", passwordEncoder.encode("hk123"), Role.ROLE_HOUSEKEEPER));
        Housekeeper hk3 = housekeeperRepository.save(new Housekeeper(hkUser3, "Sunitha Rao", "9876543212", "Kitchen Hygiene & Dining Maintenance"));

        // Seed Tasks for Housekeepers
        housekeeperTaskRepository.save(new HousekeeperTask(hk1, "Sanitize Room 101 AC Filters", "101"));
        housekeeperTaskRepository.save(new HousekeeperTask(hk2, "Moop Hall and Staircase", "Common"));
        housekeeperTaskRepository.save(new HousekeeperTask(hk3, "Clean Dining Area post Lunch", "Dining"));

        // 4. Seed Initial Sample Residents
        List<Object[]> initialResidents = Arrays.asList(
                new Object[]{"Lajitha", "lajitha@ladieshostel.com", "9123456780", "9988776655", "123 Main St, City", room1},
                new Object[]{"Kavitha M", "kavitha@ladieshostel.com", "9123456781", "9988776654", "45 Park View, City", room1},
                new Object[]{"Priya Sharma", "priya@ladieshostel.com", "9123456782", "9988776653", "88 Lake Gardens, City", room2},
                new Object[]{"Deepa V", "deepa@ladieshostel.com", "9123456783", "9988776652", "12 Hill Road, City", room3}
        );

        for (Object[] r : initialResidents) {
            String name = (String) r[0];
            String email = (String) r[1];
            String phone = (String) r[2];
            String emergency = (String) r[3];
            String address = (String) r[4];
            Room targetRoom = (Room) r[5];

            User resUser = userRepository.save(new User(email, passwordEncoder.encode("resident123"), Role.ROLE_RESIDENT));
            Resident resident = new Resident(resUser, name, email, phone, emergency, address, LocalDate.now().minusMonths(2), targetRoom);
            residentRepository.save(resident);

            targetRoom.setOccupiedBeds(targetRoom.getOccupiedBeds() + 1);
            roomRepository.save(targetRoom);

            // Seed access history for resident
            accessRecordRepository.save(new AccessRecord(resident, LocalDate.now(), "08:15 AM", "09:30 AM", "FINGERPRINT_DOOR_SCAN", "GRANTED"));
            accessRecordRepository.save(new AccessRecord(resident, LocalDate.now().minusDays(1), "07:45 PM", "08:30 AM", "FINGERPRINT_DOOR_SCAN", "GRANTED"));
        }

        // 5. Seed Food Menu
        foodMenuRepository.save(new FoodMenu(LocalDate.now(), "BREAKFAST", "Idli, Vada, Chutney, Sambar, Tea / Coffee", "8:00 AM - 9:00 AM"));
        foodMenuRepository.save(new FoodMenu(LocalDate.now(), "LUNCH", "Rice, Chapati, Dal Fry, Ladyfinger Poriyal, Curd", "12:30 PM - 2:00 PM"));
        foodMenuRepository.save(new FoodMenu(LocalDate.now(), "SNACKS", "Samosa / Masala Sundal, Coffee / Milk", "5:00 PM - 6:00 PM"));
        foodMenuRepository.save(new FoodMenu(LocalDate.now(), "DINNER", "Phulka, Paneer Butter Masala, Jeera Rice, Rasam", "7:30 PM - 9:00 PM"));

        // 6. Seed Hostel Notices
        noticeRepository.save(new Notice("Hostel Gate Timings Reminder", "All residents must return to the hostel by 10:00 PM. Submit a late arrival request for unavoidable delays.", "ALL", "Admin"));
        noticeRepository.save(new Notice("Monthly Electricity Bill Distribution", "August electricity bill of ₹6000 split equally (₹200 per resident). Please pay via your Resident Portal.", "RESIDENT", "Admin"));
        noticeRepository.save(new Notice("Weekly Deep Cleaning Schedule", "Housekeepers will perform deep cleaning of common areas and bathrooms on Sunday 9 AM.", "HOUSEKEEPER", "Admin"));

        // 7. Seed August Electricity Bill & Payments
        List<Resident> activeRes = residentRepository.findByStatus("ACTIVE");
        double totalBill = 6000.0;
        double share = totalBill / Math.max(1, activeRes.size());
        share = Math.round(share * 100.0) / 100.0;

        ElectricityBill augBill = electricityBillRepository.save(new ElectricityBill("August 2026", totalBill, activeRes.size(), share));

        for (int i = 0; i < activeRes.size(); i++) {
            Resident res = activeRes.get(i);
            Payment payment = new Payment(res, augBill, share);
            if (i == 0) { // First resident paid
                payment.setPaymentStatus("PAID");
                payment.setPaymentDate(LocalDate.now().minusDays(2));
                payment.setTransactionRef("PAY-UPI-98210341");
            }
            paymentRepository.save(payment);
        }
    }
}
