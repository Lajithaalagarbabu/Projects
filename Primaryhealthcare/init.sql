CREATE DATABASE IF NOT EXISTS primary_healthcare;
USE primary_healthcare;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    available_timings VARCHAR(100) NOT NULL,
    leave_status VARCHAR(20) NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    emergency_contact_name VARCHAR(100) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    follow_up_date DATETIME DEFAULT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- 5. Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    visit_date DATETIME NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    treatment_details TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- 6. Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medical_record_id BIGINT NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration_days INT NOT NULL,
    start_date DATE NOT NULL,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE
);

-- 7. Medicine Inventory Table
CREATE TABLE IF NOT EXISTS medicine_inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL
);

-- 8. Vaccines Table
CREATE TABLE IF NOT EXISTS vaccines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vaccine_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(20) NOT NULL
);

-- 9. Pregnancy Records Table
CREATE TABLE IF NOT EXISTS pregnancy_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    registration_date DATE NOT NULL,
    edd DATE NOT NULL,
    lmp_date DATE NOT NULL,
    blood_pressure VARCHAR(20) NOT NULL,
    hemoglobin DECIMAL(4,2) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    high_risk_status BOOLEAN NOT NULL DEFAULT FALSE,
    high_risk_reason VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 10. Elderly Health Records Table
CREATE TABLE IF NOT EXISTS elderly_health_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    record_date DATETIME NOT NULL,
    blood_pressure_sys INT NOT NULL,
    blood_pressure_dia INT NOT NULL,
    sugar_fasting INT NOT NULL,
    sugar_post_prandial INT NOT NULL,
    heart_rate INT NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    chronic_diseases VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 11. Medicine Reminders Table
CREATE TABLE IF NOT EXISTS medicine_reminders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    reminder_time TIME NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
);

-- 12. Medicine Compliance Table
CREATE TABLE IF NOT EXISTS medicine_compliance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    prescription_id BIGINT NOT NULL,
    date DATE NOT NULL,
    reminder_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    action_time DATETIME DEFAULT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
);

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SEED DATA
-- All accounts below have password: 'password' (bcrypt: $2a$10$r.T6Wc3C6hE4m4sWlFeqQOf0.d7vY/Ld1x1wH8m0o2wJ34d4r4Xb.)

-- Users
INSERT INTO users (id, username, password, email, role) VALUES
(1, 'admin', '$2a$10$r.T6Wc3C6hE4m4sWlFeqQOf0.d7vY/Ld1x1wH8m0o2wJ34d4r4Xb.', 'admin@phc.gov.in', 'ADMIN'),
(2, 'dr_ananya', '$2a$10$r.T6Wc3C6hE4m4sWlFeqQOf0.d7vY/Ld1x1wH8m0o2wJ34d4r4Xb.', 'ananya@phc.gov.in', 'DOCTOR'),
(3, 'dr_bhaskar', '$2a$10$r.T6Wc3C6hE4m4sWlFeqQOf0.d7vY/Ld1x1wH8m0o2wJ34d4r4Xb.', 'bhaskar@phc.gov.in', 'DOCTOR'),
(4, 'patient_priya', '$2a$10$r.T6Wc3C6hE4m4sWlFeqQOf0.d7vY/Ld1x1wH8m0o2wJ34d4r4Xb.', 'priya@gmail.com', 'PATIENT'),
(5, 'patient_ramesh', '$2a$10$r.T6Wc3C6hE4m4sWlFeqQOf0.d7vY/Ld1x1wH8m0o2wJ34d4r4Xb.', 'ramesh@gmail.com', 'PATIENT'),
(6, 'patient_suresh', '$2a$10$r.T6Wc3C6hE4m4sWlFeqQOf0.d7vY/Ld1x1wH8m0o2wJ34d4r4Xb.', 'suresh@gmail.com', 'PATIENT'),
(7, 'staff_kamla', '$2a$10$r.T6Wc3C6hE4m4sWlFeqQOf0.d7vY/Ld1x1wH8m0o2wJ34d4r4Xb.', 'kamla@phc.gov.in', 'STAFF');

-- Doctors Profiles
INSERT INTO doctors (id, name, specialization, phone, email, available_timings, leave_status) VALUES
(2, 'Dr. Ananya Sen', 'Gynecologist', '9876543210', 'ananya@phc.gov.in', '09:00 AM - 02:00 PM', 'AVAILABLE'),
(3, 'Dr. Bhaskar Rao', 'General Geriatrician', '9876543211', 'bhaskar@phc.gov.in', '10:00 AM - 04:00 PM', 'AVAILABLE');

-- Patients Profiles
-- Priya (26 y/o, pregnant), Ramesh (68 y/o, elderly with chronic issues), Suresh (35 y/o, general)
INSERT INTO patients (id, name, age, gender, address, phone, blood_group, emergency_contact_name, emergency_contact_phone) VALUES
(4, 'Priya Sharma', 26, 'Female', 'Village Rampur, Block B', '9123456780', 'O+', 'Rajesh Sharma (Husband)', '9123456781'),
(5, 'Ramesh Kumar', 68, 'Male', 'Ward 4, Near Temple, Semi-Urban Center', '9123456782', 'A+', 'Amit Kumar (Son)', '9123456783'),
(6, 'Suresh Varma', 35, 'Male', 'Plot 45, Greenfield colony', '9123456784', 'B+', 'Kiran Varma (Wife)', '9123456785');

-- Pregnancy Record for Priya
-- LMP: 2026-01-10, EDD: 2026-10-17, BP: 118/78, Hb: 11.2, Weight: 58.5
INSERT INTO pregnancy_records (patient_id, registration_date, edd, lmp_date, blood_pressure, hemoglobin, weight, high_risk_status, high_risk_reason, notes) VALUES
(4, '2026-02-15', '2026-10-17', '2026-01-10', '118/78', 11.2, 58.5, FALSE, NULL, 'First pregnancy. ANC visit 1 completed. General health good, advised iron-folic acid.');

-- Elderly Health Record for Ramesh
INSERT INTO elderly_health_records (patient_id, record_date, blood_pressure_sys, blood_pressure_dia, sugar_fasting, sugar_post_prandial, heart_rate, weight, chronic_diseases, notes) VALUES
(5, '2026-05-10 10:15:00', 142, 88, 138, 195, 78, 67.2, 'Hypertension, Type 2 Diabetes', 'Advised strict diet monitoring, salt reduction and metformin adjustments.'),
(5, '2026-06-01 09:30:00', 135, 84, 126, 172, 74, 66.8, 'Hypertension, Type 2 Diabetes', 'Cardiovascular status stable, sugar levels improving.');

-- Medicine Inventory
INSERT INTO medicine_inventory (medicine_name, quantity, expiry_date, status) VALUES
('Metformin 500mg', 1200, '2028-06-30', 'AVAILABLE'),
('Amlodipine 5mg', 850, '2027-12-31', 'AVAILABLE'),
('Iron & Folic Acid Tablets', 1500, '2028-03-31', 'AVAILABLE'),
('Calcium Carbonate 500mg', 90, '2026-09-30', 'LOW_STOCK'),
('Paracetamol 650mg', 2000, '2028-10-31', 'AVAILABLE'),
('Amoxicillin 250mg', 0, '2026-05-15', 'OUT_OF_STOCK');

-- Injection & Vaccine Stock
INSERT INTO vaccines (vaccine_name, quantity, status) VALUES
('TT (Tetanus Toxoid) Injection', 250, 'AVAILABLE'),
('Hepatitis B Vaccine', 120, 'AVAILABLE'),
('Polio Vaccine (OPV/IPV)', 30, 'LIMITED_STOCK'),
('BCG Vaccine', 80, 'AVAILABLE'),
('COVID-19 Vaccine (Covishield/Covaxin)', 0, 'OUT_OF_STOCK');

-- Medical Records
-- 1. Priya ANC Checkup
INSERT INTO medical_records (id, patient_id, doctor_id, visit_date, diagnosis, treatment_details, notes) VALUES
(1, 4, 2, '2026-05-02 11:00:00', 'Pregnancy Checkup (16 Weeks)', 'Routine antenatal checkup. Hemoglobin stable.', 'Advised regular exercise, plenty of fluids, and iron tablets.');

-- 2. Ramesh Geriatric follow-up
INSERT INTO medical_records (id, patient_id, doctor_id, visit_date, diagnosis, treatment_details, notes) VALUES
(2, 5, 3, '2026-05-10 10:30:00', 'Chronic HTN and T2DM Follow-up', 'Continue current diabetic dosage. Added BP tablet.', 'Needs 30 days blood pressure tracking.');

-- Prescriptions
-- Priya: Iron & Folic Acid, 1-0-1 (morning and night), for 180 days
INSERT INTO prescriptions (id, medical_record_id, medicine_name, dosage, frequency, duration_days, start_date) VALUES
(1, 1, 'Iron & Folic Acid Tablets', '1-0-1', 'Daily', 180, '2026-05-02'),
(2, 2, 'Metformin 500mg', '1-0-1', 'Daily', 90, '2026-05-10'),
(3, 2, 'Amlodipine 5mg', '0-0-1', 'Daily', 90, '2026-05-10');

-- Reminders Scheduled
INSERT INTO medicine_reminders (prescription_id, reminder_time, medicine_name, dosage) VALUES
(1, '08:00:00', 'Iron & Folic Acid Tablets', '1 Tablet'),
(1, '20:00:00', 'Iron & Folic Acid Tablets', '1 Tablet'),
(2, '08:00:00', 'Metformin 500mg', '1 Tablet'),
(2, '20:00:00', 'Metformin 500mg', '1 Tablet'),
(3, '20:00:00', 'Amlodipine 5mg', '1 Tablet');

-- Seeding 30 Days Compliance History for Priya & Ramesh
-- Adherence percentages: Priya ~ 95% (2 misses), Ramesh ~ 85% (several misses)
-- Date range: 2026-05-03 to 2026-06-02

-- Priya's Compliance (Prescription 1: 08:00 and 20:00)
-- 30 days * 2 reminders/day = 60 logs. Let's seed a good chunk of them directly:
INSERT INTO medicine_compliance (patient_id, prescription_id, date, reminder_time, status, action_time) VALUES
-- Day 1 to 5 (Full Adherence)
(4, 1, '2026-05-03', '08:00:00', 'TAKEN', '2026-05-03 08:15:00'),
(4, 1, '2026-05-03', '20:00:00', 'TAKEN', '2026-05-03 20:05:00'),
(4, 1, '2026-05-04', '08:00:00', 'TAKEN', '2026-05-04 08:02:00'),
(4, 1, '2026-05-04', '20:00:00', 'TAKEN', '2026-05-04 20:10:00'),
(4, 1, '2026-05-05', '08:00:00', 'TAKEN', '2026-05-05 08:00:00'),
(4, 1, '2026-05-05', '20:00:00', 'TAKEN', '2026-05-05 20:30:00'),
(4, 1, '2026-05-06', '08:00:00', 'TAKEN', '2026-05-06 08:05:00'),
(4, 1, '2026-05-06', '20:00:00', 'TAKEN', '2026-05-06 20:12:00'),
(4, 1, '2026-05-07', '08:00:00', 'TAKEN', '2026-05-07 08:20:00'),
(4, 1, '2026-05-07', '20:00:00', 'SKIPPED', NULL), -- Priya missed one tablet on Day 5
-- Day 6 to 10
(4, 1, '2026-05-08', '08:00:00', 'TAKEN', '2026-05-08 08:05:00'),
(4, 1, '2026-05-08', '20:00:00', 'TAKEN', '2026-05-08 20:02:00'),
(4, 1, '2026-05-09', '08:00:00', 'TAKEN', '2026-05-09 08:11:00'),
(4, 1, '2026-05-09', '20:00:00', 'TAKEN', '2026-05-09 20:05:00'),
(4, 1, '2026-05-10', '08:00:00', 'TAKEN', '2026-05-10 08:15:00'),
(4, 1, '2026-05-10', '20:00:00', 'TAKEN', '2026-05-10 20:15:00'),
(4, 1, '2026-05-11', '08:00:00', 'TAKEN', '2026-05-11 08:04:00'),
(4, 1, '2026-05-11', '20:00:00', 'TAKEN', '2026-05-11 20:08:00'),
(4, 1, '2026-05-12', '08:00:00', 'TAKEN', '2026-05-12 08:00:00'),
(4, 1, '2026-05-12', '20:00:00', 'TAKEN', '2026-05-12 20:03:00'),
-- Day 11 to 20
(4, 1, '2026-05-13', '08:00:00', 'TAKEN', '2026-05-13 08:00:00'),
(4, 1, '2026-05-13', '20:00:00', 'TAKEN', '2026-05-13 20:00:00'),
(4, 1, '2026-05-14', '08:00:00', 'TAKEN', '2026-05-14 08:05:00'),
(4, 1, '2026-05-14', '20:00:00', 'TAKEN', '2026-05-14 20:15:00'),
(4, 1, '2026-05-15', '08:00:00', 'TAKEN', '2026-05-15 08:10:00'),
(4, 1, '2026-05-15', '20:00:00', 'TAKEN', '2026-05-15 20:02:00'),
(4, 1, '2026-05-16', '08:00:00', 'TAKEN', '2026-05-16 08:15:00'),
(4, 1, '2026-05-16', '20:00:00', 'SKIPPED', NULL), -- Miss 2
(4, 1, '2026-05-17', '08:00:00', 'TAKEN', '2026-05-17 08:09:00'),
(4, 1, '2026-05-17', '20:00:00', 'TAKEN', '2026-05-17 20:12:00'),
(4, 1, '2026-05-18', '08:00:00', 'TAKEN', '2026-05-18 08:00:00'),
(4, 1, '2026-05-18', '20:00:00', 'TAKEN', '2026-05-18 20:01:00'),
(4, 1, '2026-05-19', '08:00:00', 'TAKEN', '2026-05-19 08:02:00'),
(4, 1, '2026-05-19', '20:00:00', 'TAKEN', '2026-05-19 20:05:00'),
(4, 1, '2026-05-20', '08:00:00', 'TAKEN', '2026-05-20 08:00:00'),
(4, 1, '2026-05-20', '20:00:00', 'TAKEN', '2026-05-20 20:04:00'),
-- Day 21 to 30
(4, 1, '2026-05-21', '08:00:00', 'TAKEN', '2026-05-21 08:03:00'),
(4, 1, '2026-05-21', '20:00:00', 'TAKEN', '2026-05-21 20:05:00'),
(4, 1, '2026-05-22', '08:00:00', 'TAKEN', '2026-05-22 08:02:00'),
(4, 1, '2026-05-22', '20:00:00', 'TAKEN', '2026-05-22 20:00:00'),
(4, 1, '2026-05-23', '08:00:00', 'TAKEN', '2026-05-23 08:01:00'),
(4, 1, '2026-05-23', '20:00:00', 'TAKEN', '2026-05-23 20:06:00'),
(4, 1, '2026-05-24', '08:00:00', 'TAKEN', '2026-05-24 08:15:00'),
(4, 1, '2026-05-24', '20:00:00', 'TAKEN', '2026-05-24 20:10:00'),
(4, 1, '2026-05-25', '08:00:00', 'TAKEN', '2026-05-25 08:00:00'),
(4, 1, '2026-05-25', '20:00:00', 'TAKEN', '2026-05-25 20:14:00'),
(4, 1, '2026-05-26', '08:00:00', 'TAKEN', '2026-05-26 08:05:00'),
(4, 1, '2026-05-26', '20:00:00', 'TAKEN', '2026-05-26 20:02:00'),
(4, 1, '2026-05-27', '08:00:00', 'TAKEN', '2026-05-27 08:00:00'),
(4, 1, '2026-05-27', '20:00:00', 'TAKEN', '2026-05-27 20:02:00'),
(4, 1, '2026-05-28', '08:00:00', 'TAKEN', '2026-05-28 08:06:00'),
(4, 1, '2026-05-28', '20:00:00', 'TAKEN', '2026-05-28 20:08:00'),
(4, 1, '2026-05-29', '08:00:00', 'TAKEN', '2026-05-29 08:01:00'),
(4, 1, '2026-05-29', '20:00:00', 'TAKEN', '2026-05-29 20:03:00'),
(4, 1, '2026-05-30', '08:00:00', 'TAKEN', '2026-05-30 08:05:00'),
(4, 1, '2026-05-30', '20:00:00', 'TAKEN', '2026-05-30 20:00:00'),
(4, 1, '2026-05-31', '08:00:00', 'TAKEN', '2026-05-31 08:11:00'),
(4, 1, '2026-05-31', '20:00:00', 'TAKEN', '2026-05-31 20:10:00'),
(4, 1, '2026-06-01', '08:00:00', 'TAKEN', '2026-06-01 08:05:00'),
(4, 1, '2026-06-01', '20:00:00', 'TAKEN', '2026-06-01 20:01:00');

-- Ramesh's Compliance (Prescription 2 Metformin & Prescription 3 Amlodipine)
-- Let's seed Metformin (8:00 & 20:00) and Amlodipine (20:00) for a few weeks (since May 10, when prescribed)
INSERT INTO medicine_compliance (patient_id, prescription_id, date, reminder_time, status, action_time) VALUES
(5, 2, '2026-05-11', '08:00:00', 'TAKEN', '2026-05-11 08:30:00'),
(5, 2, '2026-05-11', '20:00:00', 'TAKEN', '2026-05-11 20:15:00'),
(5, 3, '2026-05-11', '20:00:00', 'TAKEN', '2026-05-11 20:15:00'),
(5, 2, '2026-05-12', '08:00:00', 'SKIPPED', NULL),
(5, 2, '2026-05-12', '20:00:00', 'TAKEN', '2026-05-12 20:45:00'),
(5, 3, '2026-05-12', '20:00:00', 'TAKEN', '2026-05-12 20:45:00'),
(5, 2, '2026-05-13', '08:00:00', 'TAKEN', '2026-05-13 08:02:00'),
(5, 2, '2026-05-13', '20:00:00', 'TAKEN', '2026-05-13 20:05:00'),
(5, 3, '2026-05-13', '20:00:00', 'SKIPPED', NULL),
(5, 2, '2026-05-14', '08:00:00', 'TAKEN', '2026-05-14 08:12:00'),
(5, 2, '2026-05-14', '20:00:00', 'TAKEN', '2026-05-14 20:10:00'),
(5, 3, '2026-05-14', '20:00:00', 'TAKEN', '2026-05-14 20:10:00'),
(5, 2, '2026-05-15', '08:00:00', 'SKIPPED', NULL),
(5, 2, '2026-05-15', '20:00:00', 'SKIPPED', NULL),
(5, 3, '2026-05-15', '20:00:00', 'SKIPPED', NULL),
-- May 16 to 25
(5, 2, '2026-05-16', '08:00:00', 'TAKEN', '2026-05-16 08:10:00'),
(5, 2, '2026-05-16', '20:00:00', 'TAKEN', '2026-05-16 20:05:00'),
(5, 3, '2026-05-16', '20:00:00', 'TAKEN', '2026-05-16 20:05:00'),
(5, 2, '2026-05-17', '08:00:00', 'TAKEN', '2026-05-17 08:00:00'),
(5, 2, '2026-05-17', '20:00:00', 'TAKEN', '2026-05-17 20:01:00'),
(5, 3, '2026-05-17', '20:00:00', 'TAKEN', '2026-05-17 20:01:00'),
(5, 2, '2026-05-18', '08:00:00', 'TAKEN', '2026-05-18 08:05:00'),
(5, 2, '2026-05-18', '20:00:00', 'TAKEN', '2026-05-18 20:00:00'),
(5, 3, '2026-05-18', '20:00:00', 'TAKEN', '2026-05-18 20:00:00'),
(5, 2, '2026-05-19', '08:00:00', 'TAKEN', '2026-05-19 08:11:00'),
(5, 2, '2026-05-19', '20:00:00', 'TAKEN', '2026-05-19 20:04:00'),
(5, 3, '2026-05-19', '20:00:00', 'TAKEN', '2026-05-19 20:04:00'),
(5, 2, '2026-05-20', '08:00:00', 'SKIPPED', NULL),
(5, 2, '2026-05-20', '20:00:00', 'TAKEN', '2026-05-20 20:15:00'),
(5, 3, '2026-05-20', '20:00:00', 'TAKEN', '2026-05-20 20:15:00'),
(5, 2, '2026-05-21', '08:00:00', 'TAKEN', '2026-05-21 08:02:00'),
(5, 2, '2026-05-21', '20:00:00', 'TAKEN', '2026-05-21 20:00:00'),
(5, 3, '2026-05-21', '20:00:00', 'TAKEN', '2026-05-21 20:00:00'),
(5, 2, '2026-05-22', '08:00:00', 'TAKEN', '2026-05-22 08:01:00'),
(5, 2, '2026-05-22', '20:00:00', 'TAKEN', '2026-05-22 20:00:00'),
(5, 3, '2026-05-22', '20:00:00', 'TAKEN', '2026-05-22 20:00:00'),
(5, 2, '2026-05-23', '08:00:00', 'TAKEN', '2026-05-23 08:12:00'),
(5, 2, '2026-05-23', '20:00:00', 'TAKEN', '2026-05-23 20:01:00'),
(5, 3, '2026-05-23', '20:00:00', 'TAKEN', '2026-05-23 20:01:00'),
(5, 2, '2026-05-24', '08:00:00', 'TAKEN', '2026-05-24 08:10:00'),
(5, 2, '2026-05-24', '20:00:00', 'TAKEN', '2026-05-24 20:02:00'),
(5, 3, '2026-05-24', '20:00:00', 'TAKEN', '2026-05-24 20:02:00'),
(5, 2, '2026-05-25', '08:00:00', 'TAKEN', '2026-05-25 08:00:00'),
(5, 2, '2026-05-25', '20:00:00', 'TAKEN', '2026-05-25 20:00:00'),
(5, 3, '2026-05-25', '20:00:00', 'SKIPPED', NULL),
-- May 26 to June 1
(5, 2, '2026-05-26', '08:00:00', 'TAKEN', '2026-05-26 08:05:00'),
(5, 2, '2026-05-26', '20:00:00', 'TAKEN', '2026-05-26 20:00:00'),
(5, 3, '2026-05-26', '20:00:00', 'TAKEN', '2026-05-26 20:00:00'),
(5, 2, '2026-05-27', '08:00:00', 'SKIPPED', NULL),
(5, 2, '2026-05-27', '20:00:00', 'TAKEN', '2026-05-27 20:30:00'),
(5, 3, '2026-05-27', '20:00:00', 'TAKEN', '2026-05-27 20:30:00'),
(5, 2, '2026-05-28', '08:00:00', 'TAKEN', '2026-05-28 08:11:00'),
(5, 2, '2026-05-28', '20:00:00', 'TAKEN', '2026-05-28 20:10:00'),
(5, 3, '2026-05-28', '20:00:00', 'TAKEN', '2026-05-28 20:10:00'),
(5, 2, '2026-05-29', '08:00:00', 'TAKEN', '2026-05-29 08:00:00'),
(5, 2, '2026-05-29', '20:00:00', 'TAKEN', '2026-05-29 20:02:00'),
(5, 3, '2026-05-29', '20:00:00', 'TAKEN', '2026-05-29 20:02:00'),
(5, 2, '2026-05-30', '08:00:00', 'TAKEN', '2026-05-30 08:03:00'),
(5, 2, '2026-05-30', '20:00:00', 'TAKEN', '2026-05-30 20:05:00'),
(5, 3, '2026-05-30', '20:00:00', 'TAKEN', '2026-05-30 20:05:00'),
(5, 2, '2026-05-31', '08:00:00', 'TAKEN', '2026-05-31 08:05:00'),
(5, 2, '2026-05-31', '20:00:00', 'TAKEN', '2026-05-31 20:00:00'),
(5, 3, '2026-05-31', '20:00:00', 'TAKEN', '2026-05-31 20:00:00'),
(5, 2, '2026-06-01', '08:00:00', 'TAKEN', '2026-06-01 08:00:00'),
(5, 2, '2026-06-01', '20:00:00', 'SKIPPED', NULL),
(5, 3, '2026-06-01', '20:00:00', 'SKIPPED', NULL);

-- Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, reason, follow_up_date) VALUES
(4, 2, '2026-06-03 10:00:00', 'BOOKED', 'Routine pregnancy checkup - 20 Weeks ANC', '2026-07-03 10:00:00'),
(5, 3, '2026-06-03 11:30:00', 'BOOKED', 'Routine Diabetes monitoring and checkup', '2026-07-03 11:30:00'),
(6, 3, '2026-06-02 14:00:00', 'BOOKED', 'General body pain and fever checkup', NULL);

-- Notifications
INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
(4, 'Upcoming Appointment', 'You have a scheduled pregnancy checkup tomorrow with Dr. Ananya Sen at 10:00 AM.', 'APPOINTMENT', FALSE, '2026-06-02 09:00:00'),
(4, 'Medicine Reminder', 'Time to take your Iron & Folic Acid Tablets.', 'MEDICINE', FALSE, '2026-06-02 08:00:00'),
(5, 'Low Adherence Alert', 'Your medicine compliance has fallen to 85% this week. Please make sure to take your medications on time.', 'MEDICINE', FALSE, '2026-06-01 10:00:00');
