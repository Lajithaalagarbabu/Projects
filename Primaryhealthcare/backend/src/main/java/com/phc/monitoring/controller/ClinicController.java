package com.phc.monitoring.controller;

import com.phc.monitoring.entity.*;
import com.phc.monitoring.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ClinicController {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicineInventoryRepository medicineRepository;
    private final VaccineRepository vaccineRepository;
    private final MedicineComplianceRepository complianceRepository;
    private final PregnancyRecordRepository pregnancyRepository;

    public ClinicController(
            UserRepository userRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            MedicalRecordRepository medicalRecordRepository,
            PrescriptionRepository prescriptionRepository,
            MedicineInventoryRepository medicineRepository,
            VaccineRepository vaccineRepository,
            MedicineComplianceRepository complianceRepository,
            PregnancyRecordRepository pregnancyRepository
    ) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.medicineRepository = medicineRepository;
        this.vaccineRepository = vaccineRepository;
        this.complianceRepository = complianceRepository;
        this.pregnancyRepository = pregnancyRepository;
    }

    // CURRENT USER UTILITY
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Logged in user not found"));
    }

    // --- PATIENTS ---
    @GetMapping("/patients")
    public ResponseEntity<?> getPatients(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(patientRepository.findByNameContainingIgnoreCase(search));
        }
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Patient updatedPatient) {
        return patientRepository.findById(id).map(patient -> {
            patient.setName(updatedPatient.getName());
            patient.setAge(updatedPatient.getAge());
            patient.setGender(updatedPatient.getGender());
            patient.setAddress(updatedPatient.getAddress());
            patient.setPhone(updatedPatient.getPhone());
            patient.setBloodGroup(updatedPatient.getBloodGroup());
            patient.setEmergencyContactName(updatedPatient.getEmergencyContactName());
            patient.setEmergencyContactPhone(updatedPatient.getEmergencyContactPhone());
            return ResponseEntity.ok(patientRepository.save(patient));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        return patientRepository.findById(id).map(patient -> {
            patientRepository.delete(patient);
            userRepository.deleteById(id);
            return ResponseEntity.ok("Patient deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- DOCTORS ---
    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @PutMapping("/doctors/{id}/availability")
    public ResponseEntity<?> updateDoctorAvailability(
            @PathVariable Long id,
            @RequestParam String timings,
            @RequestParam String leaveStatus
    ) {
        return doctorRepository.findById(id).map(doctor -> {
            doctor.setAvailableTimings(timings);
            doctor.setLeaveStatus(leaveStatus.toUpperCase());
            return ResponseEntity.ok(doctorRepository.save(doctor));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- APPOINTMENTS ---
    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments() {
        User user = getCurrentUser();
        if ("ADMIN".equals(user.getRole()) || "STAFF".equals(user.getRole())) {
            return ResponseEntity.ok(appointmentRepository.findAll());
        } else if ("DOCTOR".equals(user.getRole())) {
            return ResponseEntity.ok(appointmentRepository.findByDoctorId(user.getId()));
        } else {
            return ResponseEntity.ok(appointmentRepository.findByPatientId(user.getId()));
        }
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        User user = getCurrentUser();
        
        // Find patient context
        Patient patient;
        if ("PATIENT".equals(user.getRole())) {
            patient = patientRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        } else {
            patient = patientRepository.findById(appointment.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException("Specified Patient profile not found"));
        }
        
        Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setStatus("BOOKED");
        
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String followUpDate
    ) {
        return appointmentRepository.findById(id).map(appointment -> {
            appointment.setStatus(status.toUpperCase());
            if (followUpDate != null && !followUpDate.trim().isEmpty()) {
                appointment.setFollowUpDate(LocalDateTime.parse(followUpDate));
            }
            return ResponseEntity.ok(appointmentRepository.save(appointment));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- MEDICAL RECORDS & DIAGNOSIS ---
    @GetMapping("/medical-records/patient/{patientId}")
    public ResponseEntity<?> getPatientMedicalRecords(@PathVariable Long patientId) {
        User currentUser = getCurrentUser();
        // Patients can only look at their own records
        if ("PATIENT".equals(currentUser.getRole()) && !currentUser.getId().equals(patientId)) {
            return ResponseEntity.status(403).body("Access Denied: Cannot view other patient medical records.");
        }
        return ResponseEntity.ok(medicalRecordRepository.findByPatientId(patientId));
    }

    @PostMapping("/medical-records")
    public ResponseEntity<?> addMedicalRecord(@RequestBody MedicalRecord record) {
        User currentUser = getCurrentUser();
        if (!"DOCTOR".equals(currentUser.getRole())) {
            return ResponseEntity.status(403).body("Access Denied: Only doctors can write medical records.");
        }

        Doctor doctor = doctorRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        Patient patient = patientRepository.findById(record.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        record.setDoctor(doctor);
        record.setPatient(patient);
        record.setVisitDate(LocalDateTime.now());

        // Prepare prescriptions relationships
        List<Prescription> prescriptions = record.getPrescriptions();
        record.setPrescriptions(null); // Save record first
        MedicalRecord savedRecord = medicalRecordRepository.save(record);

        if (prescriptions != null) {
            for (Prescription p : prescriptions) {
                p.setMedicalRecord(savedRecord);
                prescriptionRepository.save(p);
            }
            savedRecord.setPrescriptions(prescriptions);
        }

        return ResponseEntity.ok(savedRecord);
    }

    // --- DASHBOARD ANALYTICS ---
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<?> getDashboardAnalytics() {
        User user = getCurrentUser();
        Map<String, Object> stats = new HashMap<>();

        if ("ADMIN".equals(user.getRole())) {
            stats.put("totalPatients", patientRepository.count());
            stats.put("totalDoctors", doctorRepository.count());
            stats.put("totalAppointments", appointmentRepository.count());
            
            // Stock summaries
            long lowStockMed = medicineRepository.findAll().stream().filter(m -> "LOW_STOCK".equals(m.getStatus())).count();
            long outOfStockMed = medicineRepository.findAll().stream().filter(m -> "OUT_OF_STOCK".equals(m.getStatus())).count();
            stats.put("lowStockMedicines", lowStockMed);
            stats.put("outOfStockMedicines", outOfStockMed);

            long lowStockVac = vaccineRepository.findAll().stream().filter(v -> "LIMITED_STOCK".equals(v.getStatus())).count();
            long outOfStockVac = vaccineRepository.findAll().stream().filter(v -> "OUT_OF_STOCK".equals(v.getStatus())).count();
            stats.put("limitedStockVaccines", lowStockVac);
            stats.put("outOfStockVaccines", outOfStockVac);

        } else if ("DOCTOR".equals(user.getRole())) {
            List<Appointment> todayApps = appointmentRepository.findByDoctorId(user.getId()).stream()
                    .filter(a -> a.getAppointmentDate().toLocalDate().isEqual(LocalDateTime.now().toLocalDate()))
                    .collect(Collectors.toList());
            stats.put("todayAppointmentsCount", todayApps.size());
            stats.put("todayAppointments", todayApps);

            long highRiskPregnancies = pregnancyRepository.findByHighRiskStatusTrue().size();
            stats.put("highRiskPregnanciesCount", highRiskPregnancies);

            // Compute low compliance patients (< 85%)
            List<Patient> lowCompliancePatients = new ArrayList<>();
            List<Patient> allPatients = patientRepository.findAll();
            for (Patient p : allPatients) {
                List<MedicineCompliance> logs = complianceRepository.findByPatientId(p.getId());
                if (!logs.isEmpty()) {
                    long taken = logs.stream().filter(l -> "TAKEN".equals(l.getStatus())).count();
                    double compliance = (double) taken / logs.size() * 100;
                    if (compliance < 85.0) {
                        lowCompliancePatients.add(p);
                    }
                }
            }
            stats.put("lowCompliancePatientsCount", lowCompliancePatients.size());
            stats.put("lowCompliancePatients", lowCompliancePatients);

        } else if ("PATIENT".equals(user.getRole())) {
            List<Appointment> upcoming = appointmentRepository.findByPatientId(user.getId()).stream()
                    .filter(a -> a.getAppointmentDate().isAfter(LocalDateTime.now()))
                    .collect(Collectors.toList());
            stats.put("upcomingAppointments", upcoming);

            List<MedicineCompliance> patientLogs = complianceRepository.findByPatientId(user.getId());
            if (!patientLogs.isEmpty()) {
                long taken = patientLogs.stream().filter(l -> "TAKEN".equals(l.getStatus())).count();
                stats.put("complianceRate", Math.round((double) taken / patientLogs.size() * 100));
            } else {
                stats.put("complianceRate", 100); // default
            }

            // Health records count
            stats.put("totalVisits", medicalRecordRepository.findByPatientId(user.getId()).size());
        }

        return ResponseEntity.ok(stats);
    }
}
