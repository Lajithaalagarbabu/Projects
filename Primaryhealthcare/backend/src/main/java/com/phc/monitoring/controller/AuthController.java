package com.phc.monitoring.controller;

import com.phc.monitoring.config.JwtTokenProvider;
import com.phc.monitoring.dto.LoginRequest;
import com.phc.monitoring.dto.LoginResponse;
import com.phc.monitoring.dto.RegisterRequest;
import com.phc.monitoring.entity.Doctor;
import com.phc.monitoring.entity.Patient;
import com.phc.monitoring.entity.User;
import com.phc.monitoring.repository.DoctorRepository;
import com.phc.monitoring.repository.PatientRepository;
import com.phc.monitoring.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole());

        return ResponseEntity.ok(new LoginResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getId()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole().toUpperCase());

        User savedUser = userRepository.save(user);

        if ("PATIENT".equalsIgnoreCase(request.getRole())) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setName(request.getName() != null ? request.getName() : request.getUsername());
            patient.setAge(request.getAge() != null ? request.getAge() : 30);
            patient.setGender(request.getGender() != null ? request.getGender() : "Male");
            patient.setAddress(request.getAddress() != null ? request.getAddress() : "Default Address");
            patient.setPhone(request.getPhone() != null ? request.getPhone() : "0000000000");
            patient.setBloodGroup(request.getBloodGroup() != null ? request.getBloodGroup() : "O+");
            patient.setEmergencyContactName(request.getEmergencyContactName() != null ? request.getEmergencyContactName() : "Emergency Name");
            patient.setEmergencyContactPhone(request.getEmergencyContactPhone() != null ? request.getEmergencyContactPhone() : "0000000000");
            patientRepository.save(patient);
        } else if ("DOCTOR".equalsIgnoreCase(request.getRole())) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setName(request.getName() != null ? request.getName() : request.getUsername());
            doctor.setSpecialization(request.getSpecialization() != null ? request.getSpecialization() : "General Practitioner");
            doctor.setPhone(request.getPhone() != null ? request.getPhone() : "0000000000");
            doctor.setEmail(request.getEmail());
            doctor.setAvailableTimings(request.getAvailableTimings() != null ? request.getAvailableTimings() : "09:00 AM - 05:00 PM");
            doctor.setLeaveStatus("AVAILABLE");
            doctorRepository.save(doctor);
        }

        return ResponseEntity.ok("User registered successfully!");
    }
}
