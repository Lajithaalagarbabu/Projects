package com.pgmanagement.repository;

import com.pgmanagement.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Long> {
    Optional<Resident> findByEmail(String email);
    Optional<Resident> findByUserId(Long userId);
    List<Resident> findByRoomId(Long roomId);
    List<Resident> findByStatus(String status);
    long countByStatus(String status);
    boolean existsByEmail(String email);
}
