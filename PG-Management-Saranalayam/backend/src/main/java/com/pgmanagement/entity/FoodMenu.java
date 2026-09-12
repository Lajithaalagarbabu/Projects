package com.pgmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "food_menus")
public class FoodMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String mealType; // BREAKFAST, LUNCH, SNACKS, DINNER

    @Column(columnDefinition = "TEXT")
    private String foodItems;

    private String timing;

    public FoodMenu() {}

    public FoodMenu(LocalDate date, String mealType, String foodItems, String timing) {
        this.date = date;
        this.mealType = mealType;
        this.foodItems = foodItems;
        this.timing = timing;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }

    public String getFoodItems() { return foodItems; }
    public void setFoodItems(String foodItems) { this.foodItems = foodItems; }

    public String getTiming() { return timing; }
    public void setTiming(String timing) { this.timing = timing; }
}
