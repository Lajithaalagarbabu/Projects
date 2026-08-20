package com.phc.monitoring.controller;

import com.phc.monitoring.entity.*;
import com.phc.monitoring.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CareAdherenceController {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PregnancyRecordRepository pregnancyRepository;
    private final ElderlyHealthRecordRepository elderlyRepository;
    private final MedicineComplianceRepository complianceRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final NotificationRepository notificationRepository;
    private final MedicineReminderRepository reminderRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public CareAdherenceController(
            UserRepository userRepository,
            PatientRepository patientRepository,
            PregnancyRecordRepository pregnancyRepository,
            ElderlyHealthRecordRepository elderlyRepository,
            MedicineComplianceRepository complianceRepository,
            PrescriptionRepository prescriptionRepository,
            NotificationRepository notificationRepository,
            MedicineReminderRepository reminderRepository,
            MedicalRecordRepository medicalRecordRepository
    ) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.pregnancyRepository = pregnancyRepository;
        this.elderlyRepository = elderlyRepository;
        this.complianceRepository = complianceRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.notificationRepository = notificationRepository;
        this.reminderRepository = reminderRepository;
        this.medicalRecordRepository = medicalRecordRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Logged in user not found"));
    }

    // --- PREGNANCY CARE ---
    @GetMapping("/pregnancy/patient/{patientId}")
    public ResponseEntity<?> getPregnancyRecord(@PathVariable Long patientId) {
        List<PregnancyRecord> records = pregnancyRepository.findByPatientId(patientId);
        if (records.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyMap());
        }
        
        PregnancyRecord record = records.get(records.size() - 1);
        
        // Calculate dynamic gestation week
        long weeks = 0;
        if (record.getLmpDate() != null) {
            weeks = ChronoUnit.WEEKS.between(record.getLmpDate(), LocalDate.now());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", record.getId());
        response.put("registrationDate", record.getRegistrationDate());
        response.put("edd", record.getEdd());
        response.put("lmpDate", record.getLmpDate());
        response.put("bloodPressure", record.getBloodPressure());
        response.put("hemoglobin", record.getHemoglobin());
        response.put("weight", record.getWeight());
        response.put("highRiskStatus", record.getHighRiskStatus());
        response.put("highRiskReason", record.getHighRiskReason());
        response.put("notes", record.getNotes());
        response.put("pregnancyWeek", Math.max(0, weeks));
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pregnancy")
    public ResponseEntity<?> addPregnancyRecord(@RequestBody PregnancyRecord record) {
        Patient patient = patientRepository.findById(record.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        
        record.setPatient(patient);
        record.setRegistrationDate(LocalDate.now());
        
        // Auto calculate EDD if not provided (LMP + 280 days / 9 months & 7 days)
        if (record.getEdd() == null && record.getLmpDate() != null) {
            record.setEdd(record.getLmpDate().plusDays(280));
        }

        // Trigger High Risk Pregnancy Alert if Hemoglobin < 10.0 or BP is elevated
        if (record.getHemoglobin() < 10.0) {
            record.setHighRiskStatus(true);
            record.setHighRiskReason("Severe Anemia (Hb < 10.0g/dL)");
        } else if (record.getBloodPressure().contains("/")) {
            try {
                String[] parts = record.getBloodPressure().split("/");
                int sys = Integer.parseInt(parts[0].trim());
                if (sys >= 140) {
                    record.setHighRiskStatus(true);
                    record.setHighRiskReason("Pregnancy-Induced Hypertension (BP Sys >= 140)");
                }
            } catch (Exception e) {}
        }

        PregnancyRecord saved = pregnancyRepository.save(record);
        
        // Save in-app notification
        Notification notification = new Notification();
        notification.setUser(patient.getUser());
        notification.setTitle("Pregnancy Record Updated");
        notification.setMessage("Your prenatal care card has been updated. Weeks of Gestation: " + 
                ChronoUnit.WEEKS.between(saved.getLmpDate(), LocalDate.now()));
        notification.setType("PREGNANCY");
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);

        return ResponseEntity.ok(saved);
    }

    // --- ELDERLY CARE ---
    @GetMapping("/elderly/patient/{patientId}")
    public ResponseEntity<?> getElderlyRecords(@PathVariable Long patientId) {
        List<ElderlyHealthRecord> logs = elderlyRepository.findByPatientIdOrderByRecordDateDesc(patientId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/elderly")
    public ResponseEntity<?> addElderlyRecord(@RequestBody ElderlyHealthRecord record) {
        Patient patient = patientRepository.findById(record.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        record.setPatient(patient);
        record.setRecordDate(LocalDateTime.now());
        
        ElderlyHealthRecord saved = elderlyRepository.save(record);

        // Notify patient
        Notification notification = new Notification();
        notification.setUser(patient.getUser());
        notification.setTitle("Geriatric Metrics Recorded");
        notification.setMessage("New health vitals (Blood Pressure & Blood Sugar) have been registered.");
        notification.setType("ELDERLY");
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);

        return ResponseEntity.ok(saved);
    }

    // --- MEDICINE COMPLIANCE REMINDERS ---
    @GetMapping("/reminders/active")
    public ResponseEntity<?> getActiveReminders() {
        User user = getCurrentUser();
        if (!"PATIENT".equals(user.getRole())) {
            return ResponseEntity.badRequest().body("Only patients have active reminders checklist.");
        }

        // Gather all patient prescriptions
        List<MedicalRecord> visits = medicalRecordRepository.findByPatientId(user.getId());
        List<Prescription> prescriptions = visits.stream()
                .flatMap(v -> v.getPrescriptions().stream())
                .collect(Collectors.toList());

        // Generate dynamic checklist of reminders for today
        LocalDate today = LocalDate.now();
        List<Map<String, Object>> activeSchedule = new ArrayList<>();

        for (Prescription p : prescriptions) {
            // Check if prescription is active (within duration)
            long elapsed = ChronoUnit.DAYS.between(p.getStartDate(), today);
            if (elapsed >= 0 && elapsed <= p.getDurationDays()) {
                
                // Map dosage (e.g. 1-0-1 -> Morning, Afternoon, Night doses)
                String[] doseCodes = p.getDosage().split("-");
                String[] intervals = {"Morning (08:00 AM)", "Afternoon (02:00 PM)", "Night (08:00 PM)"};
                LocalTime[] times = {LocalTime.of(8, 0), LocalTime.of(14, 0), LocalTime.of(20, 0)};

                for (int i = 0; i < Math.min(doseCodes.length, 3); i++) {
                    if (!"0".equals(doseCodes[i].trim())) {
                        Map<String, Object> dose = new HashMap<>();
                        dose.put("prescriptionId", p.getId());
                        dose.put("medicineName", p.getMedicineName());
                        dose.put("dosage", doseCodes[i] + " Tablet(s)");
                        dose.put("timeLabel", intervals[i]);
                        dose.put("reminderTime", times[i].toString());
                        
                        // Check if patient already logged compliance status for this specific time today
                        LocalTime queryTime = times[i];
                        Optional<MedicineCompliance> logged = complianceRepository.findByPrescriptionId(p.getId())
                                .stream()
                                .filter(c -> c.getDate().isEqual(today) && c.getReminderTime().equals(queryTime))
                                .findFirst();

                        dose.put("status", logged.map(MedicineCompliance::getStatus).orElse("PENDING"));
                        activeSchedule.add(dose);
                    }
                }
            }
        }

        return ResponseEntity.ok(activeSchedule);
    }

    @PostMapping("/compliance")
    public ResponseEntity<?> logCompliance(
            @RequestParam Long prescriptionId,
            @RequestParam String timeLabel,
            @RequestParam String status
    ) {
        User user = getCurrentUser();
        Patient patient = patientRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        LocalDate today = LocalDate.now();
        LocalTime reminderTime;
        if (timeLabel.contains("Morning")) reminderTime = LocalTime.of(8, 0);
        else if (timeLabel.contains("Afternoon")) reminderTime = LocalTime.of(14, 0);
        else reminderTime = LocalTime.of(20, 0);

        // Check if compliance log already exists
        Optional<MedicineCompliance> existing = complianceRepository.findByPrescriptionId(prescriptionId)
                .stream()
                .filter(c -> c.getDate().isEqual(today) && c.getReminderTime().equals(reminderTime))
                .findFirst();

        MedicineCompliance compliance;
        if (existing.isPresent()) {
            compliance = existing.get();
            compliance.setStatus(status.toUpperCase());
            compliance.setActionTime(LocalDateTime.now());
        } else {
            compliance = new MedicineCompliance();
            compliance.setPatient(patient);
            compliance.setPrescription(prescription);
            compliance.setDate(today);
            compliance.setReminderTime(reminderTime);
            compliance.setStatus(status.toUpperCase());
            compliance.setActionTime(LocalDateTime.now());
        }

        return ResponseEntity.ok(complianceRepository.save(compliance));
    }

    // --- NOTIFICATIONS ---
    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications() {
        User user = getCurrentUser();
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<?> markNotificationRead(@PathVariable Long id) {
        return notificationRepository.findById(id).map(notif -> {
            notif.setIsRead(true);
            return ResponseEntity.ok(notificationRepository.save(notif));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- EMERGENCY SUPPORT TRIGGER ---
    @PostMapping("/notifications/trigger-emergency")
    public ResponseEntity<?> triggerEmergencyAlert() {
        User user = getCurrentUser();
        
        // Log Emergency into notifications for all active doctor users and staff users
        List<User> staffAndDoctors = userRepository.findAll().stream()
                .filter(u -> "DOCTOR".equals(u.getRole()) || "STAFF".equals(u.getRole()) || "ADMIN".equals(u.getRole()))
                .collect(Collectors.toList());

        String name = user.getUsername();
        String contactInfo = "";
        Optional<Patient> p = patientRepository.findById(user.getId());
        if (p.isPresent()) {
            name = p.get().getName();
            contactInfo = " Phone: " + p.get().getPhone() + ", Blood Group: " + p.get().getBloodGroup() + ", Emergency Contact: " + p.get().getEmergencyContactName() + " (" + p.get().getEmergencyContactPhone() + ")";
        }

        for (User u : staffAndDoctors) {
            Notification alert = new Notification();
            alert.setUser(u);
            alert.setTitle("🚨 CRITICAL EMERGENCY ALERT 🚨");
            alert.setMessage("Patient " + name + " has pressed the emergency support button. Immediate response requested!" + contactInfo);
            alert.setType("GENERAL");
            alert.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(alert);
        }

        // Print to backend console log as simulated notification
        System.out.println("🚨 EMERGENCY BROADCAST SENT FOR PATIENT: " + name + contactInfo);

        return ResponseEntity.ok("Emergency support services have been notified immediately.");
    }
}
