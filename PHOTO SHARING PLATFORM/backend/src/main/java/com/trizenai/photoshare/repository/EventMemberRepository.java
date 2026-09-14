package com.trizenai.photoshare.repository;

import com.trizenai.photoshare.entity.EventMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventMemberRepository extends JpaRepository<EventMember, Long> {
    List<EventMember> findByEventId(Long eventId);
    Optional<EventMember> findByEventIdAndUserId(Long eventId, Long userId);
    boolean existsByEventIdAndUserId(Long eventId, Long userId);
    void deleteByEventIdAndUserId(Long eventId, Long userId);
}
