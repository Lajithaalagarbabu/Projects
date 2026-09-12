package com.pgmanagement.repository;

import com.pgmanagement.entity.FoodMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodMenuRepository extends JpaRepository<FoodMenu, Long> {
    List<FoodMenu> findByDate(LocalDate date);
    List<FoodMenu> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
