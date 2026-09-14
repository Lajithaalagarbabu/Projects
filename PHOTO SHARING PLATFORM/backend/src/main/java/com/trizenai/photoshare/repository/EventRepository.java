package com.trizenai.photoshare.repository;

import com.trizenai.photoshare.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCreatedBy(Long createdBy);
    Optional<Event> findByIdAndCreatedBy(Long id, Long createdBy);

    @Query("SELECT e FROM Event e WHERE e.id IN (SELECT em.eventId FROM EventMember em WHERE em.userId = :userId)")
    List<Event> findAssignedEventsByUserId(@Param("userId") Long userId);
}
