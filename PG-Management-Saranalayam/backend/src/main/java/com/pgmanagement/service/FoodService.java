package com.pgmanagement.service;

import com.pgmanagement.entity.FoodMenu;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.repository.FoodMenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FoodService {

    @Autowired
    private FoodMenuRepository foodMenuRepository;

    public List<FoodMenu> getFoodMenuByDate(LocalDate date) {
        return foodMenuRepository.findByDate(date != null ? date : LocalDate.now());
    }

    public List<FoodMenu> getTodayFoodMenu() {
        return foodMenuRepository.findByDate(LocalDate.now());
    }

    @Transactional
    public FoodMenu addOrUpdateFoodMenu(LocalDate date, String mealType, String foodItems, String timing) {
        List<FoodMenu> existing = foodMenuRepository.findByDate(date);
        for (FoodMenu menu : existing) {
            if (menu.getMealType().equalsIgnoreCase(mealType)) {
                menu.setFoodItems(foodItems);
                menu.setTiming(timing);
                return foodMenuRepository.save(menu);
            }
        }
        FoodMenu newMenu = new FoodMenu(date, mealType, foodItems, timing);
        return foodMenuRepository.save(newMenu);
    }
}
