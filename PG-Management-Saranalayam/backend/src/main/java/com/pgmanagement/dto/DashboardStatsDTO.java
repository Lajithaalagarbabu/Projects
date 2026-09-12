package com.pgmanagement.dto;

public class DashboardStatsDTO {
    private long totalResidents;
    private long maxCapacity = 30;
    private int totalBeds = 30;
    private int occupiedBeds;
    private int availableBeds;
    private int totalRooms = 5;
    private long pendingLateArrivals;
    private long totalHousekeepers;
    private double currentMonthBillTotal;
    private long paidBillsCount;
    private long unpaidBillsCount;

    public DashboardStatsDTO() {}

    public long getTotalResidents() { return totalResidents; }
    public void setTotalResidents(long totalResidents) { this.totalResidents = totalResidents; }

    public long getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(long maxCapacity) { this.maxCapacity = maxCapacity; }

    public int getTotalBeds() { return totalBeds; }
    public void setTotalBeds(int totalBeds) { this.totalBeds = totalBeds; }

    public int getOccupiedBeds() { return occupiedBeds; }
    public void setOccupiedBeds(int occupiedBeds) { this.occupiedBeds = occupiedBeds; }

    public int getAvailableBeds() { return availableBeds; }
    public void setAvailableBeds(int availableBeds) { this.availableBeds = availableBeds; }

    public int getTotalRooms() { return totalRooms; }
    public void setTotalRooms(int totalRooms) { this.totalRooms = totalRooms; }

    public long getPendingLateArrivals() { return pendingLateArrivals; }
    public void setPendingLateArrivals(long pendingLateArrivals) { this.pendingLateArrivals = pendingLateArrivals; }

    public long getTotalHousekeepers() { return totalHousekeepers; }
    public void setTotalHousekeepers(long totalHousekeepers) { this.totalHousekeepers = totalHousekeepers; }

    public double getCurrentMonthBillTotal() { return currentMonthBillTotal; }
    public void setCurrentMonthBillTotal(double currentMonthBillTotal) { this.currentMonthBillTotal = currentMonthBillTotal; }

    public long getPaidBillsCount() { return paidBillsCount; }
    public void setPaidBillsCount(long paidBillsCount) { this.paidBillsCount = paidBillsCount; }

    public long getUnpaidBillsCount() { return unpaidBillsCount; }
    public void setUnpaidBillsCount(long unpaidBillsCount) { this.unpaidBillsCount = unpaidBillsCount; }
}
